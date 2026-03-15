import { useRef, useState } from 'react';
import Button from 'devextreme-react/button';
import config from '../config'
import { createLookupStore, pathFile, pathImg } from '../utils/api';
import { HtmlEditor, Popup } from 'devextreme-react';
import MyImageResizeUploader from './MyImageResizeUploader';
import MyVideoUploader from './MyVideoUploader';
import FileManager, { ItemView, Permissions } from 'devextreme-react/file-manager';
import List from 'devextreme-react/list';
import Plyr from "plyr-react"
import "plyr-react/plyr.css"
import grapesjs, { Editor } from 'grapesjs';
import GjsEditor from '@grapesjs/react';
import presetWebpage from 'grapesjs-preset-webpage';
import blocksBasic from 'grapesjs-blocks-basic';
import presetNewsletter from 'grapesjs-preset-newsletter';

export default function MyCustomHtmlEditor({ defaultValue, onValueChange }) {
  const dataSourceTemplatesOptions = createLookupStore("Templates");
  const [cursorIndex, setCursorIndex] = useState();
  const [itemToDisplay, setItemToDisplay] = useState({});
  const [popupGjsVisible, setPopupGjsVisible] = useState(false);
  const [popupPreviewVisible, setPopupPreviewVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [popupImageUploadVisible, setPopupImageUploadVisible] = useState(false);
  const [popupVideoUploadVisible, setPopupVideoUploadVisible] = useState(false);
  const [popupFileManagerVisible, setPopupFileManagerVisible] = useState(false);
  const [popupChooseTemplatesVisible, setPopupChooseTemplatesVisible] =
    useState(false);
  const [editor, setEditor] = useState();
  const htmlEditorRef = useRef();
  let htmlEditorLargeOptions = {
    height: 550,
    tableContextMenu: {
      enabled: true,
    },
    tableResizing: {
      enabled: true,
    },

    imageUpload: {
      tabs: [
        // 'file',
        "url",
      ],
      fileUploadMode: "base64",
    },

    toolbar: {
      items: [
        "clear",
        "undo",
        "redo",
        "separator",
        {
          name: "size",
          options: { value: "14px" },
          acceptedValues: [
            "8px",
            "10px",
            "12px",
            "14px",
            "18px",
            "24px",
            "36px",
          ],
        },
        {
          name: "font",
          acceptedValues: ["Inter", "Arial"],
        },
        "separator",
        "bold",
        "italic",
        "strike",
        "underline",
        "separator",
        "alignLeft",
        "alignCenter",
        "alignRight",
        "alignJustify",
        "separator",
        "orderedList",
        "bulletList",
        "separator",
        {
          name: "header",
          acceptedValues: [false, 1, 2, 3, 4, 5],
        },
        "separator",
        "color",
        "background",
        "separator",
        "image",
        "link",
        "separator",
        "codeBlock",
        "blockquote",
        "separator",
        "insertTable",
        "deleteTable",
        "insertRowAbove",
        "insertRowBelow",
        "deleteRow",
        "insertColumnLeft",
        "insertColumnRight",
        "deleteColumn",
        "cellProperties",
        "tableProperties",
        {
          widget: "dxButton",
          options: {
            icon: "image",
            text: "Up và resize ảnh",
            onClick: function () {
              setCursorIndex(htmlEditorRef.current._instance.getSelection());
              setPopupImageUploadVisible(true);
            },
          },
        },
        {
          widget: "dxButton",
          options: {
            icon: "video",
            text: "Up và chèn video",
            onClick: function () {
              setCursorIndex(htmlEditorRef.current._instance.getSelection());
              setPopupVideoUploadVisible(true);
            },
          },
        },
        {
          widget: "dxButton",
          options: {
            icon: "file",
            text: "Chọn từ thư viện",
            onClick: function () {
              setCursorIndex(htmlEditorRef.current._instance.getSelection());
              setPopupFileManagerVisible(true);
            },
          },
        },
        {
          widget: "dxSelectBox",
          options: {
            width: 100,
            placeholder: "Chọn màu",
            displayExpr: "text",
            dataSource: [
              { text: "red", val: "red" },
              { text: "black", val: "black" },
              { text: "blue", val: "blue" },
              { text: "yellow", val: "yellow" },
              { text: "green", val: "green" },
              { text: "Font trang chủ", val: "#092D6A" },
            ],
            dropDownOptions: {
              minWidth: 200,
            },
            itemTemplate: function (data) {
              return `<i style="height: 1em;width: 30px;padding:0;margin: 0;display: inline-block;background-color:${data.val};"></i>${data.text}`;
            },
            onItemClick: function (ele) {
              const selection =
                htmlEditorRef.current._instance.getSelection(true);
              htmlEditorRef.current._instance.formatText(
                selection.index,
                selection.length,
                "color",
                ele.itemData.val,
              );
            },
          },
        },
      ],
    },
    onContentReady: function (e) {
      e.component
        .getQuillInstance()
        .clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
          delta.ops = delta.ops.map((op) => {
            return {
              insert: op.insert,
            };
          });
          return delta;
        });
    },
  };

  const onEditorInit = (editor2) => {
    setEditor(editor2);
    const pn = editor2.Panels;
    const commands = editor2.Commands;
    editor2.Panels.getButton("options", "sw-visibility").set("active", false);
    commands.add("save-gjs", (editor) => {
      var htmlAndCssInline = editor.runCommand("gjs-get-inlined-html");
      htmlEditorRef.current._instance.option("value", htmlAndCssInline);
      setPopupGjsVisible(false);
    });

    commands.add("close-gjs", (editor) => {
      setPopupGjsVisible(false);
    });

    commands.add("open-templates", (editor) => {
      setPopupChooseTemplatesVisible(true);
      document.getElementById("grapesjs-react").className =
        "gjs-editor-cont d-none";
    });

    pn.addButton("options", {
      id: "close-gjs",
      className: "fa fa-close",
      attributes: {
        title: "Close",
      },
      command: "close-gjs",
    });

    pn.addButton("options", {
      id: "save-gjs",
      className: "fa fa-save",
      attributes: {
        title: "Save",
      },
      command: "save-gjs",
    });

    pn.addButton("options", {
      id: "open-templates",
      className: "fa fa-file",
      attributes: {
        title: "Chọn templates",
      },
      command: "open-templates",
      togglable: false,
    });
    editor2.on("load", () => {
      editor2.setComponents(htmlEditorRef.current._instance.option("value"));
    });
  };
  function displayImagePopup(e) {
    setPopupPreviewVisible(true);
    setItemToDisplay({
      name: e.file.name,
      url: pathFile(`/Upload/${e.file.dataItem.path}`),
    });
  }

  function onItemClick(e) {
    console.log(e);
  }
  let fileEndsWith = (host, ends) => {
    let value = false;
    value = ends.some((element) => {
      return host.toLowerCase().endsWith(element.toLowerCase());
    });
    return value;
  };
  function onSelectionChanged(e) {
    var isClose = false;
    e.selectedItems.map((item) => {
      var aEditor = htmlEditorRef.current._instance;
      var index = (cursorIndex && cursorIndex.index) || 0;
      if (item.isDirectory) {
        return;
      }
      setTimeout(() => {
        if (
          fileEndsWith(item.path, [
            ".jpg",
            ".jpeg",
            ".svg",
            ".bmp",
            ".tiff",
            ".png",
            ".webp",
            ".gif",
          ])
        ) {
          aEditor.insertEmbed(index, "extendedImage", {
            src: pathFile(`/Upload/${item.path}`),
            width: "100%",
          });
        } else if (fileEndsWith(item.path, [".mp4", ".avi"])) {
          aEditor.insertEmbed(index, "video", pathFile(`/Upload/${item.path}`));
        } else {
          aEditor.insertEmbed(index, "link", {
            href: pathFile(`/Upload/${item.path}`),
            text: item.name,
          });
        }
      }, 1000);
      isClose = true;
    });
    setPopupFileManagerVisible(!isClose);
  }
  function onCurrentDirectoryChanged(e) {
    setCurrentPath(e.component.option("currentPath"));
  }
  return (
    <>
      <Button
        onClick={() => {
          setPopupGjsVisible(true);
        }}
      >
        Mở chương trình edit HTML
      </Button>
      <br />
      <HtmlEditor
        ref={htmlEditorRef}
        spellcheck={false}
        onInitialized={(e) => {
          // const htmlEditor = e.component;
          // const ATTRIBUTES = ['alt', 'height', 'width'];
          // const Image = htmlEditor.get('formats/image');
          // class CustomImage extends Image {
          //     static create(value) {
          //         const node = super.create(value);
          //         if (typeof value === 'string') {
          //             node.setAttribute('src', this.sanitize(value));
          //         }
          //         return node;
          //     }
          //     static formats(domNode) {
          //         return ATTRIBUTES.reduce((formats, attribute) => {
          //         if (domNode.hasAttribute(attribute)) {
          //             formats[attribute] = domNode.getAttribute(attribute);
          //         }
          //         return formats;
          //         }, {});
          //     }
          //     static sanitize(url) {
          //       return super.sanitize(url);
          //     }
          //     static match(url) {
          //         return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
          //     }
          //     static value(domNode) {
          //         return domNode.getAttribute('src');
          //     }
          //     format(name, value) {
          //         if (ATTRIBUTES.indexOf(name) > -1) {
          //         if (value) {
          //             this.domNode.setAttribute(name, value);
          //         } else {
          //             this.domNode.removeAttribute(name);
          //         }
          //         } else {
          //             super.format(name, value);
          //         }
          //     }
          // }
          // htmlEditor.register({
          //     'formats/image': CustomImage
          // });
          // const Video = htmlEditor.get('formats/video');
          // const ATTRIBUTES = ['height', 'width'];
          // class CustomVideo extends Video {
          //     static create(value) {
          //         const node = super.create(value);
          //         node.setAttribute('frameborder', '0');
          //         node.setAttribute('allowfullscreen', true);
          //         node.setAttribute('src', value);
          //         return node;
          //     }
          // }
          // htmlEditor.register({
          //     'formats/video': CustomVideo
          // });
        }}
        onValueChanged={onValueChange}
        {...htmlEditorLargeOptions}
        defaultValue={defaultValue}
      />

      <Popup
        maxHeight={600}
        hideOnOutsideClick={true}
        title={itemToDisplay.name}
        visible={popupPreviewVisible}
        onHiding={() => {
          setPopupPreviewVisible(false);
        }}
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
      <Popup
        showTitle={true}
        title="Upload Image"
        hideOnOutsideClick={true}
        visible={popupImageUploadVisible}
        onHidden={() => {
          setPopupImageUploadVisible(false);
        }}
        contentRender={() => {
          return (
            <>
              <MyImageResizeUploader
                onUploaded={(e) => {
                  var res = JSON.parse(e.request.response);
                  if (res?.docfiles?.length <= 0) {
                    setPopupImageUploadVisible(false);
                    return;
                  }
                  var imgUrl = res?.docfiles[0];
                  var aEditor = htmlEditorRef.current._instance;
                  var range = aEditor.getSelection();
                  var index = (range && range.index) || 0;
                  aEditor.insertEmbed(index, "extendedImage", {
                    src: pathImg(imgUrl),
                  });
                  setPopupImageUploadVisible(false);
                }}
              />
            </>
          );
        }}
      ></Popup>
      <Popup
        showTitle={true}
        title="Upload Video"
        hideOnOutsideClick={true}
        visible={popupVideoUploadVisible}
        onHidden={() => {
          setPopupVideoUploadVisible(false);
        }}
        contentRender={() => {
          return (
            <>
              <MyVideoUploader
                onUploaded={(e) => {
                  setPopupVideoUploadVisible(false);
                  var res = JSON.parse(e.request.response);
                  if (res?.docfiles?.length <= 0) {
                    return;
                  }
                  var imgUrl = res?.docfiles[0];
                  setTimeout(() => {
                    var aEditor = htmlEditorRef.current._instance;
                    var index = (cursorIndex && cursorIndex.index) || 0;
                    var videoUrl = pathFile(imgUrl);
                    aEditor.insertEmbed(index, "video", videoUrl);
                  }, 1000);
                }}
              />
            </>
          );
        }}
      ></Popup>

      <Popup
        showTitle={true}
        title="Chọn file để chèn link"
        hideOnOutsideClick={true}
        visible={popupFileManagerVisible}
        onHidden={() => {
          setPopupFileManagerVisible(false);
        }}
        fullScreen={true}
        contentRender={() => {
          return (
            <>
              <FileManager
                currentPath={currentPath}
                onContextMenuItemClick={onItemClick}
                fileSystemProvider={config.remoteProvider}
                onSelectedFileOpened={displayImagePopup}
                onSelectionChanged={onSelectionChanged}
                selectionMode="single"
                customizeThumbnail={(fileManagerItem) => {
                  return fileManagerItem.dataItem &&
                    fileManagerItem.dataItem.thumbnailUrl
                    ? pathFile(fileManagerItem.dataItem.thumbnailUrl)
                    : null;
                }}
                onCurrentDirectoryChanged={onCurrentDirectoryChanged}
                onInitialized={(e) => {
                  e.component.option("itemView.mode", "thumbnails");
                }}
              >
                <ItemView
                  // mode="thumbnails"
                  details={{
                    columns: [
                      "thumbnail",
                      "name",
                      {
                        dataField: "dateModified",
                        sortIndex: 0,
                        sortOrder: "desc",
                      },
                      "size",
                    ],
                  }}
                ></ItemView>
                <Permissions
                  create={true}
                  copy={false}
                  move={false}
                  delete={false}
                  rename={true}
                  upload={true}
                  download={true}
                ></Permissions>
              </FileManager>
            </>
          );
        }}
      ></Popup>

      <Popup
        className="popupLayout"
        fullScreen={true}
        visible={popupChooseTemplatesVisible}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={true}
        onHidden={() => {
          setPopupChooseTemplatesVisible(false);
        }}
        showTitle={true}
        title="Cấu hình layout"
        contentRender={() => {
          return (
            <>
              <List
                dataSource={dataSourceTemplatesOptions}
                onItemClick={(item) => {
                  editor.setComponents(item.itemData.Html);
                  document.getElementById("grapesjs-react").className =
                    "gjs-editor-cont";
                  setPopupChooseTemplatesVisible(false);
                }}
                itemRender={(item) => {
                  return (
                    <div style={{ lineHeight: "50px" }}>
                      <div className="h4" style={{ verticalAlign: "middle" }}>
                        {item.Title}
                      </div>
                    </div>
                  );
                }}
              />
            </>
          );
        }}
      ></Popup>
      <Popup
        showTitle={true}
        title="Design"
        hideOnOutsideClick={true}
        visible={popupGjsVisible}
        fullScreen={true}
        onHidden={() => {
          setPopupGjsVisible(false);
        }}
        contentRender={() => {
          return (
            <>
              {popupGjsVisible && (
                <GjsEditor
                  grapesjs={grapesjs}
                  id="grapesjs-react"
                  options={{
                    style: "width: 100%; height: 100%;",
                    width: "100%",
                    height: "100%",
                    pageManager: true,
                    assetManager: {
                      custom: true,
                      assets: [],
                    },
                  }}
                  onEditor={onEditorInit}
                  plugins={[
                    presetWebpage,
                    presetNewsletter,
                    blocksBasic
                  ]}
                  pluginsOpts= {{
                    [presetNewsletter.name]: {
                      // ... configuration options for preset Newsletter
                    },
                    [blocksBasic.name]: {
                      // ... configuration options for basic blocks
                    }
                  }}
                />
              )}
            </>
          );
        }}
      ></Popup>
    </>
  );
}
