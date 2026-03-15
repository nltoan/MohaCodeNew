import { useRef } from 'react';
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
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyImageUploader from '../components/MyImageUploader';
import MyFileFileUploader from '../components/MyFileFileUploader';
import { Popup } from 'devextreme-react';

export default function GioiThieuVanBan() {
  const dataSourceOptions = createCustomStore("GioiThieuVanBans");
  const dataSourceVanBanQPPLOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/VanBans/Get?LopVanBanID=101`,
  });
  const dataSourceVanBanDTOptions = createLookupStore("VanBanDuThaos");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  const title = "Giới thiệu văn bản";
  const dataGridRef = useRef(null);
  let rowData;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
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
          ref={dataGridRef}
          dataSource={dataSourceOptions}
          repaintChangesOnly={true}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          wordWrapEnabled={true}
          height="calc(100vh - 190px)"
          onInitNewRow={(e) => {
            rowData = null;
            e.data.NgayXuatBan = new Date();
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
              title="Thông tin Giới thiệu văn bản"
              showTitle={true}
              fullScreen={true}
            />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
                e.component.option("items[0].tabs[2].visible", !!rowData);
                e.component.option("items[0].tabs[3].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TieuDe" isRequired={true} colSpan={2} />
                  <Item dataField="IDVanBanQPPL" />
                  <Item dataField="IDVanBanDT" />
                  <Item
                    dataField="NgayXuatBan"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item dataField="TrangThai" />
                  <Item dataField="AnhDaiDien" colSpan={2} />
                  <Item
                    dataField="MoTa"
                    editorType="dxTextArea"
                    isRequired={true}
                    colSpan={2}
                  />
                  <Item dataField="NoiDung" colSpan={2} />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/GioiThieuVanBan_Files/Get?filter=[['GioiThieuVanBanId','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/GioiThieuVanBan_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/GioiThieuVanBan_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/GioiThieuVanBan_Files/Delete`,
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
                      e.data.GioiThieuVanBanId = rowData.ID;
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
                      <Popup title="Thông tin file đính kèm" showTitle={true} />
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
            caption="ID"
            defaultSortOrder={"desc"}
            width={60}
          />
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
          <Column
            dataField="MoTa"
            dataType="string"
            caption="Mô tả"
            visible={false}
          />
          <Column
            dataField="TacGia"
            dataType="string"
            caption="Tác giả"
            visible={false}
          />
          <Column
            dataField="NgayXuatBan"
            dataType="date"
            caption="Ngày xuất bản"
            format={"dd/MM/yyyy"}
            width={110}
          />
          <Column
            dataField="TrangThai"
            dataType="string"
            caption="Trạng thái"
            width={120}
          >
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
            dataField="IDVanBanQPPL"
            dataType="string"
            caption="Văn bản QPPL liên quan"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceVanBanQPPLOptions}
              valueExpr="ID"
              displayExpr="SoKyHieu"
            />
          </Column>
          <Column
            dataField="IDVanBanDT"
            dataType="string"
            caption="Văn bản dự thảo liên quan"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceVanBanDTOptions}
              valueExpr="ID"
              displayExpr="TieuDe"
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
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
