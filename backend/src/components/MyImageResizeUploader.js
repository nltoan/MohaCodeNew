import { Fragment, useEffect, useState } from "react";
import FileUploader from 'devextreme-react/file-uploader';
import { createLookupStore } from "../utils/api";
import { getToken } from "../utils/token";

const dataSourceOptions = createLookupStore("ImageSizes");

export default function MyImageResizeUploader({ onUploaded }) {
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
      {/* size === undefined means "keep original": the upload URL then sends empty Width/Height. */}
      <input
        type={`radio`}
        name="imagesize"
        checked={!size}
        onChange={() => {
          setSize(undefined);
        }}
      />{" "}
      Giữ nguyên <br />
      {imageSizes &&
        imageSizes.map((item, index) => (
          <Fragment key={item.ID ?? index}>
            <input
              type={`radio`}
              name="imagesize"
              value={item.ID}
              checked={!!size && size.ID === item.ID}
              onChange={() => {
                setSize(item);
              }}
            />
            {item.Name} ({item.Width} x {item.Height} )<br />
          </Fragment>
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
          let access_token = getToken();
          return {
            Authorization: `Bearer ${access_token}`,
          };
        })()}
      />
    </>
  );
}
