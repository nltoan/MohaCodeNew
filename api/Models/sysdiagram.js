
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

const dataSourceOptions = createCustomStore("sysdiagrams");

export default function sysdiagram() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý sysdiagram</h3>
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
                <Popup title="Quản lý sysdiagram" showTitle={true} />
                <Form>
				
					<Item dataField="name" colSpan={2}  />
				
					<Item dataField="principal_id" colSpan={2}  />
				
					<Item dataField="diagram_id" colSpan={2}  />
				
					<Item dataField="version" colSpan={2}  />
				
					<Item dataField="definition" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="name" dataType="string" caption="name" >
					</Column>
				
					<Column dataField="principal_id" dataType="string" caption="principal_id" >
					</Column>
				
					<Column dataField="diagram_id" dataType="string" caption="diagram_id" >
					</Column>
				
					<Column dataField="version" dataType="string" caption="version" >
					</Column>
				
					<Column dataField="definition" dataType="string" caption="definition" >
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

