import { useEffect, useState } from "react";
import { pathFile } from "../utils/api";

// kind: "image" | "video" | "audio"
// pathField: ten truong trong dong (cellInfo.data) da chua duong dan file (vd "FileLinkLuuTru").
// Co pathField thi hien thang, khong goi them API cho tung dong; neu khong co moi tra cuu qua dataSource.
const MediaLookup = (props) => {
  const { cellInfo, dataSource, valueExpr, displayExpr, kind = "image", pathField } = props;
  const rowPath = pathField ? cellInfo?.data?.[pathField] : null;
  const [lookedUpUrl, setLookedUpUrl] = useState(null);
  const id = cellInfo?.value;

  useEffect(() => {
    if (rowPath) return undefined;
    let alive = true;
    if (id && dataSource) {
      if (Array.isArray(dataSource)) {
        const item = dataSource.find((i) => i[valueExpr] === id);
        setLookedUpUrl(item ? item[displayExpr] : null);
      } else {
        const store = dataSource.store ? dataSource.store() : dataSource;
        store
          .byKey(id)
          .then((item) => {
            if (alive && item) setLookedUpUrl(item[displayExpr]);
          })
          .catch(() => alive && setLookedUpUrl(null));
      }
    }
    return () => {
      alive = false;
    };
  }, [rowPath, id, dataSource, valueExpr, displayExpr]);

  const imageUrl = rowPath || lookedUpUrl;
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
        <audio src={fullUrl} controls preload="none" style={style} />
      ) : kind === "video" ? (
        // Chi tai thong tin dau file (khung hinh dau), khong tai ca video khi mo danh sach.
        <video
          src={fullUrl}
          preload="metadata"
          muted
          controls
          style={style}
          title="Bấm đúp để mở video trong tab mới"
          onDoubleClick={() => window.open(fullUrl, "_blank")}
        />
      ) : (
        <img
          src={fullUrl}
          alt="Xem trước"
          loading="lazy"
          style={{ ...style, cursor: "pointer" }}
          onClick={() => window.open(fullUrl, "_blank")}
        />
      )}
    </div>
  );
};
export default MediaLookup;
