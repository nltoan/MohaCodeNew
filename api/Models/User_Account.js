
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
  FormItem,
  FilterRow, 
  HeaderFilter,
  RequiredRule
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

const dataSourceOptions = createCustomStore("User_Accounts");

export default function User_Account() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý User_Account" showTitle={true} />
                <Form>
				
					<Item dataField="UserID" colSpan={2}  />
				
					<Item dataField="TenDangKy" colSpan={2}  />
				
					<Item dataField="TenTruyCap" colSpan={2}  />
				
					<Item dataField="MatKhau" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="SoDienThoai" colSpan={2}  />
				
					<Item dataField="EmailAddress" colSpan={2}  />
				
					<Item dataField="SoCMND" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="PasswordQuestion" colSpan={2}  />
				
					<Item dataField="PasswordAnswer" colSpan={2}  />
				
					<Item dataField="CreationDate" colSpan={2}  />
				
					<Item dataField="LastLoginDate" colSpan={2}  />
				
					<Item dataField="LastPasswordChangeDate" colSpan={2}  />
				
					<Item dataField="LastLockoutDate" colSpan={2}  />
				
					<Item dataField="IDDVC_DonViDangKy" colSpan={2}  />
				
					<Item dataField="LoaiTaiKhoan" colSpan={2}  />
				
					<Item dataField="NguoiLienHe_HoVaTen" colSpan={2}  />
				
					<Item dataField="NguoiLienHe_CMT_HoChieu" colSpan={2}  />
				
					<Item dataField="NguoiLienHe_Email" colSpan={2}  />
				
					<Item dataField="NguoiLienHe_DiaChi" colSpan={2}  />
				
					<Item dataField="NguoiLienHe_SoDienThoai" colSpan={2}  />
				
					<Item dataField="RoleId" colSpan={2}  />
				
					<Item dataField="Authenticator_Secret" colSpan={2}  />
				
					<Item dataField="IsTwoFA" colSpan={2}  />
				
					<Item dataField="IsReceiveEmail" colSpan={2}  />
				
					<Item dataField="TypeUser" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="UserID" dataType="string" caption="UserID" >
					</Column>
				
					<Column dataField="TenDangKy" dataType="string" caption="TenDangKy" >
					</Column>
				
					<Column dataField="TenTruyCap" dataType="string" caption="TenTruyCap" >
					</Column>
				
					<Column dataField="MatKhau" dataType="string" caption="MatKhau" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="SoDienThoai" dataType="string" caption="SoDienThoai" >
					</Column>
				
					<Column dataField="EmailAddress" dataType="string" caption="EmailAddress" >
					</Column>
				
					<Column dataField="SoCMND" dataType="string" caption="SoCMND" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="PasswordQuestion" dataType="string" caption="PasswordQuestion" >
					</Column>
				
					<Column dataField="PasswordAnswer" dataType="string" caption="PasswordAnswer" >
					</Column>
				
					<Column dataField="CreationDate" dataType="string" caption="CreationDate" >
					</Column>
				
					<Column dataField="LastLoginDate" dataType="string" caption="LastLoginDate" >
					</Column>
				
					<Column dataField="LastPasswordChangeDate" dataType="string" caption="LastPasswordChangeDate" >
					</Column>
				
					<Column dataField="LastLockoutDate" dataType="string" caption="LastLockoutDate" >
					</Column>
				
					<Column dataField="IDDVC_DonViDangKy" dataType="string" caption="IDDVC_DonViDangKy" >
					</Column>
				
					<Column dataField="LoaiTaiKhoan" dataType="string" caption="LoaiTaiKhoan" >
					</Column>
				
					<Column dataField="NguoiLienHe_HoVaTen" dataType="string" caption="NguoiLienHe_HoVaTen" >
					</Column>
				
					<Column dataField="NguoiLienHe_CMT_HoChieu" dataType="string" caption="NguoiLienHe_CMT_HoChieu" >
					</Column>
				
					<Column dataField="NguoiLienHe_Email" dataType="string" caption="NguoiLienHe_Email" >
					</Column>
				
					<Column dataField="NguoiLienHe_DiaChi" dataType="string" caption="NguoiLienHe_DiaChi" >
					</Column>
				
					<Column dataField="NguoiLienHe_SoDienThoai" dataType="string" caption="NguoiLienHe_SoDienThoai" >
					</Column>
				
					<Column dataField="RoleId" dataType="string" caption="RoleId" >
					</Column>
				
					<Column dataField="Authenticator_Secret" dataType="string" caption="Authenticator_Secret" >
					</Column>
				
					<Column dataField="IsTwoFA" dataType="string" caption="IsTwoFA" >
					</Column>
				
					<Column dataField="IsReceiveEmail" dataType="string" caption="IsReceiveEmail" >
					</Column>
				
					<Column dataField="TypeUser" dataType="string" caption="TypeUser" >
					</Column>
				
              <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
              <Paging defaultPageSize={20} />
            </DataGrid>
          </div>
          <div className="card-footer">
          </div>
      </div>
  );
}

