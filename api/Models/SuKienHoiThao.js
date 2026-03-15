
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

const dataSourceOptions = createCustomStore("SuKienHoiThaos");

export default function SuKienHoiThao() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý SuKienHoiThao</h3>
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
                <Popup title="Quản lý SuKienHoiThao" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenHoiThao" colSpan={2}  />
				
					<Item dataField="LoaiHoiThao" colSpan={2}  />
				
					<Item dataField="ThoiGianTu" colSpan={2}  />
				
					<Item dataField="ThoiGianDen" colSpan={2}  />
				
					<Item dataField="DonViTaiTro" colSpan={2}  />
				
					<Item dataField="DiaDiemToChuc" colSpan={2}  />
				
					<Item dataField="ThanhPhanThamGia" colSpan={2}  />
				
					<Item dataField="DonViToChucChinh" colSpan={2}  />
				
					<Item dataField="FileNoiDung" colSpan={2}  />
				
					<Item dataField="NoiDungThongTinMoi" colSpan={2}  />
				
					<Item dataField="ChoPhepDangKy" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="Lang" colSpan={2}  />
				
					<Item dataField="AnhDaiDien" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenHoiThao" dataType="string" caption="TenHoiThao" >
					</Column>
				
					<Column dataField="LoaiHoiThao" dataType="string" caption="LoaiHoiThao" >
					</Column>
				
					<Column dataField="ThoiGianTu" dataType="string" caption="ThoiGianTu" >
					</Column>
				
					<Column dataField="ThoiGianDen" dataType="string" caption="ThoiGianDen" >
					</Column>
				
					<Column dataField="DonViTaiTro" dataType="string" caption="DonViTaiTro" >
					</Column>
				
					<Column dataField="DiaDiemToChuc" dataType="string" caption="DiaDiemToChuc" >
					</Column>
				
					<Column dataField="ThanhPhanThamGia" dataType="string" caption="ThanhPhanThamGia" >
					</Column>
				
					<Column dataField="DonViToChucChinh" dataType="string" caption="DonViToChucChinh" >
					</Column>
				
					<Column dataField="FileNoiDung" dataType="string" caption="FileNoiDung" >
					</Column>
				
					<Column dataField="NoiDungThongTinMoi" dataType="string" caption="NoiDungThongTinMoi" >
					</Column>
				
					<Column dataField="ChoPhepDangKy" dataType="string" caption="ChoPhepDangKy" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="Lang" dataType="string" caption="Lang" >
					</Column>
				
					<Column dataField="AnhDaiDien" dataType="string" caption="AnhDaiDien" >
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

