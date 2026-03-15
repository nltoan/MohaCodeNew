import { useEffect, useState } from "react";
import FileUploader from 'devextreme-react/file-uploader';
import { createLookupStore } from "../utils/api";

export default function MyImageResizeUploader({ onUploaded }) {
  const dataSourceOptions = createLookupStore("ImageSizes");
  const [size, setSize] = useState();
  const [imageSizes, setImageSizes] = useState();
  useEffect(() => {
    dataSourceOptions.load().then(
      (data) => {
        setImageSizes(data);
      },
      (error) => {
        /* Handle the "error" here */
      },
    );
  }, []);
  return (
    <>
      <input type={`radio`} name="imagesize" checked /> Giữ nguyên <br />
      {imageSizes &&
        imageSizes.map((item, index) => (
          <>
            <input
              type={`radio`}
              name="imagesize"
              value={item.ID}
              onClick={() => {
                setSize(item);
              }}
            />
            {item.Name} ({item.Width} x {item.Height} )<br />
          </>
        ))}
      <FileUploader
        multiple={false}
        accept="image/*"
        uploadMode="instantly"
        uploadUrl={
          window.env.REACT_APP_API_URL +
          `/FileManager/ImageUpload?Width=${size ? size.Width : ""}&Height=${size ? size.Height : ""}`
        }
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
