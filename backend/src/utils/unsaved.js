// Hoi xac nhan truoc khi bo thay doi chua luu (popup sua cua DataGrid, form rieng...).
import { confirm } from "devextreme/ui/dialog";

const DEFAULT_MESSAGE = "Nội dung chưa được lưu. Bạn có chắc muốn bỏ các thay đổi?";

// Tra ve Promise<boolean>: true = dong y bo thay doi.
export function confirmDiscard(message = DEFAULT_MESSAGE) {
  return confirm(`<div style="max-width:420px">${message}</div>`, "Thay đổi chưa lưu");
}

// Canh bao khi dong tab / tai lai trang trong luc con thay doi chua luu.
// Goi setBeforeUnload(true) khi mo form co thay doi, setBeforeUnload(false) khi luu xong / dong form.
let beforeUnloadActive = false;
function beforeUnloadHandler(e) {
  e.preventDefault();
  e.returnValue = "";
  return "";
}
export function setBeforeUnload(active) {
  if (active && !beforeUnloadActive) window.addEventListener("beforeunload", beforeUnloadHandler);
  if (!active && beforeUnloadActive) window.removeEventListener("beforeunload", beforeUnloadHandler);
  beforeUnloadActive = !!active;
}

// Luu y: voi Popup sua cua DataGrid (DevExtreme 22.2), editing.popup.onHiding chay SAU khi luoi da huy thay doi,
// nen khong chan duoc o do. Xem cach boc popup.hide() trong pages/TinTuc.js (guardPopupHide).
