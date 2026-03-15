
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';

export default function LanhDao_ThoiKy() {
  const dataSourceOptions = createCustomStore("LanhDao_ThoiKys");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý LanhDao_ThoiKy</h3>
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
              <Item dataField="IDLanhDao" />
              <Item dataField="LoaiLanhDao" />
              <Item dataField="SoThuTu" />
            </Form>
          </Editing>

          <Column dataField="IDLanhDao" dataType="string" caption="IDLanhDao" />
          <Column
            dataField="LoaiLanhDao"
            dataType="string"
            caption="LoaiLanhDao"
          />
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="Số thứ tự"
            defaultSortOrder="asc"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
