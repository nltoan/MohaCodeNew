import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Button as DataGridButton,
  Lookup,
  Form,
  FormItem,
  FilterRow, HeaderFilter, ToolbarItem,
  Scrolling,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab,
} from 'devextreme-react/form';
import 'devextreme-react/html-editor';

import {getFrontEndURL} from '../utils/helpers';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore } from '../utils/api';
import { Popup } from 'devextreme-react';
import MyImageFileUploader from '../components/MyImageFileUploader';
import MyFileFileUploader from '../components/MyFileFileUploader';
import CKEditorWrapper from '../components/CKEditorWrapper';
import MyTreeCombobox from '../components/MyTreeCombobox';
import { useSearchParams } from 'react-router-dom';
import ApprovePopup from '../components/ApprovePopup';
import ActionPopup from '../components/ActionPopup';
import SendApprovePopup from '../components/SendApprovePopup';
import ViewPopup from '../components/ViewPopup';
import NewsPreviewPopup from '../components/NewsPreviewPopup';
import DropDownButton from 'devextreme-react/drop-down-button';
import { confirm } from 'devextreme/ui/dialog';
import Notify from 'devextreme/ui/notify';
import { Deferred } from 'devextreme/core/utils/deferred';
import { confirmDiscard, setBeforeUnload } from '../utils/unsaved';

// ---- Ban nhap cuc bo (localStorage) cho form sua tin: chong mat bai khi dong nham / het phien dang nhap ----
const DRAFT_PREFIX = "tintuc-draft:";
const DRAFT_FIELDS = ["TieuDe", "MoTa", "NoiDung"];
const DRAFT_INTERVAL_MS = 30000;

