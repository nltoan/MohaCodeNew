import { useRef } from 'react';
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
  CustomRule,
  EmailRule,
  Toolbar,
  Item as GridToolbarItem,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import { exportButtonOptions } from '../utils/exportCsv';
import 'devextreme/ui/html_editor/converters/markdown';

const dataSourceOptions = createCustomStore("PhanAnhKienNghis");
const dataSourceLinhVucOptions = createLookupStore("PhanAnhKienNghi_LinhVucs");
const dataSourceCoQuanOptions = createLookupStore("PhanAnhKienNghi_CoQuans");

// Thong tin do nguoi gui nhap tu portal / he thong ghi nhan: chi xem khi tra loi (van nhap duoc khi them moi).
const READ_ONLY_WHEN_EDITING = ["TenNguoiGui", "Email", "SoDienThoai", "IPNguoiGui", "NgayHoi", "LuotXem"];

export default function PhanAnhKienNghi() {
  const dataGridRef = useRef(null);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Trả lời phản ánh, kiến nghị</h3>
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
          ref={dataGridRef}
          dataSource={dataSourceOptions}
          allowColumnReordering={true}
          allowColumnResizing={true}
          rowAlternationEnabled={true}
          showBorders={true}
          wordWrapEnabled={true}
          height="calc(100vh - 190px)"
          onEditorPreparing={(e) => {
            if (
              e.parentType === "dataRow" &&
              READ_ONLY_WHEN_EDITING.indexOf(e.dataField) >= 0 &&
              e.row &&
              !e.row.isNewRow
            ) {
              e.editorOptions.readOnly = true;
            }
          }}
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel
            visible={true}
            width={260}
            placeholder="Tìm tên câu hỏi..."
          />
          <Toolbar>
            <GridToolbarItem name="addRowButton" />
            <GridToolbarItem
              location="after"
              widget="dxButton"
              options={exportButtonOptions(
                () => dataGridRef.current.instance,
                "phan-anh-kien-nghi",
              )}
            />
            <GridToolbarItem name="searchPanel" />
          </Toolbar>
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup
              title="Trả lời phản ánh, kiến nghị"
              showTitle={true}
              fullScreen={true}
            />
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
            width={70}
          />
          <Column dataField="TenCauHoi" caption="Tên câu hỏi">
            <RequiredRule message="Hãy nhập tên câu hỏi" />
          </Column>
          <Column
            dataField="NgayHoi"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày gửi"
            width={100}
            sortIndex={1}
            sortOrder={"desc"}
          />
          <Column
            dataField="DaTraLoi"
            caption="Đã trả lời"
            dataType="boolean"
            width={110}
            trueText="Đã trả lời"
            falseText="Chưa trả lời"
            allowEditing={false}
            allowSearch={false}
            sortIndex={0}
            sortOrder={"asc"}
            cellRender={(cell) => (
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 10,
                  color: "#fff",
                  background: cell.value ? "#28a745" : "#dc3545",
                  fontSize: "0.85em",
                  whiteSpace: "nowrap",
                }}
              >
                {cell.value ? "Đã trả lời" : "Chưa trả lời"}
              </span>
            )}
          >
            <FormItem visible={false} />
          </Column>
          <Column
            dataField="TenNguoiGui"
            caption="Tên người gửi"
            visible={false}
          >
            {/* Chi bat buoc khi them moi: khi tra loi o nay chi xem, ban ghi cu thieu ten van luu duoc. */}
            <CustomRule
              message="Hãy nhập tên người gửi"
              validationCallback={(o) =>
                (o.data && o.data.ID != null) ||
                (o.value != null && String(o.value).trim() !== "")
              }
            />
          </Column>
          <Column
            dataField="Email"
            dataType="email"
            caption="Email"
            visible={false}
          >
            <EmailRule message="Email không hợp lệ" />
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
            <RequiredRule message="Hãy nhập nội dung câu hỏi" />
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
