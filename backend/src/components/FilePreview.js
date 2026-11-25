import { useMemo } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

// Plyr mac dinh tai icon/video rong tu cdn.plyr.io (CSP chan): dung ban tu host trong public/.
const plyrOptions = { iconUrl: `${process.env.PUBLIC_URL}/plyr.svg`, blankVideo: `${process.env.PUBLIC_URL}/plyr-blank.mp4` };

const IMAGE = ["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "ico"];
const VIDEO = { mp4: "video/mp4", webm: "video/webm", mov: "video/mp4" };
const AUDIO = { mp3: "audio/mpeg", wav: "audio/wav", aac: "audio/aac", m4a: "audio/mp4", ogg: "audio/ogg", flac: "audio/flac" };

export function fileKind(name) {
  const ext = String(name || "").split(".").pop().toLowerCase();
  if (IMAGE.includes(ext)) return "image";
  if (VIDEO[ext]) return "video";
  if (AUDIO[ext]) return "audio";
  if (ext === "pdf") return "pdf";
  return "other";
}

// Xem truoc mot file trong thu vien theo loai. ready=false: chua tao Plyr (plyr-react can popup da gan vao DOM).
export default function FilePreview({ name, url, size, ready = true }) {
  const kind = fileKind(name);
  const ext = String(name || "").split(".").pop().toLowerCase();
  const videoSource = useMemo(
    () => ({ type: "video", sources: [{ src: url, type: VIDEO[ext] || "video/mp4" }] }),
    [url, ext],
  );

  if (!url) return null;
  if (kind === "image") return <img src={url} alt={name} className="img-fluid" />;
  // Plyr boc <video> vao phan tu rieng: phai nam trong mot div de React go ca khoi khi dong popup (tranh loi removeChild).
  if (kind === "video") return ready ? <div><Plyr options={plyrOptions} source={videoSource} /></div> : null;
  if (kind === "audio") return <audio controls preload="none" src={url} style={{ width: "100%" }} />;
  if (kind === "pdf") {
    return (
      <div>
        <iframe title={name} src={url} style={{ width: "100%", height: "65vh", border: 0 }} />
        <a href={url} target="_blank" rel="noopener noreferrer">Mở PDF trong tab mới</a>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-2">
        Không xem trước được loại file này{size ? ` (${(size / 1024 / 1024).toFixed(2)} MB)` : ""}.
      </p>
      <a className="btn btn-outline-primary btn-sm" href={url} target="_blank" rel="noopener noreferrer" download={name}>
        Tải về / mở trong tab mới
      </a>
    </div>
  );
}
