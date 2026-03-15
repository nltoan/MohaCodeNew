
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

export default function User_DichVuCong() {
  const dataSourceOptions = createCustomStore("User_DichVuCongs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý User_DichVuCong</h3>
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
              <Item dataField="ID_CoQuan" />
              <Item dataField="DanhSachDVCSuDung" />
              <Item dataField="ID_User" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
            </Form>
          </Editing>

          <Column dataField="ID_CoQuan" dataType="string" caption="ID_CoQuan" />
          <Column
            dataField="DanhSachDVCSuDung"
            dataType="string"
            caption="DanhSachDVCSuDung"
          />
          <Column dataField="ID_User" dataType="string" caption="ID_User" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không hoạt động" },
                { Val: 1, Name: "Hoạt động" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
