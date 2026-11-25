// Popup chi xem (khong sua) noi dung mot gop y du thao van ban.
// Dung: const ref = useRef(); <GopYChiTietPopup ref={ref} />; ref.current.open(rowData, tenDuThao)
// State nam trong component nay de mo/dong popup khong lam trang cha render lai (tranh anh huong form sua dang mo).
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import safeParse from '../utils/safe-html';

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const date = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return d.getHours() || d.getMinutes() ? `${date} ${pad(d.getHours())}:${pad(d.getMinutes())}` : date;
}

const labelStyle = { width: 160, fontWeight: 600, verticalAlign: 'top', padding: '4px 8px 4px 0' };
const valueStyle = { padding: '4px 0', wordBreak: 'break-word' };

const GopYChiTietPopup = forwardRef(function GopYChiTietPopup(props, ref) {
  const [state, setState] = useState({ visible: false, data: null, tenDuThao: '' });

  useImperativeHandle(ref, () => ({
    open(data, tenDuThao) {
      setState({ visible: true, data: data || {}, tenDuThao: tenDuThao || '' });
    },
  }));

  const close = () => setState((s) => ({ ...s, visible: false }));
  const data = state.data || {};
  const rows = [
    ['Dự thảo văn bản', state.tenDuThao],
    ['Ngày gửi', formatDateTime(data.NgayGui)],
    ['Họ tên', data.HoTen],
    ['Số điện thoại', data.SoDienThoai],
    ['Email', data.Email],
    ['Địa chỉ', data.DiaChi],
  ];

  return (
    <Popup
      visible={state.visible}
      onHiding={close}
      title="Chi tiết góp ý"
      showTitle={true}
      showCloseButton={true}
      hideOnOutsideClick={true}
      width="min(900px, 95vw)"
      height="auto"
      maxHeight="90vh"
      toolbarItems={[
        {
          widget: 'dxButton',
          toolbar: 'bottom',
          location: 'after',
          options: { text: 'Đóng', onClick: close },
        },
      ]}
    >
      {/* Luon co phan tu con: devextreme-react chi tao noi dung khi Popup co children ngay lan render dau. */}
      <div>
      {state.visible && (
        <div style={{ overflowY: 'auto', maxHeight: '70vh' }}>
          <table style={{ width: '100%', marginBottom: 12 }}>
            <tbody>
              {rows
                .filter((r) => r[1])
                .map((r) => (
                  <tr key={r[0]}>
                    <td style={labelStyle}>{r[0]}</td>
                    <td style={valueStyle}>{r[1]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Nội dung góp ý</div>
          <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12, background: '#fafafa' }}>
            {data.NoiDung ? safeParse(data.NoiDung) : <em>(Không có nội dung)</em>}
          </div>
        </div>
      )}
      </div>
    </Popup>
  );
});

export default GopYChiTietPopup;
