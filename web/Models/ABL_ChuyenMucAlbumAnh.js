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

const url = "http://moha.ptdl.tk/api/ABL_ChuyenMucAlbumAnhs"
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

export default function ABL_ChuyenMucAlbumAnh() {
  return (
    <LayoutAdmin title={"ABL_ChuyenMucAlbumAnh"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ABL_ChuyenMucAlbumAnh</h3>
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
									<Item dataField="ID_ChuDeCha" />
									<Item dataField="TrangThai" />
									<Item dataField="DanhSachCha" />
									<Item dataField="SoThuTu" />
									<Item dataField="DanhSachNguoiPhuTrach" />
									<Item dataField="DanhSachNhomPhuTrach" />
									<Item dataField="TenNguoiPhuTrach" />
									<Item dataField="TenNhomPhuTrach" />
									<Item dataField="IDQuyTrinh" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenChuyenMuc" dataType="string" caption="TenChuyenMuc" />
									<Column dataField="ID_ChuDeCha" dataType="string" caption="ID_ChuDeCha" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="DanhSachCha" dataType="string" caption="DanhSachCha" />
									<Column dataField="SoThuTu" dataType="string" caption="SoThuTu" />
									<Column dataField="DanhSachNguoiPhuTrach" dataType="string" caption="DanhSachNguoiPhuTrach" />
									<Column dataField="DanhSachNhomPhuTrach" dataType="string" caption="DanhSachNhomPhuTrach" />
									<Column dataField="TenNguoiPhuTrach" dataType="string" caption="TenNguoiPhuTrach" />
									<Column dataField="TenNhomPhuTrach" dataType="string" caption="TenNhomPhuTrach" />
									<Column dataField="IDQuyTrinh" dataType="string" caption="IDQuyTrinh" />
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

