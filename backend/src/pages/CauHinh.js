import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow,
  HeaderFilter} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function CauHinh() {
  const dataSourceOptions = createCustomStore("CauHinhs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý CauHinh</h3>
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
            <Popup title="Quản lý CauHinh" showTitle={true} />
            <Form>
              <Item dataField="ID" colSpan={2} />
              <Item dataField="Ten" colSpan={2} isRequired={true} />
              <Item
                dataField="Ma"
                colSpan={2}
                editorOptions={{ readOnly: true }}
              />
              <Item
                dataField="GiaTri"
                editorType="dxTextArea"
                editorOptions={{ minHeight: 30 }}
                isRequired={true}
                colSpan={2}
              />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
            width={60}
          ></Column>
          <Column dataField="Ten" dataType="string" caption="Tên"></Column>
          <Column dataField="Ma" dataType="string" caption="Mã"></Column>
          <Column
            dataField="GiaTri"
            dataType="string"
            caption="Giá trị"
            visible={false}
          ></Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
