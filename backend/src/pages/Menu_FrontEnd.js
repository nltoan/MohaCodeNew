
import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup, FilterRow
} from 'devextreme-react/tree-list';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function Menu_FrontEnd() {
  const dataSourceOptions = createLookupStore("Menu_FrontEnd");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Menu FrontEnd</h3>
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
          dataSource={createCustomStore("Menu_FrontEnd")}
          allowColumnResizing={true}
          showBorders={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          keyExpr="ID"
          parentIdExpr="IDMenuCha"
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
              <Item dataField="TenMenu" isRequired={true} />
              <Item dataField="URL" />
              <Item dataField="STT" isRequired={true} />
              <Item dataField="IDMenuCha" />
              <Item dataField="ClassCSS" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
              <Item dataField="IconDaiDien" />
            </Form>
          </Editing>

          <Column dataField="TenMenu" dataType="string" caption="Tên menu" />
          <Column dataField="ID" dataType="string" caption="ID" />
          <Column dataField="URL" dataType="string" caption="URL" />
          <Column
            dataField="STT"
            dataType="string"
            caption="STT"
            defaultSortOrder="asc"
          />
          <Column dataField="ClassCSS" dataType="string" caption="ClassCSS" />
          <Column
            dataField="IconDaiDien"
            dataType="string"
            caption="Icon đại diện"
            visible={false}
          />
          <Column dataField="HienThi" dataType="string" caption="Hiển thị">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không" },
                { Val: 1, Name: "Có" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column dataField="IDMenuCha" dataType="string" caption="Menu cha">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              remoteOperations={true}
              valueExpr="ID"
              displayExpr="TenMenu"
            />
          </Column>
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
