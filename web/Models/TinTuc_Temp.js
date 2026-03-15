import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Header, SideNavigationMenu, Footer } from '../components';
import { useScreenSize } from '../utils/media-query';
import { Template } from 'devextreme-react/core/template';
import { useMenuPatch } from '../utils/patches';
import Aside from '../components/Aside';
import Content from '../components/Content';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
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
import LayoutAdmin from '../layouts/LayoutAdmin';

const url = "http://moha.ptdl.tk/api/TinTuc_Temps"
const dataSourceOptions = createStore({
  key: 'ID',
  loadUrl: `${url}/List`,
  insertUrl: `${url}/Insert`,
  updateUrl: `${url}/Update`,
  deleteUrl: `${url}/Delete`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: false };
  },
});

export default function TinTuc_Temp() {
  return (
    <LayoutAdmin title={"TinTuc_Temp"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý TinTuc_Temp</h3>
            <div className="card-tools">
              <button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
                <i className="fas fa-minus" />
              </button>
              <button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body">
            <DataGrid
              dataSource={dataSourceOptions}
              allowColumnReordering={true}
              rowAlternationEnabled={true}
              showBorders={true}
            >
              <FilterRow visible={true} />
              <HeaderFilter visible={true} />
              <SearchPanel visible={true} highlightCaseSensitive={true} />
              <Editing
                mode="popup"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="TieuDe" />
									<Item dataField="MoTa" />
									<Item dataField="NoiDung" />
									<Item dataField="TacGia" />
									<Item dataField="NgayTao" />
									<Item dataField="TrangThai" />
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
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TieuDe" dataType="string" caption="TieuDe" />
									<Column dataField="MoTa" dataType="string" caption="MoTa" />
									<Column dataField="NoiDung" dataType="string" caption="NoiDung" />
									<Column dataField="TacGia" dataType="string" caption="TacGia" />
									<Column dataField="NgayTao" dataType="string" caption="NgayTao" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="IDChuyenMuc" dataType="string" caption="IDChuyenMuc" />
									<Column dataField="ChoPhepGuiPhanHoi" dataType="string" caption="ChoPhepGuiPhanHoi" />
									<Column dataField="CacTinLienQuan" dataType="string" caption="CacTinLienQuan" />
									<Column dataField="AnhDaiDien" dataType="string" caption="AnhDaiDien" />
									<Column dataField="NgayXuatBan" dataType="string" caption="NgayXuatBan" />
									<Column dataField="DongSuKien" dataType="string" caption="DongSuKien" />
									<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" />
									<Column dataField="FilesDinhKem" dataType="string" caption="FilesDinhKem" />
									<Column dataField="NguonTin" dataType="string" caption="NguonTin" />
									<Column dataField="PhuDe" dataType="string" caption="PhuDe" />
									<Column dataField="NguoiTao" dataType="string" caption="NguoiTao" />
									<Column dataField="NguoiTraVe" dataType="string" caption="NguoiTraVe" />
									<Column dataField="NgayTraVe" dataType="string" caption="NgayTraVe" />
									<Column dataField="TenNguoiTao" dataType="string" caption="TenNguoiTao" />
									<Column dataField="TenNguoiTraVe" dataType="string" caption="TenNguoiTraVe" />
									<Column dataField="TuKhoa" dataType="string" caption="TuKhoa" />
									<Column dataField="PageCount" dataType="string" caption="PageCount" />
									<Column dataField="DanhGia" dataType="string" caption="DanhGia" />
									<Column dataField="ThoiGianUuTien" dataType="string" caption="ThoiGianUuTien" />
									<Column dataField="LogChuyenMucThayDoi" dataType="string" caption="LogChuyenMucThayDoi" />
									<Column dataField="LogQuyTrinhThayDoi" dataType="string" caption="LogQuyTrinhThayDoi" />
									<Column dataField="ID_TinTuc" dataType="string" caption="ID_TinTuc" />
				              <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
              <Paging defaultPageSize={10} />
            </DataGrid>
          </div>
          <div className="card-footer">
          </div>
      </div>
    </LayoutAdmin>
  );
}

