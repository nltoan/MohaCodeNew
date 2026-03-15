
import FileUploader from 'devextreme-react/file-uploader';

export default function MyFileFileUploader({ cellInfo }) {
  const onUploaded = (e, cellInfo) => {
    let files = JSON.parse(e.request.responseText);
    let v = cellInfo.value;
    if (!v) {
      v = [files.files[0].ID];
    } else {
      v.push(files.files[0].ID);
    }
    cellInfo.setValue(v);
  };
  return (
    <>
      <FileUploader
        multiple={true}
        chunkSize={2048000}
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/FileUpload`}
        uploadHeaders={(() => {
          let access_token = localStorage.getItem("access_token");
          return {
            Authorization: `Bearer ${access_token}`,
          };
        })()}
        onUploaded={(e) => onUploaded(e, cellInfo)}
      />
    </>
  );
}
