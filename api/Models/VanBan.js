
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

const dataSourceOptions = createCustomStore("VanBans");

export default function VanBan() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý VanBan" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="SoKyHieu" colSpan={2}  />
				
					<Item dataField="NgayBanHanh" colSpan={2}  />
				
					<Item dataField="NgayXuatBan" colSpan={2}  />
				
					<Item dataField="ID_HinhThucVanBan" colSpan={2}  />
				
					<Item dataField="IDs_LinhVuc" colSpan={2}  />
				
					<Item dataField="IDs_LopVanBan" colSpan={2}  />
				
					<Item dataField="IDs_CoQuanBanHanh" colSpan={2}  />
				
					<Item dataField="TrichYeu" colSpan={2}  />
				
					<Item dataField="NguoiKy" colSpan={2}  />
				
					<Item dataField="NgayCoHieuLuc" colSpan={2}  />
				
					<Item dataField="NgayHetHan" colSpan={2}  />
				
					<Item dataField="VanBanLienQuan" colSpan={2}  />
				
					<Item dataField="FileDinhKem" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="Lang" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="VanBanConHieuLuc" colSpan={2}  />
				
					<Item dataField="GhiChu" colSpan={2}  />
				
					<Item dataField="NgayHetHieuLuc1Phan" colSpan={2}  />
				
					<Item dataField="VanBanBiTacDongHieuLuc1Phan" colSpan={2}  />
				
					<Item dataField="ChucDanh" colSpan={2}  />
				
					<Item dataField="NgayKyKet" colSpan={2}  />
				
					<Item dataField="NgayCongBo" colSpan={2}  />
				
					<Item dataField="NgayGiaNhap" colSpan={2}  />
				
					<Item dataField="NgayCoHLVietNam" colSpan={2}  />
				
					<Item dataField="TinhTrang" colSpan={2}  />
				
					<Item dataField="FileGoc" colSpan={2}  />
				
					<Item dataField="Migrate_Source" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="SoKyHieu" dataType="string" caption="SoKyHieu" >
					</Column>
				
					<Column dataField="NgayBanHanh" dataType="string" caption="NgayBanHanh" >
					</Column>
				
					<Column dataField="NgayXuatBan" dataType="string" caption="NgayXuatBan" >
					</Column>
				
					<Column dataField="ID_HinhThucVanBan" dataType="string" caption="ID_HinhThucVanBan" >
					</Column>
				
					<Column dataField="IDs_LinhVuc" dataType="string" caption="IDs_LinhVuc" >
					</Column>
				
					<Column dataField="IDs_LopVanBan" dataType="string" caption="IDs_LopVanBan" >
					</Column>
				
					<Column dataField="IDs_CoQuanBanHanh" dataType="string" caption="IDs_CoQuanBanHanh" >
					</Column>
				
					<Column dataField="TrichYeu" dataType="string" caption="TrichYeu" >
					</Column>
				
					<Column dataField="NguoiKy" dataType="string" caption="NguoiKy" >
					</Column>
				
					<Column dataField="NgayCoHieuLuc" dataType="string" caption="NgayCoHieuLuc" >
					</Column>
				
					<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" >
					</Column>
				
					<Column dataField="VanBanLienQuan" dataType="string" caption="VanBanLienQuan" >
					</Column>
				
					<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="Lang" dataType="string" caption="Lang" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="VanBanConHieuLuc" dataType="string" caption="VanBanConHieuLuc" >
					</Column>
				
					<Column dataField="GhiChu" dataType="string" caption="GhiChu" >
					</Column>
				
					<Column dataField="NgayHetHieuLuc1Phan" dataType="string" caption="NgayHetHieuLuc1Phan" >
					</Column>
				
					<Column dataField="VanBanBiTacDongHieuLuc1Phan" dataType="string" caption="VanBanBiTacDongHieuLuc1Phan" >
					</Column>
				
					<Column dataField="ChucDanh" dataType="string" caption="ChucDanh" >
					</Column>
				
					<Column dataField="NgayKyKet" dataType="string" caption="NgayKyKet" >
					</Column>
				
					<Column dataField="NgayCongBo" dataType="string" caption="NgayCongBo" >
					</Column>
				
					<Column dataField="NgayGiaNhap" dataType="string" caption="NgayGiaNhap" >
					</Column>
				
					<Column dataField="NgayCoHLVietNam" dataType="string" caption="NgayCoHLVietNam" >
					</Column>
				
					<Column dataField="TinhTrang" dataType="string" caption="TinhTrang" >
					</Column>
				
					<Column dataField="FileGoc" dataType="string" caption="FileGoc" >
					</Column>
				
					<Column dataField="Migrate_Source" dataType="string" caption="Migrate_Source" >
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

