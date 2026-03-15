import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Lookup,
  Form,
  FormItem,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab,
} from 'devextreme-react/form';
import { Item } from 'devextreme-react/form';
import MyImageUploader from '../components/MyImageUploader';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function ThongTinLanhDao() {
  const dataSourceThongTinLanhDaoOptions = createLookupStore("ThongTinLanhDaos");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý thông tin lãnh đạo</h3>
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
          dataSource={createCustomStore("ThongTinLanhDaos")}
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
            <DataGridPopup
              title="Thông tin"
              showTitle={true}
              fullScreen={true}
            />
            <Form>
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="HoTenLanhDao" colSpan={2} />
                  <Item dataField="NgaySinh" />
                  <Item dataField="GioiTinh" />
                  <Item dataField="DanToc" />
                  <Item dataField="TonGiao" />
                  <Item dataField="SoFax" />
                  <Item dataField="Email" />
                  <Item dataField="SoDienThoai" />
                  <Item dataField="AnhDaiDien" />
                  <Item dataField="NguyenQuan" colSpan={2} />
                  <Item dataField="ChucDanh" />
                  <Item dataField="ChucVuDang" />
                  <Item dataField="NgayVaoDang" />
                  <Item dataField="NgayVaoDangChinhThuc" />
                  <Item dataField="TieuSuBanThan" colSpan={2} />
                  <Item dataField="HienThiTieuSu" editorType="dxCheckBox" />
                  <Item dataField="ThuKy" />
                  {/* <Item dataField="NhiemKy" /> */}
                  <Item dataField="TrangThai" />
                  {/* <Item dataField="Hang" /> */}
                  {/* <Item dataField="Cot" /> */}
                  <Item dataField="Lang" />
                </Tab>
                <Tab title="Thông tin bổ nhiệm" colCount={2}>
                  <Item dataField="TrinhDo" />
                  <Item dataField="TrinhDoLLCT" />
                  <Item dataField="SoQDBoNhiem" />
                  <Item dataField="NgayQDBoNhiem" />
                  <Item dataField="NguoiKyQDBoNhiem" />
                  <Item dataField="ThoiHanBoNhiem" />
                  <Item dataField="BatDauBoNhiem" />
                  <Item dataField="ChucVuCu" />
                  <Item dataField="ChucVuMoi" />
                  <Item dataField="DonViCu" />
                  <Item dataField="DonViMoi" />
                  <Item
                    dataField="QuaTrinhCongTac"
                    colSpan={2}
                    editorType={"dxTextArea"}
                  />
                  <Item dataField="DangVien" />
                  <Item dataField="LinkQDBoNhiem" />
                  <Item dataField="ThongTinQĐBoNhiem" />
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
          />
          <Column
            dataField="HoTenLanhDao"
            dataType="string"
            caption="Họ và tên lãnh đạo"
          />
          <Column dataField="ChucDanh" dataType="string" caption="Chức vụ" />
          <Column
            dataField="TieuSuBanThan"
            dataType="string"
            caption="Tiểu sử bản thân"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column
            dataField="NgaySinh"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày sinh"
            visible={false}
          />
          <Column
            dataField="GioiTinh"
            dataType="string"
            caption="Giới tính"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "0", Name: "Nữ" },
                { Val: "1", Name: "Nam" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="SoDienThoai"
            dataType="string"
            caption="Số điện thoại"
            visible={false}
          />
          <Column
            dataField="AnhDaiDien"
            dataType="string"
            caption="Ảnh đại diện"
            cellRender={config.defaultImageCellRender}
            editCellRender={(cellInfo) => (
              <MyImageUploader cellInfo={cellInfo} />
            )}
          />
          <Column
            dataField="HienThiTieuSu"
            dataType="string"
            caption="Hiện tiểu sử"
            visible={false}
          >
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
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "0", Name: "Không hoạt động" },
                { Val: "1", Name: "Hoạt động" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column dataField="Lang" dataType="string" caption="Ngôn ngữ">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 1066, Name: "Tiếng Việt" },
                { Val: 1033, Name: "Tiếng Anh" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="TrinhDo"
            dataType="string"
            caption="Trình độ"
            visible={false}
          />
          <Column
            dataField="TrinhDoLLCT"
            dataType="string"
            caption="Trình độ LLCT"
            visible={false}
          />
          <Column
            dataField="DangVien"
            dataType="string"
            caption="Là đảng viên"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không" },
                { Val: 1, Name: "Đúng" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="NguyenQuan"
            dataType="string"
            caption="Nguyên quán"
            visible={false}
          />
          <Column
            dataField="Email"
            dataType="string"
            caption="Email"
            visible={false}
          />
          <Column
            dataField="SoQDBoNhiem"
            dataType="string"
            caption="Số QĐ bổ nhiệm"
            visible={false}
          />
          <Column
            dataField="NgayQDBoNhiem"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày QĐ bổ nhiệm"
            visible={false}
          />
          <Column
            dataField="NguoiKyQDBoNhiem"
            dataType="string"
            caption="Người ký QĐ bổ nhiệm"
            visible={false}
          />
          <Column
            dataField="ThoiHanBoNhiem"
            dataType="string"
            caption="Thời hạn bổ nhiệm"
            visible={false}
          />
          <Column
            dataField="BatDauBoNhiem"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Bắt đầu bổ nhiệm từ"
            visible={false}
          />
          <Column
            dataField="ChucVuCu"
            dataType="string"
            caption="Chức vụ cũ"
            visible={false}
          />
          <Column
            dataField="ChucVuMoi"
            dataType="string"
            caption="Chức vụ mới"
            visible={false}
          />
          <Column
            dataField="DonViCu"
            dataType="string"
            caption="Đơn vị cũ"
            visible={false}
          />
          <Column
            dataField="DonViMoi"
            dataType="string"
            caption="Đơn vị mới"
            visible={false}
          />
          <Column
            dataField="QuaTrinhCongTac"
            dataType="string"
            caption="Quá trình công tác"
            visible={false}
          />
          <Column
            dataField="LinkQDBoNhiem"
            dataType="string"
            caption="Link QĐ bổ nhiệm"
            visible={false}
          />
          <Column
            dataField="ThongTinQĐBoNhiem"
            dataType="string"
            caption="Thông tin QĐ bổ nhiệm"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorMediumOptions}
            />
          </Column>
          <Column
            dataField="ThuKy"
            caption="Thư ký"
            width={125}
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceThongTinLanhDaoOptions}
              valueExpr="ID"
              displayExpr="HoTenLanhDao"
            />
          </Column>
          <Column
            dataField="DanToc"
            dataType="string"
            caption="Dân tộc"
            visible={false}
          />
          <Column
            dataField="TonGiao"
            dataType="string"
            caption="Tôn giáo"
            visible={false}
          />
          <Column
            dataField="ChucVuDang"
            dataType="string"
            caption="Chức vụ Đảng"
            visible={false}
          />
          <Column
            dataField="NgayVaoDang"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày vào Đảng"
            visible={false}
          />
          <Column
            dataField="NgayVaoDangChinhThuc"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày vào Đảng chính thức"
            visible={false}
          />

          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
