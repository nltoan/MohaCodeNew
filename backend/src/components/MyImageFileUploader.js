import { useEffect, useRef, useState } from "react";
import { notify, pathImg, request, requestXFormRaw } from "../utils/api";
import FileUploader from 'devextreme-react/file-uploader';
import { Button } from "devextreme-react/button";
import MediaLibraryPicker from "./MediaLibraryPicker";
import UploadPreview from "./UploadPreview";
import {
  CHUNKED_MAX_MB,
  changePendingUploads,
  createUploadErrorHandler,
  parseUploadResponse,
  uploadHint,
  uploadLimitProps,
  useBlockGridSaving,
} from "../utils/upload";

// Truong luu ID ban ghi Files (anh dai dien album, banner, tin tuc...).
// Upload theo phan qua FileManager/FileUpload (tao ban ghi Files, toi uu anh nhu FileImageUpload khi khong resize).
export default function MyImageFileUploader({ cellInfo }) {
  const [image, setImage] = useState();
  const [uploading, setUploading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const pendingRef = useRef(0);

  useEffect(() => {
    let alive = true;
    (async function () {
      if (!cellInfo.value) return;
      const data2 = await request(`Public/FileDetail?ID=${encodeURIComponent(cellInfo.value)}`);
      if (alive && data2?.data?.LinkLuuTru) setImage(`${pathImg(data2.data.LinkLuuTru)}`);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chan bam "Lưu" khi anh chua tai xong (tranh luu thieu anh).
  useBlockGridSaving(cellInfo.component, pendingRef);

  useEffect(() => () => {
    // Dong popup khi dang tai: bo dem dang tai cua component nay.
    if (pendingRef.current) changePendingUploads(-pendingRef.current);
    pendingRef.current = 0;
  }, []);

  const endPending = () => {
    if (pendingRef.current > 0) {
      pendingRef.current -= 1;
      changePendingUploads(-1);
    }
    setUploading(pendingRef.current > 0);
  };

  const onUploadStarted = () => {
    pendingRef.current += 1;
    changePendingUploads(1);
    setUploading(true);
  };

  const onUploaded = (e) => {
    endPending();
    const res = parseUploadResponse(e);
    const file = res?.files?.[0] || res?.docfiles?.[0];
    if (!file || !file.ID) {
      e.message = "Tải lên thất bại";
      notify("Tải lên thất bại: máy chủ không trả về thông tin file.", "error");
      return;
    }
    cellInfo.setValue(file.ID);
    // Chi doi anh xem truoc khi may chu da luu file.
    if (file.LinkLuuTru) setImage(pathImg(file.LinkLuuTru));
  };

  const onUploadError = createUploadErrorHandler({ maxMB: CHUNKED_MAX_MB, onError: endPending });

  // Lay (hoac tao) ban ghi Files cho file da co trong thu vien, roi gan ID vao truong.
  const onPicked = async ({ path, name }) => {
    setPickerVisible(false);
    const res = await requestXFormRaw(`FileManager/FileFromLibrary?path=${encodeURIComponent(path)}`, {
      method: "POST",
    });
    const row = res.data;
    if (!res.ok || !row || !row.ID) {
      if (res.status === 401) return;
      const message = row?.Message || (res.status === 0 ? "Không kết nối được máy chủ. Vui lòng thử lại." : `Không chọn được "${name}".`);
      notify(message, "error");
      return;
    }
    cellInfo.setValue(row.ID);
    setImage(pathImg(row.LinkLuuTru || path));
  };

  return (
    <>
      <UploadPreview src={image} uploading={uploading} />
      <FileUploader
        multiple={false}
        uploadMode="instantly"
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/FileUpload`}
        {...uploadLimitProps("image")}
        onUploadStarted={onUploadStarted}
        onUploaded={onUploaded}
        onUploadError={onUploadError}
        onUploadAborted={endPending}
      />
      <div className="d-flex align-items-center flex-wrap" style={{ gap: 8 }}>
        <Button text="Chọn từ thư viện" icon="folder" stylingMode="outlined" onClick={() => setPickerVisible(true)} />
        <small className="text-muted">{uploadHint("image")}</small>
      </div>
      <MediaLibraryPicker
        visible={pickerVisible}
        kind="image"
        onSelect={onPicked}
        onClose={() => setPickerVisible(false)}
      />
    </>
  );
}
