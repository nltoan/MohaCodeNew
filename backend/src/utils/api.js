import DataSource from "devextreme/data/data_source";
import Notify from "devextreme/ui/notify";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { getToken, clearToken } from "./token";


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
  ajaxOptions.headers = {
    Authorization: `Bearer ${getToken()}`,
  };
}

// 401: phien het han / token sai -> xoa phien va chuyen ve trang dang nhap.
export function handleUnauthorized() {
  clearToken();
  localStorage.removeItem("user");
  localStorage.removeItem("setup_required");
  if (!window.location.pathname.startsWith("/Login")) {
    window.location.href = "/Login";
  }
}

function onAjaxError({ xhr, error }) {
  if (xhr.status === 401) {
    handleUnauthorized();
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

// Doc body JSON; 204 / body rong -> {}.
async function readJson(response) {
  if (response.status === 204) return {};
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// Giong request nhung form-urlencoded, tra ve ca ma HTTP va noi dung loi (khong bien loi thanh null).
export async function requestXFormRaw(path, options = { method: "GET" }) {
  try {
    const response = await fetch(`${window.env.REACT_APP_API_URL}/${String(path).replace(/^\/+/, "")}`, {
      ...options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.status === 401) {
      handleUnauthorized();
    }
    let data = null;
    try { data = await readJson(response); } catch { data = null; }
    return { ok: response.ok, status: response.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

// Goi API va tra ve thong diep loi cua server (Message cua Web API) de popup hien ly do that thay vi bao loi chung.
export async function requestAction(path, options = { method: "POST" }) {
  try {
    const response = await fetch(`${window.env.REACT_APP_API_URL}/${String(path).replace(/^\/+/, "")}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (response.status === 401) {
      handleUnauthorized();
      return { ok: false, message: "Phiên đăng nhập đã hết hạn." };
    }
    const data = await readJson(response);
    if (!response.ok || data?.isOk === false) {
      return { ok: false, message: data?.Message || data?.message || `Thao tác thất bại (HTTP ${response.status}).` };
    }
    return { ok: true, message: "" };
  } catch {
    return { ok: false, message: "Không kết nối được máy chủ." };
  }
}

export async function request(path, options = { method: "GET" }) {
  const response = await fetch(`${window.env.REACT_APP_API_URL}/${String(path).replace(/^\/+/, "")}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (response.status === 401) {
    handleUnauthorized();
    return null;
  }
  if (!response.ok) {
    return null;
  }
  return await readJson(response);
}
