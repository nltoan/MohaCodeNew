import { useMemo, useRef } from "react";
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FilterRow, 
  HeaderFilter,
  RequiredRule,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore, notify } from '../utils/api';
import MyImageFileUploader from '../components/MyImageFileUploader';
import MyFileFileUploader from '../components/MyFileFileUploader';
import ImageLookup from '../components/ImageLookup';

const dataSourceABLChuyenMucAlbumOptions = createLookupStore("ABL_ChuyenMucAlbumAnh");
const dataSourceFileWithPathOptions = createLookupStore({
  loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetFilePath`,
});

const dataSourceABL_AlbumAnh = createCustomStore("ABL_AlbumAnh");

export default function ABL_AlbumAnh() {
  const rowDataRef = useRef();
  // Sau lan luu dau tien (them moi) popup mo lai o che do sua: chuyen thang sang the danh sach file.
  const openFilesTabRef = useRef(false);
  const tabPanelOptions = useMemo(() => ({
    onInitialized: (ev) => {
      if (!openFilesTabRef.current) return;
      openFilesTabRef.current = false;
      setTimeout(() => ev.component.option("selectedIndex", 1), 0);
    },
  }), []);
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý album</h3>
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
          dataSource={dataSourceABL_AlbumAnh}
          remoteOperations={true}
          showBorders={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          height="calc(100vh - 190px)"
          onInitNewRow={(e) => {
            rowDataRef.current = null;
          }}
          onEditingStart={(e) => {
            rowDataRef.current = e.data;
          }}
          onRowInserted={(e) => {
            openFilesTabRef.current = true;
            notify("Đã lưu thông tin chung. Bây giờ bạn có thể thêm ảnh vào album.", "info");
            e.component.navigateToRow(e.key).done(function () {
              var rowindex = e.component.getRowIndexByKey(e.key);
              e.component.editRow(rowindex);
            });
          }}
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Album Ảnh" showTitle={true} />
            <Form
              onInitialized={(e) => {
                // Album chua luu: hien the thay the kem huong dan thay vi an mat the danh sach file.
                e.component.option("items[0].tabs[1].visible", !!rowDataRef.current);
                e.component.option("items[0].tabs[2].visible", !rowDataRef.current);
              }}
            >
              <TabbedItem colSpan={2} tabPanelOptions={tabPanelOptions}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TieuDe" />
                  <Item dataField="MoTa" />
                  <Item dataField="ThoiGianTao" />
                  <Item dataField="TrangThai" />
                  <Item dataField="IDChuyenMucAlbumAnh" />
                  <Item dataField="TacGia" />
                  <Item dataField="ThoiGianXuatBan" />
                  <Item dataField="AnhDaiDien" />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/AlbumAnh_Files/Get?filter=[['AlbumId','=',${rowDataRef.current ? rowDataRef.current.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/AlbumAnh_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/AlbumAnh_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/AlbumAnh_Files/Delete`,
                          // Thong bao so file da them o onRowInserted thay cho "Thêm mới thành công!".
                          onInserted: () => {},
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowInserted={(e) => {
                      const ids = e.data && e.data.FileID;
                      const n = Array.isArray(ids) ? ids.length : ids != null ? 1 : 0;
                      notify(`Đã thêm ${n} file vào album`);
                      e.component.refresh();
                    }}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    width="100%"
                    onInitNewRow={(e) => {
                      e.data.AlbumID = rowDataRef.current.ID;
                    }}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} />
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
                      caption="Chọn file"
                      visible={false}
                      showInColumnChooser={false}
                      editCellRender={(cellInfo) => (
                        <MyFileFileUploader cellInfo={cellInfo} kind="image" />
                      )}
                    />
                    {/* Ten file tra san tu AlbumAnh_Files/Get: khong tai ca bang Files de hien ten. */}
                    <Column dataField="FileTen" dataType="string" caption="Tên file" allowEditing={false} />
                    <Column
                      dataField="FileID"
                      name="FileIDPreview"
                      caption="Hình ảnh"
                      width={300}
                      allowEditing={false}
                      allowFiltering={false}
                      allowSorting={false}
                      cellRender={(cellInfo) => (
                        <ImageLookup
                          cellInfo={cellInfo}
                          pathField="FileLinkLuuTru"
                          dataSource={dataSourceFileWithPathOptions}
                          valueExpr="ID"
                          displayExpr="LinkLuuTru"
                        />
                      )}
                    />
                  </DataGrid>
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <Item
                    itemType="simple"
                    render={() => (
                      <div className="alert alert-info mb-0">
                        Hãy lưu thông tin chung trước để thêm ảnh vào album. Sau khi bấm "Lưu", thẻ này sẽ cho phép tải ảnh lên.
                      </div>
                    )}
                  />
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" />
          <Column
            dataField="TieuDe"
            dataType="string"
            caption="Tiêu đề"
            width={300}
          />
          <Column
            dataField="MoTa"
            dataType="string"
            caption="Mô tả"
            visible={false}
          />
          <Column
            dataField="ThoiGianTao"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Thời gian tạo"
            sortOrder={"desc"}
          />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "HuyXuatBan", Name: "Hủy xuất bản" },
                { Val: "1", Name: "Xuất bản" },
                { Val: "ChoDuyet", Name: "Chờ duyệt" },
                { Val: "BiTraVe", Name: "Trả về" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="IDChuyenMucAlbumAnh"
            dataType="string"
            caption="Tên chuyên mục"
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceABLChuyenMucAlbumOptions}
              valueExpr="ID"
              displayExpr="TenChuyenMuc"
            />
          </Column>
          <Column
            dataField="TacGia"
            dataType="string"
            caption="Tác giả"
            visible={false}
          />
          <Column
            dataField="ThoiGianXuatBan"
            dataType="date"
            format={"dd/MM/yyyy"}
            caption="Thời gian xuất bản"
          />
          <Column
            dataField="AnhDaiDien"
            dataType="string"
            caption="Ảnh đại diện"
            visible={false}
            cellRender={config.defaultImageCellRender}
            editCellRender={(cellInfo) => (
              <MyImageFileUploader cellInfo={cellInfo} />
            )}
          >
            <RequiredRule />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
