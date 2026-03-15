
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

const dataSourceOptions = createCustomStore("ThongTinDoanhNghieps");

export default function ThongTinDoanhNghiep() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ThongTinDoanhNghiep</h3>
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
                <Popup title="Quản lý ThongTinDoanhNghiep" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenDoanhNghiep" colSpan={2}  />
				
					<Item dataField="MaSoDoanhNghiep" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="DienThoai" colSpan={2}  />
				
					<Item dataField="EmailAddress" colSpan={2}  />
				
					<Item dataField="Website" colSpan={2}  />
				
					<Item dataField="CoQuanThucHien" colSpan={2}  />
				
					<Item dataField="NguoiDaiDien" colSpan={2}  />
				
					<Item dataField="ChucVuNguoiDaiDien" colSpan={2}  />
				
					<Item dataField="DienThoaiNguoiDaiDien" colSpan={2}  />
				
					<Item dataField="EmailNguoiDaiDien" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="FilesDinhKem" colSpan={2}  />
				
					<Item dataField="Fax" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenDoanhNghiep" dataType="string" caption="TenDoanhNghiep" >
					</Column>
				
					<Column dataField="MaSoDoanhNghiep" dataType="string" caption="MaSoDoanhNghiep" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="DienThoai" dataType="string" caption="DienThoai" >
					</Column>
				
					<Column dataField="EmailAddress" dataType="string" caption="EmailAddress" >
					</Column>
				
					<Column dataField="Website" dataType="string" caption="Website" >
					</Column>
				
					<Column dataField="CoQuanThucHien" dataType="string" caption="CoQuanThucHien" >
					</Column>
				
					<Column dataField="NguoiDaiDien" dataType="string" caption="NguoiDaiDien" >
					</Column>
				
					<Column dataField="ChucVuNguoiDaiDien" dataType="string" caption="ChucVuNguoiDaiDien" >
					</Column>
				
					<Column dataField="DienThoaiNguoiDaiDien" dataType="string" caption="DienThoaiNguoiDaiDien" >
					</Column>
				
					<Column dataField="EmailNguoiDaiDien" dataType="string" caption="EmailNguoiDaiDien" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="FilesDinhKem" dataType="string" caption="FilesDinhKem" >
					</Column>
				
					<Column dataField="Fax" dataType="string" caption="Fax" >
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

