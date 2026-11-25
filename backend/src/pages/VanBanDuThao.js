
import { useState, useRef } from 'react';
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
  RequiredRule,
  CustomRule,
  Button as DataGridButton,
  Toolbar,
  Item as GridToolbarItem,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import TabPanel from 'devextreme/ui/tab_panel';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore, notify } from '../utils/api';
import { exportButtonOptions } from '../utils/exportCsv';
import MyFileFileUploader from '../components/MyFileFileUploader';
import GopYChiTietPopup from '../components/GopYChiTietPopup';
import { Popup } from 'devextreme-react';

const dataSourceOptions = createCustomStore("VanBanDuThaos");
const dataSourceFileOptions = createLookupStore({
  loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
});

function startOfDay(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}

// Tinh trang lay y kien theo ngay bat dau / ngay het han.
const TINH_TRANG = {
  chua: { text: "Chưa mở", color: "#6c757d" },
  dang: { text: "Đang lấy ý kiến", color: "#28a745" },
  het: { text: "Đã hết hạn", color: "#dc3545" },
};

function tinhTrangLayYKien(row) {
  const today = startOfDay(new Date());
  const start = startOfDay(row.NgayBatDauLayYKien);
  const end = startOfDay(row.NgayHetHanLayYKien);
  if (end && today > end) return "het";
  if (start && today < start) return "chua";
  if (!start && !end) return null;
  return "dang";
}

// Lay ma (ID) tu phan tu bang noi (object tu server) hoac gia tri da chon tren form (so).
function joinIds(list, key) {
  return Array.isArray(list) ? list.map((x) => (x && typeof x === "object" ? x[key] : x)) : list;
}

// Noi dung tab chi hien khi du thao da duoc luu (co ID); ban ghi moi thi hien huong dan.
function SavedRecordOnly({ rowDataRef, message, children }) {
  if (rowDataRef.current && rowDataRef.current.ID) return children;
  return (
    <div className="alert alert-info" style={{ margin: 16 }}>
      <i className="fas fa-info-circle" /> {message}
    </div>
  );
}

