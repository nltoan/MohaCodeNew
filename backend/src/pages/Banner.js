
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item, Tab, TabbedItem } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyImageFileUploader from '../components/MyImageFileUploader';

export default function Banner() {
  const dataSourceViTriOptions = createLookupStore("QuangCao_ViTri");
  const dataSourceFileOptions = createLookupStore("Files");
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Banner</h3>
        <div className="card-tools">
          <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
            <i className="fas fa-minus" />
          </button>
          <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <DataGrid
          dataSource={createCustomStore("Banners")} remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
          onInitNewRow={(e) => {
            rowData = null;
            e.data.NgayXuatBan = new Date();
            e.data.NgayTao = new Date();
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
            allowDeleting={true}>
            <Popup title="Thông tin" showTitle={true} />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="TenBanner" colSpan={2} isRequired={true} />
                  <Item dataField="ID_File" isRequired={true} />
                  <Item dataField="URL" isRequired={true} />
                  <Item dataField="NgayXuatBan" />
                  <Item dataField="NgayHetHieuLuc" />
                  <Item dataField="NgayTao" />
                  {/* <Item dataField="LuotTruyCap" /> */}
                </Tab>
                <Tab title="Danh sách vị trí được gắn">
                  <DataGrid
                    remoteOperations={true}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/Banner_ViTri/Get?filter=[['ID_Banner','=',${rowData ? rowData.ID : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/Banner_ViTri/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/Banner_ViTri/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/Banner_ViTri/Delete`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowInserted={(e) => {
                      e.component.refresh();
                    }}
                    onInitNewRow={(e) => {
                      e.data.ID_Banner = rowData.ID;
                    }}
                  >
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={false}
                      allowAdding={true}
                      allowDeleting={true}>
                      <Popup title="Thêm vào vị trí" showTitle={true} />
                      <Form>
                        <Item dataField="ID_ViTri" />
                        {/* <Item dataField="ThuTu" /> */}
                      </Form>
                    </Editing>

                    <Column dataField="ID" dataType="string" caption="ID" />
                    <Column dataField="ID_ViTri" dataType="string" caption="Tên vị trí" >
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceViTriOptions} allowColumnResizing={true} valueExpr="ID" displayExpr="TenViTri" />
                    </Column>
                    <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
                    <Paging defaultPageSize={20} />
                  </DataGrid>
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" defaultSortOrder={"desc"} />
          <Column dataField="TenBanner" dataType="string" caption="Tên banner" />
          <Column dataField="ID_File" dataType="string" caption="Ảnh"
            cellRender={config.defaultImageCellRender}
            editCellRender={(cellInfo) => <MyImageFileUploader cellInfo={cellInfo} />}
          >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceFileOptions} allowColumnResizing={true} valueExpr="ID" displayExpr="LinkLuuTru" />
          </Column>
          <Column dataField="NgayTao" dataType="date" format={"dd/MM/yyyy"} caption="Ngày tạo" defaultSortOrder="desc" />
          <Column dataField="NgayXuatBan" dataType="date" format={"dd/MM/yyyy"} caption="Ngày xuất bản" visible={false} />
          <Column dataField="NgayHetHieuLuc" dataType="date" format={"dd/MM/yyyy"} caption="Ngày hết hiệu lực" visible={false} />
          <Column dataField="URL" dataType="string" caption="URL" />
          <Column dataField="LuotTruyCap" dataType="number" caption="Lượt truy cập" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>
  );
}

