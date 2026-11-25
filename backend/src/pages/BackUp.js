import { useRef, useState, useEffect, useCallback } from 'react';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  FilterRow, HeaderFilter, Button, Editing,
} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import { confirm } from 'devextreme/ui/dialog';
import { createCustomStore, requestAction, notify, handleUnauthorized } from '../utils/api';
import { getToken } from '../utils/token';

const dataSourceOptions = createCustomStore("BackUps", "path");

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDateTime(value) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())} ngày ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function formatSize(bytes) {
  if (bytes == null) return "";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let v = Number(bytes);
  let i = 0;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function BackUp() {
  const datagrid = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  // undefined = dang tai, null = chua co ban sao luu nao.
  const [latest, setLatest] = useState(undefined);

  const loadLatest = useCallback(() => {
    dataSourceOptions
      .store()
      .load({ sort: [{ selector: "created", desc: true }], take: 1 })
      .then(
        (result) => {
          const rows = Array.isArray(result) ? result : (result && result.data) || [];
          setLatest(rows.length ? rows[0] : null);
        },
        () => setLatest(undefined),
      );
  }, []);

  useEffect(() => {
    loadLatest();
  }, [loadLatest]);

  async function performBackUp() {
    if (isRunning) return;
    const ok = await confirm(
      "Tạo bản sao lưu cơ sở dữ liệu ngay?<br/>Việc sao lưu có thể mất vài phút; vui lòng không đóng trang trong lúc chờ.",
      "Xác nhận sao lưu",
    );
    if (!ok) return;
    setIsRunning(true);
    try {
      const result = await requestAction(`/BackUps/Post`, { method: "POST" });
      if (!result.ok) {
        notify(result.message || "Sao lưu thất bại!", "error");
        return;
      }
      notify("Đã tạo bản sao lưu thành công!");
      if (datagrid.current) datagrid.current.instance.refresh();
      loadLatest();
    } finally {
      setIsRunning(false);
    }
  }
  async function performDownload(e) {
    const path = e.row.data.path;
    try {
      const response = await fetch(
        `${window.env.REACT_APP_API_URL}/BackUps/Download?path=${encodeURIComponent(path)}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (response.status !== 200) {
        notify("Tải tệp sao lưu thất bại!", "error");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = path;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      notify("Tải tệp sao lưu thất bại!", "error");
    }
  }
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý sao lưu</h3>
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
        <LoadPanel
          visible={isRunning}
          shading={true}
          showIndicator={true}
          showPane={true}
          message="Đang sao lưu cơ sở dữ liệu…"
        />
        <div className="d-flex align-items-center flex-wrap mb-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={performBackUp}
            disabled={isRunning}
          >
            {isRunning ? "Đang sao lưu…" : "Tạo bản sao lưu ngay"}
          </button>
          <span className="ml-3 text-muted">
            {latest === undefined
              ? ""
              : latest
                ? `Bản sao lưu gần nhất: ${formatDateTime(latest.created)}`
                : "Chưa có bản sao lưu nào."}
          </span>
        </div>
        <DataGrid
          ref={datagrid}
          onRowRemoved={loadLatest}
          dataSource={dataSourceOptions}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} />
          <Editing mode="row" allowDeleting={true} useIcons={true} />
          <Column dataField="name" dataType="string" caption="Tên file" />
          <Column dataField="size" dataType="number" caption="Dung lượng" customizeText={(c) => formatSize(c.value)} />
          <Column dataField="created" dataType="datetime" caption="Ngày tạo" format="dd/MM/yyyy HH:mm" />

          <Column type="buttons" width={110}>
            <Button hint="Tải về" icon="download" onClick={performDownload} />
            <Button name="delete" />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
