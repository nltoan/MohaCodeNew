import RemoteFileSystemProvider from "devextreme/file_management/remote_provider";

import { pathImg } from "./utils/api";

let config = {
  defaultImageCellRender: (data) => {
    return (
      data.text && (
        <img
          src={pathImg(data.text)}
          style={{ maxWidth: 150, maxHeight: 150 }}
        />
      )
    );
  },
  remoteProvider: new RemoteFileSystemProvider({
    endpointUrl: `${window.env.REACT_APP_API_URL}/FileManager/FileSystem`,
    beforeAjaxSend: (ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: false };
      let access_token = localStorage.getItem("access_token");
      ajaxOptions.headers = {
        Authorization: `Bearer ${access_token}`,
      };
    },
  }),
  dateBoxOptions: {
    displayFormat: "dd/MM/yyyy",
    useMaskBehavior: true,
    applyValueMode: "instantly",
  },
  htmlEditorOptions: {
    height: 100,
    imageUpload: {
      tabs: ["file", "url"],
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
        {
          name: "header",
          acceptedValues: [false, 1, 2, 3, 4, 5],
        },
        "separator",
        "color",
        "background",
        "separator",
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
  },
  htmlEditorMediumOptions: {
    height: 300,
    tableContextMenu: {
      enabled: true,
    },
    tableResizing: {
      enabled: true,
    },

    imageUpload: {
      tabs: ["file", "url"],
      fileUploadMode: "base64",
    },

    // imageUpload: {
    //     tabs: ['file', 'url'],
    //     fileUploadMode: 'server',
    //     uploadUrl: `https://molisa.tefli.vn/api/FileManager/ImageUpload?Width=&Height=`
    // },

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
        "link",
        "image",
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
  },
  htmlEditorLargeOptions: {
    height: 550,
    tableContextMenu: {
      enabled: true,
    },
    tableResizing: {
      enabled: true,
    },

    imageUpload: {
      tabs: ["file", "url"],
      fileUploadMode: "base64",
    },

    // imageUpload: {
    //     tabs: ['file', 'url'],
    //     fileUploadMode: 'server',
    //     uploadUrl: `https://molisa.tefli.vn/api/FileManager/ImageUpload?Width=&Height=`
    // },

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
        "link",
        "image",
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
  },
};

export default Object.freeze(Object.assign({}, config));
