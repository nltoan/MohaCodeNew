
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

const dataSourceOptions = createCustomStore("DVC_HoSos");

export default function DVC_HoSo() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DVC_HoSo</h3>
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
                <Popup title="Quản lý DVC_HoSo" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenHoSo" colSpan={2}  />
				
					<Item dataField="TenDichVuCong" colSpan={2}  />
				
					<Item dataField="NguoiGui" colSpan={2}  />
				
					<Item dataField="LinkLuuTru" colSpan={2}  />
				
					<Item dataField="ThoiGianTao" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="ID_DichVuCong3" colSpan={2}  />
				
					<Item dataField="ArrayIDsFiles" colSpan={2}  />
				
					<Item dataField="ID_HoSoGoc" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenHoSo" dataType="string" caption="TenHoSo" >
					</Column>
				
					<Column dataField="TenDichVuCong" dataType="string" caption="TenDichVuCong" >
					</Column>
				
					<Column dataField="NguoiGui" dataType="string" caption="NguoiGui" >
					</Column>
				
					<Column dataField="LinkLuuTru" dataType="string" caption="LinkLuuTru" >
					</Column>
				
					<Column dataField="ThoiGianTao" dataType="string" caption="ThoiGianTao" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="ID_DichVuCong3" dataType="string" caption="ID_DichVuCong3" >
					</Column>
				
					<Column dataField="ArrayIDsFiles" dataType="string" caption="ArrayIDsFiles" >
					</Column>
				
					<Column dataField="ID_HoSoGoc" dataType="string" caption="ID_HoSoGoc" >
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

