import { useState } from "react";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import FileManager, { Permissions, ItemView, Toolbar, Item } from "devextreme-react/file-manager";
import config from "../config";
import { pathFile } from "../utils/api";
import { getUploadKind, libraryPath } from "../utils/upload";

// Popup chon mot file co san trong thu vien (FileManager/FileSystem), chi hien file dung loai (kind).
// onSelect({ path, name }) voi path dang "/Upload/...".
export default function MediaLibraryPicker({ visible, kind = "image", onSelect, onClose }) {
  const [selected, setSelected] = useState(null);

  const choose = (item) => {
    const it = item || selected;
    if (!it || it.isDirectory || !it.dataItem || !it.dataItem.url) return;
    onSelect && onSelect({ path: libraryPath(it.dataItem.url), name: it.name });
    setSelected(null);
  };

  const close = () => {
    setSelected(null);
    onClose && onClose();
  };

  return (
    <Popup
      visible={visible}
      title="Chọn từ thư viện"
      showTitle={true}
      showCloseButton={true}
      hideOnOutsideClick={false}
      width="90vw"
      maxWidth={1100}
      height="80vh"
      onHiding={close}
    >
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{
          text: "Chọn",
          type: "default",
          stylingMode: "contained",
          disabled: !selected,
          onClick: () => choose(),
        }}
      />
      <ToolbarItem
        widget="dxButton"
        toolbar="bottom"
        location="after"
        options={{ text: "Hủy", onClick: close }}
      />
      {visible && (
        <>
          <div style={{ marginBottom: 8, color: "#666" }}>
            Bấm vào một file để chọn rồi bấm "Chọn" (hoặc bấm đúp vào file). Chỉ hiện: {getUploadKind(kind).label}.
          </div>
          <FileManager
            height="calc(100% - 30px)"
            fileSystemProvider={config.remoteProvider}
            selectionMode="single"
            allowedFileExtensions={getUploadKind(kind).ext}
            customizeThumbnail={(item) =>
              item.dataItem && item.dataItem.thumbnailUrl ? pathFile(item.dataItem.thumbnailUrl) : null
            }
            onSelectionChanged={(e) => {
              const it = (e.selectedItems || []).find((x) => !x.isDirectory);
              setSelected(it || null);
            }}
            onSelectedFileOpened={(e) => choose(e.file)}
          >
            <Permissions
              create={false}
              copy={false}
              move={false}
              delete={false}
              rename={false}
              upload={false}
              download={false}
            />
            <ItemView mode="thumbnails" showParentFolder={false} />
            <Toolbar>
              <Item name="refresh" />
              <Item name="switchView" />
              <Item name="showNavPane" />
            </Toolbar>
          </FileManager>
        </>
      )}
    </Popup>
  );
}
