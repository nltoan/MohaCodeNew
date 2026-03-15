import { useEffect, useState } from "react";
import { pathImg, request } from "../utils/api";
import FileUploader from 'devextreme-react/file-uploader';

export default function MyImageFileUploader({ cellInfo }) {
  const [image, setImage] = useState();
  useEffect(() => {
    (async function () {
      const data2 = await request(`Public/FileDetail?ID=${cellInfo.value}`);
      setImage(`${pathImg(data2.data?.LinkLuuTru)}`);
    })();
  }, []);
  const onUploaded = (e, cellInfo) => {
    let files = JSON.parse(e.request.responseText);
    cellInfo.setValue(files.docfiles[0].ID);
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
          `/FileManager/FileImageUpload?Width=&Height=`
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