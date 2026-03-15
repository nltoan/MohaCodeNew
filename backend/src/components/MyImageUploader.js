import { useState } from "react";
import { pathImg } from "../utils/api";
import FileUploader from 'devextreme-react/file-uploader';

export default function MyImageUploader({ cellInfo }) {
  const [image, setImage] = useState(pathImg(cellInfo.value));
  const onUploaded = (e, cellInfo) => {
    let files = JSON.parse(e.request.responseText);
    cellInfo.setValue(files.docfiles[0]);
  };
  const onValueChanged = (e) => {
    const reader = new FileReader();
    reader.onload = function (args) {
      setImage(args.target.result);
    };
    reader.readAsDataURL(e.value[0]);
  };
  return (
    <>
      <img className="uploadedImage" width={100} src={image} />
      <FileUploader
        multiple={false}
        accept="image/*"
        uploadMode="instantly"
        uploadUrl={
          window.env.REACT_APP_API_URL +
          `/FileManager/ImageUpload?Width=&Height=`
        }
        uploadHeaders={(() => {
          let access_token = localStorage.getItem("access_token");
          return {
            Authorization: `Bearer ${access_token}`,
          };
        })()}
        onValueChanged={onValueChanged}
        onUploaded={(e) => onUploaded(e, cellInfo)}
      />
    </>
  );
}
