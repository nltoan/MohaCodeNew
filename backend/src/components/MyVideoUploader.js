
import FileUploader from 'devextreme-react/file-uploader';
import { getToken } from "../utils/token";

export default function MyVideoUploader({ onUploaded }) {
  return (
    <>
      <FileUploader
        multiple={false}
        uploadMode="instantly"
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/VideoUpload`}
        onUploaded={onUploaded}
        uploadHeaders={(() => {
          let access_token = getToken();
          return {
            Authorization: `Bearer ${access_token}`,
          };
        })()}
      />
    </>
  );
}
