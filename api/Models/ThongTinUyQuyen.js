
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

const dataSourceOptions = createCustomStore("ThongTinUyQuyens");

export default function ThongTinUyQuyen() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý ThongTinUyQuyen" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="NguoiUyQuyen" colSpan={2}  />
				
					<Item dataField="NguoiDuocUyQuyen" colSpan={2}  />
				
					<Item dataField="NguoiCapNhat" colSpan={2}  />
				
					<Item dataField="ThoiGianBatDau" colSpan={2}  />
				
					<Item dataField="ThoiGianKetThuc" colSpan={2}  />
				
					<Item dataField="ThoiGianCapNhat" colSpan={2}  />
				
					<Item dataField="TaiKhoanUyQuyen" colSpan={2}  />
				
					<Item dataField="TaiKhoanDuocUyQuyen" colSpan={2}  />
				
					<Item dataField="TaiKhoanCapNhat" colSpan={2}  />
				
					<Item dataField="TenDonVi" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="NguoiUyQuyen" dataType="string" caption="NguoiUyQuyen" >
					</Column>
				
					<Column dataField="NguoiDuocUyQuyen" dataType="string" caption="NguoiDuocUyQuyen" >
					</Column>
				
					<Column dataField="NguoiCapNhat" dataType="string" caption="NguoiCapNhat" >
					</Column>
				
					<Column dataField="ThoiGianBatDau" dataType="string" caption="ThoiGianBatDau" >
					</Column>
				
					<Column dataField="ThoiGianKetThuc" dataType="string" caption="ThoiGianKetThuc" >
					</Column>
				
					<Column dataField="ThoiGianCapNhat" dataType="string" caption="ThoiGianCapNhat" >
					</Column>
				
					<Column dataField="TaiKhoanUyQuyen" dataType="string" caption="TaiKhoanUyQuyen" >
					</Column>
				
					<Column dataField="TaiKhoanDuocUyQuyen" dataType="string" caption="TaiKhoanDuocUyQuyen" >
					</Column>
				
					<Column dataField="TaiKhoanCapNhat" dataType="string" caption="TaiKhoanCapNhat" >
					</Column>
				
					<Column dataField="TenDonVi" dataType="string" caption="TenDonVi" >
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

