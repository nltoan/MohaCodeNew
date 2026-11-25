
import { useState } from 'react';
import FileManager, { Item, Permissions, ContextMenu, Upload } from 'devextreme-react/file-manager';
import { Popup } from 'devextreme-react/popup';
import config from '../config';
import { notify, pathFile } from '../utils/api';
import FilePreview from '../components/FilePreview';
import { CHUNKED_MAX_MB, FILE_MANAGER_UPLOAD_HINT, MB, mediaUrl, onFileManagerError } from '../utils/upload';
import { useAuth } from '../contexts/auth';

// Sao chep duong dan; trinh duyet chan clipboard (http, khong cap quyen) thi dung cach cu, cuoi cung hien de chep tay.
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export default function MediaFileManager() {
  const auth = useAuth();
  const [currentPath, setCurrentPath] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState({});
  const [copyFallback, setCopyFallback] = useState('');
  // plyr-react tim video bang selector toan trang: chi tao Plyr khi popup da gan vao DOM (onShown).
  const [popupShown, setPopupShown] = useState(false);
  const canViewAll = (auth.user?.Role?.RolePermissions || []).some((x) =>
    x?.Permission?.Name === 'view-all-media',
  );

  function displayPreview(e) {
    setPopupVisible(true);
    setItemToDisplay({
      name: e.file.name,
      // Host API khong nam trong CSP img-src/media-src cua admin production: xem qua host media.
      url: mediaUrl(e.file.dataItem.url),
      size: e.file.size,
    });
  }

  function hidePreview() {
    setPopupVisible(false);
    setPopupShown(false);
  }

  function onCurrentDirectoryChanged(e) {
    setCurrentPath(e.component.option("currentPath"));
  }
  const onContextMenuItemClick = async (e) => {
    if (e.itemData.name === "copypath") {
      const selectedFile = e.fileSystemItem;
      if (!selectedFile || !selectedFile.dataItem || !selectedFile.dataItem.url) return;
      const path = selectedFile.dataItem.url.replace(window.env.REACT_APP_API_UPLOAD_URL, '');
      if (await copyText(path)) notify("Đã sao chép đường dẫn.", "success");
      else setCopyFallback(path);
    }
  };
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý file</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
            title="Thu gọn"
          >
            <i className="fas fa-minus" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <p className="text-muted mb-2"><small>
          {canViewAll ? 'Bạn được xem toàn bộ thư viện media.' : 'Bạn chỉ xem và quản lý các file do chính mình tải lên.'}
          {' '}{FILE_MANAGER_UPLOAD_HINT} Bấm đúp vào file để xem trước.
        </small></p>
        <FileManager
          currentPath={currentPath}
          onContextMenuItemClick={onContextMenuItemClick}
          customizeThumbnail={(fileManagerItem) => {
            return fileManagerItem.dataItem &&
              fileManagerItem.dataItem.thumbnailUrl
              ? pathFile(fileManagerItem.dataItem.thumbnailUrl)
              : null;
          }}
          fileSystemProvider={config.remoteProvider}
          onSelectedFileOpened={displayPreview}
          onCurrentDirectoryChanged={onCurrentDirectoryChanged}
          onErrorOccurred={onFileManagerError}
        >
          {/* API (FileManager/FileSystem UploadChunk) tu choi file lon hon 80 MB. */}
          <Upload maxFileSize={CHUNKED_MAX_MB * MB} />
          <Permissions
            create={true}
            copy={true}
            move={true}
            delete={true}
            rename={true}
            upload={true}
            download={true}
          ></Permissions>
          <ContextMenu>
            <Item name="rename" />
            <Item name="move" />
            <Item name="copy" />
            <Item name="delete" />
            <Item name="refresh" beginGroup="true" />
            <Item name="download" />
            <Item text="Sao chép đường dẫn" icon="copy" name="copypath" beginGroup="true" />
          </ContextMenu>
        </FileManager>
        <Popup
          maxHeight="90vh"
          width="80vw"
          maxWidth={1100}
          hideOnOutsideClick={true}
          showCloseButton={true}
          title={itemToDisplay.name}
          visible={popupVisible}
          onHiding={hidePreview}
          onShown={() => setPopupShown(true)}
        >
          {/* Luon co phan tu con: devextreme-react chi tao template noi dung khi Popup co children luc render dau. */}
          <div>
            {popupVisible && (
              <FilePreview name={itemToDisplay.name} url={itemToDisplay.url} size={itemToDisplay.size} ready={popupShown} />
            )}
          </div>
        </Popup>
        <Popup
          visible={!!copyFallback}
          title="Sao chép đường dẫn"
          showCloseButton={true}
          hideOnOutsideClick={true}
          width={520}
          height="auto"
          onHiding={() => setCopyFallback('')}
        >
          <p>Trình duyệt không cho sao chép tự động. Hãy chọn và sao chép (Ctrl+C) đường dẫn dưới đây:</p>
          <input
            className="form-control"
            readOnly
            value={copyFallback}
            onFocus={(ev) => ev.target.select()}
            autoFocus
          />
        </Popup>
      </div>
    </div>
  );
}
