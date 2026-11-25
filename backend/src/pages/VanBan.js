import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import DataGrid, {
  Column,
  ColumnChooser,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Lookup,
  Form,
  FormItem,
  FilterRow, HeaderFilter,
  Toolbar,
  Item as GridToolbarItem,
} from 'devextreme-react/data-grid';
import { TabbedItem, Tab, Item } from 'devextreme-react/form';
import DataSource from 'devextreme/data/data_source';
import TabPanel from 'devextreme/ui/tab_panel';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore, request, notify } from '../utils/api';
import { exportButtonOptions } from '../utils/exportCsv';
import MyFileFileUploader from '../components/MyFileFileUploader';
import { Popup } from 'devextreme-react';

const dataSourceFileOptions = createLookupStore({
  loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
});

const dataSourceVanBans = createLookupStore("VanBans");
const dataSourceVanBans2 = createLookupStore("VanBans");

// Bo loc "Co quan ban hanh" tren thanh cong cu: loc phia server qua tham so CoQuanBanHanhID
// (cot nhieu gia tri nen khong loc duoc bang bo loc chuan cua luoi).
const coQuanFilterSource = new DataSource({
  store: createLookupStore("CoQuanBanHanhs"),
  paginate: true,
  pageSize: 50,
  sort: "TenCoQuanBanHanh",
});

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function shorten(text, max) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// Nhan hien thi cua van ban trong o chon van ban lien quan / bi tac dong.
function formatVanBanLabel(item) {
  if (!item) return "";
  return [item.SoKyHieu, shorten(item.TrichYeu, 80), formatDate(item.NgayBanHanh)]
    .filter(Boolean)
    .join(" – ");
}

// Nguon du lieu cho o chon van ban: tim theo so ky hieu / trich yeu, bo van ban dang sua.
function createVanBanPickerSource(currentId) {
  return new DataSource({
    store: dataSourceVanBans,
    paginate: true,
    pageSize: 30,
    sort: [{ selector: "ID", desc: true }],
    filter: currentId ? ["ID", "<>", currentId] : null,
  });
}

function setupVanBanPicker(e, fieldName, rowDataRef) {
  if (e.parentType !== "dataRow" || e.dataField !== fieldName) return;
  const currentId = rowDataRef.current ? rowDataRef.current.ID : null;
  e.editorName = "dxSelectBox";
  e.editorOptions.dataSource = createVanBanPickerSource(currentId);
  e.editorOptions.valueExpr = "ID";
  e.editorOptions.displayExpr = formatVanBanLabel;
  e.editorOptions.searchEnabled = true;
  e.editorOptions.searchExpr = ["SoKyHieu", "TrichYeu"];
  e.editorOptions.showClearButton = true;
  e.editorOptions.placeholder = "Gõ số ký hiệu hoặc trích yếu để tìm...";
  e.editorOptions.noDataText = "Không tìm thấy văn bản";
}

// Lay ma (ID) tu phan tu bang noi (object tu server) hoac gia tri da chon tren form (so).
function joinIds(list, key) {
  return Array.isArray(list) ? list.map((x) => (x && typeof x === "object" ? x[key] : x)) : list;
}

// Noi dung tab chi hien khi van ban da duoc luu (co ID); van ban moi thi hien huong dan.
function SavedRecordOnly({ rowDataRef, message, children }) {
  if (rowDataRef.current && rowDataRef.current.ID) return children;
  return (
    <div className="alert alert-info" style={{ margin: 16 }}>
      <i className="fas fa-info-circle" /> {message}
    </div>
  );
}

function blockInsertWithoutParent(e, parentField) {
  if (!e.data[parentField]) {
    e.cancel = true;
    notify("Hãy lưu văn bản trước.", "warning");
  }
}

