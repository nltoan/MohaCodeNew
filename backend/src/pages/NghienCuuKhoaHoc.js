import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FormItem,
  FilterRow,
  HeaderFilter,
  RequiredRule
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function NghienCuuKhoaHoc() {
  const dataSourceOptions = createCustomStore("NghienCuuKhoaHocs");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Nghiên Cứu Khoa học</h3>
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
          columnAutoWidth={true}
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
            <Popup
              title="Nghiên Cứu Khoa học"
              showTitle={true}
              width={900}
              height={700}
            />
            <Form colCount={2}>
              <Item dataField="TenDeTai" colSpan={2} />
              <Item dataField="CapQuanLy" colSpan={2} />
              <Item dataField="LinhVuc" colSpan={2} />
              <Item dataField="DonViChuTri" colSpan={2} />
              <Item dataField="ThoiGianThucHien" colSpan={2} />
              <Item dataField="MoTa" colSpan={2} />
              <Item dataField="NoiDung" colSpan={2} />
            </Form>
          </Editing>

          <Column
            dataField="ID"
            dataType="string"
            caption="ID"
            defaultSortOrder={"desc"}
          />
          <Column dataField="TenDeTai" caption="Tên đề tài">
            <RequiredRule />
          </Column>
          <Column dataField="CapQuanLy" caption="Cấp Quản lý" width={150}>
            <RequiredRule />
          </Column>
          <Column dataField="LinhVuc" caption="Lĩnh vực" width={150}>
            <RequiredRule />
          </Column>
          <Column dataField="DonViChuTri" caption="Đơn vị chủ trì">
            <RequiredRule />
          </Column>
          <Column
            dataField="ThoiGianThucHien"
            caption="Thời gian thực hiện"
            width={150}
          >
            <RequiredRule />
          </Column>
          <Column dataField="MoTa" caption="Mô tả" visible={false} />
          <Column dataField="NoiDung" caption="Nội dung" visible={false}>
            <RequiredRule />
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorLargeOptions}
            />
          </Column>
          <Column dataField="NguoiTao" caption="Người Tạo" visible={false} />
          <Column dataField="NgayTao" caption="Ngày Tạo" visible={false} />
          <Column
            dataField="NguoiCapNhat"
            caption="Người Cập nhật"
            visible={false}
          />
          <Column
            dataField="NgayCapNhat"
            caption="Ngày Cập nhật"
            visible={false}
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
