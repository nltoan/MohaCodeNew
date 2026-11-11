import { useEffect,useState } from "react";
import { pathFile } from "../utils/api";

// kind: "image" | "video" | "audio"
const MediaLookup = (props) => {
  const { cellInfo, dataSource, valueExpr, displayExpr, kind = "image" } = props;
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

  const fullUrl = pathFile(imageUrl);

  const style = {
    width: "200px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ddd",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {kind === "audio" ? (
        <audio src={fullUrl} controls style={style} />
      ) : kind === "video" ? (
        <video src={fullUrl} style={style} onClick={() => window.open(fullUrl, "_blank")} />
      ) : (
        <img src={fullUrl} alt="Preview" style={style} onClick={() => window.open(fullUrl, "_blank")} />
      )}
    </div>
  );
};
export default MediaLookup;
