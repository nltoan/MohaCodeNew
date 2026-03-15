
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

const dataSourceOptions = createCustomStore("QLDA_DuAnDeAns");

export default function QLDA_DuAnDeAn() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý QLDA_DuAnDeAn</h3>
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
                <Popup title="Quản lý QLDA_DuAnDeAn" showTitle={true} />
                <Form>
				
					<Item dataField="id" colSpan={2}  />
				
					<Item dataField="IDCha" colSpan={2}  />
				
					<Item dataField="Ten" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="PhamViThucHienID" colSpan={2}  />
				
					<Item dataField="GiaiDoanThucHienID" colSpan={2}  />
				
					<Item dataField="PhamVi" colSpan={2}  />
				
					<Item dataField="GiaiDoan" colSpan={2}  />
				
					<Item dataField="LinhVucID" colSpan={2}  />
				
					<Item dataField="DonViChuTriID" colSpan={2}  />
				
					<Item dataField="DonViThucHien" colSpan={2}  />
				
					<Item dataField="DonViPhoiHop" colSpan={2}  />
				
					<Item dataField="TrangThaiDuAn" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="LoaiID" colSpan={2}  />
				
					<Item dataField="NgayTao" colSpan={2}  />
				
					<Item dataField="TuKhoa" colSpan={2}  />
				
					<Item dataField="NgaybatDau" colSpan={2}  />
				
					<Item dataField="NgayKetThuc" colSpan={2}  />
				
					<Item dataField="NganSach" colSpan={2}  />
				
					<Item dataField="MenhGia" colSpan={2}  />
				
					<Item dataField="TenChuDauTu" colSpan={2}  />
				
					<Item dataField="TenGoiThau" colSpan={2}  />
				
					<Item dataField="GiaGoiThau" colSpan={2}  />
				
					<Item dataField="FileDinhKem" colSpan={2}  />
				
					<Item dataField="NgayHetHan" colSpan={2}  />
				
					<Item dataField="DauThau" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="id" dataType="string" caption="id" >
					</Column>
				
					<Column dataField="IDCha" dataType="string" caption="IDCha" >
					</Column>
				
					<Column dataField="Ten" dataType="string" caption="Ten" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="PhamViThucHienID" dataType="string" caption="PhamViThucHienID" >
					</Column>
				
					<Column dataField="GiaiDoanThucHienID" dataType="string" caption="GiaiDoanThucHienID" >
					</Column>
				
					<Column dataField="PhamVi" dataType="string" caption="PhamVi" >
					</Column>
				
					<Column dataField="GiaiDoan" dataType="string" caption="GiaiDoan" >
					</Column>
				
					<Column dataField="LinhVucID" dataType="string" caption="LinhVucID" >
					</Column>
				
					<Column dataField="DonViChuTriID" dataType="string" caption="DonViChuTriID" >
					</Column>
				
					<Column dataField="DonViThucHien" dataType="string" caption="DonViThucHien" >
					</Column>
				
					<Column dataField="DonViPhoiHop" dataType="string" caption="DonViPhoiHop" >
					</Column>
				
					<Column dataField="TrangThaiDuAn" dataType="string" caption="TrangThaiDuAn" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="LoaiID" dataType="string" caption="LoaiID" >
					</Column>
				
					<Column dataField="NgayTao" dataType="string" caption="NgayTao" >
					</Column>
				
					<Column dataField="TuKhoa" dataType="string" caption="TuKhoa" >
					</Column>
				
					<Column dataField="NgaybatDau" dataType="string" caption="NgaybatDau" >
					</Column>
				
					<Column dataField="NgayKetThuc" dataType="string" caption="NgayKetThuc" >
					</Column>
				
					<Column dataField="NganSach" dataType="string" caption="NganSach" >
					</Column>
				
					<Column dataField="MenhGia" dataType="string" caption="MenhGia" >
					</Column>
				
					<Column dataField="TenChuDauTu" dataType="string" caption="TenChuDauTu" >
					</Column>
				
					<Column dataField="TenGoiThau" dataType="string" caption="TenGoiThau" >
					</Column>
				
					<Column dataField="GiaGoiThau" dataType="string" caption="GiaGoiThau" >
					</Column>
				
					<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" >
					</Column>
				
					<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" >
					</Column>
				
					<Column dataField="DauThau" dataType="string" caption="DauThau" >
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

