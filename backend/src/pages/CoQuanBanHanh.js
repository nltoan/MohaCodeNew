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

export default function CoQuanBanHanh() {
  const dataSourceOptions = createCustomStore("CoQuanBanHanhs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách Cơ quan ban hành</h3>
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
              <Item dataField="Lang" isRequired={true} colSpan="2" />
              <Item
                dataField="TenCoQuanBanHanh"
                isRequired={true}
                colSpan="2"
              />
              <Item dataField="MoTa" colSpan="2" editorType="dxTextArea" />
              <Item dataField="SoThuTu" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
            </Form>
          </Editing>

          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
          />
          <Column
            dataField="TenCoQuanBanHanh"
            dataType="string"
            caption="Tên cơ quan ban hành"
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
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
