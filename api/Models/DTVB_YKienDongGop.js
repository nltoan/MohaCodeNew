
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

const dataSourceOptions = createCustomStore("DTVB_YKienDongGops");

export default function DTVB_YKienDongGop() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DTVB_YKienDongGop</h3>
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
                <Popup title="Quản lý DTVB_YKienDongGop" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="HoVaTen" colSpan={2}  />
				
					<Item dataField="TieuDe" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="DienThoai" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="ArrayIDsFiles" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="IDDuThaoVanBan" colSpan={2}  />
				
					<Item dataField="NgayTao" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="HoVaTen" dataType="string" caption="HoVaTen" >
					</Column>
				
					<Column dataField="TieuDe" dataType="string" caption="TieuDe" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="DienThoai" dataType="string" caption="DienThoai" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="ArrayIDsFiles" dataType="string" caption="ArrayIDsFiles" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="IDDuThaoVanBan" dataType="string" caption="IDDuThaoVanBan" >
					</Column>
				
					<Column dataField="NgayTao" dataType="string" caption="NgayTao" >
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

