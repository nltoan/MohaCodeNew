import { useEffect, useState } from 'react';
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

const dataSourcePermissionsOptions = createLookupStore("Permissions");
const dataSourceOptions = createCustomStore("Roles");

export default function Role() {
  // Ten quyen theo ID de hien trong luoi (Roles/Get chi tra PermissionId).
  const [permissionNames, setPermissionNames] = useState({});
  useEffect(() => {
    let alive = true;
    dataSourcePermissionsOptions.load().then(
      (data) => {
        if (!alive) return;
        const rows = Array.isArray(data) ? data : data?.data || [];
        const map = {};
        rows.forEach((p) => { map[p.ID] = p.Description || p.Name; });
        setPermissionNames(map);
      },
      () => {},
    );
    return () => { alive = false; };
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Vai trò và phân quyền</h3>
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
          dataSource={dataSourceOptions}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          wordWrapEnabled={true}
          height="calc(100vh - 190px)"
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} placeholder="Tìm theo tên, mô tả..." />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
          >
            <Popup title="Vai trò" showTitle={true} />
            <Form>
              <Item dataField="Name" isRequired={true} />
              <Item dataField="Description" />
              <Item
                dataField="RolePermissions"
                isRequired={true}
                editorType="dxTagBox"
                helpText="Bấm vào ô để mở danh sách quyền; tích chọn các quyền cần cấp (có thể gõ để tìm)."
                editorOptions={{
                  dataSource: dataSourcePermissionsOptions,
                  valueExpr: "ID",
                  displayExpr: "Description",
                  showSelectionControls: true,
                  selectAllMode: "allPages",
                  selectAllText: "Chọn tất cả",
                  applyValueMode: "instantly",
                  searchEnabled: true,
                  showDropDownButton: true,
                  placeholder: "Chọn quyền...",
                }}
                colSpan={2}
              />
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" visible={false} />
          <Column dataField="Name" dataType="string" caption="Tên vai trò" width={200} />
          <Column dataField="Description" dataType="string" caption="Mô tả" width={240} />
          <Column
            dataField="RolePermissions"
            caption="Danh sách quyền"
            visible={false}
            showInColumnChooser={false}
            calculateCellValue={(e) => {
              return e.RolePermissions?.map((x) => x.PermissionId);
            }}
          />
          <Column
            caption="Quyền được cấp"
            allowFiltering={false}
            allowSorting={false}
            allowSearch={false}
            calculateCellValue={(e) => {
              const ids = (e.RolePermissions || []).map((x) => x.PermissionId);
              if (!ids.length) return "(chưa có quyền)";
              return `${ids.length} quyền: ` + ids.map((id) => permissionNames[id] || `#${id}`).join(", ");
            }}
          />
          <Column type="buttons" width={90}>
            <DataGridButton name="edit" hint="Sửa vai trò" />
            <DataGridButton name="delete" hint="Xóa vai trò" visible={(e) => e.row.data.Removable == 1} />
            <DataGridButton
              hint="Vai trò hệ thống, không thể xóa"
              icon="fas fa-lock"
              visible={(e) => e.row.data.Removable != 1}
              disabled={true}
            />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
    </div>
  );
}
