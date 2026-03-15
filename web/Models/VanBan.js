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

const url = "http://moha.ptdl.tk/api/VanBans"
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

export default function VanBan() {
  return (
    <LayoutAdmin title={"VanBan"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý VanBan</h3>
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
									<Item dataField="SoKyHieu" />
									<Item dataField="NgayBanHanh" />
									<Item dataField="ID_HinhThucVanBan" />
									<Item dataField="IDs_LinhVuc" />
									<Item dataField="IDs_LopVanBan" />
									<Item dataField="IDs_CoQuanBanHanh" />
									<Item dataField="TrichYeu" />
									<Item dataField="NguoiKy" />
									<Item dataField="NgayCoHieuLuc" />
									<Item dataField="NgayHetHan" />
									<Item dataField="VanBanLienQuan" />
									<Item dataField="FileDinhKem" />
									<Item dataField="TrangThai" />
									<Item dataField="Lang" />
									<Item dataField="NoiDung" />
									<Item dataField="VanBanConHieuLuc" />
									<Item dataField="GhiChu" />
									<Item dataField="NgayHetHieuLuc1Phan" />
									<Item dataField="VanBanBiTacDongHieuLuc1Phan" />
									<Item dataField="ChucDanh" />
									<Item dataField="NgayKyKet" />
									<Item dataField="NgayCongBo" />
									<Item dataField="NgayGiaNhap" />
									<Item dataField="NgayCoHLVietNam" />
									<Item dataField="TinhTrang" />
									<Item dataField="FileGoc" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="SoKyHieu" dataType="string" caption="SoKyHieu" />
									<Column dataField="NgayBanHanh" dataType="string" caption="NgayBanHanh" />
									<Column dataField="ID_HinhThucVanBan" dataType="string" caption="ID_HinhThucVanBan" />
									<Column dataField="IDs_LinhVuc" dataType="string" caption="IDs_LinhVuc" />
									<Column dataField="IDs_LopVanBan" dataType="string" caption="IDs_LopVanBan" />
									<Column dataField="IDs_CoQuanBanHanh" dataType="string" caption="IDs_CoQuanBanHanh" />
									<Column dataField="TrichYeu" dataType="string" caption="TrichYeu" />
									<Column dataField="NguoiKy" dataType="string" caption="NguoiKy" />
									<Column dataField="NgayCoHieuLuc" dataType="string" caption="NgayCoHieuLuc" />
									<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" />
									<Column dataField="VanBanLienQuan" dataType="string" caption="VanBanLienQuan" />
									<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="Lang" dataType="string" caption="Lang" />
									<Column dataField="NoiDung" dataType="string" caption="NoiDung" />
									<Column dataField="VanBanConHieuLuc" dataType="string" caption="VanBanConHieuLuc" />
									<Column dataField="GhiChu" dataType="string" caption="GhiChu" />
									<Column dataField="NgayHetHieuLuc1Phan" dataType="string" caption="NgayHetHieuLuc1Phan" />
									<Column dataField="VanBanBiTacDongHieuLuc1Phan" dataType="string" caption="VanBanBiTacDongHieuLuc1Phan" />
									<Column dataField="ChucDanh" dataType="string" caption="ChucDanh" />
									<Column dataField="NgayKyKet" dataType="string" caption="NgayKyKet" />
									<Column dataField="NgayCongBo" dataType="string" caption="NgayCongBo" />
									<Column dataField="NgayGiaNhap" dataType="string" caption="NgayGiaNhap" />
									<Column dataField="NgayCoHLVietNam" dataType="string" caption="NgayCoHLVietNam" />
									<Column dataField="TinhTrang" dataType="string" caption="TinhTrang" />
									<Column dataField="FileGoc" dataType="string" caption="FileGoc" />
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

