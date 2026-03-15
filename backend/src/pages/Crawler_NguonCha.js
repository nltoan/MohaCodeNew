import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';

export default function Crawler_NguonCha() {
  const dataSourceOptions = createCustomStore("Crawler_NguonCha");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý crawler nguồn báo</h3>
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
              <Item dataField="TenNguon" />
              <Item dataField="MoTa" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
              <Item dataField="SoThuTu" />
              <Item dataField="LinkLienKet" />
            </Form>
          </Editing>

          <Column dataField="TenNguon" dataType="string" caption="TenNguon" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="HienThi" dataType="string" caption="Hiển thị">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không" },
                { Val: 1, Name: "Có" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="Số thứ tự"
            defaultSortOrder="asc"
          />
          <Column
            dataField="LinkLienKet"
            dataType="string"
            caption="LinkLienKet"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
