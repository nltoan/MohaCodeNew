
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

const dataSourceOptions = createCustomStore("DonVi_LanhDaos");

export default function DonVi_LanhDao() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DonVi_LanhDao</h3>
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
                <Popup title="Quản lý DonVi_LanhDao" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="IDLanhDao" colSpan={2}  />
				
					<Item dataField="IDDonVi" colSpan={2}  />
				
					<Item dataField="Hang" colSpan={2}  />
				
					<Item dataField="Cot" colSpan={2}  />
				
					<Item dataField="ChucVu" colSpan={2}  />
				
					<Item dataField="PhuTrach" colSpan={2}  />
				
					<Item dataField="ChucNangNhiemVu" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="IDLanhDao" dataType="string" caption="IDLanhDao" >
					</Column>
				
					<Column dataField="IDDonVi" dataType="string" caption="IDDonVi" >
					</Column>
				
					<Column dataField="Hang" dataType="string" caption="Hang" >
					</Column>
				
					<Column dataField="Cot" dataType="string" caption="Cot" >
					</Column>
				
					<Column dataField="ChucVu" dataType="string" caption="ChucVu" >
					</Column>
				
					<Column dataField="PhuTrach" dataType="string" caption="PhuTrach" >
					</Column>
				
					<Column dataField="ChucNangNhiemVu" dataType="string" caption="ChucNangNhiemVu" >
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

