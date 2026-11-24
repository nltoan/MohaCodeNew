import { useState } from "react";
import FileUploader from 'devextreme-react/file-uploader';
import { notify } from "../utils/api";
import { createUploadErrorHandler, parseUploadResponse, uploadHint, uploadLimitProps, uploadMaxMB } from "../utils/upload";

const onUploadError = createUploadErrorHandler({ maxMB: uploadMaxMB("video") });

// Tai video theo phan qua FileManager/FileUpload (VideoUpload nhan nguyen file nen bi IIS chan voi file ~30 MB tro len).
// onUploaded van nhan e.request.response dang { docfiles: ["/Upload/..."] } nhu VideoUpload cu.
export default function MyVideoUploader({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  return (
    <>
      <FileUploader
        multiple={false}
        uploadMode="instantly"
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/FileUpload`}
        {...uploadLimitProps("video")}
        onUploadStarted={() => setUploading(true)}
        onUploaded={(e) => {
          setUploading(false);
          const res = parseUploadResponse(e);
          const path = res?.files?.[0]?.LinkLuuTru;
          if (!path) {
            e.message = "Tải lên thất bại";
            notify("Tải lên thất bại: máy chủ không trả về đường dẫn file.", "error");
            return;
          }
          const body = JSON.stringify({ docfiles: [path] });
          onUploaded && onUploaded({ ...e, request: { response: body, responseText: body, status: e.request?.status } });
        }}
        onUploadError={(e) => {
          setUploading(false);
          onUploadError(e);
        }}
        onUploadAborted={() => setUploading(false)}
      />
      <small className="text-muted d-block">
        {uploading ? "Đang tải lên…" : uploadHint("video")}
      </small>
    </>
  );
}