export default function VanBan() {
  const [dataSourceOptions, setDataSourceOptions] = useState(
    createCustomStore("VanBans"),
  );
  const [title, setTitle] = useState("Quản lý văn bản");
  const [chucDanhOptions, setChucDanhOptions] = useState([]);
  const [nguoiKyOptions, setNguoiKyOptions] = useState([]);
  const [coQuanFilter, setCoQuanFilter] = useState(null);
  const { IdLopVanBan } = useParams();
  const dataGridRef = useRef(null);

  const rowDataRef = useRef();
  // ID cua van ban vua them moi: khi popup mo lai de sua thi chuyen sang tab file dinh kem.
  const justInsertedKeyRef = useRef(null);
  React.useEffect(() => {
    let loadUrl = `${window.env.REACT_APP_API_URL}/VanBans/Get?LopVanBanID=${IdLopVanBan}`;
    if (coQuanFilter) {
      loadUrl += `&CoQuanBanHanhID=${encodeURIComponent(coQuanFilter)}`;
    }
    setDataSourceOptions(
      createCustomStore({
        loadUrl: loadUrl,
        insertUrl: `${window.env.REACT_APP_API_URL}/VanBans/Post`,
        updateUrl: `${window.env.REACT_APP_API_URL}/VanBans/Put`,
        deleteUrl: `${window.env.REACT_APP_API_URL}/VanBans/Delete`,
      }),
    );
    if (IdLopVanBan == "101") {
      setTitle("Danh sách văn bản QPPL");
    } else if (IdLopVanBan == "104") {
      setTitle("Danh sách văn bản CĐĐH");
    } else if (IdLopVanBan == "2125") {
      setTitle("Danh sách văn bản Hợp tác quốc tế");
    }
  }, [IdLopVanBan, coQuanFilter]);
  function getFilteredHinhThucVanBan(options) {
    return createFilterLookupStore(
      "HinhThucVanBans",
      options.data ? ["Lang", "=", options.data.Lang] : null,
    );
  }

  function getFilteredLinhVucVanBan(options) {
    return createFilterLookupStore(
      "LinhVucs",
      options.data ? ["Lang", "=", options.data.Lang] : null,
    );
  }
  function getFilteredLopVanBanVanBan(options) {
    return createFilterLookupStore(
      "LopVanBans",
      options.data ? ["Lang", "=", options.data.Lang] : null,
    );
  }
  function getFilteredCoQuanBanHanhVanBan(options) {
    return createFilterLookupStore(
      "CoQuanBanHanhs",
      options.data ? ["Lang", "=", options.data.Lang] : null,
    );
  }

  React.useEffect(() => {
    const getChucDanh = async function () {
      const items = await request(`/VanBans/GetLookUpChucDanh`);
      setChucDanhOptions(items?.data);
    };
    const getNguoiKy = async function () {
      const items = await request(`/VanBans/GetLookUpNguoiKy`);
      setNguoiKyOptions(items?.data);
    };
    getChucDanh();
    getNguoiKy();
  }, []);

  const onChucDanhItemCreating = useCallback((args) => {
    const newValue = { Name: args.text };
    args.customItem = newValue;
    setChucDanhOptions((prev) => [...(prev || []), newValue]);
  }, []);

  const onNguoiKyItemCreating = useCallback((args) => {
    const newValue = { Name: args.text };
    args.customItem = newValue;
    setNguoiKyOptions((prev) => [...(prev || []), newValue]);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
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
          repaintChangesOnly={true}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          wordWrapEnabled={true}
          height="calc(100vh - 190px)"
          onInitNewRow={(e) => {
            rowDataRef.current = null;
            justInsertedKeyRef.current = null;
            e.data.Lang = 1066;
            e.data.NgayXuatBan = new Date();
            if (IdLopVanBan != 2125) {
              e.data.VanBan_LopVanBan = [{ LopVanBanID: IdLopVanBan }];
            }
          }}
          onRowInserting={(e) => {
            e.data.VanBan_LopVanBan = (e.data.VanBan_LopVanBan || []).map((x) =>
              x && x.LopVanBanID ? x.LopVanBanID : x,
            );
          }}
          onEditingStart={(e) => {
            rowDataRef.current = e.data;
          }}
          onEditorPreparing={(e) => {
            if (
              e.parentType === "dataRow" &&
              e.dataField === "ID_HinhThucVanBan"
            ) {
              e.editorOptions.disabled = typeof e.row.data.Lang !== "number";
            }
          }}
          onRowInserted={(e) => {
            justInsertedKeyRef.current = e.key;
            e.component.navigateToRow(e.key).done(function () {
              var rowindex = e.component.getRowIndexByKey(e.key);
              e.component.editRow(rowindex);
            });
          }}
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel
            visible={true}
            width={260}
            placeholder="Tìm số ký hiệu, trích yếu..."
          />
          <ColumnChooser enabled={true} mode="select" title="Chọn cột hiển thị" />
          <Toolbar>
            <GridToolbarItem
              location="before"
              widget="dxSelectBox"
              options={{
                dataSource: coQuanFilterSource,
                valueExpr: "ID",
                displayExpr: (item) =>
                  item
                    ? item.TenCoQuanBanHanh + (item.Lang === 1033 ? " (EN)" : "")
                    : "",
                searchEnabled: true,
                searchExpr: "TenCoQuanBanHanh",
                showClearButton: true,
                placeholder: "Lọc theo cơ quan ban hành",
                width: 280,
                value: coQuanFilter,
                onValueChanged: (e) => setCoQuanFilter(e.value || null),
              }}
            />
            <GridToolbarItem name="addRowButton" />
            <GridToolbarItem
              location="after"
              widget="dxButton"
              options={exportButtonOptions(
                () => dataGridRef.current.instance,
                title,
              )}
            />
            <GridToolbarItem name="columnChooserButton" />
            <GridToolbarItem name="searchPanel" />
          </Toolbar>
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <DataGridPopup
              title="Thông tin văn bản"
              showTitle={true}
              fullScreen={true}
            />
            <Form
              onInitialized={(e) => {
                const row = rowDataRef.current;
                if (
                  row &&
                  row.ID &&
                  justInsertedKeyRef.current != null &&
                  justInsertedKeyRef.current == row.ID
                ) {
                  justInsertedKeyRef.current = null;
                  notify("Đã lưu. Bây giờ bạn có thể đính kèm file.", "success");
                  const form = e.component;
                  setTimeout(() => {
                    const root = form.element();
                    const node = root && root.querySelector ? root : root && root[0];
                    const el = node && node.querySelector(".dx-tabpanel");
                    const tabPanel = el && TabPanel.getInstance(el);
                    if (tabPanel) tabPanel.option("selectedIndex", 1);
                  }, 0);
                }
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="Lang" isRequired={true} />
                  <Item dataField="TrangThai" isRequired={true} />
                  <Item
                    dataField="SoKyHieu"
                    isRequired={true}
                    colSpan={IdLopVanBan != "104" ? 1 : 2}
                  />
                  <Item
                    dataField="ID_HinhThucVanBan"
                  />
                  <Item
                    dataField="TrichYeu"
                    editorType="dxTextArea"
                    isRequired={true}
                    colSpan={2}
                  />
                  <Item
                    dataField="NguoiKy"
                    isRequired={IdLopVanBan != "104"}
                    visible={IdLopVanBan != "2125"}
                    editorType="dxSelectBox"
                    editorOptions={{
                      dataSource: nguoiKyOptions,
                      valueExpr: "Name",
                      displayExpr: "Name",
                      searchEnabled: true,
                      acceptCustomValue: true,
                      onCustomItemCreating: onNguoiKyItemCreating,
                    }}
                  />
                  <Item
                    dataField="ChucDanh"
                    isRequired={IdLopVanBan != "104"}
                    visible={IdLopVanBan != "2125"}
                    editorType="dxSelectBox"
                    editorOptions={{
                      dataSource: chucDanhOptions,
                      valueExpr: "Name",
                      displayExpr: "Name",
                      searchEnabled: true,
                      acceptCustomValue: true,
                      onCustomItemCreating: onChucDanhItemCreating,
                    }}
                  />
                  <Item
                    dataField="NgayBanHanh"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item
                    dataField="NgayCoHieuLuc"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan != "104"}
                  />
                  <Item
                    dataField="NgayHetHan"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "101"}
                  />
                  <Item
                    dataField="NgayHetHieuLuc1Phan"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "101"}
                  />
                  <Item
                    dataField="NgayXuatBan"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item
                    dataField="NgayCapNhat"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item dataField="VanBanConHieuLuc" visible={false} />
                  <Item
                    dataField="VanBan_LopVanBan"
                    isRequired={true}
                    editorType="dxTagBox"
                    colSpan={2}
                    visible={IdLopVanBan == "2125"}
                  />
                  <Item
                    dataField="VanBan_CoQuanBanHanh"
                    editorType="dxTagBox"
                    colSpan={2}
                  />
                  <Item
                    dataField="VanBan_LinhVuc"
                    isRequired={true}
                    editorType="dxTagBox"
                    colSpan={2}
                  />
                  <Item
                    dataField="NgayKyKet"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "2125"}
                  />
                  <Item
                    dataField="NgayCongBo"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "2125"}
                  />
                  <Item
                    dataField="NgayGiaNhap"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "2125"}
                  />
                  <Item
                    dataField="NgayCoHLVietNam"
                    editorOptions={config.dateBoxOptions}
                    visible={IdLopVanBan == "2125"}
                  />
                  <Item dataField="TinhTrang" visible={IdLopVanBan == "2125"} />
                  <Item dataField="NoiDung" />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <SavedRecordOnly
                    rowDataRef={rowDataRef}
                    message="Bấm Lưu để tạo văn bản, sau đó đính kèm file tại đây."
                  >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_Files/Get?filter=[['VanBanID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/VanBan_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/VanBan_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/VanBan_Files/Delete`,
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
                      e.data.VanBanID = rowDataRef.current ? rowDataRef.current.ID : null;
                    }}
                    onRowInserting={(e) => blockInsertWithoutParent(e, "VanBanID")}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} placeholder="Tìm kiếm..." />
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
                  </SavedRecordOnly>
                </Tab>
                <Tab title="Văn bản liên quan">
                  <SavedRecordOnly
                    rowDataRef={rowDataRef}
                    message="Bấm Lưu để tạo văn bản, sau đó thêm văn bản liên quan tại đây."
                  >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_LienQuan/Get?filter=[['VanBanID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/VanBan_LienQuan/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/VanBan_LienQuan/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/VanBan_LienQuan/Delete`,
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
                      e.data.VanBanID = rowDataRef.current ? rowDataRef.current.ID : null;
                    }}
                    onRowInserting={(e) => blockInsertWithoutParent(e, "VanBanID")}
                    onEditorPreparing={(e) => setupVanBanPicker(e, "LienQuanID", rowDataRef)}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} placeholder="Tìm kiếm..." />
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <DataGridPopup
                        title="Thông tin văn bản liên quan"
                        showTitle={true}
                      />
                      <Form>
                        <Item dataField="LienQuanID" isRequired={true} colSpan={2} />
                      </Form>
                    </Editing>
                    <Column
                      dataField="LienQuanID"
                      dataType="string"
                      caption="Văn bản liên quan"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceVanBans}
                        remoteOperations={true}
                        valueExpr="ID"
                        displayExpr={formatVanBanLabel}
                      />
                    </Column>
                  </DataGrid>
                  </SavedRecordOnly>
                </Tab>
                <Tab title="Văn bản bị tác động">
                  <SavedRecordOnly
                    rowDataRef={rowDataRef}
                    message="Bấm Lưu để tạo văn bản, sau đó thêm văn bản bị tác động tại đây."
                  >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_BiTacDong/Get?filter=[['VanBanID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/VanBan_BiTacDong/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/VanBan_BiTacDong/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/VanBan_BiTacDong/Delete`,
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
                      e.data.VanBanID = rowDataRef.current ? rowDataRef.current.ID : null;
                    }}
                    onRowInserting={(e) => blockInsertWithoutParent(e, "VanBanID")}
                    onEditorPreparing={(e) => setupVanBanPicker(e, "BiTacDongID", rowDataRef)}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} placeholder="Tìm kiếm..." />
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <DataGridPopup
                        title="Thông tin văn bản bị tác động"
                        showTitle={true}
                      />
                      <Form>
                        <Item dataField="BiTacDongID" isRequired={true} colSpan={2} />
                      </Form>
                    </Editing>
                    <Column
                      dataField="BiTacDongID"
                      dataType="string"
                      caption="Văn bản bị tác động"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceVanBans2}
                        remoteOperations={true}
                        valueExpr="ID"
                        displayExpr={formatVanBanLabel}
                      />
                    </Column>
                  </DataGrid>
                  </SavedRecordOnly>
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
            width={60}
          />
          <Column
            dataField="SoKyHieu"
            dataType="string"
            caption="Số ký hiệu"
            width={IdLopVanBan != "104" ? 150 : null}
            minWidth={IdLopVanBan != "104" ? undefined : 280}
          />
          <Column
            dataField="TrichYeu"
            dataType="string"
            caption="Trích yếu"
            width={IdLopVanBan == "104" ? 150 : null}
            minWidth={IdLopVanBan == "104" ? undefined : 280}
          />
          <Column
            dataField="NgayBanHanh"
            dataType="date"
            caption="Ngày ban hành"
            format={"dd/MM/yyyy"}
            width={80}
          />
          <Column
            dataField="NgayXuatBan"
            dataType="date"
            caption="Ngày xuất bản"
            format={"dd/MM/yyyy"}
            width={80}
          />
          <Column
            dataField="ID_HinhThucVanBan"
            dataType="string"
            caption="Loại văn bản"
            width={140}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={getFilteredHinhThucVanBan}
              valueExpr="ID"
              displayExpr="TenHinhThucVanBan"
            />
          </Column>
          <Column
            dataField="NguoiKy"
            dataType="string"
            caption="Người ký"
            visible={false}
          />
          <Column
            dataField="NgayCoHieuLuc"
            dataType="date"
            caption="Ngày có hiệu lực"
            format={"dd/MM/yyyy"}
            visible={false}
          />
          <Column
            dataField="NgayHetHan"
            dataType="date"
            caption="Ngày hết hiệu lực"
            format={"dd/MM/yyyy"}
            visible={false}
          />
          <Column
            dataField="NgayCapNhat"
            dataType="date"
            caption="Ngày cập nhật"
            format={"dd/MM/yyyy"}
            visible={false}
          />
          <Column
            dataField="VanBanLienQuan"
            dataType="string"
            caption="Văn bản liên quan"
            visible={false}
          />
          <Column
            dataField="FileDinhKem"
            dataType="string"
            caption="File đính kèm"
            visible={false}
          />
          <Column
            dataField="TrangThai"
            dataType="string"
            caption="Trạng thái"
            width={80}
          >
            <Lookup
              allowClearing={true}
              allowAdding={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không xuất bản" },
                { Val: 1, Name: "Xuất bản" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="Lang"
            dataType="number"
            caption="Ngôn ngữ"
            setCellValue={(newData, value, currentRowData) => {
              newData.Lang = value;
              if (currentRowData && currentRowData.Lang === value) return;
              // Danh muc phu thuoc ngon ngu: doi ngon ngu thi chon lai.
              newData.ID_HinhThucVanBan = null;
              newData.VanBan_LinhVuc = [];
              newData.VanBan_CoQuanBanHanh = [];
              if (IdLopVanBan == "2125") {
                newData.VanBan_LopVanBan = [];
              }
            }}
            width={90}
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
          <Column
            dataField="NoiDung"
            dataType="string"
            caption="Nội dung"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorMediumOptions}
            />
          </Column>
          <Column
            dataField="VanBanConHieuLuc"
            dataType="string"
            caption="Văn bản còn hiệu lực"
            visible={false}
          />
          <Column
            dataField="GhiChu"
            dataType="string"
            caption="Ghi chú"
            visible={false}
          />
          <Column
            dataField="NgayHetHieuLuc1Phan"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày hết hiệu lực 1 phần"
            visible={false}
          />
          <Column
            dataField="VanBanBiTacDongHieuLuc1Phan"
            dataType="string"
            caption="Văn bản bị tác động hiệu lực 1 phần"
            visible={false}
          />
          <Column
            dataField="ChucDanh"
            dataType="string"
            caption="Chức danh"
            visible={false}
          />
          <Column
            dataField="NgayKyKet"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày ký kết"
            visible={false}
          />
          <Column
            dataField="NgayCongBo"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày công bố"
            visible={false}
          />
          <Column
            dataField="NgayGiaNhap"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày gia nhập"
            visible={false}
          />
          <Column
            dataField="NgayCoHLVietNam"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Ngày có hiệu lực VN"
            visible={false}
          />
          <Column
            dataField="TinhTrang"
            dataType="number"
            caption="Tình trạng"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Việt Nam chưa ký/gia nhập" },
                { Val: 1, Name: "Việt Nam đang gia nhập" },
                { Val: 2, Name: "Việt Nam đã ký/gia nhập" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="FileGoc"
            dataType="string"
            caption="FileGoc"
            visible={false}
          />
          <Column
            dataField="VanBan_LopVanBan"
            dataType="string"
            caption="Lớp văn bản"
            visible={false}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            allowSearch={false}
            calculateCellValue={(e) => joinIds(e.VanBan_LopVanBan, "LopVanBanID")}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={getFilteredLopVanBanVanBan}
              valueExpr="ID"
              displayExpr="TenLopVanBan"
            />
          </Column>
          <Column
            dataField="VanBan_CoQuanBanHanh"
            allowSearch={false}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            dataType="string"
            caption="Cơ quan ban hành"
            width={200}
            calculateCellValue={(e) => joinIds(e.VanBan_CoQuanBanHanh, "CoQuanBanHanhID")}
            cellRender={(cell) => {
              // Cot nhieu gia tri: tra ten tung co quan qua lookup cua cot.
              const ids = Array.isArray(cell.value) ? cell.value : [];
              const lookup = cell.column && cell.column.lookup;
              const hasLookup = lookup && typeof lookup.calculateCellValue === "function";
              return ids
                .map((id) => (hasLookup && lookup.calculateCellValue(id)) || id)
                .join(", ");
            }}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={getFilteredCoQuanBanHanhVanBan}
              valueExpr="ID"
              displayExpr="TenCoQuanBanHanh"
            />
          </Column>
          <Column
            dataField="VanBan_LinhVuc"
            allowSearch={false}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            dataType="string"
            caption="Lĩnh vực"
            visible={false}
            calculateCellValue={(e) => joinIds(e.VanBan_LinhVuc, "LinhVucID")}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={getFilteredLinhVucVanBan}
              valueExpr="ID"
              displayExpr="TenLinhVuc"
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
