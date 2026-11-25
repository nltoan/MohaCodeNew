// Cau hinh va xu ly loi dung chung cho cac FileUploader (DevExtreme) cua trang quan tri.
// - Gioi han dinh dang khop voi API (FileManagerController.SafeUploadExtensions va danh sach cua FileUpload).
// - Upload theo phan qua FileManager/FileUpload (moi phan ~2 MB): API chi chan file > ~1,17 GB (CheckMaxSize),
//   nen video/am thanh/van ban cho phep 1024 MB; anh gioi han 80 MB (anh duoc toi uu lai tren may chu).
// - Thu vien file (FileManager/FileSystem UploadChunk) tu choi file > 80 MB.
// - Upload nguyen file (ImageUpload/FileImageUpload/VideoUpload) bi IIS chan o khoang 30.000.000 byte
//   (Web.config khong dat requestLimits cho cac duong dan nay), nen chi cho phep 25 MB.
import { useEffect } from "react";
import { notify, handleUnauthorized } from "./api";
import { getToken } from "./token";

export const MB = 1024 * 1024;
export const CHUNKED_MAX_MB = 80; // anh + thu vien file (FileSystem)
export const FILE_UPLOAD_MAX_MB = 1024; // FileManager/FileUpload theo phan, loai khong phai anh
export const DIRECT_MAX_MB = 25;
export const CHUNK_SIZE = 2048000;

function kindDef(ext, label, mime, maxMB = FILE_UPLOAD_MAX_MB) {
  return {
    ext,
    label,
    maxMB,
    accept: [...(mime || []), ...ext].join(","),
    extText: ext.map((x) => x.slice(1).toUpperCase()).join(", "),
  };
}

export function formatMB(mb) {
  return mb >= 1024 && mb % 1024 === 0 ? `${mb / 1024} GB` : `${mb} MB`;
}

export const UPLOAD_KINDS = {
  image: kindDef([".jpg", ".jpeg", ".png", ".gif", ".webp"], "Ảnh JPG, PNG, GIF, WEBP", ["image/jpeg", "image/png", "image/gif", "image/webp"], CHUNKED_MAX_MB),
  video: kindDef([".mp4", ".webm"], "Video MP4, WEBM", ["video/mp4", "video/webm"]),
  // API khong nhan .m4a/.ogg.
  audio: kindDef([".mp3", ".wav", ".aac", ".flac"], "Âm thanh MP3, WAV, AAC, FLAC", ["audio/mpeg", "audio/wav", "audio/aac", "audio/flac"]),
  // Giao cua SafeUploadExtensions va danh sach trong FileManager/FileUpload (.bmp/.ico bi FileUpload tu choi).
  any: kindDef(
    [
      ".pdf", ".doc", ".docx", ".rtf", ".txt", ".xls", ".xlsx", ".csv", ".ppt", ".pptx",
      ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".tif", ".tiff",
      ".mp4", ".webm", ".mov", ".avi", ".mkv", ".mpeg", ".mp3", ".wav", ".aac", ".flac",
      ".zip", ".rar", ".7z", ".tar", ".gz",
    ],
    "Văn bản (PDF, Word, Excel, PowerPoint, TXT), ảnh, video, âm thanh, file nén (ZIP, RAR, 7Z)",
  ),
};

export function getUploadKind(kind) {
  return UPLOAD_KINDS[kind] || UPLOAD_KINDS.any;
}

export function uploadAuthHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// chunked = true: FileManager/FileUpload theo phan; false: ImageUpload/... nhan nguyen file.
export function uploadMaxMB(kind, { chunked = true } = {}) {
  return chunked ? getUploadKind(kind).maxMB : DIRECT_MAX_MB;
}

// Dong goi y hien duoi o tai len, vd "Ảnh JPG, PNG, GIF, WEBP, tối đa 80 MB".
export function uploadHint(kind, opts) {
  return `${getUploadKind(kind).label}, tối đa ${formatMB(uploadMaxMB(kind, opts))}.`;
}

