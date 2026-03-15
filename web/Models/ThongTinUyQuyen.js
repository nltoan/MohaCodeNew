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

const url = "http://moha.ptdl.tk/api/ThongTinUyQuyens"
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

export default function ThongTinUyQuyen() {
  return (
    <LayoutAdmin title={"ThongTinUyQuyen"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ThongTinUyQuyen</h3>
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
									<Item dataField="NguoiUyQuyen" />
									<Item dataField="NguoiDuocUyQuyen" />
									<Item dataField="NguoiCapNhat" />
									<Item dataField="ThoiGianBatDau" />
									<Item dataField="ThoiGianKetThuc" />
									<Item dataField="ThoiGianCapNhat" />
									<Item dataField="TaiKhoanUyQuyen" />
									<Item dataField="TaiKhoanDuocUyQuyen" />
									<Item dataField="TaiKhoanCapNhat" />
									<Item dataField="TenDonVi" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="NguoiUyQuyen" dataType="string" caption="NguoiUyQuyen" />
									<Column dataField="NguoiDuocUyQuyen" dataType="string" caption="NguoiDuocUyQuyen" />
									<Column dataField="NguoiCapNhat" dataType="string" caption="NguoiCapNhat" />
									<Column dataField="ThoiGianBatDau" dataType="string" caption="ThoiGianBatDau" />
									<Column dataField="ThoiGianKetThuc" dataType="string" caption="ThoiGianKetThuc" />
									<Column dataField="ThoiGianCapNhat" dataType="string" caption="ThoiGianCapNhat" />
									<Column dataField="TaiKhoanUyQuyen" dataType="string" caption="TaiKhoanUyQuyen" />
									<Column dataField="TaiKhoanDuocUyQuyen" dataType="string" caption="TaiKhoanDuocUyQuyen" />
									<Column dataField="TaiKhoanCapNhat" dataType="string" caption="TaiKhoanCapNhat" />
									<Column dataField="TenDonVi" dataType="string" caption="TenDonVi" />
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

