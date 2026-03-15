
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

const dataSourceOptions = createCustomStore("GLTT_CauHois");

export default function GLTT_CauHoi() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý GLTT_CauHoi</h3>
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
                <Popup title="Quản lý GLTT_CauHoi" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenNguoiHoi" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="DienThoai" colSpan={2}  />
				
					<Item dataField="TieuDeCauHoi" colSpan={2}  />
				
					<Item dataField="NoiDungCauHoi" colSpan={2}  />
				
					<Item dataField="ThoiGianHoi" colSpan={2}  />
				
					<Item dataField="ID_ChuDe" colSpan={2}  />
				
					<Item dataField="ID_PhienGiaoLuu" colSpan={2}  />
				
					<Item dataField="IDs_CauHoi" colSpan={2}  />
				
					<Item dataField="TieuDeTraLoi" colSpan={2}  />
				
					<Item dataField="NoiDungTraLoi" colSpan={2}  />
				
					<Item dataField="ThoiGianTraLoi" colSpan={2}  />
				
					<Item dataField="NguoiTraLoi" colSpan={2}  />
				
					<Item dataField="NguoiXuatBan" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenNguoiHoi" dataType="string" caption="TenNguoiHoi" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="DienThoai" dataType="string" caption="DienThoai" >
					</Column>
				
					<Column dataField="TieuDeCauHoi" dataType="string" caption="TieuDeCauHoi" >
					</Column>
				
					<Column dataField="NoiDungCauHoi" dataType="string" caption="NoiDungCauHoi" >
					</Column>
				
					<Column dataField="ThoiGianHoi" dataType="string" caption="ThoiGianHoi" >
					</Column>
				
					<Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" >
					</Column>
				
					<Column dataField="ID_PhienGiaoLuu" dataType="string" caption="ID_PhienGiaoLuu" >
					</Column>
				
					<Column dataField="IDs_CauHoi" dataType="string" caption="IDs_CauHoi" >
					</Column>
				
					<Column dataField="TieuDeTraLoi" dataType="string" caption="TieuDeTraLoi" >
					</Column>
				
					<Column dataField="NoiDungTraLoi" dataType="string" caption="NoiDungTraLoi" >
					</Column>
				
					<Column dataField="ThoiGianTraLoi" dataType="string" caption="ThoiGianTraLoi" >
					</Column>
				
					<Column dataField="NguoiTraLoi" dataType="string" caption="NguoiTraLoi" >
					</Column>
				
					<Column dataField="NguoiXuatBan" dataType="string" caption="NguoiXuatBan" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
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

