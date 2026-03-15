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
  RequiredRule
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyImageFileUploader from '../components/MyImageFileUploader';
import MyFileFileUploader from '../components/MyFileFileUploader';
import VideoLookup from '../components/VideoLookup';

export default function ABL_AlbumAudio() {
  const dataSourceABLChuyenMucAlbumOptions = createLookupStore("ABL_ChuyenMucAlbumAudio");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  const dataSourceFileWithPathOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetFilePath`,
  });
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý album</h3>
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
          dataSource={createCustomStore("ABL_AlbumAudio")}
          remoteOperations={true}
          showBorders={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
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
            <Popup title="Album Audio" showTitle={true} />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TieuDe" />
                  <Item dataField="MoTa" />
                  <Item dataField="ThoiGianTao" />
                  <Item dataField="TrangThai" />
                  <Item dataField="IDChuyenMucAlbumAudio" />
                  <Item dataField="TacGia" />
                  <Item dataField="ThoiGianXuatBan" />
                  <Item dataField="AnhDaiDien" />
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/AlbumAudio_Files/Get?filter=[['AlbumId','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/AlbumAudio_Files/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/AlbumAudio_Files/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/AlbumAudio_Files/Delete`,
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
                    width="100%"
                    onInitNewRow={(e) => {
                      e.data.AlbumID = rowData.ID;
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
                    <Column
                      dataField="FileID"
                      caption="Audio"
                      width={300}
                      allowEditing={false}
                      allowFiltering={false}
                      allowSorting={false}
                      cellRender={(cellInfo) => (
                        <VideoLookup
                          cellInfo={cellInfo}
                          dataSource={dataSourceFileWithPathOptions}
                          valueExpr="ID"
                          displayExpr="LinkLuuTru"
                        />
                      )}
                    />
                  </DataGrid>
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
            dataField="IDChuyenMucAlbumAudio"
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
