import DataGrid, {
  Column as DataGridColumn,
  SearchPanel as DataGridSearchPanel,
  Editing as DataGridEditing,
  Popup as DataGridPopup,
  Lookup as DataGridLookup,
  Form as DataGridForm,
  FilterRow as DataGridFilterRow,
  HeaderFilter as DataGridHeaderFilter,
} from 'devextreme-react/data-grid';
import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup as TreeListPopup, FilterRow, FormItem,
} from 'devextreme-react/tree-list';
import 'devextreme-react/html-editor';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore } from '../utils/api';
import MyTreeCombobox from '../components/MyTreeCombobox';

export default function CoCauToChuc() {
  const dataSourceCoCauToChucOptions = createLookupStore("CoCauToChucs");
  const dataSourceThongTinLanhDaoOptions = createLookupStore("ThongTinLanhDaos");
  const dataSourceChucDanhOptions = createLookupStore("ChucDanhs");
  const dataSourceLoaiDonViOptions = [
    { Val: 5, Name: "State Management Agencies", Lang: 1033 },
    { Val: 6, Name: "Functional Unit", Lang: 1033 },
    { Val: 7, Name: "Public Service Organizations", Lang: 1033 },
    { Val: 8, Name: "Local Departments", Lang: 1033 },

    { Val: 1, Name: "Các đơn vị quản lý nhà nước", Lang: 1066 },
    {
      Val: 30,
      Name: "Các đơn vị sự nghiệp phục vụ quản lý nhà nước",
      Lang: 1066,
    },
    { Val: 28, Name: "Các đơn vị sự nghiệp khác", Lang: 1066 },
    { Val: 19, Name: "Các Sở Lao động - Thương binh và Xã hội", Lang: 1066 },
  ];
  function treeviewEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceCoCauToChucOptions}
          keyExpr={"ID"}
          displayExpr={"TenDonVi"}
          parentIdExpr={"IDDVCha"}
          defaultValue={data.row.data.IDDVCha}
          onValueChanged={(e) => {
            if (e.value && e.value.length > 0) {
              data.setValue(e.value[0]);
            }
          }}
        />
      </>
    );
  }
  let rowData;
  function getFilteredCoCauToChucs(options) {
    return createFilterLookupStore(
      "CoCauToChucs",
      options.data ? ["IDLoaiDV", "=", options.data.IDLoaiDV] : null,
    );
  }
  function getFilteredLoaiDonVis(options) {
    if (!options.data) {
      return dataSourceLoaiDonViOptions;
    }
    return dataSourceLoaiDonViOptions.filter(
      (x) => (x.Lang = options.data.Lang),
    );
  }
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý cơ cấu tổ chức</h3>
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
        <TreeList
          dataSource={createCustomStore("CoCauToChucs")}
          // remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          keyExpr="ID"
          parentIdExpr="IDDVCha"
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
          onEditorPreparing={(e) => {
            if (e.parentType === "dataRow" && e.dataField === "IDDVCha") {
              e.editorOptions.disabled = typeof e.row.data.Lang !== "number";
            }
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
            <TreeListPopup
              title="Thông tin chi tiết đơn vị"
              showTitle={true}
              fullScreen={true}
            />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
                e.component.option("items[0].tabs[2].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item
                    dataField="TenDonVi"
                    editorType={"dxTextArea"}
                    colSpan={2}
                    isRequired={true}
                  />
                  <Item dataField="TenTiengAnh" colSpan={2} />
                  <Item dataField="Lang" isRequired={true} />
                  <Item dataField="IDDVCha" />
                  <Item dataField="LinkBaiViet" />
                  <Item dataField="Email" />
                  <Item dataField="Website" />
                  <Item dataField="Phone" />
                  <Item dataField="DiaChi" colSpan={2} />
                  {/* <Item dataField="SoThuTu" /> */}
                  <Item dataField="HienThi" isRequired={true} />
                </Tab>
                <Tab title="Danh sách lãnh đạo">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/DonVi_LanhDao/Get?filter=[['IDDonVi','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/DonVi_LanhDao/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/DonVi_LanhDao/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/DonVi_LanhDao/Delete`,
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
                      e.data.IDDonVi = rowData.ID;
                    }}
                  >
                    <DataGridFilterRow visible={true} />
                    <DataGridHeaderFilter visible={true} />
                    <DataGridSearchPanel
                      visible={true}
                      highlightCaseSensitive={true}
                    />
                    <DataGridEditing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <DataGridPopup
                        title="Thông tin lãnh đạo"
                        showTitle={true}
                      />
                      <Form>
                        <Item dataField="IDLanhDao" colSpan={2} />
                        <Item dataField="Hang" />
                        <Item dataField="Cot" />
                        <Item dataField="ChucVu" />
                        <Item dataField="PhuTrach" />
                      </Form>
                    </DataGridEditing>
                    <DataGridColumn
                      dataField="IDLanhDao"
                      dataType="string"
                      caption="Tên lãnh đạo"
                    >
                      <DataGridLookup
                        dataSource={dataSourceThongTinLanhDaoOptions}
                        remoteOperations={true}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="HoTenLanhDao"
                      />
                    </DataGridColumn>
                    <DataGridColumn
                      dataField="ChucVu"
                      dataType="string"
                      caption="Chức vụ"
                    >
                      <DataGridLookup
                        dataSource={dataSourceChucDanhOptions}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="ChucVi"
                      />
                    </DataGridColumn>
                    <DataGridColumn
                      dataField="PhuTrach"
                      dataType="string"
                      caption="Phụ trách"
                    >
                      <DataGridLookup
                        dataSource={[
                          { Val: 0, Name: "Không" },
                          { Val: 1, Name: "Có" },
                        ]}
                        valueExpr="Val"
                        displayExpr="Name"
                      />
                    </DataGridColumn>
                    <DataGridColumn
                      dataField="Hang"
                      dataType="string"
                      caption="Hàng"
                    />
                    <DataGridColumn
                      dataField="Cot"
                      dataType="string"
                      caption="Cột"
                    />
                  </DataGrid>
                </Tab>
                <Tab title="Danh sách đơn vị trực thuộc">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/CoCauToChucs/Get?filter=[['IDDVCha','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/CoCauToChucs/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/CoCauToChucs/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/CoCauToChucs/Delete`,
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
                      e.data.IDDVCha = rowData.ID;
                    }}
                  >
                    <DataGridFilterRow visible={true} />
                    <DataGridHeaderFilter visible={true} />
                    <DataGridSearchPanel
                      visible={true}
                      highlightCaseSensitive={true}
                    />
                    <DataGridEditing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <DataGridPopup
                        title="Thông tin đơn vị"
                        showTitle={true}
                      />
                      <DataGridForm>
                        <Item dataField="SoThuTu" colSpan={2} />
                      </DataGridForm>
                    </DataGridEditing>
                    <DataGridColumn
                      dataField="TenDonVi"
                      dataType="string"
                      caption="Tên đơn vị"
                    />
                    <DataGridColumn
                      dataField="SoThuTu"
                      dataType="number"
                      caption="Số thứ tự"
                    />
                  </DataGrid>
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>
          <Column dataField="TenDonVi" dataType="string" caption="Tên đơn vị" />
          <Column dataField="ID" dataType="string" caption="ID" width={80} />
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="STT"
            defaultSortOrder={"asc"}
            width={80}
          />
          <Column
            dataField="LinkBaiViet"
            dataType="string"
            caption="Link Bài viết"
          />
          <Column
            dataField="IDLoaiDV"
            dataType="number"
            caption="Loại đơn vị"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={getFilteredLoaiDonVis}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="IDDVCha"
            caption="Cha"
            width={125}
            editCellRender={treeviewEditCellRender}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceCoCauToChucOptions}
              valueExpr="ID"
              displayExpr="TenDonVi"
            />
          </Column>
          <Column
            dataField="ChucNangNhiemVu"
            dataType="string"
            caption="Chức năng nhiệm vụ"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column
            dataField="TenTiengAnh"
            dataType="string"
            caption="Tên tiếng anh"
            visible={false}
          />
          <Column
            dataField="DiaChi"
            dataType="string"
            caption="Địa chỉ"
            visible={false}
          />
          <Column
            dataField="Website"
            dataType="string"
            caption="Website"
            visible={false}
          />
          <Column
            dataField="Phone"
            dataType="string"
            caption="Số điện thoại"
            visible={false}
          />
          <Column
            dataField="Email"
            dataType="string"
            caption="Email"
            visible={false}
          />
          <Column
            dataField="HienThi"
            dataType="string"
            caption="Hiển thị"
            width={80}
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
            dataField="Lang"
            dataType="string"
            caption="Ngôn ngữ"
            width={120}
            setCellValue={(newData, value, currentRowData) => {
              newData.Lang = value;
              newData.IDDVCha = null;
            }}
          >
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
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
