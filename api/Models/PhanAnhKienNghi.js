
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

const dataSourceOptions = createCustomStore("PhanAnhKienNghis");

export default function PhanAnhKienNghi() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý PhanAnhKienNghi</h3>
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
                <Popup title="Quản lý PhanAnhKienNghi" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenCauHoi" colSpan={2}  />
				
					<Item dataField="TenNguoiGui" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="SoDienThoai" colSpan={2}  />
				
					<Item dataField="IPNguoiGui" colSpan={2}  />
				
					<Item dataField="LinhVucId" colSpan={2}  />
				
					<Item dataField="CoQuanId" colSpan={2}  />
				
					<Item dataField="NgayHoi" colSpan={2}  />
				
					<Item dataField="NguoiTraLoi" colSpan={2}  />
				
					<Item dataField="LuotXem" colSpan={2}  />
				
					<Item dataField="HienThiLuotXem" colSpan={2}  />
				
					<Item dataField="NoiDungCauHoi" colSpan={2}  />
				
					<Item dataField="NoiDungCauTraLoi" colSpan={2}  />
				
					<Item dataField="Migrate_Source" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenCauHoi" dataType="string" caption="TenCauHoi" >
					</Column>
				
					<Column dataField="TenNguoiGui" dataType="string" caption="TenNguoiGui" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="SoDienThoai" dataType="string" caption="SoDienThoai" >
					</Column>
				
					<Column dataField="IPNguoiGui" dataType="string" caption="IPNguoiGui" >
					</Column>
				
					<Column dataField="LinhVucId" dataType="string" caption="LinhVucId" >
					</Column>
				
					<Column dataField="CoQuanId" dataType="string" caption="CoQuanId" >
					</Column>
				
					<Column dataField="NgayHoi" dataType="string" caption="NgayHoi" >
					</Column>
				
					<Column dataField="NguoiTraLoi" dataType="string" caption="NguoiTraLoi" >
					</Column>
				
					<Column dataField="LuotXem" dataType="string" caption="LuotXem" >
					</Column>
				
					<Column dataField="HienThiLuotXem" dataType="string" caption="HienThiLuotXem" >
					</Column>
				
					<Column dataField="NoiDungCauHoi" dataType="string" caption="NoiDungCauHoi" >
					</Column>
				
					<Column dataField="NoiDungCauTraLoi" dataType="string" caption="NoiDungCauTraLoi" >
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

