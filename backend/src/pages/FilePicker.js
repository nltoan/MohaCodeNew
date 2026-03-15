
import { useState } from 'react';
import FileManager, { Item, Permissions, ContextMenu } from 'devextreme-react/file-manager';
import Notify from 'devextreme/ui/notify';
import "plyr-react/plyr.css"
import config from '../config';
import { pathFile } from '../utils/api';
import { useSearchParams } from 'react-router-dom';
import { decodeBase64Url } from '../utils/helpers';

export default function FilePicker() {
  const [currentPath, setCurrentPath] = useState("");
  const [searchParams] = useSearchParams();
  const siteUrl1 = decodeBase64Url(searchParams.get('s1'));

  function onSelected(e) {
    if(e.file.dataItem){
      var parentWindow = (window.parent == window) ? window.opener : window.parent;
      parentWindow['CKEDITOR'].tools.callFunction(1, e.file.dataItem.url.replace(siteUrl1, ''), '');
      window.close();
    }
  }

  function onCurrentDirectoryChanged(e) {
    setCurrentPath(e.component.option("currentPath"));
  }
  const onContextMenuItemClick = async (e) => {
    if (e.itemData.name === "copypath") {
      const selectedFile = e.fileSystemItem;
      try {
        await navigator.clipboard.writeText(selectedFile.dataItem.url.replace(siteUrl1, ''));
        Notify(
          {
            message: `Copy thành công!`,
            height: 45,
            width: 150,
            minWidth: 150,
            type: "success",
            displayTime: 3500,
          },
          {
            position: "top right",
          },
        );
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý file</h3>
      </div>
      <div className="card-body">
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
          onSelectedFileOpened={onSelected}
          onCurrentDirectoryChanged={onCurrentDirectoryChanged}
        >
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
            <Item text="Copy File Path" name="copypath" beginGroup="true" />
          </ContextMenu>
        </FileManager>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
