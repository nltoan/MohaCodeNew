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

export default function Banner_ViTri() {
  const dataSourceOptions = createCustomStore("Banner_ViTri");
  const dataSourceBannerOptions = createCustomStore("Banner");
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
              <Item dataField="ID_Banner" />
              <Item dataField="ID_ViTri" />
              <Item dataField="ThuTu" isRequired={true} />
            </Form>
          </Editing>
          <Column dataField="ID_Banner" dataType="string" caption="Tên banner">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceBannerOptions}
              valueExpr="ID"
              displayExpr="TenBanner"
            />
          </Column>
          <Column dataField="ID_ViTri" dataType="string" caption="ID_ViTri" />
          <Column dataField="ThuTu" dataType="string" caption="Số thứ tự" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
