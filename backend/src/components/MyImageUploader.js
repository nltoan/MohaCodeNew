import { useEffect, useRef, useState } from "react";
import { notify, pathImg } from "../utils/api";
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

// Truong luu duong dan anh ("/Upload/..."). Dung duoc ca <MyImageUploader cellInfo={cellInfo} />
// lan editCellRender={MyImageUploader} (khi do props chinh la cellInfo).
export default function MyImageUploader(props) {
  const cellInfo = props.cellInfo || props;
  const [image, setImage] = useState(pathImg(cellInfo.value));
  const [uploading, setUploading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const pendingRef = useRef(0);

  // Chan bam "Lưu" khi anh chua tai xong (tranh luu thieu anh).
  useBlockGridSaving(cellInfo.component, pendingRef);

  useEffect(() => () => {
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
    const path = res?.files?.[0]?.LinkLuuTru || res?.docfiles?.[0];
    if (!path || typeof path !== "string") {
      e.message = "Tải lên thất bại";
      notify("Tải lên thất bại: máy chủ không trả về đường dẫn file.", "error");
      return;
    }
    cellInfo.setValue(path);
    // Chi doi anh xem truoc khi may chu da luu file.
    setImage(pathImg(path));
  };

  const onUploadError = createUploadErrorHandler({ maxMB: CHUNKED_MAX_MB, onError: endPending });

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
        onSelect={({ path }) => {
          setPickerVisible(false);
          cellInfo.setValue(path);
          setImage(pathImg(path));
        }}
        onClose={() => setPickerVisible(false)}
      />
    </>
  );
}
