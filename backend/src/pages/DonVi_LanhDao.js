import DataGrid, {
  Column,
  Lookup,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

const dataSourceOptions = createCustomStore("DonVi_LanhDao");
const dataSourceLanhDaoOptions = createLookupStore("ThongTinLanhDaos");
const dataSourceDonViOptions = createLookupStore("CoCauToChucs");

export default function DonVi_LanhDao() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lãnh đạo phụ trách đơn vị</h3>
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
          <SearchPanel visible={true} />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Lãnh đạo phụ trách đơn vị" showTitle={true} />
            <Form>
              <Item dataField="IDLanhDao" isRequired={true} />
              <Item dataField="IDDonVi" isRequired={true} />
              <Item dataField="ChucVu" />
              <Item dataField="PhuTrach" />
              <Item dataField="Hang" helpText="Vị trí hiển thị trên sơ đồ: hàng thứ mấy." />
              <Item dataField="Cot" helpText="Vị trí hiển thị trên sơ đồ: cột thứ mấy." />
              <Item dataField="ChucNangNhiemVu" colSpan={2} editorType="dxTextArea" editorOptions={{ height: 120 }} />
            </Form>
          </Editing>

          <Column dataField="IDLanhDao" caption="Lãnh đạo">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceLanhDaoOptions} valueExpr="ID" displayExpr="HoTenLanhDao" />
          </Column>
          <Column dataField="IDDonVi" caption="Đơn vị">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="TenDonVi" />
          </Column>
          <Column dataField="ChucVu" dataType="string" caption="Chức vụ" />
          <Column dataField="PhuTrach" dataType="string" caption="Phụ trách" />
          <Column dataField="Hang" dataType="string" caption="Hàng" width={70} />
          <Column dataField="Cot" dataType="string" caption="Cột" width={70} />
          <Column
            dataField="ChucNangNhiemVu"
            dataType="string"
            caption="Chức năng nhiệm vụ"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
    </div>
  );
}
