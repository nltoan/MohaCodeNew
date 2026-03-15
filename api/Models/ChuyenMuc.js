
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

const dataSourceOptions = createCustomStore("ChuyenMucs");

export default function ChuyenMuc() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý ChuyenMuc" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenChuyenMuc" colSpan={2}  />
				
					<Item dataField="ChuyenMucCha" colSpan={2}  />
				
					<Item dataField="LinkTinTuc" colSpan={2}  />
				
					<Item dataField="MoTa" colSpan={2}  />
				
					<Item dataField="IDQuyTrinh" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="DanhSachNguoiPhuTrach" colSpan={2}  />
				
					<Item dataField="DanhSachNhomPhuTrach" colSpan={2}  />
				
					<Item dataField="NgayTao" colSpan={2}  />
				
					<Item dataField="TenNguoiPhuTrach" colSpan={2}  />
				
					<Item dataField="TenNhomPhuTrach" colSpan={2}  />
				
					<Item dataField="SoThuTu" colSpan={2}  />
				
					<Item dataField="VungHienThi" colSpan={2}  />
				
					<Item dataField="LogThayDoi" colSpan={2}  />
				
					<Item dataField="DangKyNhanBaiViet" colSpan={2}  />
				
					<Item dataField="HienThiTieuDe" colSpan={2}  />
				
					<Item dataField="Type" colSpan={2}  />
				
					<Item dataField="Migrate_Source" colSpan={2}  />
				
					<Item dataField="IsVisible" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenChuyenMuc" dataType="string" caption="TenChuyenMuc" >
					</Column>
				
					<Column dataField="ChuyenMucCha" dataType="string" caption="ChuyenMucCha" >
					</Column>
				
					<Column dataField="LinkTinTuc" dataType="string" caption="LinkTinTuc" >
					</Column>
				
					<Column dataField="MoTa" dataType="string" caption="MoTa" >
					</Column>
				
					<Column dataField="IDQuyTrinh" dataType="string" caption="IDQuyTrinh" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="DanhSachNguoiPhuTrach" dataType="string" caption="DanhSachNguoiPhuTrach" >
					</Column>
				
					<Column dataField="DanhSachNhomPhuTrach" dataType="string" caption="DanhSachNhomPhuTrach" >
					</Column>
				
					<Column dataField="NgayTao" dataType="string" caption="NgayTao" >
					</Column>
				
					<Column dataField="TenNguoiPhuTrach" dataType="string" caption="TenNguoiPhuTrach" >
					</Column>
				
					<Column dataField="TenNhomPhuTrach" dataType="string" caption="TenNhomPhuTrach" >
					</Column>
				
					<Column dataField="SoThuTu" dataType="string" caption="SoThuTu" >
					</Column>
				
					<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" >
					</Column>
				
					<Column dataField="LogThayDoi" dataType="string" caption="LogThayDoi" >
					</Column>
				
					<Column dataField="DangKyNhanBaiViet" dataType="string" caption="DangKyNhanBaiViet" >
					</Column>
				
					<Column dataField="HienThiTieuDe" dataType="string" caption="HienThiTieuDe" >
					</Column>
				
					<Column dataField="Type" dataType="string" caption="Type" >
					</Column>
				
					<Column dataField="Migrate_Source" dataType="string" caption="Migrate_Source" >
					</Column>
				
					<Column dataField="IsVisible" dataType="string" caption="IsVisible" >
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

