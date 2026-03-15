
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

const dataSourceOptions = createCustomStore("DVC_TraoDois");

export default function DVC_TraoDoi() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DVC_TraoDoi</h3>
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
                <Popup title="Quản lý DVC_TraoDoi" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TieuDe" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="FilesDinhKem" colSpan={2}  />
				
					<Item dataField="ThoiGianTao" colSpan={2}  />
				
					<Item dataField="NguoiTao" colSpan={2}  />
				
					<Item dataField="ID_HoSo" colSpan={2}  />
				
					<Item dataField="DSNguoiNhan" colSpan={2}  />
				
					<Item dataField="DSTenNguoiNhan" colSpan={2}  />
				
					<Item dataField="HanXuLy" colSpan={2}  />
				
					<Item dataField="DSXuLy" colSpan={2}  />
				
					<Item dataField="ID_BuocQuyTrinh" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TieuDe" dataType="string" caption="TieuDe" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="FilesDinhKem" dataType="string" caption="FilesDinhKem" >
					</Column>
				
					<Column dataField="ThoiGianTao" dataType="string" caption="ThoiGianTao" >
					</Column>
				
					<Column dataField="NguoiTao" dataType="string" caption="NguoiTao" >
					</Column>
				
					<Column dataField="ID_HoSo" dataType="string" caption="ID_HoSo" >
					</Column>
				
					<Column dataField="DSNguoiNhan" dataType="string" caption="DSNguoiNhan" >
					</Column>
				
					<Column dataField="DSTenNguoiNhan" dataType="string" caption="DSTenNguoiNhan" >
					</Column>
				
					<Column dataField="HanXuLy" dataType="string" caption="HanXuLy" >
					</Column>
				
					<Column dataField="DSXuLy" dataType="string" caption="DSXuLy" >
					</Column>
				
					<Column dataField="ID_BuocQuyTrinh" dataType="string" caption="ID_BuocQuyTrinh" >
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

