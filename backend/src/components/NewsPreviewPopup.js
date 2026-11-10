import { useEffect, useState } from 'react';
import { Popup } from 'devextreme-react';
import { request } from '../utils/api';

const escapeHtml = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Duong dan anh/tep upload tu CMS dang "Media_Share/..." -> tro ve may chu upload.
const resolveMedia = (html) => (html || '').replace(
  /(src|href)=(["'])\/?(Media_Share\/[^"']*)\2/gi,
  (m, attr, q, path) => `${attr}=${q}${window.env.REACT_APP_UPLOAD_URL}/${path}${q}`,
);

const buildDocument = (post) => `<!doctype html><html><head><meta charset="utf-8">
<style>body{font-family:Arial,sans-serif;max-width:900px;margin:24px auto;padding:0 16px;line-height:1.6;color:#111}
h1{font-size:28px;line-height:1.3}.meta{color:#666;font-size:13px;margin-bottom:16px}
.sapo{font-weight:bold;margin-bottom:20px}img,video,iframe{max-width:100%;height:auto}</style></head><body>
<h1>${escapeHtml(post.TieuDe)}</h1>
<div class="meta">Trạng thái: ${escapeHtml(post.TrangThai)} · Người tạo: ${escapeHtml(post.TenNguoiTao)}</div>
<div class="sapo">${resolveMedia(post.MoTa)}</div>
<div>${resolveMedia(post.NoiDung)}</div></body></html>`;

// Hien noi dung trong iframe sandbox (khong script, khac origin) de noi dung tin nhap
// cua nguoi khac khong the chay ma trong trang quan tri.
export default function NewsPreviewPopup({ ID, onHidden }) {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setPost(null); setError('');
    request(`TinTucs/Preview?ID=${encodeURIComponent(ID)}`).then((data) => {
      if (!active) return;
      if (data) setPost(data); else setError('Không tải được nội dung hoặc bạn không có quyền xem.');
    });
    return () => { active = false; };
  }, [ID]);

  return (
    <Popup
      visible={true}
      showTitle={true}
      title="Xem trước tin bài (nội bộ)"
      fullScreen={true}
      showCloseButton={true}
      hideOnOutsideClick={true}
      onHidden={onHidden}
      contentRender={() => error
        ? <div className="alert alert-warning">{error}</div>
        : post
          ? <iframe title="Xem trước" sandbox="" srcDoc={buildDocument(post)} style={{ width: '100%', height: '100%', border: 0 }} />
          : <div>Đang tải...</div>}
    />
  );
}
