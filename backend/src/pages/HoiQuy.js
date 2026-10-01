import { useState } from 'react';
import './HoiQuy.css';
async function request(path, options = {}) {
  const response = await fetch(`${window.env.REACT_APP_API_URL}/HoiQuy/${path}`, {
    ...options, headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`, ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(response.status === 403 ? 'Tài khoản chưa có quyền quản lý Hội và Quỹ.' : response.status === 401 ? 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' : data.Message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
  return data;
}
const duplicateIssue = 'Trùng tên và loại trong file';
export default function HoiQuy() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [includeLogos, setIncludeLogos] = useState(true);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [skipInvalid, setSkipInvalid] = useState(true);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const rows = preview?.Rows || [];
  const invalid = rows.filter(r => r.Issues.some(i => i !== duplicateIssue));
  const duplicates = rows.filter(r => r.Issues.includes(duplicateIssue));
  const eligible = rows.filter(r => r.Issues.length === 0);
  const filtered = rows.filter(r => filter === 'all' || (filter === 'issues' && r.Issues.length > 0) || (filter === 'duplicates' && r.Issues.includes(duplicateIssue)));
  const pageRows = filtered.slice((page - 1) * 10, page * 10);
  async function readFile() {
    if (!file) { setError('Vui lòng chọn file Excel.'); return; }
    if (!file.name.toLowerCase().endsWith('.xlsx') || file.size > 80 * 1024 * 1024) { setError('Chọn file .xlsx tối đa 80 MB.'); return; }
    setBusy(true); setError(''); setPreview(null); setResult(null);
    try {
      setProgress('Đang khởi tạo upload…');
      const upload = await request('UploadStart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ FileName: file.name, Bytes: file.size, IncludeLogos: includeLogos }) });
      for (let offset = 0, index = 0; offset < file.size; offset += upload.ChunkBytes, index++) {
        const body = file.slice(offset, Math.min(offset + upload.ChunkBytes, file.size));
        for (let attempt = 0; ; attempt++) {
          try { await request(`UploadChunk?token=${encodeURIComponent(upload.Token)}&index=${index}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body }); break; }
          catch (e) { if (attempt >= 2) throw e; }
        }
        setProgress(`Đã tải ${Math.round(Math.min(offset + upload.ChunkBytes, file.size) / file.size * 100)}%`);
      }
      setProgress('Đang đọc dữ liệu và logo…');
      setPreview(await request(`UploadComplete?token=${encodeURIComponent(upload.Token)}`, { method: 'POST' })); setPage(1); setFilter('all');
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  async function commit() {
    setBusy(true); setError('');
    try {
      setResult(await request('Commit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Token: preview.Token, IncludeLogos: includeLogos, UpdateExisting: updateExisting, SkipInvalid: skipInvalid, SkipDuplicates: skipDuplicates }) }));
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <div className="hq-admin">
    <div className="card"><div className="card-header"><h3 className="card-title">Hội và Quỹ Trung ương — Import Excel</h3></div><div className="card-body">
      <div className="hqa-steps"><span className="active">1. Chọn file</span><span className={preview ? 'active' : ''}>2. Xem trước</span><span className={result ? 'active' : ''}>3. Kết quả import</span></div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {result ? <div className="alert alert-success" role="status"><h4>Import hoàn tất</h4><p>Thêm mới: <strong>{result.Added}</strong> · Cập nhật: <strong>{result.Updated}</strong> · Đã tồn tại: <strong>{result.Existing}</strong> · Bỏ qua lỗi/trùng: <strong>{result.Skipped}</strong></p><a href={`${window.env.REACT_APP_FRONTEND_URL || 'http://localhost:5173'}/tra-cuu-hoi-quy`} target="_blank" rel="noreferrer">Mở trang tra cứu</a><button className="btn btn-outline-success ml-3" onClick={() => { setResult(null); setPreview(null); }}>Import file khác</button></div> : <>
        <label htmlFor="hqa-file">File dữ liệu (.xlsx, tối đa 80 MB)</label><input id="hqa-file" className="form-control-file mb-3" type="file" accept=".xlsx" disabled={busy} onChange={e => { setFile(e.target.files[0] || null); setPreview(null); setError(''); }} />
        <p className="text-muted">Sheet <strong>HoiQuyTrungUong</strong> · Tiêu đề dòng 3 · Dữ liệu từ dòng 4. Các cột: STT, Logo, Tên đơn vị, Loại, Chủ tịch, Địa chỉ, Số điện thoại, Email, Website, Tôn chỉ mục đích.</p>
        <div className="hqa-options"><label><input type="checkbox" checked={includeLogos} disabled={busy || !!preview} onChange={e => setIncludeLogos(e.target.checked)} /> Nhập logo nhúng trong Excel</label><label>Chế độ import <select className="form-control" value={String(updateExisting)} disabled={busy} onChange={e => setUpdateExisting(e.target.value === 'true')}><option value="false">Chỉ thêm mới (bỏ qua bản ghi đã có)</option><option value="true">Thêm mới và cập nhật theo tên + loại</option></select></label></div>
        <button className="btn btn-primary" disabled={busy || !file} onClick={readFile}>{busy ? progress || 'Đang xử lý…' : 'Đọc file và xem trước'}</button>
      </>}
    </div></div>
    {preview && !result && <div className="card"><div className="card-header"><h3 className="card-title">Xem trước: {preview.FileName}</h3></div><div className="card-body">
      <div className="hqa-stats">{[[rows.length, 'Tổng số dòng'], [rows.filter(r => r.Type === 'Hội').length, 'Hội'], [rows.filter(r => r.Type === 'Quỹ').length, 'Quỹ'], [rows.filter(r => r.HasLogo).length, 'Logo'], [invalid.length, 'Dòng lỗi'], [duplicates.length, 'Dòng trùng']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      {(invalid.length > 0 || duplicates.length > 0) && <div className="alert alert-warning">Có {invalid.length} dòng cần sửa và {duplicates.length} dòng trùng tên + loại. Mặc định bỏ qua toàn bộ các dòng này; vui lòng sửa file nguồn nếu muốn nhập chúng.</div>}
      <div className="hqa-options"><label><input type="checkbox" checked={skipInvalid} disabled={busy} onChange={e => setSkipInvalid(e.target.checked)} /> Bỏ qua dòng lỗi/thiếu tên</label><label><input type="checkbox" checked={skipDuplicates} disabled={busy} onChange={e => setSkipDuplicates(e.target.checked)} /> Bỏ qua các dòng trùng trong file</label></div>
      <div className="hqa-filter"><label htmlFor="hqa-filter">Hiển thị</label><select id="hqa-filter" className="form-control" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}><option value="all">Tất cả dòng trong file</option><option value="issues">Dòng có vấn đề</option><option value="duplicates">Dòng trùng tên + loại</option></select></div>
      <div className="table-responsive"><table className="table table-bordered table-striped"><thead><tr><th>Dòng Excel</th><th>Tên đơn vị</th><th>Loại</th><th>Chủ tịch</th><th>Logo</th><th>Kiểm tra</th></tr></thead><tbody>{pageRows.map(row => <tr key={row.SourceRow}><td>{row.SourceRow}</td><td>{row.Name || <em className="text-danger">Thiếu tên</em>}</td><td>{row.Type}</td><td>{row.Chair || '—'}</td><td>{row.HasLogo ? 'Có' : '—'}</td><td className={row.Issues.length ? 'text-danger' : 'text-success'}>{row.Issues.join('; ') || 'Hợp lệ'}</td></tr>)}</tbody></table></div>
      <div className="hqa-actions"><div><button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trước</button><span className="mx-3">Trang {page} / {Math.max(1, Math.ceil(filtered.length / 10))}</span><button className="btn btn-outline-secondary" disabled={page * 10 >= filtered.length} onClick={() => setPage(page + 1)}>Sau</button></div><button className="btn btn-danger" disabled={busy || eligible.length === 0 || (!skipInvalid && invalid.length > 0) || (!skipDuplicates && duplicates.length > 0)} onClick={commit}>{busy ? 'Đang import…' : `Import ${eligible.length} dòng hợp lệ`}</button></div>
      <p className="text-muted mt-3 mb-0">Phiên xem trước có hiệu lực 30 phút. Dữ liệu chỉ được lưu khi bấm Import; các bản ghi cập nhật giữ logo cũ nếu file không cung cấp logo mới.</p>
    </div></div>}
  </div>;
}
