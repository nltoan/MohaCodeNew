
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

const dataSourceOptions = createCustomStore("TinTuc_Historys");

export default function TinTuc_History() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý TinTuc_History</h3>
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
                <Popup title="Quản lý TinTuc_History" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TieuDe" colSpan={2}  />
				
					<Item dataField="MoTa" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="TacGia" colSpan={2}  />
				
					<Item dataField="NgayTao" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="IDChuyenMuc" colSpan={2}  />
				
					<Item dataField="ChoPhepGuiPhanHoi" colSpan={2}  />
				
					<Item dataField="CacTinLienQuan" colSpan={2}  />
				
					<Item dataField="AnhDaiDien" colSpan={2}  />
				
					<Item dataField="NgayXuatBan" colSpan={2}  />
				
					<Item dataField="DongSuKien" colSpan={2}  />
				
					<Item dataField="VungHienThi" colSpan={2}  />
				
					<Item dataField="FilesDinhKem" colSpan={2}  />
				
					<Item dataField="NguonTin" colSpan={2}  />
				
					<Item dataField="PhuDe" colSpan={2}  />
				
					<Item dataField="NguoiTao" colSpan={2}  />
				
					<Item dataField="NguoiTraVe" colSpan={2}  />
				
					<Item dataField="NgayTraVe" colSpan={2}  />
				
					<Item dataField="TenNguoiTao" colSpan={2}  />
				
					<Item dataField="TenNguoiTraVe" colSpan={2}  />
				
					<Item dataField="TuKhoa" colSpan={2}  />
				
					<Item dataField="PageCount" colSpan={2}  />
				
					<Item dataField="DanhGia" colSpan={2}  />
				
					<Item dataField="ThoiGianUuTien" colSpan={2}  />
				
					<Item dataField="LogChuyenMucThayDoi" colSpan={2}  />
				
					<Item dataField="LogQuyTrinhThayDoi" colSpan={2}  />
				
					<Item dataField="LoaiTin" colSpan={2}  />
				
					<Item dataField="ChuyenMucHienThiThem" colSpan={2}  />
				
					<Item dataField="PreFix" colSpan={2}  />
				
					<Item dataField="Infographich" colSpan={2}  />
				
					<Item dataField="Type" colSpan={2}  />
				
					<Item dataField="TinTucID" colSpan={2}  />
				
					<Item dataField="UpdatedAt" colSpan={2}  />
				
					<Item dataField="UserId" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TieuDe" dataType="string" caption="TieuDe" >
					</Column>
				
					<Column dataField="MoTa" dataType="string" caption="MoTa" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="TacGia" dataType="string" caption="TacGia" >
					</Column>
				
					<Column dataField="NgayTao" dataType="string" caption="NgayTao" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="IDChuyenMuc" dataType="string" caption="IDChuyenMuc" >
					</Column>
				
					<Column dataField="ChoPhepGuiPhanHoi" dataType="string" caption="ChoPhepGuiPhanHoi" >
					</Column>
				
					<Column dataField="CacTinLienQuan" dataType="string" caption="CacTinLienQuan" >
					</Column>
				
					<Column dataField="AnhDaiDien" dataType="string" caption="AnhDaiDien" >
					</Column>
				
					<Column dataField="NgayXuatBan" dataType="string" caption="NgayXuatBan" >
					</Column>
				
					<Column dataField="DongSuKien" dataType="string" caption="DongSuKien" >
					</Column>
				
					<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" >
					</Column>
				
					<Column dataField="FilesDinhKem" dataType="string" caption="FilesDinhKem" >
					</Column>
				
					<Column dataField="NguonTin" dataType="string" caption="NguonTin" >
					</Column>
				
					<Column dataField="PhuDe" dataType="string" caption="PhuDe" >
					</Column>
				
					<Column dataField="NguoiTao" dataType="string" caption="NguoiTao" >
					</Column>
				
					<Column dataField="NguoiTraVe" dataType="string" caption="NguoiTraVe" >
					</Column>
				
					<Column dataField="NgayTraVe" dataType="string" caption="NgayTraVe" >
					</Column>
				
					<Column dataField="TenNguoiTao" dataType="string" caption="TenNguoiTao" >
					</Column>
				
					<Column dataField="TenNguoiTraVe" dataType="string" caption="TenNguoiTraVe" >
					</Column>
				
					<Column dataField="TuKhoa" dataType="string" caption="TuKhoa" >
					</Column>
				
					<Column dataField="PageCount" dataType="string" caption="PageCount" >
					</Column>
				
					<Column dataField="DanhGia" dataType="string" caption="DanhGia" >
					</Column>
				
					<Column dataField="ThoiGianUuTien" dataType="string" caption="ThoiGianUuTien" >
					</Column>
				
					<Column dataField="LogChuyenMucThayDoi" dataType="string" caption="LogChuyenMucThayDoi" >
					</Column>
				
					<Column dataField="LogQuyTrinhThayDoi" dataType="string" caption="LogQuyTrinhThayDoi" >
					</Column>
				
					<Column dataField="LoaiTin" dataType="string" caption="LoaiTin" >
					</Column>
				
					<Column dataField="ChuyenMucHienThiThem" dataType="string" caption="ChuyenMucHienThiThem" >
					</Column>
				
					<Column dataField="PreFix" dataType="string" caption="PreFix" >
					</Column>
				
					<Column dataField="Infographich" dataType="string" caption="Infographich" >
					</Column>
				
					<Column dataField="Type" dataType="string" caption="Type" >
					</Column>
				
					<Column dataField="TinTucID" dataType="string" caption="TinTucID" >
					</Column>
				
					<Column dataField="UpdatedAt" dataType="string" caption="UpdatedAt" >
					</Column>
				
					<Column dataField="UserId" dataType="string" caption="UserId" >
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

