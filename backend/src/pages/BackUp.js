import { useRef } from 'react';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  FilterRow, HeaderFilter, Button,
} from 'devextreme-react/data-grid';
import { createCustomStore, request } from '../utils/api';

export default function BackUp() {
  const dataSourceOptions = createCustomStore("BackUps", "path");
  const datagrid = useRef(null);
  async function performBackUp() {
    const response = await request(`/BackUps/Post`);
    datagrid.current._instance.refresh();
  }
  async function performDownload(e) {
    window.location = `${window.env.REACT_APP_API_URL}/BackUps/Download?path=${e.row.data.path}`;
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
          <Column dataField="path" dataType="string" caption="Đường dẫn" />

          <Column type="buttons" width={110}>
            <Button hint="Download" icon="download" onClick={performDownload} />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
