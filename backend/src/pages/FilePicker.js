
import { useState } from 'react';
import FileManager, { Item, FileSelectionItem, Permissions, ContextMenu, Upload, Toolbar } from 'devextreme-react/file-manager';
import { CHUNKED_MAX_MB, FILE_MANAGER_UPLOAD_HINT, MB, getUploadKind, mediaUrl, onFileManagerError } from '../utils/upload';
import config from '../config';
import { notify, pathFile } from '../utils/api';
import { useSearchParams } from 'react-router-dom';
import { copyText } from './MediaFileManager';

// Cua so chon file cua CKEditor (nut "Duyet may chu"). type=Images: chi hien anh; type=Videos: moi file
// (CKEditor dung chung cho chen video va chen lien ket toi file).
export default function FilePicker() {
  const [currentPath, setCurrentPath] = useState("");
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const imagesOnly = (searchParams.get('type') || '').toLowerCase() === 'images';
  // CKEditor appends CKEditorFuncNum to the browse URL; fall back to 1 when absent/invalid.
  const parsedFuncNum = parseInt(searchParams.get('CKEditorFuncNum'), 10);
  const funcNum = Number.isNaN(parsedFuncNum) ? 1 : parsedFuncNum;

  // Host media lay tu runtime-config (tham so s1 cu khong con dung).
  const fileUrl = (item) => mediaUrl(item?.dataItem?.url);

  function choose(item) {
    const it = item || selected;
    if (!it || it.isDirectory || !it.dataItem) return;
    const parentWindow = (window.parent === window) ? window.opener : window.parent;
    if (!parentWindow || !parentWindow['CKEDITOR']) {
      notify("Không tìm thấy trình soạn thảo đã mở cửa sổ này. Hãy đóng cửa sổ và thử lại.", "error");
      return;
    }
    parentWindow['CKEDITOR'].tools.callFunction(funcNum, fileUrl(it), '');
    window.close();
  }

  function onCurrentDirectoryChanged(e) {
    setCurrentPath(e.component.option("currentPath"));
  }
  const onContextMenuItemClick = async (e) => {
    if (e.itemData.name === "copypath") {
      const selectedFile = e.fileSystemItem;
      if (!selectedFile || !selectedFile.dataItem) return;
      if (await copyText(fileUrl(selectedFile))) notify("Đã sao chép đường dẫn.", "success");
      else notify("Trình duyệt không cho sao chép tự động.", "warning");
    } else if (e.itemData.name === "choose") {
      choose(e.fileSystemItem);
    }
  };
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{imagesOnly ? "Chọn ảnh để chèn" : "Chọn file để chèn"}</h3>
      </div>
      <div className="card-body">
        <p className="mb-1">Bấm vào file rồi bấm <strong>Chọn</strong> (hoặc bấm đúp vào file). Có thể tải file mới lên rồi chọn.</p>
        <p className="text-muted mb-2"><small>{FILE_MANAGER_UPLOAD_HINT}</small></p>
        <FileManager
          currentPath={currentPath}
          height="calc(100vh - 170px)"
          selectionMode="single"
          allowedFileExtensions={imagesOnly ? getUploadKind("image").ext : undefined}
          onContextMenuItemClick={onContextMenuItemClick}
          customizeThumbnail={(fileManagerItem) => {
            return fileManagerItem.dataItem &&
              fileManagerItem.dataItem.thumbnailUrl
              ? pathFile(fileManagerItem.dataItem.thumbnailUrl)
              : null;
          }}
          fileSystemProvider={config.remoteProvider}
          onSelectedFileOpened={(e) => choose(e.file)}
          onSelectionChanged={(e) => setSelected((e.selectedItems || []).find((x) => !x.isDirectory) || null)}
          onCurrentDirectoryChanged={onCurrentDirectoryChanged}
          onErrorOccurred={onFileManagerError}
        >
          {/* API (FileManager/FileSystem UploadChunk) tu choi file lon hon 80 MB. */}
          <Upload maxFileSize={CHUNKED_MAX_MB * MB} />
          {/* Cua so chon file chi de chen: khong xoa / di chuyen / doi ten file cua thu vien tu day. */}
          <Permissions
            create={true}
            copy={false}
            move={false}
            delete={false}
            rename={false}
            upload={true}
            download={true}
          ></Permissions>
          <Toolbar>
            <Item name="showNavPane" />
            <Item name="create" />
            <Item name="upload" />
            <Item name="refresh" />
            <Item name="switchView" location="after" />
            {/* Khi da chon file, FileManager doi sang bo nut fileSelectionItems: nut "Chon" phai nam o day. */}
            <FileSelectionItem
              location="before"
              widget="dxButton"
              options={{ text: "Chọn", icon: "check", type: "default", stylingMode: "contained", onClick: () => choose() }}
            />
            <FileSelectionItem name="download" />
            <FileSelectionItem name="refresh" />
            <FileSelectionItem name="clearSelection" />
          </Toolbar>
          <ContextMenu>
            <Item text="Chọn file này" icon="check" name="choose" />
            <Item name="refresh" beginGroup="true" />
            <Item name="download" />
            <Item text="Sao chép đường dẫn" icon="copy" name="copypath" beginGroup="true" />
          </ContextMenu>
        </FileManager>
      </div>
    </div>
  );
}
