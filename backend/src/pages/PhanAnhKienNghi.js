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
  HeaderFilter,
  RequiredRule,
  EmailRule
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function PhanAnhKienNghi() {
  const dataSourceOptions = createCustomStore("PhanAnhKienNghis");
  const dataSourceLinhVucOptions = createLookupStore("PhanAnhKienNghi_LinhVucs");
  const dataSourceCoQuanOptions = createLookupStore("PhanAnhKienNghi_CoQuans");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Trả lời phản ánh, kiến nghị</h3>
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
            <Popup title="Trả lời phản án, kiến nghị" showTitle={true} />
            <Form>
              <Item dataField="TenCauHoi" colSpan={2} />
              <Item dataField="TenNguoiGui" colSpan={2} />
              <Item dataField="Email" colSpan={2} />
              <Item dataField="SoDienThoai" />
              <Item dataField="IPNguoiGui" />
              <Item dataField="LinhVucId" colSpan={2} />
              <Item dataField="CoQuanId" colSpan={2} />
              <Item dataField="NgayHoi" />
              <Item dataField="NguoiTraLoi" colSpan={2} />
              <Item dataField="HienThiLuotXem" />
              <Item dataField="LuotXem" />
              <Item dataField="NoiDungCauHoi" colSpan={2} />
              <Item dataField="NoiDungCauTraLoi" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            caption="ID"
            defaultSortOrder={"desc"}
            width={70}
          />
          <Column dataField="TenCauHoi" caption="Tên câu hỏi">
            <RequiredRule />
          </Column>
          <Column
            dataField="TenNguoiGui"
            caption="Tên người gửi"
            visible={false}
          >
            <RequiredRule />
          </Column>
          <Column
            dataField="Email"
            dataType="email"
            caption="Email"
            visible={false}
          >
            <RequiredRule />
            <EmailRule />
          </Column>
          <Column
            dataField="SoDienThoai"
            caption="Số điện thoại"
            visible={false}
          />
          <Column
            dataField="IPNguoiGui"
            caption="IP người gửi"
            visible={false}
          />
          <Column dataField="LinhVucId" caption="Lĩnh vực" width={150}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceLinhVucOptions}
              valueExpr="ID"
              displayExpr="TenLinhVuc"
            />
          </Column>
          <Column
            dataField="CoQuanId"
            caption="Cơ quan tiếp nhận"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceCoQuanOptions}
              valueExpr="ID"
              displayExpr="TenCoQuan"
            />
          </Column>
          <Column
            dataField="NgayHoi"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày hỏi"
            visible={false}
          />
          <Column
            dataField="NguoiTraLoi"
            caption="Người trả lời"
            visible={false}
          />
          <Column dataField="LuotXem" caption="Lượt xem" visible={false} />
          <Column
            dataField="HienThiLuotXem"
            caption="Hiển thị lượt xem"
            visible={false}
            dataType="boolean"
          />
          <Column
            dataField="NoiDungCauHoi"
            caption="Nội dung câu hỏi"
            visible={false}
          >
            <RequiredRule />
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column
            dataField="NoiDungCauTraLoi"
            caption="Nội dung câu trả lời"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
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
