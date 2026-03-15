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

const url = "http://moha.ptdl.tk/api/User_Accounts"
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

export default function User_Account() {
  return (
    <LayoutAdmin title={"User_Account"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý User_Account</h3>
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
									<Item dataField="UserID" />
									<Item dataField="TenDangKy" />
									<Item dataField="TenTruyCap" />
									<Item dataField="MatKhau" />
									<Item dataField="DiaChi" />
									<Item dataField="SoDienThoai" />
									<Item dataField="EmailAddress" />
									<Item dataField="SoCMND" />
									<Item dataField="TrangThai" />
									<Item dataField="PasswordQuestion" />
									<Item dataField="PasswordAnswer" />
									<Item dataField="CreationDate" />
									<Item dataField="LastLoginDate" />
									<Item dataField="LastPasswordChangeDate" />
									<Item dataField="LastLockoutDate" />
									<Item dataField="IDDVC_DonViDangKy" />
									<Item dataField="LoaiTaiKhoan" />
									<Item dataField="NguoiLienHe_HoVaTen" />
									<Item dataField="NguoiLienHe_CMT_HoChieu" />
									<Item dataField="NguoiLienHe_Email" />
									<Item dataField="NguoiLienHe_DiaChi" />
									<Item dataField="NguoiLienHe_SoDienThoai" />
									<Item dataField="RoleId" />
				                </Form>
              </Editing>
									<Column dataField="UserID" dataType="string" caption="UserID" />
									<Column dataField="TenDangKy" dataType="string" caption="TenDangKy" />
									<Column dataField="TenTruyCap" dataType="string" caption="TenTruyCap" />
									<Column dataField="MatKhau" dataType="string" caption="MatKhau" />
									<Column dataField="DiaChi" dataType="string" caption="DiaChi" />
									<Column dataField="SoDienThoai" dataType="string" caption="SoDienThoai" />
									<Column dataField="EmailAddress" dataType="string" caption="EmailAddress" />
									<Column dataField="SoCMND" dataType="string" caption="SoCMND" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="PasswordQuestion" dataType="string" caption="PasswordQuestion" />
									<Column dataField="PasswordAnswer" dataType="string" caption="PasswordAnswer" />
									<Column dataField="CreationDate" dataType="string" caption="CreationDate" />
									<Column dataField="LastLoginDate" dataType="string" caption="LastLoginDate" />
									<Column dataField="LastPasswordChangeDate" dataType="string" caption="LastPasswordChangeDate" />
									<Column dataField="LastLockoutDate" dataType="string" caption="LastLockoutDate" />
									<Column dataField="IDDVC_DonViDangKy" dataType="string" caption="IDDVC_DonViDangKy" />
									<Column dataField="LoaiTaiKhoan" dataType="string" caption="LoaiTaiKhoan" />
									<Column dataField="NguoiLienHe_HoVaTen" dataType="string" caption="NguoiLienHe_HoVaTen" />
									<Column dataField="NguoiLienHe_CMT_HoChieu" dataType="string" caption="NguoiLienHe_CMT_HoChieu" />
									<Column dataField="NguoiLienHe_Email" dataType="string" caption="NguoiLienHe_Email" />
									<Column dataField="NguoiLienHe_DiaChi" dataType="string" caption="NguoiLienHe_DiaChi" />
									<Column dataField="NguoiLienHe_SoDienThoai" dataType="string" caption="NguoiLienHe_SoDienThoai" />
									<Column dataField="RoleId" dataType="string" caption="RoleId" />
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

