import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';
import MyCustomHtmlEditor from '../components/MyCustomHtmlEditor';

export default function Template() {
  const dataSourceOptions = createCustomStore("Templates");

  function gjsEditCellRender(data) {
    return (
      <>
        <MyCustomHtmlEditor
          defaultValue={data.row.data.Html}
          onValueChange={(e) => {
            data.setValue(e.value);
          }}
        />
      </>
    );
  }
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quản lý mẫu emgazine</h3>
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
              <DataGridPopup title="Thông tin" showTitle={true} />
              <Form>
                <Item dataField="Title" colSpan={2} />
                <Item dataField="Description" colSpan={2} />
                <Item dataField="Html" colSpan={2} />
              </Form>
            </Editing>
            <Column
              dataField="ID"
              dataType="string"
              caption="id"
              visible={false}
            />
            <Column dataField="Title" dataType="string" caption="Tiêu đề" />
            <Column dataField="Description" dataType="string" caption="Mô tả" />
            <Column
              dataField="Html"
              dataType="string"
              caption="Mã nguồn mẫu"
              visible={false}
              editCellRender={gjsEditCellRender}
            />
            <Paging defaultPageSize={20} />
          </DataGrid>
        </div>
        <div className="card-footer"></div>
      </div>
    </>
  );
}
