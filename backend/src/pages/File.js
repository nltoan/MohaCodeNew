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

export default function File() {
  const dataSourceOptions = createCustomStore("Files");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý File</h3>
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
              <Item dataField="Ten" />
              <Item dataField="MoTa" />
              <Item dataField="KichThuoc" />
              <Item dataField="ID_NhanVien" />
              <Item dataField="LoginName" />
              <Item dataField="NgayTao" />
              <Item dataField="SoLanTaiFile" />
              <Item dataField="LinkTaiFile" />
              <Item dataField="LinkLuuTru" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="LinkGoc" />
            </Form>
          </Editing>

          <Column dataField="Ten" dataType="string" caption="Tên" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="KichThuoc" dataType="string" caption="KichThuoc" />
          <Column
            dataField="ID_NhanVien"
            dataType="string"
            caption="ID_NhanVien"
          />
          <Column dataField="LoginName" dataType="string" caption="LoginName" />
          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
          <Column
            dataField="SoLanTaiFile"
            dataType="string"
            caption="SoLanTaiFile"
          />
          <Column
            dataField="LinkTaiFile"
            dataType="string"
            caption="LinkTaiFile"
          />
          <Column
            dataField="LinkLuuTru"
            dataType="string"
            caption="LinkLuuTru"
          />
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
          <Column dataField="LinkGoc" dataType="string" caption="LinkGoc" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
