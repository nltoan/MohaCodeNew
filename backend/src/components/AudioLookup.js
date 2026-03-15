import { useEffect,useState } from "react";

const ImageLookup = (props) => {
  const { cellInfo, dataSource, valueExpr, displayExpr } = props;
  const [imageUrl, setImageUrl] = useState(null);
  const id = cellInfo?.value;

  useEffect(() => {
    if (id && dataSource) {
      if (Array.isArray(dataSource)) {
        const item = dataSource.find((i) => i[valueExpr] === id);
        setImageUrl(item ? item[displayExpr] : null);
      } else {
        const store = dataSource.store ? dataSource.store() : dataSource;
        store
          .byKey(id)
          .then((item) => {
            if (item) setImageUrl(item[displayExpr]);
          })
          .catch(() => setImageUrl(null));
      }
    }
  }, [id, dataSource, valueExpr, displayExpr]);

  if (!imageUrl) return null;

  const fullUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${window.env.REACT_APP_UPLOAD_URL}/${imageUrl}`;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img
        src={fullUrl}
        alt="Preview"
        style={{
          width: "200px",
          objectFit: "cover",
          borderRadius: "4px",
          border: "1px solid #ddd",
        }}
        onClick={() => window.open(fullUrl, "_blank")}
      />
    </div>
  );
};
export default ImageLookup;
