import { useEffect, useState, type FormEvent } from 'react';
import { Container, Modal } from 'react-bootstrap';
import './HoiQuyPage.scss';
import axiosInstance from '@/services';

type Organization = { ID: number; Name: string; Type: string; Chair: string; Address: string; Phone: string; Email: string; Website: string; Purpose: string; HasLogo: boolean };
type Results = { Rows: Organization[]; Total: number; Page: number; PageSize: number };
type Challenge = { Token: string; Image: string };
const api = () => `${(axiosInstance.defaults.baseURL || '').replace(/Public\/?$/i, '').replace(/\/$/, '')}/HoiQuy`;
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${api()}/${path}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.Message || 'Không thể kết nối máy chủ. Vui lòng thử lại.');
  return data;
}
export function HoiQuyPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [captcha, setCaptcha] = useState<Challenge | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string; code: string; token: string } | null>(null);
  const [detail, setDetail] = useState<Organization | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function refresh() {
    setCaptcha(null); setCode(''); setSubmitted(null); setResults(null);
    try { setCaptcha(await get<Challenge>('Captcha')); } catch (e) { setError((e as Error).message); }
  }
  useEffect(() => { void refresh(); }, []);
  async function search(event?: FormEvent, page = 1) {
    event?.preventDefault();
    if (!name.trim()) { setResults(null); setError('Vui lòng nhập tên tổ chức để tra cứu.'); return; }
    if (!captcha || !code.trim()) { setResults(null); setError('Vui lòng nhập mã xác nhận.'); return; }
    const query = page === 1 ? { name: name.trim(), code: code.trim(), token: captcha.Token } : submitted;
    if (!query) return;
    setBusy(true); setError('');
    try {
      const params = new URLSearchParams({ ...query, page: String(page) });
      setResults(await get<Results>(`Search?${params}`)); setSubmitted(query);
    } catch (e) { setResults(null); setError((e as Error).message); }
    finally { setBusy(false); }
  }
  return <Container className="hq-page py-4">
    <section className="hq-search" aria-labelledby="hq-title">
      <h1 id="hq-title"><span aria-hidden="true">⌕</span> Tra cứu Hội và Quỹ Trung ương</h1>
      <form onSubmit={search} className="hq-form">
        <label className="hq-name"><span className="visually-hidden">Tên tổ chức</span><input className="form-control" value={name} maxLength={200} placeholder="Tên tổ chức" onChange={e => { setName(e.target.value); setResults(null); }} /></label>
        <label><span className="visually-hidden">Mã xác nhận</span><input className="form-control" value={code} placeholder="Mã xác nhận" autoComplete="off" maxLength={5} onChange={e => setCode(e.target.value)} /></label>
        <div className="hq-captcha">{captcha && <img src={captcha.Image} alt="Mã xác nhận gồm 5 ký tự" />}<button type="button" onClick={() => { setError(''); void refresh(); }} disabled={busy} aria-label="Đổi mã xác nhận">↻</button></div>
        <button className="btn hq-submit" type="submit" disabled={busy || !captcha}>{busy ? 'Đang tìm…' : '⌕ Tra cứu'}</button>
      </form>
      {error && <p className="hq-error" role="alert">{error}</p>}
    </section>
    {results && submitted && name.trim() === submitted.name && <section className="hq-results" aria-live="polite" aria-label="Kết quả tra cứu">
      <div className="hq-result-heading"><h2>Kết quả tra cứu</h2><span>Tìm thấy <strong>{results.Total}</strong> tổ chức</span></div>
      {results.Total === 0 ? <p className="hq-empty">Không tìm thấy tổ chức phù hợp với tên đã nhập.</p> : <>
        <div className="table-responsive"><table className="table hq-table"><thead><tr><th>STT</th><th>Tên tổ chức</th><th>Loại</th><th>Chủ tịch</th><th>Thông tin</th></tr></thead><tbody>
          {results.Rows.map((row, index) => <tr key={row.ID}><td>{(results.Page - 1) * results.PageSize + index + 1}</td><td className="hq-org-name">{row.Name}</td><td><span className={`hq-type ${row.Type === 'Quỹ' ? 'fund' : ''}`}>{row.Type}</span></td><td>{row.Chair || '—'}</td><td><button className="hq-detail-button" onClick={() => setDetail(row)}>Chi tiết</button></td></tr>)}
        </tbody></table></div>
        <nav aria-label="Phân trang kết quả" className="hq-pagination"><button disabled={busy || results.Page <= 1} onClick={() => void search(undefined, results.Page - 1)}>‹ Trước</button><span>Trang {results.Page} / {Math.ceil(results.Total / results.PageSize)}</span><button disabled={busy || results.Page * results.PageSize >= results.Total} onClick={() => void search(undefined, results.Page + 1)}>Sau ›</button></nav>
      </>}
    </section>}
    <Modal show={!!detail} onHide={() => setDetail(null)} size="lg" centered><Modal.Header closeButton><Modal.Title>Thông tin Hội và Quỹ</Modal.Title></Modal.Header><Modal.Body>{detail && <div className="hq-detail">
      {detail.HasLogo && <img className="hq-logo" src={`${api()}/Logo/${detail.ID}`} alt={`Logo ${detail.Name}`} />}
      <h2>{detail.Name}</h2><span className="hq-type">{detail.Type}</span>
      <dl>{([['Chủ tịch', detail.Chair], ['Địa chỉ', detail.Address], ['Số điện thoại', detail.Phone], ['Email', detail.Email], ['Website', detail.Website], ['Tôn chỉ mục đích', detail.Purpose]] as const).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Chưa có thông tin'}</dd></div>)}</dl>
    </div>}</Modal.Body><Modal.Footer><button className="btn btn-secondary" onClick={() => setDetail(null)}>Đóng</button></Modal.Footer></Modal>
  </Container>;
}
