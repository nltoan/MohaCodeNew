
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

const dataSourceOptions = createCustomStore("DuAnDauThaus");

export default function DuAnDauThau() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DuAnDauThau</h3>
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
                <Popup title="Quản lý DuAnDauThau" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenCoQuanDangKy" colSpan={2}  />
				
					<Item dataField="DiaChi" colSpan={2}  />
				
					<Item dataField="DienThoai" colSpan={2}  />
				
					<Item dataField="Fax" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="TenDuAn" colSpan={2}  />
				
					<Item dataField="LoaiDuAn" colSpan={2}  />
				
					<Item dataField="TenChuDauTu" colSpan={2}  />
				
					<Item dataField="TenGoiThau" colSpan={2}  />
				
					<Item dataField="GiaGoiThau" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="FileDinhKem" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="HanDuAn" colSpan={2}  />
				
					<Item dataField="IDLinhVuc" colSpan={2}  />
				
					<Item dataField="GiaiDoanThucHien" colSpan={2}  />
				
					<Item dataField="SoHieuVanBan" colSpan={2}  />
				
					<Item dataField="TuKhoa" colSpan={2}  />
				
					<Item dataField="HienThi" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenCoQuanDangKy" dataType="string" caption="TenCoQuanDangKy" >
					</Column>
				
					<Column dataField="DiaChi" dataType="string" caption="DiaChi" >
					</Column>
				
					<Column dataField="DienThoai" dataType="string" caption="DienThoai" >
					</Column>
				
					<Column dataField="Fax" dataType="string" caption="Fax" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="TenDuAn" dataType="string" caption="TenDuAn" >
					</Column>
				
					<Column dataField="LoaiDuAn" dataType="string" caption="LoaiDuAn" >
					</Column>
				
					<Column dataField="TenChuDauTu" dataType="string" caption="TenChuDauTu" >
					</Column>
				
					<Column dataField="TenGoiThau" dataType="string" caption="TenGoiThau" >
					</Column>
				
					<Column dataField="GiaGoiThau" dataType="string" caption="GiaGoiThau" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="HanDuAn" dataType="string" caption="HanDuAn" >
					</Column>
				
					<Column dataField="IDLinhVuc" dataType="string" caption="IDLinhVuc" >
					</Column>
				
					<Column dataField="GiaiDoanThucHien" dataType="string" caption="GiaiDoanThucHien" >
					</Column>
				
					<Column dataField="SoHieuVanBan" dataType="string" caption="SoHieuVanBan" >
					</Column>
				
					<Column dataField="TuKhoa" dataType="string" caption="TuKhoa" >
					</Column>
				
					<Column dataField="HienThi" dataType="string" caption="HienThi" >
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

