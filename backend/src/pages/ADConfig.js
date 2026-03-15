import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';

export default function ADConfig() {
  const dataSourceOptions = createCustomStore("ADConfigs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý chuỗi AD cho phép đăng nhập</h3>
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
        <DataGrid
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
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="Name" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            dataType="string"
            caption="id"
            visible={false}
          />
          <Column dataField="Name" dataType="string" caption="Chuỗi" />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
