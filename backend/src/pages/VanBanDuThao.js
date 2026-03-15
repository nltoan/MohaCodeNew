
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
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore } from '../utils/api';
import MyFileFileUploader from '../components/MyFileFileUploader';
import { Popup } from 'devextreme-react';

export default function VanBanDuThao() {
  const dataSourceOptions = createCustomStore("VanBanDuThaos");

  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });

  const [title, setTitle] = useState("Quản lý văn bản dự thảo");
  const dataGridRef = useRef(null);

  let rowData;
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
          onEditorPreparing={(e) => {
            if (
              e.parentType === "dataRow" &&
              e.dataField === "ID_HinhThucVanBan"
            ) {
              e.editorOptions.disabled = typeof e.row.data.Lang !== "number";
            }
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
              title="Thông tin văn bản dự thảo"
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
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_Files/Get?filter=[['VanBanDuThaoID','=',${rowData ? rowData.ID : ""}]]`,
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
                      e.data.VanBanDuThaoID = rowData.ID;
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
                <Tab title="Danh sách Góp ý">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_GopYs/Get?filter=[['VanBanDuThaoID','=',${rowData ? rowData.ID : ""}]]`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/VanBanDuThao_GopYs/Put`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    allowAdding={false}
                    allowDeleting={false}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={false}
                      allowDeleting={false}
                    >
                      <Popup title="Thông tin Góp ý" showTitle={true}></Popup>
                      <Form>
                        <Item dataField="NgayGui" colSpan={2} />
                        <Item dataField="HoTen" colSpan={2} />
                        <Item dataField="SoDienThoai" colSpan={2} />
                        <Item dataField="Email" colSpan={2} />
                        <Item dataField="DiaChi" colSpan={2} />
                        <Item dataField="NoiDung" colSpan={2} />
                      </Form>
                    </Editing>
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
                      width={100}
                    >
                      <FormItem
                        colSpan={2}
                        editorOptions={{ readOnly: true }}
                      />
                    </Column>
                    <Column dataField="HoTen" caption="Họ tên">
                      <FormItem
                        colSpan={2}
                        editorOptions={{ readOnly: true }}
                      />
                    </Column>
                    <Column
                      dataField="SoDienThoai"
                      caption="Số điện thoại"
                      width={100}
                    >
                      <FormItem
                        colSpan={2}
                        editorOptions={{ readOnly: true }}
                      />
                    </Column>
                    <Column dataField="Email" caption="Email" width={200}>
                      <FormItem
                        colSpan={2}
                        editorOptions={{ readOnly: true }}
                      />
                    </Column>
                    <Column
                      dataField="DiaChi"
                      caption="Địa chỉ"
                      visible={false}
                    >
                      <FormItem
                        colSpan={2}
                        editorOptions={{ readOnly: true }}
                      />
                    </Column>
                    <Column
                      dataField="NoiDung"
                      caption="Nội dung"
                      visible={false}
                    >
                      <FormItem
                        colSpan={2}
                        editorType="dxHtmlEditor"
                        editorOptions={{ readOnly: true }}
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
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
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
          />
          <Column
            dataField="NgayHetHanLayYKien"
            dataType="date"
            caption="Ngày hết hạn lấy ý kiến"
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
            dataField="VanBanDuThao_CoQuanBanHanhs"
            allowSearch={false}
            dataType="string"
            caption="Cơ quan ban hành"
            visible={false}
            calculateCellValue={(e) => {
              return e.VanBanDuThao_CoQuanBanHanhs?.map((x) => x.CoQuanID);
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
            dataField="VanBanDuThao_LinhVucs"
            allowSearch={false}
            dataType="string"
            caption="Lĩnh vực"
            visible={false}
            calculateCellValue={(e) => {
              return e.VanBanDuThao_LinhVucs?.map((x) => x.LinhVucID);
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
