import DataSource from "devextreme/data/data_source";
import Notify from "devextreme/ui/notify";
import { createStore } from "devextreme-aspnet-data-nojquery";
import Cookies from "universal-cookie";


export function notify(message, type = "success") {
  Notify(
    {
      message: message,
      height: 45,
      width: 300,
      minWidth: 150,
      type: type,
      displayTime: 3500,
    },
    {
      position: "top right",
    },
  );
}

export function pathFile(path) {
  if (path.startsWith("http")) {
    return path;
  }
  return `${window.env.REACT_APP_UPLOAD_URL}/${path}`;
}

export function pathImg(path) {
  if (!path) {
    return "/dummy.png";
  }
  if (path.startsWith("http")) {
    return path;
  }
  return `${window.env.REACT_APP_UPLOAD_URL}/${path}`;
}

function onInserted(key, values) {
  Notify(
    {
      message: `Thêm mới thành công!`,
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
}

function onUpdated(key, values) {
  Notify(
    {
      message: `Cập nhật thành công!`,
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
}

function onRemoved(key) {
  Notify(
    {
      message: `Xóa thành công!`,
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
}
export function onBeforeSend(method, ajaxOptions) {
  ajaxOptions.xhrFields = { withCredentials: false };
  let access_token = localStorage.getItem("access_token");
  ajaxOptions.headers = {
    Authorization: `Bearer ${access_token}`,
  };
}
function onAjaxError({ xhr, error }) {
  if (xhr.status == 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    const cookies = new Cookies();
    cookies.remove("access_token");
    window.location.href = "/Login";
  }
}

export function createFilterLookupStore(module, filterExp) {
  const url = `${window.env.REACT_APP_API_URL}/${module}`;
  return {
    store: createLookupStore({
      loadUrl: `${url}/Get`,
      insertUrl: `${url}/Post`,
      updateUrl: `${url}/Put`,
      deleteUrl: `${url}/Delete`,
    }),
    filter: filterExp,
  };
}

export function createLookupStore(storeOptions, key = "ID") {
  let dataSourceOptions = null;
  if (typeof storeOptions == "string") {
    const url = `${window.env.REACT_APP_API_URL}/${storeOptions}`;
    dataSourceOptions = createStore({
      key: key,
      loadUrl: `${url}/Get`,
      insertUrl: `${url}/Post`,
      updateUrl: `${url}/Put`,
      deleteUrl: `${url}/Delete`,
      onBeforeSend: onBeforeSend,
      onInserted: onInserted,
      onUpdated: onUpdated,
      onRemoved: onRemoved,
      onAjaxError: onAjaxError,
    });
    return dataSourceOptions;
  } else if (typeof storeOptions == "object") {
    let mergedOptions = {
      ...{
        key: key,
        onBeforeSend: onBeforeSend,
        onInserted: onInserted,
        onUpdated: onUpdated,
        onRemoved: onRemoved,
        onAjaxError: onAjaxError,
      },
      ...storeOptions,
    };
    dataSourceOptions = createStore(mergedOptions);
    return dataSourceOptions;
  }
}

export function createCustomStore(storeOptions, key = "ID", filters = null) {
  let dataSourceOptions = null;
  if (typeof storeOptions == "string") {
    const url = `${window.env.REACT_APP_API_URL}/${storeOptions}`;
    dataSourceOptions = new DataSource({
      store: createStore({
        key: key,
        loadUrl: `${url}/Get`,
        insertUrl: `${url}/Post`,
        updateUrl: `${url}/Put`,
        deleteUrl: `${url}/Delete`,
        onBeforeSend: onBeforeSend,
        onInserted: onInserted,
        onUpdated: onUpdated,
        onRemoved: onRemoved,
        onAjaxError: onAjaxError,
      }),
      filter: filters,
    });
    return dataSourceOptions;
  } else if (typeof storeOptions == "object") {
    let mergedOptions = {
      ...{
        key: key,
        onBeforeSend: onBeforeSend,
        onInserted: onInserted,
        onUpdated: onUpdated,
        onRemoved: onRemoved,
        onAjaxError: onAjaxError,
      },
      ...storeOptions,
    };
    dataSourceOptions = new DataSource({
      store: createStore(mergedOptions),
      filter: filters,
    });
    return dataSourceOptions;
  }
}

export async function requestXForm(path, options = { method: "GET" }) {
  const cookies = new Cookies();
  let access_token = cookies.get("access_token");
  const response2 = await fetch(`${window.env.REACT_APP_API_URL}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (response2.status != 200) {
    return null;
  }
  var data = await response2.json();
  return data;
}

export async function request(path, options = { method: "GET" }) {
  const cookies = new Cookies();
  let access_token = cookies.get("access_token");
  const response2 = await fetch(`${window.env.REACT_APP_API_URL}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (response2.status != 200) {
    return null;
  }
  var data = await response2.json();
  return data;
}