export default function VanBanDuThao() {


  const [title] = useState("Quản lý văn bản dự thảo");
  const dataGridRef = useRef(null);
  const gopYGridRef = useRef(null);
  const gopYPopupRef = useRef(null);

  const rowDataRef = useRef();
  // ID cua du thao vua them moi: khi popup mo lai de sua thi chuyen sang tab file dinh kem.
  const justInsertedKeyRef = useRef(null);
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

  function getFilteredCoQuanBanHanhVanBan(options) {
    return createFilterLookupStore(
      "CoQuanBanHanhs",
      options.data ? ["Lang", "=", options.data.Lang] : null,
    );
  }

  function tenDuThaoHienTai() {
    const row = rowDataRef.current;
    return row ? row.TieuDe || row.TrichYeu || `Dự thảo ${row.ID}` : "";
  }

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
            const start = startOfDay(new Date());
            const end = new Date(start);
            end.setDate(end.getDate() + 60);
            e.data.NgayBatDauLayYKien = start;
            e.data.NgayHetHanLayYKien = end;
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
            placeholder="Tìm tiêu đề, trích yếu..."
          />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <DataGridPopup
              title="Thông tin văn bản dự thảo"
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
                  <Item dataField="ID_HinhThucVanBan" colSpan={2} />
                  <Item
                    dataField="VanBanDuThao_CoQuanBanHanhs"
                    editorType="dxTagBox"
                    colSpan={2}
                  />
                  <Item
                    dataField="VanBanDuThao_LinhVucs"
                    isRequired={true}
                    editorType="dxTagBox"
                    colSpan={2}
                  />
                  <Item dataField="TieuDe" isRequired={true} colSpan={2} />
                  <Item
                    dataField="TrichYeu"
                    editorType="dxTextArea"
                    isRequired={true}
                    colSpan={2}
                  />
                  <Item
                    dataField="NgayBatDauLayYKien"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item
                    dataField="NgayHetHanLayYKien"
                    editorOptions={config.dateBoxOptions}
                  />
                  <Item dataField="NoiDung" />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <SavedRecordOnly
                    rowDataRef={rowDataRef}
                    message="Bấm Lưu để tạo dự thảo, sau đó đính kèm file tại đây."
                  >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_Files/Get?filter=[['VanBanDuThaoID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_Files/Delete`,
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
                      e.data.VanBanDuThaoID = rowDataRef.current ? rowDataRef.current.ID : null;
                    }}
                    onRowInserting={(e) => {
                      if (!e.data.VanBanDuThaoID) {
                        e.cancel = true;
                        notify("Hãy lưu dự thảo trước.", "warning");
                      }
                    }}
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
                <Tab title="Danh sách Góp ý">
                  <SavedRecordOnly
                    rowDataRef={rowDataRef}
                    message="Dự thảo chưa được lưu nên chưa có góp ý."
                  >
                  <DataGrid
                    ref={gopYGridRef}
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_GopYs/Get?filter=[['VanBanDuThaoID','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowDblClick={(e) => {
                      if (e.rowType === "data") gopYPopupRef.current.open(e.data, tenDuThaoHienTai());
                    }}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} placeholder="Tìm kiếm..." />
                    <Toolbar>
                      <GridToolbarItem
                        location="after"
                        widget="dxButton"
                        options={exportButtonOptions(
                          () => gopYGridRef.current.instance,
                          `gop-y-du-thao-${rowDataRef.current ? rowDataRef.current.ID : ""}-${tenDuThaoHienTai()}`,
                          { columns: ["ID", "NgayGui", "HoTen", "SoDienThoai", "Email", "DiaChi", "NoiDung"] },
                        )}
                      />
                      <GridToolbarItem name="searchPanel" />
                    </Toolbar>
                    <Column type="buttons" width={60}>
                      <DataGridButton
                        hint="Xem chi tiết"
                        icon="info"
                        onClick={(e) => gopYPopupRef.current.open(e.row.data, tenDuThaoHienTai())}
                      />
                    </Column>
                    <Column
                      dataField="ID"
                      caption="ID"
                      width={70}
                      defaultSortOrder={"asc"}
                    />
                    <Column
                      dataField="NgayGui"
                      dataType="date"
                      caption="Ngày gửi"
                      format={"dd/MM/yyyy"}
                      width={100}
                    />
                    <Column dataField="HoTen" caption="Họ tên" />
                    <Column
                      dataField="SoDienThoai"
                      caption="Số điện thoại"
                      width={110}
                    />
                    <Column dataField="Email" caption="Email" width={200} />
                    <Column
                      dataField="DiaChi"
                      caption="Địa chỉ"
                      visible={false}
                    />
                    <Column
                      dataField="NoiDung"
                      caption="Nội dung"
                      visible={false}
                    />
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
            dataField="TrangThai"
            dataType="string"
            caption="Trạng thái"
            width={80}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không xuất bản" },
                { Val: 1, Name: "Xuất bản" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" minWidth={260} />
          <Column
            dataField="TrichYeu"
            dataType="string"
            caption="Trích yếu"
            width={150}
          />
          <Column
            dataField="NgayBatDauLayYKien"
            dataType="date"
            caption="Ngày bắt đầu lấy ý kiến"
            format={"dd/MM/yyyy"}
            width={80}
            setCellValue={(newData, value) => {
              newData.NgayBatDauLayYKien = value;
            }}
          >
            <RequiredRule message="Hãy nhập ngày bắt đầu lấy ý kiến" />
          </Column>
          <Column
            dataField="NgayHetHanLayYKien"
            dataType="date"
            caption="Ngày hết hạn lấy ý kiến"
            format={"dd/MM/yyyy"}
            width={80}
          >
            <RequiredRule message="Hãy nhập ngày hết hạn lấy ý kiến" />
            <CustomRule
              message="Ngày hết hạn phải bằng hoặc sau ngày bắt đầu lấy ý kiến"
              reevaluate={true}
              validationCallback={(e) => {
                const start = startOfDay(e.data && e.data.NgayBatDauLayYKien);
                const end = startOfDay(e.value);
                return !start || !end || end >= start;
              }}
            />
          </Column>
          <Column
            name="TinhTrangLayYKien"
            caption="Tình trạng lấy ý kiến"
            width={130}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            allowSearch={false}
            allowEditing={false}
            showInColumnChooser={false}
            calculateCellValue={tinhTrangLayYKien}
            cellRender={(cell) => {
              const info = TINH_TRANG[cell.value];
              if (!info) return null;
              return (
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 10,
                    color: "#fff",
                    background: info.color,
                    fontSize: "0.85em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {info.text}
                </span>
              );
            }}
          >
            <FormItem visible={false} />
          </Column>
          <Column
            dataField="ID_HinhThucVanBan"
            dataType="string"
            caption="Loại văn bản"
            visible={false}
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
            dataField="Lang"
            dataType="number"
            caption="Ngôn ngữ"
            setCellValue={(newData, value, currentRowData) => {
              newData.Lang = value;
              if (currentRowData && currentRowData.Lang === value) return;
              // Danh muc phu thuoc ngon ngu: doi ngon ngu thi chon lai.
              newData.ID_HinhThucVanBan = null;
              newData.VanBanDuThao_CoQuanBanHanhs = [];
              newData.VanBanDuThao_LinhVucs = [];
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
            dataField="VanBanDuThao_CoQuanBanHanhs"
            allowSearch={false}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            dataType="string"
            caption="Cơ quan ban hành"
            visible={false}
            calculateCellValue={(e) => joinIds(e.VanBanDuThao_CoQuanBanHanhs, "CoQuanID")}
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
            dataField="VanBanDuThao_LinhVucs"
            allowSearch={false}
            allowFiltering={false}
            allowHeaderFiltering={false}
            allowSorting={false}
            dataType="string"
            caption="Lĩnh vực"
            visible={false}
            calculateCellValue={(e) => joinIds(e.VanBanDuThao_LinhVucs, "LinhVucID")}
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
        <GopYChiTietPopup ref={gopYPopupRef} />
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