// Cac thuoc tinh gioi han/thong bao dua vao <FileUploader {...uploadLimitProps("image")} />.
export function uploadLimitProps(kind, { chunked = true } = {}) {
  const k = getUploadKind(kind);
  const maxMB = uploadMaxMB(kind, { chunked });
  const props = {
    allowedFileExtensions: k.ext,
    accept: k.accept,
    maxFileSize: maxMB * MB,
    invalidMaxFileSizeMessage: `File vượt quá ${formatMB(maxMB)}`,
    invalidFileExtensionMessage: `Định dạng không được phép (chỉ nhận ${k.extText})`,
    uploadFailedMessage: "Tải lên thất bại",
    uploadHeaders: uploadAuthHeaders(),
  };
  if (chunked) props.chunkSize = CHUNK_SIZE;
  return props;
}

const KNOWN_MESSAGES = [
  [/invalid upload file/i, "File không hợp lệ: định dạng không được phép, tên file dài quá 200 ký tự hoặc chứa ký tự đặc biệt (/ \\ : * ? \" < > |), hoặc file rỗng/quá lớn."],
  [/invalid upload metadata|invalid upload arguments/i, "Không tải lên được: định dạng hoặc tên file không được phép."],
  [/extension is invalid|invalid file extension/i, "Định dạng file không được phép."],
  [/invalid file name/i, "Tên file không hợp lệ."],
  [/too large|maximum request length|request entity/i, "File vượt quá dung lượng máy chủ cho phép."],
];

function readServerMessage(request) {
  let text = "";
  try {
    text = (request && (request.responseText || (typeof request.response === "string" ? request.response : ""))) || "";
  } catch {
    text = "";
  }
  if (!text) return "";
  try {
    const d = JSON.parse(text);
    if (!d || typeof d !== "object") return "";
    if (d.Message || d.ExceptionMessage) return String(d.Message || d.ExceptionMessage);
    if (d.message) return String(d.message);
    if (typeof d.error === "string") return d.error;
    if (d.error && d.error.message) return String(d.error.message);
    if (d.errorText) return String(d.errorText);
    return "";
  } catch {
    // Trang loi HTML cua IIS/proxy: khong hien nguyen van.
    return /<\s*(html|!doctype|body)/i.test(text) ? "" : text.trim().slice(0, 200);
  }
}

// Chuyen loi tai len thanh cau tieng Viet de hien cho nguoi dung.
export function uploadErrorMessage(request, { maxMB } = {}) {
  const status = request ? request.status : 0;
  if (status === 401) return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  if (status === 403) return "Bạn không có quyền tải file lên.";
  if (status === 413) return maxMB ? `File vượt quá ${formatMB(maxMB)}` : "File vượt quá dung lượng máy chủ cho phép.";
  const server = readServerMessage(request);
  if (server) {
    for (const [re, vi] of KNOWN_MESSAGES) {
      if (re.test(server)) return vi;
    }
    // Thong diep da la tieng Viet (co dau) thi giu nguyen.
    if (/[\u0080-￿]/.test(server)) return server;
  }
  // IIS tra 404.13 khi vuot maxAllowedContentLength; proxy/WAF co the cat ket noi (status 0, khong CORS).
  if (status === 404) return "Tải lên thất bại: file quá lớn so với giới hạn máy chủ hoặc không tìm thấy địa chỉ tải lên.";
  if (!status) return "Tải lên thất bại: không kết nối được máy chủ hoặc file quá lớn so với giới hạn máy chủ.";
  return `Tải lên thất bại (mã lỗi ${status}).`;
}

// onErrorOccurred cua FileManager (MediaFileManager, FilePicker): dich thong diep tieng Anh cua may chu.
export function onFileManagerError(e) {
  const text = (e && e.errorText) || "";
  for (const [re, vi] of KNOWN_MESSAGES) {
    if (re.test(text)) {
      e.errorText = vi;
      return;
    }
  }
  if (/protected/i.test(text)) e.errorText = "File này được bảo vệ, không thể thao tác.";
}

// Dong goi y cho FileManager (upload tung phan qua FileManager/FileSystem, toi da 80 MB).
export const FILE_MANAGER_UPLOAD_HINT = `Tải lên: tối đa ${CHUNKED_MAX_MB} MB mỗi file; nhận ảnh, video, âm thanh, văn bản (PDF, Word, Excel, PowerPoint, TXT) và file nén. Tên file không quá 200 ký tự, không chứa / \\ : * ? " < > |.`;

