
import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup as TreeListPopup, FilterRow,
} from 'devextreme-react/tree-list';

import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function LopVanBan() {
  const dataSourceOptions = createLookupStore("LopVanBans");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý lớp văn bản</h3>
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
          dataSource={createCustomStore("LopVanBans")}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          keyExpr="ID"
          parentIdExpr="LopVanBanCha"
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
            <TreeListPopup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="LopVanBanCha" colSpan="2" />

              <Item dataField="TenLopVanBan" isRequired={true} colSpan="2" />
              <Item dataField="MoTa" editorType="dxTextArea" colSpan="2" />
              <Item dataField="SoThuTu" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
              <Item dataField="Lang" />
            </Form>
          </Editing>

          <Column dataField="TenLopVanBan" dataType="string" caption="Tên" />
          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
          />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="Số thứ tự"
            defaultSortOrder="asc"
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
          <Column dataField="Lang" dataType="string" caption="Ngôn ngữ">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 1066, Name: "Tiếng Việt" },
                { Val: 1033, Name: "Tiếng Anh" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column dataField="LopVanBanCha" caption="Cha" width={125}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenLopVanBan"
            />
          </Column>
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
