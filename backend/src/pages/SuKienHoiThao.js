import "devextreme-react/html-editor";
import config from "../config";
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
import 'devextreme-react/html-editor';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyFileFileUploader from '../components/MyFileFileUploader';
import MyImageUploader from '../components/MyImageUploader';

export default function SuKienHoiThao() {
  const dataSourceLoaiSuKienOptions = createLookupStore("LoaiSuKiens");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Hội nghị, Sự kiện</h3>
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
          dataSource={createCustomStore("SuKienHoiThaos")}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
          onInitNewRow={(e) => {
            rowData = null;
          }}
          onEditingStart={(e) => {
            rowData = e.data;
          }}
          onRowInserted={(e) => {
            e.component.navigateToRow(e.key).done(function () {
              var rowindex = e.component.getRowIndexByKey(e.key);
              e.component.editRow(rowindex);
            });
          }}
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
              title="Thông tin Hội nghị, Sự kiện"
              showTitle={true}
              fullScreen={true}
            />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TenHoiThao" colSpan={2} isRequired={true} />
                  <Item dataField="LoaiHoiThao" isRequired={true} colSpan={2} />
                  <Item dataField="ThoiGianTu" isRequired={true} />
                  <Item dataField="ThoiGianDen" isRequired={true} />
                  <Item dataField="DonViTaiTro" colSpan={2} />
                  <Item dataField="DiaDiemToChuc" />
                  <Item dataField="ThanhPhanThamGia" />
                  <Item dataField="DonViToChucChinh" colSpan={2} />
                  <Item dataField="NoiDungThongTinMoi" colSpan={2} />
                  <Item dataField="ChoPhepDangKy" editorType="dxCheckBox" />
                  <Item dataField="TrangThai" editorType="dxCheckBox" />
                  <Item dataField="AnhDaiDien" />
                  <Item dataField="Lang" isRequired={true} />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/SuKienHoiThao_Files/Get?filter=[['SuKienHoiThaoID','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/SuKienHoiThao_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/SuKienHoiThao_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/SuKienHoiThao_Files/Delete`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowInserted={(e) => {
                      e.component.refresh();
                    }}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    onInitNewRow={(e) => {
                      e.data.SuKienHoiThaoID = rowData.ID;
                    }}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={false}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <DataGridPopup title="Thông tin" showTitle={true} />
                      <Form>
                        <Item dataField="FileID" colSpan={2} />
                      </Form>
                    </Editing>
                    <Column
                      dataField="FileID"
                      dataType="string"
                      caption="Link file"
                      editCellRender={(cellInfo) => (
                        <MyFileFileUploader cellInfo={cellInfo} />
                      )}
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceFileOptions}
                        remoteOperations={true}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="Ten"
                      />
                    </Column>
                  </DataGrid>
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
            dataField="TenHoiThao"
            dataType="string"
            caption="Tên sự kiện"
          />
          <Column
            dataField="ThoiGianTu"
            dataType="datetime"
            format={"dd/MM/yyyy hh:mm a"}
            caption="Thời gian bắt đầu"
          />
          <Column
            dataField="ThoiGianDen"
            dataType="datetime"
            format={"dd/MM/yyyy hh:mm a"}
            caption="Thời gian kết thúc"
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
          <Column
            dataField="AnhDaiDien"
            dataType="string"
            caption="Ảnh đại diện"
            visible={false}
            cellRender={config.defaultImageCellRender}
            editCellRender={(cellInfo) => (
              <MyImageUploader cellInfo={cellInfo} />
            )}
          />
          <Column
            dataField="DonViTaiTro"
            dataType="string"
            caption="Đơn vị tài trợ"
            visible={false}
          />
          <Column
            dataField="DonViToChucChinh"
            dataType="string"
            caption="Đơn vị tổ chức chính"
            visible={false}
          />
          <Column
            dataField="LoaiHoiThao"
            dataType="string"
            caption="Loại sự kiện"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceLoaiSuKienOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenLoaiSuKien"
            />
          </Column>
          <Column
            dataField="ThanhPhanThamGia"
            dataType="string"
            caption="Thành phần tham gia"
            visible={false}
          />
          <Column
            dataField="ChoPhepDangKy"
            dataType="string"
            caption="Cho phép đăng ký"
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
          <Column
            dataField="DiaDiemToChuc"
            dataType="string"
            caption="Địa điểm tổ chức"
            visible={false}
          />
          <Column
            dataField="NoiDungThongTinMoi"
            dataType="string"
            caption="Nội dung thông tin mới"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorMediumOptions}
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
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
