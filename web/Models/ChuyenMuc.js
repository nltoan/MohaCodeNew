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

const url = "http://moha.ptdl.tk/api/ChuyenMucs"
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

export default function ChuyenMuc() {
  return (
    <LayoutAdmin title={"ChuyenMuc"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ChuyenMuc</h3>
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
									<Item dataField="TenChuyenMuc" />
									<Item dataField="ChuyenMucCha" />
									<Item dataField="LinkTinTuc" />
									<Item dataField="MoTa" />
									<Item dataField="IDQuyTrinh" />
									<Item dataField="TrangThai" />
									<Item dataField="DanhSachNguoiPhuTrach" />
									<Item dataField="DanhSachNhomPhuTrach" />
									<Item dataField="NgayTao" />
									<Item dataField="TenNguoiPhuTrach" />
									<Item dataField="TenNhomPhuTrach" />
									<Item dataField="SoThuTu" />
									<Item dataField="VungHienThi" />
									<Item dataField="LogThayDoi" />
									<Item dataField="DangKyNhanBaiViet" />
									<Item dataField="HienThiTieuDe" />
									<Item dataField="Type" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenChuyenMuc" dataType="string" caption="TenChuyenMuc" />
									<Column dataField="ChuyenMucCha" dataType="string" caption="ChuyenMucCha" />
									<Column dataField="LinkTinTuc" dataType="string" caption="LinkTinTuc" />
									<Column dataField="MoTa" dataType="string" caption="MoTa" />
									<Column dataField="IDQuyTrinh" dataType="string" caption="IDQuyTrinh" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="DanhSachNguoiPhuTrach" dataType="string" caption="DanhSachNguoiPhuTrach" />
									<Column dataField="DanhSachNhomPhuTrach" dataType="string" caption="DanhSachNhomPhuTrach" />
									<Column dataField="NgayTao" dataType="string" caption="NgayTao" />
									<Column dataField="TenNguoiPhuTrach" dataType="string" caption="TenNguoiPhuTrach" />
									<Column dataField="TenNhomPhuTrach" dataType="string" caption="TenNhomPhuTrach" />
									<Column dataField="SoThuTu" dataType="string" caption="SoThuTu" />
									<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" />
									<Column dataField="LogThayDoi" dataType="string" caption="LogThayDoi" />
									<Column dataField="DangKyNhanBaiViet" dataType="string" caption="DangKyNhanBaiViet" />
									<Column dataField="HienThiTieuDe" dataType="string" caption="HienThiTieuDe" />
									<Column dataField="Type" dataType="string" caption="Type" />
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

