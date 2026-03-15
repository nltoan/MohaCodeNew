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

const url = "http://moha.ptdl.tk/api/QuaTrinhKiemDuyets"
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

export default function QuaTrinhKiemDuyet() {
  return (
    <LayoutAdmin title={"QuaTrinhKiemDuyet"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý QuaTrinhKiemDuyet</h3>
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
									<Item dataField="IDQuyTrinh" />
									<Item dataField="BuocQuyTrinh" />
									<Item dataField="DanhSachNguoiKiemDuyet" />
									<Item dataField="DanhSachNhomKiemDuyet" />
									<Item dataField="IDTinTuc" />
									<Item dataField="NguoiKiemDuyet" />
									<Item dataField="NgayKiemDuyet" />
									<Item dataField="GhiChu" />
									<Item dataField="TrangThai" />
									<Item dataField="NguoiGui" />
									<Item dataField="NgayGui" />
									<Item dataField="TenChuyenMuc" />
									<Item dataField="TenNguoiKiemDuyet" />
									<Item dataField="TenNguoiGui" />
									<Item dataField="IDChuyenMuc" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="IDQuyTrinh" dataType="string" caption="IDQuyTrinh" />
									<Column dataField="BuocQuyTrinh" dataType="string" caption="BuocQuyTrinh" />
									<Column dataField="DanhSachNguoiKiemDuyet" dataType="string" caption="DanhSachNguoiKiemDuyet" />
									<Column dataField="DanhSachNhomKiemDuyet" dataType="string" caption="DanhSachNhomKiemDuyet" />
									<Column dataField="IDTinTuc" dataType="string" caption="IDTinTuc" />
									<Column dataField="NguoiKiemDuyet" dataType="string" caption="NguoiKiemDuyet" />
									<Column dataField="NgayKiemDuyet" dataType="string" caption="NgayKiemDuyet" />
									<Column dataField="GhiChu" dataType="string" caption="GhiChu" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="NguoiGui" dataType="string" caption="NguoiGui" />
									<Column dataField="NgayGui" dataType="string" caption="NgayGui" />
									<Column dataField="TenChuyenMuc" dataType="string" caption="TenChuyenMuc" />
									<Column dataField="TenNguoiKiemDuyet" dataType="string" caption="TenNguoiKiemDuyet" />
									<Column dataField="TenNguoiGui" dataType="string" caption="TenNguoiGui" />
									<Column dataField="IDChuyenMuc" dataType="string" caption="IDChuyenMuc" />
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