// Tao ham onUploadError cho FileUploader: 401 -> ve trang dang nhap; con lai hien ly do bang tieng Viet
// (dong trang thai duoi ten file + thong bao goc phai man hinh).
export function createUploadErrorHandler({ maxMB, onError } = {}) {
  return (e) => {
    // Upload theo phan: e.request la XHR cua phan bi loi; du phong e.error (cung la XHR) neu thieu.
    const request = (e && e.request) || (e && e.error && typeof e.error === "object" && "status" in e.error ? e.error : null);
    if (request && request.status === 401) {
      if (e) e.message = "Phiên đăng nhập đã hết hạn";
      handleUnauthorized();
      if (onError) onError(e, "Phiên đăng nhập đã hết hạn");
      return;
    }
    const msg = uploadErrorMessage(request, { maxMB });
    if (e) e.message = msg;
    const name = e && e.file && e.file.name;
    notify(name ? `${name}: ${msg}` : msg, "error");
    if (onError) onError(e, msg);
  };
}

// Doc JSON tra ve khi tai len thanh cong; loi phan tich -> null.
export function parseUploadResponse(e) {
  try {
    const r = e && e.request;
    const text = r && (r.responseText || r.response);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

// Dem so file dang tai len tren toan trang (de chan bam Luu khi chua tai xong).
let pendingUploads = 0;
export function hasPendingUploads() {
  return pendingUploads > 0;
}
export function changePendingUploads(delta) {
  pendingUploads = Math.max(0, pendingUploads + delta);
}
export const PENDING_UPLOAD_MESSAGE = "Đang tải file lên, vui lòng đợi tải xong rồi mới lưu.";

// Chan su kien "saving" cua DataGrid (bam "Lưu" trong popup sua) khi o tai len con file dang tai.
// grid: cellInfo.component; pendingRef: ref dem so file dang tai cua o.
export function useBlockGridSaving(grid, pendingRef) {
  useEffect(() => {
    if (!grid || typeof grid.on !== "function") return undefined;
    const onSaving = (e) => {
      if (pendingRef.current > 0) {
        e.cancel = true;
        notify(PENDING_UPLOAD_MESSAGE, "warning");
      }
    };
    grid.on("saving", onSaving);
    return () => {
      grid.off("saving", onSaving);
    };
  }, [grid, pendingRef]);
}

// Chuan hoa duong dan file chon tu thu vien (FileManager tra url dang "/Upload/..." hoac URL day du).
export function libraryPath(url) {
  if (!url) return "";
  let p = String(url);
  const bases = [window.env.REACT_APP_API_UPLOAD_URL, window.env.REACT_APP_UPLOAD_URL].filter(Boolean);
  for (const b of bases) {
    const base = String(b).replace(/\/+$/, "");
    if (base && p.toLowerCase().startsWith(base.toLowerCase())) {
      p = p.slice(base.length);
      break;
    }
  }
  if (/^https?:\/\//i.test(p)) {
    try {
      p = new URL(p).pathname;
    } catch {
      /* giu nguyen */
    }
  }
  p = p.startsWith("/") ? p : `/${p}`;
  // API dat trong thu muc ao (vd "/api/Upload/..."): LinkLuuTru luon bat dau bang "/Upload/".
  const i = p.toLowerCase().indexOf("/upload/");
  return i > 0 ? p.slice(i) : p;
}

// URL de hien thi/chen file thu vien: luon tren host media (REACT_APP_UPLOAD_URL).
// FileManager tra URL tuyet doi cua host API, nhung CSP admin production chi cho tai anh
// tu 'self' va host media; HTML luu trong CMS cung phai tro toi host media de portal hien duoc.
export function mediaUrl(url) {
  if (!url) return "";
  const p = libraryPath(url);
  if (!/^\/upload\//i.test(p)) return String(url);
  return String(window.env.REACT_APP_UPLOAD_URL || "").replace(/\/+$/, "") + p;
}
