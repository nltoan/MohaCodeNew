import { useEffect, useRef, useState } from "react";
import FileUploader from 'devextreme-react/file-uploader';
import { Button } from "devextreme-react/button";
import { notify } from "../utils/api";
import {
  MB,
  changePendingUploads,
  createUploadErrorHandler,
  getUploadKind,
  parseUploadResponse,
  uploadHint,
  uploadLimitProps,
  uploadMaxMB,
  useBlockGridSaving,
} from "../utils/upload";

function isAcceptedFile(file, kind) {
  const name = (file && file.name) || "";
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  return getUploadKind(kind).ext.includes(ext) && file.size > 0 && file.size <= uploadMaxMB(kind) * MB;
}

// Tai nhieu file (theo phan) va ghi danh sach ID ban ghi Files vao o (cellInfo.setValue([...])).
// Danh sach ID luon khop voi cac file dang hien thi: bo file nao thi ID cua file do bi bo theo.
// kind: "image" | "video" | "audio" | "any" (mac dinh: moi loai API cho phep).
export default function MyFileFileUploader({ cellInfo, kind = "any" }) {
  const uploaderRef = useRef(null);
  // Gia tri ban dau cua o: null khi them moi (luu mang ID), mot ID khi sua dong co san (Put chi nhan mot ID).
  const initialValueRef = useRef(cellInfo.value);
  const lastSetRef = useRef(JSON.stringify(cellInfo.value === undefined ? null : cellInfo.value));
  const idMapRef = useRef(new Map()); // File -> ID
  const statusRef = useRef(new Map()); // File -> "pending" | "done" | "error"
  const filesRef = useRef([]);
  const pendingRef = useRef(0);
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);

  const setPending = (n) => {
    const delta = n - pendingRef.current;
    if (delta) changePendingUploads(delta);
    pendingRef.current = n;
  };
  const recountPending = () => {
    let n = 0;
    statusRef.current.forEach((s) => {
      if (s === "pending") n += 1;
    });
    setPending(n);
  };

  const syncValue = () => {
    const ids = filesRef.current.map((f) => idMapRef.current.get(f)).filter((id) => id != null);
    const initial = initialValueRef.current;
    let next;
    if (!ids.length) {
      next = initial === undefined ? null : initial; // khong con file moi: tra lai gia tri ban dau
    } else if (Array.isArray(initial)) {
      next = [...initial, ...ids];
    } else if (initial != null && initial !== "") {
      next = ids[ids.length - 1]; // dang sua dong co san: thay bang file moi nhat (API Put chi nhan mot ID)
    } else {
      next = ids; // them moi: API Post nhan mang ID
    }
    // Chi goi setValue khi gia tri that su doi (tranh ve lai form khi chi chon/bo file chua tai).
    const key = JSON.stringify(next);
    if (key === lastSetRef.current) return;
    lastSetRef.current = key;
    cellInfo.setValue(next);
  };

  // Chan bam "Lưu" cua luoi khi con file dang tai.
  useBlockGridSaving(cellInfo.component, pendingRef);

  useEffect(() => () => {
    if (pendingRef.current) changePendingUploads(-pendingRef.current);
    pendingRef.current = 0;
  }, []);

  const onValueChanged = (e) => {
    const files = Array.isArray(e.value) ? e.value : [];
    filesRef.current = files;
    // Bo trang thai/ID cua file da bi go khoi danh sach.
    [...statusRef.current.keys()].forEach((f) => {
      if (!files.includes(f)) statusRef.current.delete(f);
    });
    [...idMapRef.current.keys()].forEach((f) => {
      if (!files.includes(f)) idMapRef.current.delete(f);
    });
    recountPending();
    syncValue();
    rerender();
  };

  const onUploadStarted = (e) => {
    statusRef.current.set(e.file, "pending");
    recountPending();
    rerender();
  };

  const onUploaded = (e) => {
    const res = parseUploadResponse(e);
    const id = res?.files?.[0]?.ID;
    if (id == null) {
      statusRef.current.set(e.file, "error");
      e.message = "Tải lên thất bại";
      notify(`${e.file?.name || "File"}: tải lên thất bại (máy chủ không trả về thông tin file).`, "error");
    } else {
      statusRef.current.set(e.file, "done");
      idMapRef.current.set(e.file, id);
    }
    recountPending();
    syncValue();
    rerender();
  };

  const handleError = createUploadErrorHandler({
    maxMB: uploadMaxMB(kind),
    onError: (e) => {
      if (e && e.file) statusRef.current.set(e.file, "error");
      recountPending();
      rerender();
    },
  });

  const onUploadAborted = (e) => {
    if (e && e.file) statusRef.current.delete(e.file);
    recountPending();
    rerender();
  };

  const removeFile = (file) => {
    const instance = uploaderRef.current && uploaderRef.current.instance;
    if (instance) instance.removeFile(file); // -> onValueChanged -> cap nhat lai danh sach ID
  };

  const files = filesRef.current;
  const valid = files.filter((f) => isAcceptedFile(f, kind));
  let done = 0;
  let failed = 0;
  statusRef.current.forEach((s) => {
    if (s === "done") done += 1;
    if (s === "error") failed += 1;
  });
  const pending = pendingRef.current;
  const finished = done + failed;
  const total = Math.max(valid.length, finished + pending);
  const uploadedFiles = files.filter((f) => idMapRef.current.has(f));

  return (
    <>
      <FileUploader
        ref={uploaderRef}
        multiple={true}
        uploadMode="instantly"
        uploadUrl={window.env.REACT_APP_API_URL + `/FileManager/FileUpload`}
        {...uploadLimitProps(kind)}
        onValueChanged={onValueChanged}
        onUploadStarted={onUploadStarted}
        onUploaded={onUploaded}
        onUploadError={handleError}
        onUploadAborted={onUploadAborted}
      />
      <small className="text-muted d-block">{uploadHint(kind)} Có thể chọn nhiều file cùng lúc.</small>
      {pending > 0 && (
        <div className="text-primary" style={{ fontWeight: 600, marginTop: 4 }}>
          Đang tải {Math.min(finished + 1, total)}/{total} file… Vui lòng đợi tải xong rồi mới bấm "Lưu".
        </div>
      )}
      {pending === 0 && (done > 0 || failed > 0) && (
        <div style={{ marginTop: 4 }}>
          {done > 0 && <span className="text-success">Đã tải lên {done} file. Bấm "Lưu" để thêm vào danh sách. </span>}
          {failed > 0 && <span className="text-danger">{failed} file tải lên thất bại (xem lý do ở từng file).</span>}
        </div>
      )}
      {uploadedFiles.length > 0 && (
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 6, marginBottom: 0 }}>
          {uploadedFiles.map((f, i) => (
            <li key={`${f.name}-${i}`} className="d-flex align-items-center" style={{ gap: 6 }}>
              <Button icon="close" hint="Bỏ file này" stylingMode="text" onClick={() => removeFile(f)} />
              <span>{f.name}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
