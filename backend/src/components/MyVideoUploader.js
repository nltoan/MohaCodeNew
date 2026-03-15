
import FileUploader from 'devextreme-react/file-uploader';

export default function MyVideoUploader({ onUploaded }) {
  return (
    <>
      <FileUploader
        multiple={false}
        uploadMode="instantly"
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/VideoUpload`}
        onUploaded={onUploaded}
        uploadHeaders={(() => {
          let access_token = localStorage.getItem("access_token");
          return {
            Authorization: `Bearer ${access_token}`,
          };
        })()}
      />
    </>
  );
}
