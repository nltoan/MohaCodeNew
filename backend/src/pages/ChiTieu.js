import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FilterRow,
  HeaderFilter} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function ChiTieu() {
  const dataSourceOptions = createCustomStore("ChiTieus");
  const dataSourceDanhMucOptions = createLookupStore("ChiTieu_DanhMucs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách Chỉ tiêu</h3>
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
            <Popup title="Chỉ tiêu" showTitle={true} />
            <Form>
              <Item dataField="DanhMucId" colSpan={2} />
              <Item dataField="TieuDe" colSpan={2} />
              <Item dataField="ChiSo" colSpan={2} />
              <Item dataField="KeyChiTietChiTieu" colSpan={2} />
              <Item dataField="NamThucHien" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            caption="ID"
            defaultSortOrder={"desc"}
          ></Column>
          <Column dataField="DanhMucId" caption="Danh mục">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceDanhMucOptions}
              valueExpr="ID"
              displayExpr="TenDanhMuc"
            />
          </Column>
          <Column dataField="TieuDe" caption="Tiêu đề"></Column>
          <Column dataField="ChiSo" caption="Chỉ số"></Column>
          <Column
            dataField="KeyChiTietChiTieu"
            caption="Key chi tiết chỉ tiêu"
          ></Column>
          <Column dataField="NamThucHien" caption="Năm thực hiện"></Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
