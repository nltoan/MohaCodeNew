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
  RequiredRule
} from 'devextreme-react/data-grid';
import config from '../config';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyFileFileUploader from '../components/MyFileFileUploader';
import 'devextreme/ui/html_editor/converters/markdown';

export default function ThongBao() {
  const dataSourceOptions = createCustomStore("ThongBaos");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Thông báo</h3>
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
          onInitNewRow={(e) => {
            rowData = null;
            e.data.NgayDang = new Date();
            e.data.TenFileHienThi = "Bấm vào đây để tải về";
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
            <Popup title="Thông báo" showTitle={true} />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TieuDe" colSpan={2} />
                  <Item dataField="SoVanBan" />
                  <Item dataField="NgayDang" />
                  <Item dataField="DonViBanHanh" colSpan={2} />
                  <Item dataField="NoiDung" colSpan={2} />
                  <Item dataField="HienThiTrangChu" />
                  <Item dataField="TenFileHienThi" />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/ThongBao_Files/Get?filter=[['ThongBaoID','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/ThongBao_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/ThongBao_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/ThongBao_Files/Delete`,
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
                      e.data.ThongBaoId = rowData.ID;
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
                      <Popup title="Thông tin" showTitle={true} />
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
          <Column dataField="ID" caption="ID"></Column>
          <Column dataField="TieuDe" caption="Tiêu đề">
            <RequiredRule />
          </Column>
          <Column
            dataField="SoVanBan"
            caption="Số văn bản đề nghị thông báo"
          ></Column>
          <Column
            dataField="NgayDang"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày đăng"
          >
            <RequiredRule />
          </Column>
          <Column dataField="DonViBanHanh" caption="Đơn vị ban hành"></Column>
          <Column dataField="NoiDung" caption="Nội dung" visible={false}>
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column
            dataField="HienThiTrangChu"
            dataType="boolean"
            caption="Hiển thị ở trang chủ"
          ></Column>
          <Column
            dataField="TenFileHienThi"
            caption="Tên file hiển thị"
          ></Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
