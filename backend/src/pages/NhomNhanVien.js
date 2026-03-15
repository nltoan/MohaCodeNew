
import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup, FilterRow
} from 'devextreme-react/tree-list';
import { Item } from 'devextreme-react/form';
import { createCustomStore } from '../utils/api';

export default function NhomNhanVien() {
  const dataSourceOptions = createCustomStore("NhomNhanViens");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý nhóm phụ trách</h3>
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
          dataSource={dataSourceOptions}
          allowColumnResizing={true}
          showBorders={true}
          useIcons={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          keyExpr="ID"
          parentIdExpr="NhomNhanVienCha"
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
              <Item dataField="TenNhomNhanVien" />
              <Item dataField="NhomNhanVienCha" />
              <Item dataField="MoTa" />
              <Item dataField="TenDanhSachNhanVien" />
              <Item dataField="DanhSachNhanVien" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
            </Form>
          </Editing>

          <Column
            dataField="TenNhomNhanVien"
            dataType="string"
            caption="Tên nhóm"
          />
          <Column dataField="NhomNhanVienCha" caption="Cha" width={125}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenNhomNhanVien"
            />
          </Column>
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column
            dataField="TenDanhSachNhanVien"
            dataType="string"
            caption="Tên danh sách nhân viên"
            visible={false}
          />
          <Column
            dataField="DanhSachNhanVien"
            dataType="string"
            caption="DanhSachNhanVien"
            visible={false}
          />
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
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
