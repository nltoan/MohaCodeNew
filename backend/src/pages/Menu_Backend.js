
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

export default function Menu_Backend() {
  const dataSourceOptions = createCustomStore("Menu_Backend");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý Menu Backend</h3>
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
              <Item dataField="TenMenu" isRequired={true} />
              <Item dataField="URL" />
              <Item dataField="STT" isRequired={true} />
              <Item dataField="IDMenuCha" />
              <Item dataField="QuyenTruyCap" />
              <Item dataField="FunctionGetNoti" />
              <Item dataField="CoCanhBao" />
              <Item dataField="QuyenKhongTruyCap" />
              <Item dataField="ClassCSS" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
              <Item dataField="TenTruyCap" />
              <Item dataField="FunctionTruyCap" />
            </Form>
          </Editing>

          <Column dataField="TenMenu" dataType="string" caption="TenMenu" />
          <Column dataField="URL" dataType="string" caption="URL" />
          <Column dataField="STT" dataType="string" caption="STT" />
          <Column dataField="IDMenuCha" caption="Cha" width={125}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenMenu"
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
