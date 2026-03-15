import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Lookup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function QuyTrinhKiemDuyet() {
  const dataSourceUsersOptions = createLookupStore("User_Account", "UserID");
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý quy trình kiểm duyệt</h3>
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
          dataSource={createCustomStore("QuyTrinhKiemDuyets")}
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
              title="Thông tin chi tiết quy trình"
              showTitle={true}
            />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item
                    dataField="TenQuyTrinhKiemDuyet"
                    isRequired={true}
                    colSpan={2}
                  />
                  <Item dataField="MoTa" colSpan={2} />
                  <Item dataField="TrangThai" />
                </Tab>
                <Tab title="Danh sách bước quy trình">
                  <Item colSpan={2}>
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/BuocQuyTrinhs/Get?filter=[['IDQuyTrinh','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/BuocQuyTrinhs/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/BuocQuyTrinhs/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/BuocQuyTrinhs/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      onRowInserted={(e) => {
                        e.component.refresh();
                      }}
                      onInitNewRow={(e) => {
                        e.data.IDQuyTrinh = rowData.ID;
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={true}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <DataGridPopup
                          title="Thông tin chi tiết bước quy trình"
                          showTitle={true}
                        />
                        <Form>
                          <Item
                            dataField="TenBuocQuyTrinh"
                            colSpan={2}
                            isRequired={true}
                          />
                          <Item
                            dataField="SoThuTu"
                            colSpan={2}
                            isRequired={true}
                          />
                          <Item
                            dataField="UserBuocQuyTrinhs"
                            isRequired={true}
                            editorType="dxTagBox"
                            editorOptions={{
                              dataSource: dataSourceUsersOptions,
                              valueExpr: "UserID",
                              displayExpr: "TenTruyCap",
                              searchEnabled: true,
                            }}
                            colSpan={2}
                          />
                        </Form>
                      </Editing>

                      <Column
                        dataField="TenBuocQuyTrinh"
                        dataType="string"
                        caption="Tên bước"
                      />
                      <Column
                        dataField="SoThuTu"
                        dataType="number"
                        caption="Số thứ tự"
                        defaultSortOrder="asc"
                      />
                      <Column
                        dataField="UserBuocQuyTrinhs"
                        dataType="string"
                        caption="Danh sách kiểm duyệt"
                        visible={false}
                        calculateCellValue={(e) => {
                          return e.UserBuocQuyTrinhs?.map((x) => x.UserID);
                        }}
                      />
                    </DataGrid>
                  </Item>
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" />
          <Column
            dataField="TenQuyTrinhKiemDuyet"
            dataType="string"
            caption="Tên quy trình"
          />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "KhongHoatDong", Name: "Không hoạt động" },
                { Val: "HoatDong", Name: "Hoạt động" },
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
