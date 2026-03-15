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

export default function TinTuc_Temp() {
  const dataSourceOptions = createCustomStore("News/TinTuc_Temp");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý TinTuc_Temp</h3>
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
              <Item dataField="TieuDe" />
              <Item dataField="MoTa" />
              <Item dataField="NoiDung" />
              <Item dataField="TacGia" />
              <Item dataField="NgayTao" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="IDChuyenMuc" />
              <Item dataField="ChoPhepGuiPhanHoi" />
              <Item dataField="CacTinLienQuan" />
              <Item dataField="AnhDaiDien" />
              <Item dataField="NgayXuatBan" />
              <Item dataField="DongSuKien" />
              <Item dataField="VungHienThi" />
              <Item dataField="FilesDinhKem" />
              <Item dataField="NguonTin" />
              <Item dataField="PhuDe" />
              <Item dataField="NguoiTao" />
              <Item dataField="NguoiTraVe" />
              <Item dataField="NgayTraVe" />
              <Item dataField="TenNguoiTao" />
              <Item dataField="TenNguoiTraVe" />
              <Item dataField="TuKhoa" />
              <Item dataField="PageCount" />
              <Item dataField="DanhGia" />
              <Item dataField="ThoiGianUuTien" />
              <Item dataField="LogChuyenMucThayDoi" />
              <Item dataField="LogQuyTrinhThayDoi" />
              <Item dataField="ID_TinTuc" />
            </Form>
          </Editing>

          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
          <Column dataField="TacGia" dataType="string" caption="Tác giả" />
          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
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
          <Column
            dataField="IDChuyenMuc"
            dataType="string"
            caption="IDChuyenMuc"
          />
          <Column
            dataField="ChoPhepGuiPhanHoi"
            dataType="string"
            caption="ChoPhepGuiPhanHoi"
          />
          <Column
            dataField="CacTinLienQuan"
            dataType="string"
            caption="CacTinLienQuan"
          />
          <Column
            dataField="AnhDaiDien"
            dataType="string"
            caption="Ảnh đại diện"
            cellRender={config.defaultImageCellRender}
            editCellRender={MyImageUploader}
          />
          <Column
            dataField="NgayXuatBan"
            dataType="datetime"
            caption="Ngày xuất bản"
          />
          <Column
            dataField="DongSuKien"
            dataType="string"
            caption="DongSuKien"
          />
          <Column
            dataField="VungHienThi"
            dataType="string"
            caption="VungHienThi"
          />
          <Column
            dataField="FilesDinhKem"
            dataType="string"
            caption="FilesDinhKem"
          />
          <Column dataField="NguonTin" dataType="string" caption="NguonTin" />
          <Column dataField="PhuDe" dataType="string" caption="PhuDe" />
          <Column dataField="NguoiTao" dataType="string" caption="NguoiTao" />
          <Column
            dataField="NguoiTraVe"
            dataType="string"
            caption="NguoiTraVe"
          />
          <Column dataField="NgayTraVe" dataType="string" caption="NgayTraVe" />
          <Column
            dataField="TenNguoiTao"
            dataType="string"
            caption="TenNguoiTao"
          />
          <Column
            dataField="TenNguoiTraVe"
            dataType="string"
            caption="TenNguoiTraVe"
          />
          <Column dataField="TuKhoa" dataType="string" caption="TuKhoa" />
          <Column dataField="PageCount" dataType="string" caption="PageCount" />
          <Column dataField="DanhGia" dataType="string" caption="DanhGia" />
          <Column
            dataField="ThoiGianUuTien"
            dataType="string"
            caption="ThoiGianUuTien"
          />
          <Column
            dataField="LogChuyenMucThayDoi"
            dataType="string"
            caption="LogChuyenMucThayDoi"
          />
          <Column
            dataField="LogQuyTrinhThayDoi"
            dataType="string"
            caption="LogQuyTrinhThayDoi"
          />
          <Column dataField="ID_TinTuc" dataType="string" caption="ID_TinTuc" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
