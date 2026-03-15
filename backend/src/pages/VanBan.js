import React, { useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router';
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
import { TabbedItem, Tab, Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore,request } from '../utils/api';
import MyFileFileUploader from '../components/MyFileFileUploader';
import { Popup } from 'devextreme-react';

export default function VanBan() {
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  const [dataSourceOptions, setDataSourceOptions] = useState(
    createCustomStore("VanBans"),
  );
  const [title, setTitle] = useState("Quản lý văn bản");
  const [chucDanhOptions, setChucDanhOptions] = useState([]);
  const [nguoiKyOptions, setNguoiKyOptions] = useState([]);
  const { IdLopVanBan } = useParams();
  const dataGridRef = useRef(null);

  let rowData;
  React.useEffect(() => {
    setDataSourceOptions(
      createCustomStore({
        loadUrl: `${window.env.REACT_APP_API_URL}/VanBans/Get?LopVanBanID=${IdLopVanBan}`,
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
  }, [IdLopVanBan]);
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
      setChucDanhOptions(items.data);
    };
    const getNguoiKy = async function () {
      const items = await request(`/VanBans/GetLookUpNguoiKy`);
      setNguoiKyOptions(items.data);
    };
    getChucDanh();
    getNguoiKy();
  }, []);

  const onChucDanhItemCreating = useCallback((args) => {
    const newValue = { Name: args.text };
    args.customItem = newValue;
    chucDanhOptions.push(newValue);
  }, []);

  const onNguoiKyItemCreating = useCallback((args) => {
    const newValue = { Name: args.text };
    args.customItem = newValue;
    nguoiKyOptions.push(newValue);
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
            if (IdLopVanBan != 2125) {
              e.data.VanBan_LopVanBan = [{ LopVanBanID: IdLopVanBan }];
            }
          }}
          onRowInserting={(e) => {
            e.data.VanBan_LopVanBan = e.data.VanBan_LopVanBan.map((x) =>
              x.LopVanBanID ? x.LopVanBanID : x,
            );
          }}
          onEditingStart={(e) => {
            rowData = e.data;
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
            setChucDanhOptions(chucDanhOptions);
            setNguoiKyOptions(nguoiKyOptions);
            e.component.navigateToRow(e.key).done(function () {
              var rowindex = e.component.getRowIndexByKey(e.key);
              e.component.editRow(rowindex);
            });
          }}
          onRowUpdated={(e) => {
            setChucDanhOptions(chucDanhOptions);
            setNguoiKyOptions(nguoiKyOptions);
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
              title="Thông tin văn bản"
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
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_Files/Get?filter=[['VanBanID','=',${rowData ? rowData.ID : ""}]]`,
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
                      e.data.VanBanID = rowData.ID;
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
                <Tab title="Văn bản liên quan">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_LienQuan/Get?filter=[['VanBanID','=',${rowData ? rowData.ID : ""}]]`,
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
                      e.data.VanBanID = rowData.id;
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
                        title="Thông tin văn bản liên quan"
                        showTitle={true}
                      />
                      <Form>
                        <Item dataField="LienQuanID" />
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
                        dataSource={createLookupStore("VanBans")}
                        remoteOperations={true}
                        valueExpr="ID"
                        displayExpr="SoKyHieu"
                      />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Văn bản bị tác động">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBan_BiTacDong/Get?filter=[['VanBanID','=',${rowData ? rowData.ID : ""}]]`,
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
                      e.data.VanBanID = rowData.id;
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
                        title="Thông tin văn bản bị tác động"
                        showTitle={true}
                      />
                      <Form>
                        <Item dataField="BiTacDongID" />
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
                        dataSource={createLookupStore("VanBans")}
                        remoteOperations={true}
                        valueExpr="ID"
                        displayExpr="SoKyHieu"
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
            width={60}
          />
          <Column
            dataField="SoKyHieu"
            dataType="string"
            caption="Số ký hiệu"
            width={IdLopVanBan != "104" ? 150 : null}
          />
          <Column
            dataField="TrichYeu"
            dataType="string"
            caption="Trích yếu"
            width={IdLopVanBan == "104" ? 150 : null}
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
              newData.ID_HinhThucVanBan = null;
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
            calculateCellValue={(e) => {
              return e.VanBan_LopVanBan?.map((x) => x.LopVanBanID);
            }}
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
            dataType="string"
            caption="Cơ quan ban hành"
            visible={false}
            calculateCellValue={(e) => {
              return e.VanBan_CoQuanBanHanh?.map((x) => x.CoQuanBanHanhID);
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
            dataType="string"
            caption="Lĩnh vực"
            visible={false}
            calculateCellValue={(e) => {
              return e.VanBan_LinhVuc?.map((x) => x.LinhVucID);
            }}
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
