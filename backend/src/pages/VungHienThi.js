
import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup, FilterRow
} from 'devextreme-react/tree-list';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function VungHienThi() {
  const dataSourceOptions = createCustomStore("VungHienThis");
  const dataSourceVungHienThiOptions = createLookupStore("VungHienThis");

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý vùng hiển thị</h3>
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
        {dataSourceOptions && (
          <TreeList
            dataSource={dataSourceOptions}
            allowColumnResizing={true}
            showBorders={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
            keyExpr="ID"
            parentIdExpr="VungHienThiCha"
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
              <Popup title="Thông tin banner" showTitle={true} />
              <Form>
                <Item dataField="TenVungHienThi" isRequired={true} />
                <Item dataField="MoTa" />
                <Item dataField="TrangThai" editorType="dxCheckBox" />
                <Item dataField="MucUuTien" />
                <Item dataField="VungHienThiCha" />
              </Form>
            </Editing>
            <Column
              dataField="ID"
              dataType="number"
              caption="ID"
              visible={false}
            />
            <Column
              dataField="TenVungHienThi"
              dataType="string"
              caption="Tên"
            />
            <Column dataField="MoTa" dataType="string" caption="Mô tả" />
            <Column
              dataField="TrangThai"
              dataType="string"
              caption="Trạng thái"
            >
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
              dataField="MucUuTien"
              dataType="string"
              caption="Mức ưu tiên"
            />
            <Column
              dataField="VungHienThiCha"
              dataType="number"
              caption="Cha"
              width={125}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceVungHienThiOptions}
                allowColumnResizing={true}
                valueExpr="ID"
                displayExpr="TenVungHienThi"
              />
            </Column>
          </TreeList>
        )}
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