const DRAFT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Nhap gan voi tai khoan dang dang nhap: may dung chung thi nguoi khac khong thay / khoi phuc duoc nhap cua minh.
// Khong xoa khi het phien (muc dich chinh cua nhap la cuu bai khi bi dang xuat giua chung).
function currentUserId() {
  try {
    const u = JSON.parse(window.localStorage.getItem("user") || "null");
    return u && u.UserID != null ? String(u.UserID) : null;
  } catch {
    return null;
  }
}
function draftStorageKey(key) {
  const uid = currentUserId();
  if (!uid) return null;
  return DRAFT_PREFIX + uid + ":" + (key == null ? "new" : String(key));
}
// Bo nhap dang cu (khoa khong co UserID, ai cung doc duoc) va nhap qua han.
(function cleanupDrafts() {
  try {
    const ls = window.localStorage;
    for (let i = ls.length - 1; i >= 0; i -= 1) {
      const k = ls.key(i);
      if (!k || k.indexOf(DRAFT_PREFIX) !== 0) continue;
      if (/^tintuc-draft:(new|[^:]+)$/.test(k)) { ls.removeItem(k); continue; }
      try {
        const d = JSON.parse(ls.getItem(k));
        if (!d || !(Date.now() - d.savedAt < DRAFT_MAX_AGE_MS)) ls.removeItem(k);
      } catch {
        ls.removeItem(k);
      }
    }
  } catch {
    // bo qua: trinh duyet chan localStorage
  }
})();
function readDraft(key) {
  const sk = draftStorageKey(key);
  if (!sk) return null;
  try {
    const raw = window.localStorage.getItem(sk);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object") return null;
    if (!(Date.now() - d.savedAt < DRAFT_MAX_AGE_MS)) {
      window.localStorage.removeItem(sk);
      return null;
    }
    return d;
  } catch {
    return null;
  }
}
function writeDraft(key, draft) {
  const sk = draftStorageKey(key);
  if (!sk) return false;
  try {
    window.localStorage.setItem(sk, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}
function removeDraft(key) {
  const sk = draftStorageKey(key);
  if (!sk) return;
  try {
    window.localStorage.removeItem(sk);
  } catch {
    // bo qua: trinh duyet chan localStorage
  }
}
function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}
function formatDraftTime(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  return d.toDateString() === new Date().toDateString()
    ? time
    : `${time} ngày ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
// Dua gia tri ve dang so sanh duoc: bo khac biet khong dang ke do trinh soan thao chuan hoa HTML
// (the bao <p>, thu tu/dang thuoc tinh, ky tu thay the &aacute;/&nbsp;, khoang trang), mang -> JSON, ngay -> so.
const MEDIA_TAGS = { img: 1, iframe: 1, video: 1, audio: 1, source: 1, a: 1 };
let entityDecoder = null;
function decodeEntities(s) {
  if (s.indexOf("&") < 0) return s;
  try {
    if (!entityDecoder) entityDecoder = document.createElement("textarea");
    entityDecoder.innerHTML = s;
    return entityDecoder.value;
  } catch {
    return s;
  }
}
function comparable(v) {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return isNaN(v.getTime()) ? "" : String(v.getTime());
  if (Array.isArray(v)) return v.length ? JSON.stringify(v) : "";
  const s = String(v);
  if (s === "[]") return "";
  const noTags = s.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) => {
    const t = tag.toLowerCase();
    if (!MEDIA_TAGS[t] || m.charAt(1) === "/") return "";
    // Giu lai anh/video/lien ket (chi ten the + duong dan) de them/bot anh van tinh la thay doi.
    const src = /\s(?:src|href)\s*=\s*["']?([^"'\s>]+)/i.exec(m);
    return `<${t}:${src ? src[1] : ""}>`;
  });
  return decodeEntities(noTags).replace(/[\s ​]+/g, "");
}
function sameValue(a, b) {
  if (a instanceof Date || b instanceof Date) {
    const ta = a ? new Date(a).getTime() : NaN;
    const tb = b ? new Date(b).getTime() : NaN;
    if (isNaN(ta) && isNaN(tb)) return true;
    return ta === tb;
  }
  return comparable(a) === comparable(b);
}
// Dau van tay noi dung goc (tren may chu) cua tin luc mo form: biet ban tren may chu da bi sua sau khi luu nhap chua.
function baseSignature(base) {
  const s = DRAFT_FIELDS.map((f) => comparable(base ? base[f] : "")).join("\u0001");
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36) + ":" + s.length;
}
function notifyLong(message, type = "info") {
  Notify(
    { message, width: 380, minWidth: 150, type, displayTime: 6000 },
    { position: "top right" },
  );
}
// Tim phien ban CKEditor dang hien trong popup sua tin (ten "editor_...").
function findVisibleCkEditor() {
  const CK = window.CKEDITOR;
  if (!CK || !CK.instances) return null;
  return Object.keys(CK.instances)
    .map((k) => CK.instances[k])
    .find((ed) => ed && ed.name && ed.name.indexOf("editor_") === 0 && ed.container && document.body.contains(ed.container.$)) || null;
}

// Chan dong popup sua tin bang dau X / phim Esc khi con noi dung chua luu.
// Khong dung onHiding: DataGrid dang ky su kien "hiding" rieng (goi cancelEditData) chay TRUOC onHiding,
// nen den luc onHiding thi thay doi da bi xoa. Vi vay boc ham hide() cua chinh popup (nut X, Esc deu goi hide();
// con luoi tu dong popup sau khi luu/huy bang option("visible", false) nen khong bi chan).
function guardPopupHide(popup, getHandlers) {
  if (!popup || popup.__tinTucHideGuard) return;
  const originalHide = popup.hide;
  popup.hide = function (...args) {
    const h = getHandlers();
    if (h && h.shouldConfirmHide && h.shouldConfirmHide()) {
      h.confirmCloseEdit();
      return new Deferred().resolve().promise();
    }
    return originalHide.apply(this, args);
  };
  popup.__tinTucHideGuard = true;
}

// Mau nhan trang thai trong danh sach.
const STATUS_COLORS = {
  public: { backgroundColor: "#28a745", color: "#fff" },
  waitapprove: { backgroundColor: "#fd7e14", color: "#fff" },
  rejectapprove: { backgroundColor: "#dc3545", color: "#fff" },
  draft: { backgroundColor: "#6c757d", color: "#fff" },
  cancelpublic: { backgroundColor: "#ced4da", color: "#212529" },
};
function statusCellRender(cell) {
  const style = STATUS_COLORS[cell.value] || { backgroundColor: "#e9ecef", color: "#212529" };
  const text = cell.displayValue || cell.value;
  if (!text) return null;
  return (
    <span className="badge" style={{ ...style, whiteSpace: "normal", fontSize: "85%", fontWeight: 600 }}>
      {text}
    </span>
  );
}
// Cot "Buoc hien tai / Nguoi xu ly": du lieu BuocThu, TongSoBuoc, TenBuocHienTai, NguoiXuLyHienTai do API TinTucs/Get tinh.
function stepCellRender(cell) {
  const d = cell.data || {};
  if (d.TrangThai === "waitapprove") {
    const step = d.BuocThu != null && d.TongSoBuoc != null ? `Bước ${d.BuocThu}/${d.TongSoBuoc}` : "Đang chờ duyệt";
    return (
      <div>
        <div>{step}{d.TenBuocHienTai ? `: ${d.TenBuocHienTai}` : ""}</div>
        {d.NguoiXuLyHienTai && <div className="text-muted small">Người xử lý: {d.NguoiXuLyHienTai}</div>}
      </div>
    );
  }
  if (d.TrangThai === "rejectapprove") {
    return <div className="text-muted small">Bị trả về, chờ người viết sửa và gửi duyệt lại</div>;
  }
  if (d.TrangThai === "draft") {
    return <div className="text-muted small">Người viết (chưa gửi duyệt)</div>;
  }
  return null;
}

const dataSourceChuyenMucOptions = createFilterLookupStore("ChuyenMucs",["IsVisible", "=", 1]);
const dataSourceLoaiTinOptions = createLookupStore("DM_LoaiTin");
const dataSourceBlockOptions = createLookupStore("Blocks");
const dataSourceBuocQuyTrinhsOptions = createLookupStore("BuocQuyTrinhs");
const dataSourceFileOptions = createLookupStore({
  loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
});
const dataSourceUsersOptions = createLookupStore("User_Account", "UserID");
// Chon "Tin lien quan": tai tung trang 20 tin tu may chu va tim theo tieu de, khong nap ca bang tin.
const dataSourceTinLienQuanOptions = {
  store: createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Get?type=publish`,
  }),
  paginate: true,
  pageSize: 20,
};

