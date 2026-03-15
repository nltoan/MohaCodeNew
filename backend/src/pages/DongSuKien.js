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
import config from '../config';
import { createCustomStore } from '../utils/api';
import MyImageUploader from '../components/MyImageUploader';

export default function DongSuKien() {
  const dataSourceOptions = createCustomStore("DongSuKiens");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý dòng sự kiện</h3>
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
              <Item dataField="TenDongSuKien" />
              <Item dataField="MoTa" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="MucUuTien" />
              <Item dataField="NgayXuatBan" />
              <Item dataField="NgayHetHieuLuc" />
              <Item dataField="AnhDaiDien" />
            </Form>
          </Editing>

          <Column dataField="TenDongSuKien" dataType="string" caption="Tên" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column
            dataField="AnhDaiDien"
            dataType="string"
            caption="Ảnh đại diện"
            cellRender={config.defaultImageCellRender}
            editCellRender={MyImageUploader}
          />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không hoạt động" },
                { Val: "HoatDong", Name: "Hoạt động" },
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
            dataField="NgayXuatBan"
            dataType="datetime"
            caption="Ngày xuất bản"
          />
          <Column
            dataField="NgayHetHieuLuc"
            dataType="datetime"
            caption="Ngày hết hiệu lực"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
