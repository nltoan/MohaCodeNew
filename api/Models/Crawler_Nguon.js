
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

const dataSourceOptions = createCustomStore("Crawler_Nguons");

export default function Crawler_Nguon() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý Crawler_Nguon</h3>
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
                <Popup title="Quản lý Crawler_Nguon" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenNguon" colSpan={2}  />
				
					<Item dataField="LinkLienKet" colSpan={2}  />
				
					<Item dataField="LoaiLienKet" colSpan={2}  />
				
					<Item dataField="Nguon" colSpan={2}  />
				
					<Item dataField="KichHoat" colSpan={2}  />
				
					<Item dataField="MoTa" colSpan={2}  />
				
					<Item dataField="BaseUrl" colSpan={2}  />
				
					<Item dataField="ChuDeID" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenNguon" dataType="string" caption="TenNguon" >
					</Column>
				
					<Column dataField="LinkLienKet" dataType="string" caption="LinkLienKet" >
					</Column>
				
					<Column dataField="LoaiLienKet" dataType="string" caption="LoaiLienKet" >
					</Column>
				
					<Column dataField="Nguon" dataType="string" caption="Nguon" >
					</Column>
				
					<Column dataField="KichHoat" dataType="string" caption="KichHoat" >
					</Column>
				
					<Column dataField="MoTa" dataType="string" caption="MoTa" >
					</Column>
				
					<Column dataField="BaseUrl" dataType="string" caption="BaseUrl" >
					</Column>
				
					<Column dataField="ChuDeID" dataType="string" caption="ChuDeID" >
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

