
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

const dataSourceOptions = createCustomStore("Menu_Backends");

export default function Menu_Backend() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý Menu_Backend</h3>
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
                <Popup title="Quản lý Menu_Backend" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenMenu" colSpan={2}  />
				
					<Item dataField="URL" colSpan={2}  />
				
					<Item dataField="STT" colSpan={2}  />
				
					<Item dataField="IDMenuCha" colSpan={2}  />
				
					<Item dataField="QuyenTruyCap" colSpan={2}  />
				
					<Item dataField="FunctionGetNoti" colSpan={2}  />
				
					<Item dataField="CoCanhBao" colSpan={2}  />
				
					<Item dataField="QuyenKhongTruyCap" colSpan={2}  />
				
					<Item dataField="ClassCSS" colSpan={2}  />
				
					<Item dataField="HienThi" colSpan={2}  />
				
					<Item dataField="TenTruyCap" colSpan={2}  />
				
					<Item dataField="FunctionTruyCap" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenMenu" dataType="string" caption="TenMenu" >
					</Column>
				
					<Column dataField="URL" dataType="string" caption="URL" >
					</Column>
				
					<Column dataField="STT" dataType="string" caption="STT" >
					</Column>
				
					<Column dataField="IDMenuCha" dataType="string" caption="IDMenuCha" >
					</Column>
				
					<Column dataField="QuyenTruyCap" dataType="string" caption="QuyenTruyCap" >
					</Column>
				
					<Column dataField="FunctionGetNoti" dataType="string" caption="FunctionGetNoti" >
					</Column>
				
					<Column dataField="CoCanhBao" dataType="string" caption="CoCanhBao" >
					</Column>
				
					<Column dataField="QuyenKhongTruyCap" dataType="string" caption="QuyenKhongTruyCap" >
					</Column>
				
					<Column dataField="ClassCSS" dataType="string" caption="ClassCSS" >
					</Column>
				
					<Column dataField="HienThi" dataType="string" caption="HienThi" >
					</Column>
				
					<Column dataField="TenTruyCap" dataType="string" caption="TenTruyCap" >
					</Column>
				
					<Column dataField="FunctionTruyCap" dataType="string" caption="FunctionTruyCap" >
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