export default function TinTuc() {
  //const dataSourceChuyenMucOptions = createLookupStore("ChuyenMucs");
  const [dataSourceOptions, setDataSourceOptions] = useState(null);
  const [title, setTitle] = useState("Quản lý tin tức");
  const [action, setAction] = useState();
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get("action");
  const ID = searchParams.get("ID");

  const gridRef = useRef();
  const rowDataRef = useRef(null);
  // Viec can lam ngay sau khi luu tin moi (onRowInserted): "close" | "continue" | "preview" | "sendapprove".
  const afterInsertRef = useRef(null);
  const initValuesRef = useRef(null); // gia tri khoi tao cua tin moi, de biet nguoi dung da go gi chua
  const formRef = useRef(null);
  const savingRef = useRef(false);
  const allowHideRef = useRef(false);
  const timersRef = useRef({ dirty: null, draft: null });
  const sendBtnRef = useRef(null);
  const hintBtnRef = useRef(null);
  const lastDraftAtRef = useRef(null);
  const handlersRef = useRef({});

  function getGrid() {
    return gridRef.current ? gridRef.current.instance : null;
  }

  // Trang thai dong dang sua trong popup: tin moi (insert) hay tin co san (update), gia tri hien tai va gia tri goc.
  function currentEdit() {
    const grid = getGrid();
    if (!grid) return null;
    const changes = grid.option("editing.changes") || [];
    const insert = changes.find((c) => c.type === "insert");
    if (insert) {
      return { isNew: true, key: null, values: { ...(insert.data || {}) }, base: initValuesRef.current || {} };
    }
    const editKey = grid.option("editing.editRowKey");
    if (editKey == null) return null;
    const upd = changes.find((c) => c.type === "update" && String(c.key) === String(editKey));
    const base = rowDataRef.current || {};
    const changed = upd && upd.data ? upd.data : {};
    return { isNew: false, key: editKey, values: { ...base, ...changed }, base, changed };
  }

  // Co thay doi that su do nguoi dung nhap? (grid.hasEditData() luon dung voi tin moi du chua go gi.)
  function hasUserChanges() {
    const st = currentEdit();
    if (!st) return false;
    const fields = (st.isNew
      ? Object.keys({ ...st.values, ...st.base })
      : Object.keys(st.changed)).filter((f) => f.indexOf("__") !== 0);
    return fields.some((f) => !sameValue(st.values[f], st.base[f]));
  }

  function setDraftHint(text) {
    if (hintBtnRef.current) hintBtnRef.current.option("text", text || "");
  }

  function saveDraftNow() {
    const st = currentEdit();
    if (!st) return;
    const differs = DRAFT_FIELDS.some((f) => !sameValue(st.values[f], st.base[f]));
    if (!differs) return;
    const draft = { key: st.isNew ? "new" : st.key, savedAt: Date.now(), baseSig: baseSignature(st.base) };
    DRAFT_FIELDS.forEach((f) => {
      draft[f] = st.values[f] == null ? "" : st.values[f];
    });
    if (writeDraft(st.isNew ? null : st.key, draft)) {
      lastDraftAtRef.current = draft.savedAt;
      setDraftHint(`Đã lưu nháp trên máy lúc ${formatDraftTime(draft.savedAt)}`);
    }
  }

  function stopEditTimers() {
    const t = timersRef.current;
    if (t.dirty) clearInterval(t.dirty);
    if (t.draft) clearInterval(t.draft);
    timersRef.current = { dirty: null, draft: null };
    window.removeEventListener("pagehide", handlersRef.current.onPageHide);
  }

  function startEditTimers() {
    stopEditTimers();
    timersRef.current = {
      // Canh bao khi dong tab / tai lai trang trong luc con noi dung chua luu.
      dirty: setInterval(() => setBeforeUnload(hasUserChanges()), 2000),
      draft: setInterval(() => saveDraftNow(), DRAFT_INTERVAL_MS),
    };
    // Roi trang (ca khi het phien dang nhap bi chuyen ve trang Login): luu nhap lan cuoi.
    window.addEventListener("pagehide", handlersRef.current.onPageHide);
  }

  // Dua noi dung ban nhap vao cac o dang sua.
  function applyDraft(d) {
    const grid = getGrid();
    const form = formRef.current;
    const rowIndex = grid ? grid.getRowIndexByKey(grid.option("editing.editRowKey")) : -1;
    ["TieuDe", "MoTa"].forEach((f) => {
      const editor = form && form.getEditor ? form.getEditor(f) : null;
      if (editor) editor.option("value", d[f] || "");
      else if (grid && rowIndex >= 0) grid.cellValue(rowIndex, f, d[f] || "");
    });
    const html = d.NoiDung || "";
    let tries = 0;
    const setCk = () => {
      const ed = findVisibleCkEditor();
      if (ed && ed.status === "ready") {
        // setData roi phat "change" de CKEditorWrapper ghi gia tri vao dong dang sua.
        ed.setData(html, { callback: () => ed.fire("change") });
        return;
      }
      tries += 1;
      if (tries < 40) setTimeout(setCk, 300);
      else if (grid && rowIndex >= 0) grid.cellValue(rowIndex, "NoiDung", html);
    };
    setCk();
  }

  function offerDraftRestore() {
    const st = currentEdit();
    if (!st) return;
    const d = readDraft(st.isNew ? null : st.key);
    if (!d) return;
    const differs = DRAFT_FIELDS.some((f) => !sameValue(d[f], st.values[f]));
    if (!differs) {
      removeDraft(st.isNew ? null : st.key);
      return;
    }
    // Ban tren may chu da bi sua (nguoi khac / nguoi duyet) sau luc luu nhap: khoi phuc se ghi de nhung thay doi do.
    const serverChanged = !st.isNew && !!d.baseSig && d.baseSig !== baseSignature(st.base);
    const warn = serverChanged
      ? `<p style="color:#b00020;margin-top:8px"><b>Lưu ý:</b> tin này đã được sửa trên hệ thống sau lúc lưu nháp. Nếu khôi phục rồi lưu, các thay đổi đó sẽ bị ghi đè.</p>`
      : "";
    confirm(
      `<div style="max-width:420px">Có bản đang soạn dở chưa lưu của tin này. Khôi phục bản đang soạn dở lúc ${formatDraftTime(d.savedAt)}?${warn}</div>`,
      "Khôi phục bản nháp",
    ).then((ok) => {
      if (ok) {
        applyDraft(d);
        lastDraftAtRef.current = d.savedAt;
        setDraftHint(`Đã khôi phục bản nháp lúc ${formatDraftTime(d.savedAt)}`);
      } else {
        removeDraft(st.isNew ? null : st.key);
      }
    });
  }

  function canSendApproveCurrent() {
    // Tin moi luon la ban nhap cua chinh nguoi tao; tin co san: cung dieu kien voi nut "Gui duyet" (CanSendApprove).
    return !rowDataRef.current || Number(rowDataRef.current.CanSendApprove) === 1;
  }

  function reopenRow(grid, key) {
    grid.navigateToRow(key).done(function () {
      const rowindex = grid.getRowIndexByKey(key);
      if (rowindex >= 0) grid.editRow(rowindex);
    });
  }

  // Luu tin trong popup. after: "close" | "continue" | "preview" | "sendapprove".
  async function saveEdit(after) {
    const grid = getGrid();
    if (!grid) return;
    // CKEditor chi dong bo khi doi noi dung / mat focus: dong bo lan cuoi truoc khi luu.
    const ck = findVisibleCkEditor();
    if (ck && ck.status === "ready") ck.fire("change");
    const st = currentEdit();
    const isNew = st ? st.isNew : false;
    const key = grid.option("editing.editRowKey");
    if (isNew) afterInsertRef.current = after;
    savingRef.current = true;
    try {
      await grid.saveEditData();
    } finally {
      savingRef.current = false;
      afterInsertRef.current = null;
    }
    if (isNew) return; // onRowInserted xu ly tiep theo "after"
    if (grid.option("editing.editRowKey") != null) return; // con loi nhap lieu, popup van mo
    removeDraft(key);
    if (after === "continue") {
      reopenRow(grid, key);
    } else if (after === "preview") {
      setAction({ type: "preview", data: key });
    } else if (after === "sendapprove") {
      setAction({ type: "sendapprove", data: key });
    }
  }

  // Nut "Huy": hoi truoc neu con noi dung chua luu.
  function cancelEdit() {
    const grid = getGrid();
    if (!grid) return;
    if (!hasUserChanges()) {
      allowHideRef.current = true;
      grid.cancelEditData();
      return;
    }
    confirmDiscard("Tin đang soạn có nội dung chưa lưu. Bạn có chắc muốn bỏ các thay đổi?").then((ok) => {
      if (!ok) return;
      discardEdit();
    });
  }

  function discardEdit() {
    const grid = getGrid();
    const st = currentEdit();
    if (st) removeDraft(st.isNew ? null : st.key);
    allowHideRef.current = true;
    setBeforeUnload(false);
    if (grid) grid.cancelEditData();
  }

  handlersRef.current = {
    saveEdit,
    cancelEdit,
    onPageHide: handlersRef.current.onPageHide || (() => handlersRef.current.saveDraftNow()),
    saveDraftNow,
    onPopupShowing: (e) => {
      allowHideRef.current = false;
      lastDraftAtRef.current = null;
      setDraftHint("");
      if (sendBtnRef.current) sendBtnRef.current.option("visible", canSendApproveCurrent());
      if (e && e.component) guardPopupHide(e.component, () => handlersRef.current);
    },
    onPopupShown: () => {
      startEditTimers();
      offerDraftRestore();
    },
    // Dong bang dau X / phim Esc khi con noi dung chua luu: hoi truoc (xem guardPopupHide).
    shouldConfirmHide: () => !allowHideRef.current && !savingRef.current && hasUserChanges(),
    confirmCloseEdit: () => {
      confirmDiscard("Tin đang soạn có nội dung chưa lưu. Bạn có chắc muốn đóng và bỏ các thay đổi?").then((ok) => {
        if (ok) discardEdit();
      });
    },
    onPopupHidden: () => {
      stopEditTimers();
      setBeforeUnload(false);
    },
  };

  useEffect(() => {
    return () => {
      stopEditTimers();
      setBeforeUnload(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tuy chon nut/popup tao mot lan (on dinh qua cac lan render) de popup sua khong bi dung lai giua chung.
  const popupConfig = useMemo(() => ({
    onShowing: (e) => handlersRef.current.onPopupShowing(e),
    onShown: () => handlersRef.current.onPopupShown(),
    onHidden: () => handlersRef.current.onPopupHidden(),
    hintOptions: {
      text: "",
      stylingMode: "text",
      focusStateEnabled: false,
      hoverStateEnabled: false,
      activeStateEnabled: false,
      elementAttr: { class: "text-muted" },
      onInitialized: (e) => {
        hintBtnRef.current = e.component;
        if (lastDraftAtRef.current) e.component.option("text", `Đã lưu nháp trên máy lúc ${formatDraftTime(lastDraftAtRef.current)}`);
      },
    },
    previewOptions: {
      icon: "fas fa-eye",
      text: "Xem trước",
      hint: "Lưu rồi xem trước tin ngay trong trang quản trị (kể cả tin nháp)",
      onClick: () => handlersRef.current.saveEdit("preview"),
    },
    sendOptions: {
      icon: "fas fa-paper-plane",
      text: "Lưu và gửi duyệt",
      hint: "Lưu tin rồi gửi lên người duyệt",
      onInitialized: (e) => {
        sendBtnRef.current = e.component;
        e.component.option("visible", canSendApproveCurrent());
      },
      onClick: () => handlersRef.current.saveEdit("sendapprove"),
    },
    continueOptions: {
      icon: "save",
      text: "Lưu và tiếp tục",
      hint: "Lưu tin và tiếp tục sửa (thêm file đính kèm, vùng hiển thị, tin liên quan)",
      onClick: () => handlersRef.current.saveEdit("continue"),
    },
    closeOptions: {
      icon: "check",
      type: "default",
      text: "Lưu và đóng",
      onClick: () => handlersRef.current.saveEdit("close"),
    },
    cancelOptions: {
      icon: "close",
      text: "Hủy",
      onClick: () => handlersRef.current.cancelEdit(),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // Cac thao tac quy trinh cua mot dong (cung dieu kien hien nut nhu truoc).
  function rowActionItems(d) {
    const open = (actionType) => () => setAction({ type: actionType, data: d.ID, title: d.TieuDe });
    const items = [];
    // Sua tin ngay tu menu (nut but chi la icon nho o cot cuoi, de bi bo qua): cung dieu kien voi nut Sua.
    if (Number(d.CanEdit) === 1 || Number(d.CanSendNext) === 1) {
      items.push({
        text: "Sửa tin",
        icon: "fas fa-pen",
        run: () => {
          const g = gridRef.current ? gridRef.current.instance : null;
          if (g) reopenRow(g, d.ID);
        },
      });
    }
    if (Number(d.CanSendApprove) === 1) items.push({ text: "Gửi duyệt", icon: "fas fa-paper-plane", run: open("sendapprove") });
    if (Number(d.CanApprove) === 1) items.push({ text: "Duyệt và xuất bản", icon: "fas fa-check-circle", run: open("approve") });
    if (Number(d.CanSendNext) === 1) items.push({ text: "Duyệt, chuyển bước tiếp", icon: "fas fa-share", run: open("approve") });
    if (Number(d.CanPublish) === 1) items.push({ text: "Xuất bản lên cổng", icon: "fas fa-globe", run: open("public") });
    if (Number(d.CanUnPublish) === 1) items.push({ text: "Gỡ khỏi cổng (hủy xuất bản)", icon: "fas fa-ban", run: open("cancelpublic") });
    if (Number(d.CanUnPublish) === 1 && Number(d.NoiBat) !== 1) items.push({ text: "Đánh dấu nổi bật chuyên mục", icon: "fas fa-star", run: open("star") });
    if (Number(d.CanUnPublish) === 1 && Number(d.NoiBat) === 1) items.push({ text: "Bỏ đánh dấu nổi bật", icon: "far fa-star", run: open("unstar") });
    items.push({
      text: "Xem trên cổng thông tin",
      icon: "fas fa-external-link-alt",
      run: () => {
        const w = window.open(`${getFrontEndURL("tin-tuc", d.TieuDe, d.ID)}`, "_blank");
        if (w) w.focus();
      },
    });
    items.push({ text: "Xem lịch sử", icon: "fas fa-history", run: () => setAction({ type: "view", data: d }) });
    return items;
  }

  function rowActionsCellRender(cell) {
    if (!cell.data || cell.rowType !== "data") return null;
    return (
      <DropDownButton
        text="Thao tác"
        stylingMode="outlined"
        useSelectMode={false}
        displayExpr="text"
        items={rowActionItems(cell.data)}
        dropDownOptions={{ width: 260 }}
        onItemClick={(e) => e.itemData && e.itemData.run && e.itemData.run()}
      />
    );
  }

  useEffect(() => {
    if (actionParam) {
      setAction({
        type: actionParam,
        data: ID,
      });
    }
  }, []);

  useEffect(() => {
    // Khong gui "?type=undefined": bo tham so khi khong co type (API coi thieu type nhu khong loc).
    const typeQuery = type ? `?type=${encodeURIComponent(type)}` : "";
    setDataSourceOptions(
      createCustomStore({
        loadUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Get${typeQuery}`,
        insertUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Post${typeQuery}`,
        updateUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Put${typeQuery}`,
        deleteUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Delete${typeQuery}`,
      }),
    );
    if (type == "owner") {
      setTitle("Danh sách tin của tôi");
    } else if (type == "publish") {
      setTitle("Danh sách tin xuất bản của tôi");
    } else if (type == "unpublish") {
      setTitle("Danh sách tin hủy xuất bản của tôi");
    } else if (type == "wait") {
      setTitle("Danh sách tin gửi duyệt của tôi");
    } else if (type == "cancel") {
      setTitle("Danh sách tin bị trả về của tôi");
    } else if (type == "draft") {
      setTitle("Danh sách tin lưu nháp của tôi");
    } else if (type == "approving") {
      setTitle("Danh sách tin đang kiểm duyệt của tôi");
    } else if (type == "ownerApproving") {
      setTitle("Danh sách tin chờ tôi kiểm duyệt");
    } else if (type == "publishUnPublish") {
      setTitle("Danh sách tin xuất bản/ hủy xuất bản");
    } else if (type == "infographic") {
      setTitle("Danh sách tin infographic");
    } else if (type == "emagazine") {
      setTitle("Danh sách tin EMagazine");
    }
  }, [type]);
  function canCreate() {
    return (
      type == "owner" ||
      type == undefined ||
      type == "infographic" ||
      type == "emagazine"
    );
  }
  function treeviewChuyenMucEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceChuyenMucOptions}
          keyExpr={"ID"}
          displayExpr={"TenChuyenMuc"}
          parentIdExpr={"ChuyenMucCha"}
          selectionMode="single"
          defaultValue={data.row.data.IDChuyenMuc}
          onValueChanged={(e) => {
            if (e.value && e.value.length > 0) {
              data.setValue(e.value[0]);
            } else {
              data.setValue(null);
            }
          }}
        />
      </>
    );
  }
  function treeviewChuyenMucThemEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceChuyenMucOptions}
          keyExpr={"ID"}
          displayExpr={"TenChuyenMuc"}
          parentIdExpr={"ChuyenMucCha"}
          selectionMode="multiple"
          defaultValue={data.row.data.ChuyenMucHienThiThem ? JSON.parse(data.row.data.ChuyenMucHienThiThem) : []}
          onValueChanged={(e) => {
            data.setValue(e.value);
          }}
        />
      </>
    );
  }
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
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
          {action && action.type == "view" && (
            <ViewPopup rowview={action.data} />
          )}
          {action && action.type == "preview" && (
            <NewsPreviewPopup
              ID={action.data}
              onHidden={() => setAction({ type: "", data: "" })}
            />
          )}
          {action && action.type == "approve" && (
            <ApprovePopup
              ID={action.data}
              onHidden={() => {
                gridRef.current.instance.refresh();
                setAction({type:"",data:""});
              }}
            />
          )}
          {action && action.type == "sendapprove" && (
            <SendApprovePopup
              ID={action.data}
              action={action.type}
              onHidden={() => {
                gridRef.current.instance.refresh();
                setAction({type:"",data:""});
              }}
            />
          )}
          {action &&
            (action.type == "cancelpublic" ||
              action.type == "public" ||
              action.type == "star" ||
              action.type == "unstar") && (
              <ActionPopup
                ID={action.data}
                action={action.type}
                title={action.title}
                onHidden={() => {
                  gridRef.current.instance.refresh();
                  setAction({type:"",data:""});
                }}
              />
            )}
          <DataGrid
            ref={gridRef}
            dataSource={dataSourceOptions}
            remoteOperations={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            wordWrapEnabled={true}
            height="calc(100vh - 190px)"
            showBorders={true}
            onInitNewRow={(e) => {
              rowDataRef.current = null;
              e.data.NgonNgu = 'vi';
              e.data.NgayXuatBan = new Date();
              e.data.NoiBat = 1;
              if (type === "infographic") {
                e.data.Type = 4;
                e.data.Infographich = 1;
              }
              if (type === "emagazine") {
                e.data.Type = 3;
              }
              initValuesRef.current = { ...e.data };
            }}
            onEditingStart={(e) => {
              rowDataRef.current = e.data;
              initValuesRef.current = null;
            }}
            onRowInserted={(e) => {
              const after = afterInsertRef.current || "close";
              afterInsertRef.current = null;
              removeDraft(null);
              setBeforeUnload(false);
              if (after === "sendapprove") {
                setAction({ type: "sendapprove", data: e.key });
                return;
              }
              notifyLong("Đã lưu nháp. Bấm Gửi duyệt để chuyển lên người duyệt.");
              if (after === "preview") {
                setAction({ type: "preview", data: e.key });
              }
              if (after === "continue" || after === "preview") {
                // Mo lai tin vua luu de sua tiep (luc nay moi them duoc file dinh kem, vung hien thi, tin lien quan).
                reopenRow(e.component, e.key);
              }
            }}
            onRowUpdated={(e) => {
              removeDraft(e.key);
            }}
          >
            <FilterRow visible={true} />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} />
            <Scrolling
                    useNative={false}
                    scrollByContent={true}
                    scrollByThumb={true}
                    showScrollbar="onHover" />
            <Editing
              mode="popup"
              useIcons={true}
              allowUpdating={true}
              allowAdding={canCreate()}
              allowDeleting={true}
            >
              <DataGridPopup
                title="Thông tin"
                showTitle={true}
                fullScreen={true}
                onShowing={popupConfig.onShowing}
                onShown={popupConfig.onShown}
                onHidden={popupConfig.onHidden}
              >
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="before"
                  options={popupConfig.hintOptions}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={popupConfig.previewOptions}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={popupConfig.sendOptions}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={popupConfig.continueOptions}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={popupConfig.closeOptions}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={popupConfig.cancelOptions}
                />
              </DataGridPopup>
              <Form
                onInitialized={(e) => {
                  formRef.current = e.component;
                  const isExisting = !!rowDataRef.current;
                  // Tin moi chua co ma: cac tab gan voi tin (vung hien thi, tin lien quan, file dinh kem) hien nhung khoa lai,
                  // kem loi nhan o tab dau; cac tab binh luan / lich su chi hien voi tin da luu.
                  e.component.option("items[0].tabs[1].disabled", !isExisting);
                  e.component.option("items[0].tabs[2].disabled", !isExisting);
                  e.component.option("items[0].tabs[3].disabled", !isExisting);
                  e.component.option("items[0].tabs[4].visible", isExisting);
                  e.component.option("items[0].tabs[5].visible", isExisting);
                  e.component.option("items[0].tabs[6].visible", isExisting);
                }}
                onDisposing={(e) => {
                  if (formRef.current === e.component) formRef.current = null;
                }}
              >
                <TabbedItem colSpan={2}>
                  <Tab title="Thông tin chung" colCount={2}>
                    <Item
                      colSpan={2}
                      render={() => (rowDataRef.current ? null : (
                        <div className="alert alert-info mb-0" role="note">
                          Lưu tin lần đầu (bấm “Lưu và tiếp tục”) để thêm file đính kèm, vùng hiển thị, tin liên quan.
                        </div>
                      ))}
                    />
                    <Item
                      dataField="IDChuyenMuc"
                      isRequired={true}
                      colSpan={2}
                    />
                    <Item
                      dataField="ChuyenMucHienThiThem"
                      editorType="dxTagBox"
                      colSpan={2}
                    />
                    <Item dataField="TieuDe" colSpan={2} isRequired={true} />
                    <Item dataField="NgonNgu" colSpan={2} isRequired={true} />
                    <Item dataField="MoTa" colSpan={2} />
                    <Item dataField="NoiDung" colSpan={2} />
                    <Item dataField="TacGia" />
                    <Item
                      dataField="ChoPhepGuiPhanHoi"
                      editorType="dxCheckBox"
                    />
                    <Item dataField="AnhDaiDien" />
                    <Item dataField="NgayXuatBan" />
                    {/* <Item dataField="Type" /> */}
                    <Item dataField="TuKhoa" />
                    <Item dataField="LoaiTin" />
                    <Item dataField="NoiBat" editorType="dxCheckBox" />
                  </Tab>
                  <Tab title="Vùng hiển thị">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      onRowInserted={(e) => {
                        e.component.refresh();
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                      onInitNewRow={(e) => {
                        e.data.TinTucID = rowDataRef.current.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item dataField="BlockID" colSpan={2} />
                          <Item dataField="TinTucID" visible={false} />
                        </Form>
                      </Editing>

                      <Column
                        dataField="TinTucID"
                        caption="Tin tức"
                        visible={false}
                      />
                      <Column dataField="BlockID" caption="Tên vùng">
                        <Lookup
                          allowClearing={true}
                          searchEnabled={true}
                          dataSource={dataSourceBlockOptions}
                          allowColumnResizing={true}
                          valueExpr="ID"
                          displayExpr="Title"
                        />
                      </Column>
                    </DataGrid>
                  </Tab>
                  <Tab title="Các tin liên quan">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      onRowInserted={(e) => {
                        e.component.refresh();
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                      onInitNewRow={(e) => {
                        e.data.TinTucID = rowDataRef.current.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item
                            dataField="LienQuanID"
                            colSpan={2}
                            editorOptions={{
                              searchEnabled: true,
                              searchExpr: "TieuDe",
                              searchMode: "contains",
                              searchTimeout: 500,
                              minSearchLength: 0,
                              showDataBeforeSearch: true,
                              placeholder: "Gõ vài chữ trong tiêu đề để tìm tin...",
                            }}
                          />
                        </Form>
                      </Editing>
                      <Column
                        dataField="LienQuanID"
                        caption="Tiêu đề"
                        // API TinTuc_LienQuan/Get tra kem tin lien quan (LienQuan): hien tieu de ma khong can nap ca bang tin.
                        calculateDisplayValue={(row) => (row && row.LienQuan && row.LienQuan.TieuDe) || (row ? row.LienQuanID : "")}
                      >
                        <Lookup
                          allowClearing={true}
                          dataSource={dataSourceTinLienQuanOptions}
                          valueExpr="ID"
                          displayExpr="TieuDe"
                        />
                      </Column>
                    </DataGrid>
                  </Tab>
                  <Tab title="Danh sách file đính kèm">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      onRowInserted={(e) => {
                        e.component.refresh();
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                      onInitNewRow={(e) => {
                        e.data.TinTucID = rowDataRef.current.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item dataField="FileID" colSpan={2} />
                        </Form>
                      </Editing>
                      <Column
                        dataField="FileID"
                        dataType="string"
                        caption="Link file"
                        editCellRender={(cellInfo) => (
                          <MyFileFileUploader cellInfo={cellInfo} />
                        )}
                      >
                        <Lookup
                          allowClearing={true}
                          searchEnabled={true}
                          dataSource={dataSourceFileOptions}
                          remoteOperations={true}
                          allowColumnResizing={true}
                          valueExpr="ID"
                          displayExpr="Ten"
                        />
                      </Column>
                    </DataGrid>
                  </Tab>
                  <Tab title="Danh sách bình luận">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      onRowInserted={(e) => {
                        e.component.refresh();
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                      onInitNewRow={(e) => {
                        e.data.TinTucID = rowDataRef.current.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <DataGridPopup
                          title="Thông tin bình luận"
                          showTitle={true}
                        />
                        <Form>
                          <Item dataField="Comment" colSpan={2} />
                        </Form>
                      </Editing>

                      <Column
                        dataField="Comment"
                        dataType="string"
                        caption="Bình luận"
                      />
                      <Column
                        dataField="NgayTao"
                        dataType="date"
                        caption="Ngày tạo"
                      />
                      <Column
                        dataField="NguoiTao"
                        dataType="string"
                        caption="Người tạo"
                      />
                    </DataGrid>
                  </Tab>
                  <Tab title="Lịch sử chỉnh sửa">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />

                      <Column
                        dataField="ID"
                        dataType="string"
                        caption="ID"
                        defaultSortOrder={"desc"}
                      />
                      <Column
                        dataField="UpdatedAt"
                        dataType="date"
                        caption="Ngày cập nhật"
                      />
                      <Column
                        dataField="UserId"
                        dataType="string"
                        caption="Người cập nhật"
                      />
                      <Column type="buttons">
                        <DataGridButton
                          text="Xem khác biệt"
                          onClick={(e) => {
                            window
                              .open(`/DiffPage?ID=${e.row.data.ID}`, "_blank")
                              .focus();
                          }}
                        />
                      </Column>
                    </DataGrid>
                  </Tab>
                  <Tab title="Lịch sử xử lý">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Get?filter=[['TinTucID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel visible={true} />

                      <Column
                        dataField="ID"
                        dataType="string"
                        caption="ID"
                        defaultSortOrder={"desc"}
                      />
                      <Column
                        dataField="BuocQuyTrinhID"
                        dataType="string"
                        caption="Bước thực hiện"
                      >
                        <Lookup
                          allowClearing={true}
                          searchEnabled={true}
                          dataSource={dataSourceBuocQuyTrinhsOptions}
                          allowColumnResizing={true}
                          valueExpr="ID"
                          displayExpr="TenBuocQuyTrinh"
                        />
                      </Column>
                      <Column
                        dataField="NguoiXuLyID"
                        dataType="string"
                        caption="Người xử lý thực hiện"
                      >
                        <Lookup
                          allowClearing={true}
                          searchEnabled={true}
                          dataSource={dataSourceUsersOptions}
                          allowColumnResizing={true}
                          valueExpr="UserID"
                          displayExpr="TenTruyCap"
                        />
                      </Column>
                      <Column dataField="BinhLuan" caption="Ghi chú xử lý" />
                      <Column
                        dataField="NgayTao"
                        dataType="date"
                        format={"dd/MM/yyyy"}
                        caption="Ngày xử lý"
                      />
                    </DataGrid>
                  </Tab>
                </TabbedItem>
              </Form>
            </Editing>

            <Column dataField="ID" dataType="string" caption="ID" width={60} />
            <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" minWidth={260} />
            <Column dataField="NgonNgu" dataType="string" caption="Ngôn ngữ" width={120}>
              <Lookup dataSource={[{ id: 'vi', name: 'Tiếng Việt' }, { id: 'en', name: 'English' }]} valueExpr="id" displayExpr="name" />
            </Column>
            <Column
              dataField="IDChuyenMuc"
              dataType="string"
              caption="Chuyên mục"
              editCellRender={treeviewChuyenMucEditCellRender}
              width={120}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceChuyenMucOptions}
                allowColumnResizing={true}
                valueExpr="ID"
                displayExpr="TenChuyenMuc"
              />
            </Column>
            <Column
              dataField="ChuyenMucHienThiThem"
              allowSearch={false}
              dataType="string"
              caption="Chuyên mục hiển thị thêm"
              visible={false}
              editCellRender={treeviewChuyenMucThemEditCellRender}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceChuyenMucOptions}
                valueExpr="ID"
                displayExpr="TenChuyenMuc"
              />
            </Column>            
            <Column
              dataField="TacGia"
              dataType="string"
              caption="Tác giả"
              visible={false}
            />
            <Column
              dataField="NoiDung"
              dataType="string"
              caption="Nội dung"
              visible={false}
              allowSearch={false}
              editCellRender={(cellInfo) => {
                return (
                  <CKEditorWrapper
                    value={cellInfo.value}
                    instanceName={`editor_${cellInfo.key || cellInfo.rowIndex}`}
                    onValueChanged={(newValue) => {
                        cellInfo.setValue(newValue);
                    }}
                  />
                );}}
            />
            <Column
              dataField="MoTa"
              dataType="string"
              caption="Mô tả"
              visible={false}
            >
              <FormItem
                colSpan={2}
                editorType="dxHtmlEditor"
                editorOptions={{...config.htmlEditorMediumOptions, height: 150, elementAttr:{class: 'cke_ignored'}}}
              />
            </Column>
            <Column
              dataField="NgayTao"
              dataType="date"
              format={"dd/MM/yyyy"}
              caption="Ngày tạo"
              visible={false}
            />
            <Column
              dataField="TrangThai"
              dataType="string"
              caption="Trạng thái"
              width={110}
              cellRender={statusCellRender}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: "cancelpublic", Name: "Hủy xuất bản" },
                  { Val: "public", Name: "Xuất bản" },
                  { Val: "waitapprove", Name: "Chờ duyệt" },
                  { Val: "rejectapprove", Name: "Trả về" },
                  { Val: "draft", Name: "Lưu nháp" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="TenBuocHienTai"
              dataType="string"
              caption="Bước hiện tại / Người xử lý"
              width={190}
              allowSearch={false}
              allowHeaderFiltering={false}
              allowEditing={false}
              cellRender={stepCellRender}
            />
            <Column
              dataField="TuKhoa"
              dataType="string"
              caption="Từ khóa"
              visible={false}
            />
            <Column
              dataField="ChoPhepGuiPhanHoi"
              dataType="string"
              caption="Cho phép gửi phản hồi"
              visible={false}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: 0, Name: "Không" },
                  { Val: 1, Name: "Có" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="NoiBat"
              dataType="string"
              caption="Nổi bật chuyên mục?"
              visible={false}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: 0, Name: "Không" },
                  { Val: 1, Name: "Có" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="NgayXuatBan"
              dataType="datetime"
              format={"dd/MM/yyyy HH:mm"}
              caption="Ngày xuất bản"
              defaultSortOrder={"desc"}
              width={125}
            />
            <Column
              dataField="NguoiTao"
              dataType="string"
              caption="Người tạo"
              visible={false}
            />
            <Column
              dataField="PageCount"
              dataType="string"
              caption="Lượt xem"
              width={70}
            />
            <Column
              dataField="ThoiGianUuTien"
              dataType="string"
              caption="ThoiGianUuTien"
              visible={false}
            />
            <Column
              dataField="AnhDaiDien"
              dataType="string"
              caption="Ảnh đại diện"
              visible={false}
              cellRender={config.defaultImageCellRender}
              editCellRender={(cellInfo) => (
                <MyImageFileUploader cellInfo={cellInfo} />
              )}
            />
            <Column
              dataField="LoaiTin"
              dataType="string"
              caption="Loại tin"
              visible={false}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceLoaiTinOptions}
                valueExpr="ID"
                displayExpr="TenLoaiTin"
              />
            </Column>
            <Column
              dataField="Infographich"
              dataType="string"
              caption="Infographic"
              visible={false}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: 0, Name: "Không" },
                  { Val: 1, Name: "Có" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="Type"
              dataType="string"
              caption="Loại trình bày"
              width={80}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: 4, Name: "Infographic" },
                  { Val: 3, Name: "EMagazine" },
                  { Val: 2, Name: "Video" },
                  { Val: 1, Name: "Audio" },
                  { Val: 0, Name: "Tin tức" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="PreFix"
              dataType="string"
              caption="PreFix"
              visible={false}
            />
            {/* Thao tac quy trinh (gui duyet, duyet, xuat ban, go xuat ban, noi bat, lich su...) gom vao menu "Thao tac",
                chi hien cac muc hop le voi tung tin (cung dieu kien CanSendApprove/CanApprove/CanSendNext/CanPublish/CanUnPublish nhu truoc). */}
            <Column
              caption="Thao tác"
              width={125}
              allowFiltering={false}
              allowSorting={false}
              allowSearch={false}
              allowHeaderFiltering={false}
              allowReordering={false}
              cellRender={rowActionsCellRender}
            />
            <Column type="buttons" width={130}>
              {/* Duyet ngay tren dong (khong phai mo menu "Thao tac"): cung hanh dong "approve" voi muc
                  "Duyet va xuat ban" / "Duyet, chuyen buoc tiep" trong menu. */}
              <DataGridButton
                hint={"Duyệt"}
                cssClass={"fas fa-check-circle text-success"}
                visible={(e) => Number(e.row.data.CanApprove) === 1 || Number(e.row.data.CanSendNext) === 1}
                onClick={(e) => {
                  const d = e.row.data;
                  setAction({ type: "approve", data: d.ID, title: d.TieuDe });
                }}
              />
              <DataGridButton
                hint={"Sửa tin"}
                name="edit"
                visible={(e) => {
                  return e.row.data.CanEdit == 1 || e.row.data.CanSendNext == 1;
                }}
              />
              <DataGridButton
                hint={"Xem trước (kể cả tin nháp)"}
                cssClass={"fas fa-eye"}
                onClick={(e) => {
                  setAction({
                    type: "preview",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Xóa tin"}
                name="delete"
                visible={(e) => {
                  return e.row.data.CanEdit == 1;
                }}
              />
            </Column>
            <Pager
              allowedPageSizes={[20, 50, 100]}
              showPageSizeSelector={true}
            />
            <Paging defaultPageSize={20} />
          </DataGrid>
        </div>
        <div className="card-footer"></div>
      </div>
    </>
  );
}
