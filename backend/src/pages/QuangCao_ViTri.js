import DataGrid, {
  Column,
  Pager,
  Paging,
  Editing,
  Popup,
  Lookup,
  Form,
} from 'devextreme-react/data-grid';
import TreeList, {
  Column as TreeListColumn, Item as TreeListItem, HeaderFilter as TreeListHeaderFilter,
  SearchPanel as TreeListSearchPanel, Lookup as TreeListLookup, Form as TreeListForm,
  Editing as TreeListEditing, Popup as TreeListPopup, FilterRow as TreeListFilterRow
} from 'devextreme-react/tree-list';
import { Item, Tab, TabbedItem } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function QuangCao_ViTri() {
  const dataSourceOptions = createLookupStore("QuangCao_ViTri");
  const dataSourceBannerOptions = createLookupStore("Banners");
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý vị trí banner</h3>
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
          dataSource={createCustomStore("QuangCao_ViTri")}
          allowColumnResizing={true}
          showBorders={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          keyExpr="ID"
          parentIdExpr="ID_ViTriCha"
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
          <TreeListFilterRow visible={true} />
          <TreeListHeaderFilter visible={true} />
          <TreeListSearchPanel visible={true} highlightCaseSensitive={true} />
          <TreeListEditing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <TreeListPopup
              title="Thông tin"
              showTitle={true}
              fullScreen={true}
            />
            <TreeListForm
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <TreeListItem
                    dataField="TenViTri"
                    colSpan={2}
                    isRequired={true}
                  />
                  <TreeListItem dataField="ID_ViTriCha" />
                  <TreeListItem dataField="MoTa" />
                </Tab>
                <Tab title="Danh sách banner gán vào vị trí">
                  <DataGrid
                    remoteOperations={true}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/Banner_ViTri/Get?filter=[['ID_ViTri','=',${rowData ? rowData.ID : ""}]]`,
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
                      e.data.ID_ViTri = rowData.ID;
                    }}
                  >
                    <Editing
                      mode="popup"
                      useIcons={true}
                      allowUpdating={true}
                      allowAdding={true}
                      allowDeleting={true}
                    >
                      <Popup title="Thêm banner vào vị trí" showTitle={true} />
                      <Form>
                        <Item dataField="ID_Banner" />
                        <Item dataField="ThuTu" />
                      </Form>
                    </Editing>

                    <Column dataField="ID" dataType="string" caption="ID" />
                    <Column dataField="ThuTu" dataType="string" caption="STT" />
                    <Column
                      dataField="ID_Banner"
                      dataType="string"
                      caption="Tên banner"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceBannerOptions}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="TenBanner"
                      />
                    </Column>
                    <Pager
                      allowedPageSizes={[20, 50, 100]}
                      showPageSizeSelector={true}
                    />
                    <Paging defaultPageSize={20} />
                  </DataGrid>
                </Tab>
              </TabbedItem>
            </TreeListForm>
          </TreeListEditing>

          <TreeListColumn
            dataField="TenViTri"
            dataType="string"
            caption="Tên vị trí"
          />
          <TreeListColumn
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
          />
          <TreeListColumn dataField="ID_ViTriCha" caption="Cha" width={125}>
            <TreeListLookup
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenViTri"
            />
          </TreeListColumn>
          <TreeListColumn dataField="MoTa" dataType="string" caption="Mô tả" />
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
