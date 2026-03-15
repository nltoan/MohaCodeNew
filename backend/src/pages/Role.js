import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
  Button as DataGridButton,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function Role() {
  const dataSourcePermissionsOptions = createLookupStore("Permissions");
  const dataSourceOptions = createCustomStore("Roles");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Vai trò</h3>
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
          dataSource={dataSourceOptions}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
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
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="Name" />
              <Item dataField="Description" />
              <Item
                dataField="RolePermissions"
                isRequired={true}
                editorType="dxTagBox"
                editorOptions={{
                  dataSource: dataSourcePermissionsOptions,
                  valueExpr: "ID",
                  displayExpr: "Description",
                  showSelectionControls: true,
                  applyValueMode: "useButtons",
                  searchEnabled: true,
                }}
                colSpan={2}
              />
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" />
          <Column dataField="Name" dataType="string" caption="Tên" />
          <Column dataField="Description" dataType="string" caption="Mô tả" />
          <Column
            dataField="RolePermissions"
            caption="Danh sách quyền"
            visible={false}
            calculateCellValue={(e) => {
              return e.RolePermissions?.map((x) => x.PermissionId);
            }}
          />
          <Column type="buttons">
            <DataGridButton name="edit" />
            <DataGridButton
              name="delete"
              visible={(e) => {
                return e.row.data.Removable == 1;
              }}
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
