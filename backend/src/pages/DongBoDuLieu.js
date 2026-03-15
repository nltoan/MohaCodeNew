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
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';

export default function DongBoDuLieu() {
  const dataSourceOptions = createCustomStore("DongBoDuLieus");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý DongBoDuLieu</h3>
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
              <Item dataField="ID_BanGhi" isRequired={true} />
              <Item dataField="TenBang" isRequired={true} />
              <Item dataField="ThaoTac" isRequired={true} />
              <Item dataField="TrangThai" isRequired={true} />
              <Item dataField="ThoiGianCapNhat" isRequired={true} />
            </Form>
          </Editing>

          <Column dataField="ID_BanGhi" dataType="string" caption="ID_BanGhi" />
          <Column dataField="TenBang" dataType="string" caption="TenBang" />
          <Column dataField="ThaoTac" dataType="string" caption="ThaoTac" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không hoạt động" },
                { Val: 1, Name: "Hoạt động" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="ThoiGianCapNhat"
            dataType="string"
            caption="ThoiGianCapNhat"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
