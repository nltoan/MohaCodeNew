
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

const dataSourceOptions = createCustomStore("HoiDap_CauHois");

export default function HoiDap_CauHoi() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý HoiDap_CauHoi</h3>
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
                <Popup title="Quản lý HoiDap_CauHoi" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="HoTen" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="DienThoai" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="CauHoi" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="ID_ChuDe" colSpan={2}  />
				
					<Item dataField="PhanCongTraLoi" colSpan={2}  />
				
					<Item dataField="DonViTraLoi" colSpan={2}  />
				
					<Item dataField="DonViDongXuLy" colSpan={2}  />
				
					<Item dataField="ThoiGianTao" colSpan={2}  />
				
					<Item dataField="ThoiGianXuatBan" colSpan={2}  />
				
					<Item dataField="FileDinhKems" colSpan={2}  />
				
					<Item dataField="Attachments" colSpan={2}  />
				
					<Item dataField="TieuDe" colSpan={2}  />
				
					<Item dataField="ID_ChuDe_New" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="HoTen" dataType="string" caption="HoTen" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="DienThoai" dataType="string" caption="DienThoai" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="CauHoi" dataType="string" caption="CauHoi" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" >
					</Column>
				
					<Column dataField="PhanCongTraLoi" dataType="string" caption="PhanCongTraLoi" >
					</Column>
				
					<Column dataField="DonViTraLoi" dataType="string" caption="DonViTraLoi" >
					</Column>
				
					<Column dataField="DonViDongXuLy" dataType="string" caption="DonViDongXuLy" >
					</Column>
				
					<Column dataField="ThoiGianTao" dataType="string" caption="ThoiGianTao" >
					</Column>
				
					<Column dataField="ThoiGianXuatBan" dataType="string" caption="ThoiGianXuatBan" >
					</Column>
				
					<Column dataField="FileDinhKems" dataType="string" caption="FileDinhKems" >
					</Column>
				
					<Column dataField="Attachments" dataType="string" caption="Attachments" >
					</Column>
				
					<Column dataField="TieuDe" dataType="string" caption="TieuDe" >
					</Column>
				
					<Column dataField="ID_ChuDe_New" dataType="string" caption="ID_ChuDe_New" >
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

