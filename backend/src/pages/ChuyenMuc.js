import TreeList, {
  Column, HeaderFilter, SearchPanel, Lookup, Form, Editing, Popup as TreeListPopup, FilterRow,
  Button as TreeListButton,
} from 'devextreme-react/tree-list';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import MyTreeCombobox from '../components/MyTreeCombobox';
import {getFrontEndURL} from '../utils/helpers';

export default function ChuyenMuc() {
  const dataSourceChuyenMucOptions = createLookupStore("ChuyenMucs");
  const dataSourceQuyTrinhKiemDuyetsOptions = createLookupStore("QuyTrinhKiemDuyets");
  function treeviewEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceChuyenMucOptions}
          keyExpr={"ID"}
          displayExpr={"TenChuyenMuc"}
          parentIdExpr={"ChuyenMucCha"}
          defaultValue={data.row.data.ChuyenMucCha}
          onValueChanged={(e) => {
            if (e.value && e.value.length > 0) {
              data.setValue(e.value[0]);
            } else {
              data.setValue("0");
            }
          }}
        />
      </>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý chuyên mục tin tức</h3>
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
          dataSource={createCustomStore("ChuyenMucs")}
          allowColumnResizing={true}
          showBorders={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          keyExpr="ID"
          parentIdExpr="ChuyenMucCha"
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
            <TreeListPopup
              title="Thông tin chi tiết chuyên mục"
              showTitle={true}
              fullScreen={true}
            />
            <Form>
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item
                    dataField="TenChuyenMuc"
                    isRequired={true}
                    colSpan={2}
                  />
                  <Item dataField="ChuyenMucCha" />
                  <Item dataField="IDQuyTrinh" />
                  <Item dataField="MoTa" colSpan={2} />
                  <Item
                      dataField="IsVisible"
                      editorType="dxCheckBox"
                    />
                  <Item dataField="TrangThai" />
                  <Item dataField="SoThuTu" />
                  <Item dataField="Type" />
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>

          <Column
            dataField="TenChuyenMuc"
            dataType="string"
            caption="Tên chuyên mục"
          />
          <Column dataField="ID" dataType="string" caption="ID" />
          <Column
            dataField="ChuyenMucCha"
            dataType="number"
            caption="Chuyên mục cha"
            editCellRender={treeviewEditCellRender}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceChuyenMucOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenChuyenMuc"
            />
          </Column>
          <Column
            dataField="IDQuyTrinh"
            caption="Quy trình kiểm duyệt"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceQuyTrinhKiemDuyetsOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenQuyTrinhKiemDuyet"
            />
          </Column>
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: "KhongHoatDong", Name: "Không hoạt động" },
                { Val: "HoatDong", Name: "Hoạt động" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>

          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="Số thứ tự"
            defaultSortOrder="asc"
          />
          <Column
            dataField="IsVisible"
            caption="Hiển thị chuyên mục"
            visible={false}
          />
          <Column
            dataField="Type"
            dataType="string"
            caption="Layout"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 3, Name: "Emagazine" },
                { Val: 4, Name: "Tin Tổng hợp" },
                { Val: 5, Name: "Tin Thông báo" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column type="buttons">
            <TreeListButton
              hint={"Xem web"}
              cssClass={"fas fa-eye"}
              onClick={(e) => {
                window
                  .open(
                    `${getFrontEndURL("chuyen-muc", e.row.data.TenChuyenMuc, e.row.data.ID)}`,
                    "_blank",
                  )
                  .focus();
              }}
            />
            <TreeListButton name="add" />
            <TreeListButton name="edit" />
            <TreeListButton name="delete" />
          </Column>
        </TreeList>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
