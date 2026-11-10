import { useRef } from 'react';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  FilterRow, HeaderFilter, Button, Editing,
} from 'devextreme-react/data-grid';
import { createCustomStore, request, notify } from '../utils/api';
import { getToken } from '../utils/token';

const dataSourceOptions = createCustomStore("BackUps", "path");

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
  async function performBackUp() {
    const response = await request(`/BackUps/Post`, { method: "POST" });
    if (!response || response.isOk === false) {
      notify("Backup thất bại!", "error");
      return;
    }
    notify("Backup thành công!");
    datagrid.current.instance.refresh();
  }
  async function performDownload(e) {
    const path = e.row.data.path;
    try {
      const response = await fetch(
        `${window.env.REACT_APP_API_URL}/BackUps/Download?path=${encodeURIComponent(path)}`,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      if (response.status !== 200) {
        notify("Tải file backup thất bại!", "error");
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
      notify("Tải file backup thất bại!", "error");
    }
  }
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý backup</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
            title="Collapse"
          >
            <i className="fas fa-minus" />
          </button>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
            title="Remove"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <button
          type="button"
          className="btn btn-primary"
          onClick={performBackUp}
        >
          Backup
        </button>
        <DataGrid
          ref={datagrid}
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
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Editing mode="row" allowDeleting={true} useIcons={true} />
          <Column dataField="name" dataType="string" caption="Tên file" />
          <Column dataField="size" dataType="number" caption="Dung lượng" customizeText={(c) => formatSize(c.value)} />
          <Column dataField="created" dataType="datetime" caption="Ngày tạo" format="dd/MM/yyyy HH:mm" />

          <Column type="buttons" width={110}>
            <Button hint="Download" icon="download" onClick={performDownload} />
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
