
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

const dataSourceOptions = createCustomStore("ABL_ChuyenMucAlbumVideos");

export default function ABL_ChuyenMucAlbumVideo() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ABL_ChuyenMucAlbumVideo</h3>
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
                <Popup title="Quản lý ABL_ChuyenMucAlbumVideo" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenChuyenMuc" colSpan={2}  />
				
					<Item dataField="ID_ChuDeCha" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="DanhSachCha" colSpan={2}  />
				
					<Item dataField="SoThuTu" colSpan={2}  />
				
					<Item dataField="DanhSachNguoiPhuTrach" colSpan={2}  />
				
					<Item dataField="DanhSachNhomPhuTrach" colSpan={2}  />
				
					<Item dataField="TenNguoiPhuTrach" colSpan={2}  />
				
					<Item dataField="TenNhomPhuTrach" colSpan={2}  />
				
					<Item dataField="IDQuyTrinh" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenChuyenMuc" dataType="string" caption="TenChuyenMuc" >
					</Column>
				
					<Column dataField="ID_ChuDeCha" dataType="string" caption="ID_ChuDeCha" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="DanhSachCha" dataType="string" caption="DanhSachCha" >
					</Column>
				
					<Column dataField="SoThuTu" dataType="string" caption="SoThuTu" >
					</Column>
				
					<Column dataField="DanhSachNguoiPhuTrach" dataType="string" caption="DanhSachNguoiPhuTrach" >
					</Column>
				
					<Column dataField="DanhSachNhomPhuTrach" dataType="string" caption="DanhSachNhomPhuTrach" >
					</Column>
				
					<Column dataField="TenNguoiPhuTrach" dataType="string" caption="TenNguoiPhuTrach" >
					</Column>
				
					<Column dataField="TenNhomPhuTrach" dataType="string" caption="TenNhomPhuTrach" >
					</Column>
				
					<Column dataField="IDQuyTrinh" dataType="string" caption="IDQuyTrinh" >
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

