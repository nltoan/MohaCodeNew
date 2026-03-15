import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FormItem,
  FilterRow,
  HeaderFilter} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function DongGopYKien() {
  const dataSourceOptions = createCustomStore("DongGopYKiens");
  const dataSourceChuDeOptions = createLookupStore("DongGopYKien_ChuDes");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Ý kiến đóng góp</h3>
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
            <Popup title="Ý kiến đóng góp" showTitle={true} />
            <Form>
              <Item dataField="TieuDe" colSpan={2} />
              <Item dataField="ChuDeId" colSpan={2} />
              <Item dataField="TenNguoiGui" />
              <Item dataField="CMND" />
              <Item dataField="Email" />
              <Item dataField="SoDienThoai" />
              <Item dataField="NoiDung" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
            width={70}
          ></Column>
          <Column
            dataField="ChuDeId"
            dataType="string"
            caption="Chủ đề"
            width={150}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceChuDeOptions}
              valueExpr="ID"
              displayExpr="TieuDe"
            />
          </Column>
          <Column
            dataField="TieuDe"
            dataType="string"
            caption="Tiêu đề"
          ></Column>
          <Column
            dataField="TenNguoiGui"
            dataType="string"
            caption="Người gửi"
            width={150}
          ></Column>
          <Column
            dataField="CMND"
            dataType="string"
            caption="CMND"
            visible={false}
          ></Column>
          <Column
            dataField="Email"
            dataType="string"
            caption="Email"
            visible={false}
          ></Column>
          <Column
            dataField="SoDienThoai"
            dataType="string"
            caption="Số điện thoại"
            width={100}
          ></Column>
          <Column
            dataField="NoiDung"
            dataType="string"
            caption="Nội dung"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column
            dataField="NgayTao"
            dataType="string"
            caption="NgayTao"
            visible={false}
          ></Column>
          <Column
            dataField="NguoiTao"
            dataType="string"
            caption="NguoiTao"
            visible={false}
          ></Column>
          <Column
            dataField="NgayCapNhat"
            dataType="string"
            caption="NgayCapNhat"
            visible={false}
          ></Column>
          <Column
            dataField="NguoiCapNhat"
            dataType="string"
            caption="NguoiCapNhat"
            visible={false}
          ></Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
