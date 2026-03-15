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
import { createCustomStore,createLookupStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function ChiTieu_DanhMuc() {
  const dataSourceOptions = createCustomStore("ChiTieu_DanhMucs");
  const dataSourceDanhMucOptions = createLookupStore("ChiTieu_DanhMucs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh mục chỉ tiêu</h3>
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
            <Popup title="Danh mục chỉ tiêu" showTitle={true} />
            <Form>
              <Item dataField="TieuDe" colSpan={2} />
              <Item dataField="TenDanhMuc" colSpan={2} />
              <Item dataField="KeyDanhMucChiTieu" colSpan={2} />
              <Item dataField="DanhMucCha" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            caption="ID"
            defaultSortOrder={"desc"}
          ></Column>
          <Column dataField="TieuDe" caption="Tiêu đề"></Column>
          <Column dataField="TenDanhMuc" caption="Tên danh mục"></Column>
          <Column
            dataField="KeyDanhMucChiTieu"
            caption="Key Danh mục chỉ tiêu"
          ></Column>
          <Column dataField="DanhMucCha" caption="Danh mục cha">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceDanhMucOptions}
              valueExpr="ID"
              displayExpr="TenDanhMuc"
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
