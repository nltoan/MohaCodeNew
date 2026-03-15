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

export default function BinhLuan() {
  const dataSourceOptions = createCustomStore("BinhLuans");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý BinhLuan</h3>
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
              <Item dataField="ID_ThongTin" />
              <Item dataField="NoiDung" />
              <Item dataField="TenBanDoc" />
              <Item dataField="Email" />
              <Item dataField="Trangthai" />
              <Item dataField="NgayTao" />
              <Item dataField="NgayKiemDuyet" />
              <Item dataField="TieuDe" />
              <Item dataField="IDCha" />
              <Item dataField="DiaChi" />
              <Item dataField="FileDinhKem" />
            </Form>
          </Editing>

          <Column
            dataField="ID_ThongTin"
            dataType="string"
            caption="ID_ThongTin"
          />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
          <Column dataField="TenBanDoc" dataType="string" caption="TenBanDoc" />
          <Column dataField="Email" dataType="string" caption="Email" />
          <Column
            dataField="Trangthai"
            dataType="string"
            caption="Trạng thái"
          />
          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
          <Column
            dataField="NgayKiemDuyet"
            dataType="string"
            caption="NgayKiemDuyet"
          />
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
          <Column dataField="IDCha" caption="Cha" width={125}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenBanDoc"
            />
          </Column>
          <Column dataField="DiaChi" dataType="string" caption="Địa chỉ" />
          <Column
            dataField="FileDinhKem"
            dataType="string"
            caption="FileDinhKem"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
