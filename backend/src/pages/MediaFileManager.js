
import { useState, useEffect } from 'react';
import FileManager, { Item, Permissions, ContextMenu } from 'devextreme-react/file-manager';
import Notify from 'devextreme/ui/notify';
import { Popup } from 'devextreme-react/popup';
import Plyr from "plyr-react"
import "plyr-react/plyr.css"
import config from '../config';
import { createLookupStore, pathFile } from '../utils/api';
import { Button } from 'devextreme-react';

export default function MediaFileManager() {
  const dataSourceOptions = createLookupStore("ImageSizes");
  const [currentPath, setCurrentPath] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [imageResize, setImageResize] = useState(false);
  const [itemToDisplay, setItemToDisplay] = useState({});
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

  function displayImagePopup(e) {
    setPopupVisible(true);
    setItemToDisplay({
      name: e.file.name,
      url: e.file.dataItem.url,
    });
  }

  function hideImagePopup() {
    setPopupVisible(false);
  }

  function onCurrentDirectoryChanged(e) {
    setCurrentPath(e.component.option("currentPath"));
  }
  const onContextMenuItemClick = async (e) => {
    if (e.itemData.name === "copypath") {
      const selectedFile = e.fileSystemItem;
      try {
        await navigator.clipboard.writeText(selectedFile.dataItem.url.replace(window.env.REACT_APP_API_UPLOAD_URL, ''));
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
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
            title="Collapse"
          >
            <i className="fas fa-minus" />
          </button>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
            title="Remove"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <Popup
          visible={imageResize}
          dragEnabled={false}
          hideOnOutsideClick={false}
          showCloseButton={false}
          showTitle={true}
          title="Chọn kích cỡ ảnh"
          width={300}
          height={280}
        >
          <input type={`radio`} name="imagesize" value={0} /> Giữ nguyên <br />
          {imageSizes &&
            imageSizes.map((item, index) => (
              <>
                <input type={`radio`} name="imagesize" value={item.ID} />{" "}
                {item.Name} ({item.Width} x {item.Height} )<br />
              </>
            ))}
          <Button onClick={() => setImageResize(false)}>Đồng ý</Button>
          <Button onClick={() => setImageResize(false)}> Hủy</Button>
        </Popup>
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
          onSelectedFileOpened={displayImagePopup}
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
        <Popup
          maxHeight={600}
          hideOnOutsideClick={true}
          title={itemToDisplay.name}
          visible={popupVisible}
          onHiding={hideImagePopup}
        >
          {itemToDisplay.name && itemToDisplay.name.endsWith(".jpg") && (
            <img src={itemToDisplay.url} className="img-fluid" />
          )}
          {itemToDisplay.name && itemToDisplay.name.endsWith(".mp4") && (
            <div>
              <Plyr
                source={{
                  type: "video",
                  sources: [{ src: itemToDisplay.url, type: "video/mp4" }],
                }}
              />
            </div>
          )}
        </Popup>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
