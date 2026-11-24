import { Fragment, useEffect, useState } from "react";
import FileUploader from 'devextreme-react/file-uploader';
import { createLookupStore } from "../utils/api";
import { DIRECT_MAX_MB, createUploadErrorHandler, uploadHint, uploadLimitProps } from "../utils/upload";

const dataSourceOptions = createLookupStore("ImageSizes");
// ImageUpload nhan nguyen file (khong theo phan) nen dung gioi han upload truc tiep.
const onUploadError = createUploadErrorHandler({ maxMB: DIRECT_MAX_MB });

export default function MyImageResizeUploader({ onUploaded }) {
  const [size, setSize] = useState();
  const [imageSizes, setImageSizes] = useState();
  const [uploading, setUploading] = useState(false);
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
        uploadMode="instantly"
        uploadUrl={
          window.env.REACT_APP_API_URL +
          `/FileManager/ImageUpload?Width=${size ? size.Width : ""}&Height=${size ? size.Height : ""}`
        }
        {...uploadLimitProps("image", { chunked: false })}
        onUploadStarted={() => setUploading(true)}
        onUploaded={(e) => {
          setUploading(false);
          onUploaded && onUploaded(e);
        }}
        onUploadError={(e) => {
          setUploading(false);
          onUploadError(e);
        }}
        onUploadAborted={() => setUploading(false)}
      />
      <small className="text-muted d-block">
        {uploading ? "Đang tải lên…" : uploadHint("image", { chunked: false })}
      </small>
    </>
  );
}
