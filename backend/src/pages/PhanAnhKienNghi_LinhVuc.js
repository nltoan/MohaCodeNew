import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function PhanAnhKienNghi_LinhVuc() {
  const dataSourceOptions = createCustomStore("PhanAnhKienNghi_LinhVucs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Lĩnh Vực</h3>
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
          allowColumnReordering={true}
          allowColumnResizing={true}
          rowAlternationEnabled={true}
          showBorders={true}
          columnAutoWidth={true}
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
            <Popup title="Lĩnh Vực" showTitle={true} />
            <Form>
              <Item dataField="TenLinhVuc" colSpan={2} />
              <Item dataField="MoTa" colSpan={2} />
            </Form>
          </Editing>
          <Column dataField="ID" caption="ID" defaultSortOrder={"desc"} />
          <Column dataField="TenLinhVuc" dataType="string" caption="Lĩnh vực" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
