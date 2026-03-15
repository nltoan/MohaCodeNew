
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

const dataSourceOptions = createCustomStore("Crawler_LienKets");

export default function Crawler_LienKet() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý Crawler_LienKet</h3>
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
                <Popup title="Quản lý Crawler_LienKet" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TieuDe" colSpan={2}  />
				
					<Item dataField="MoTa" colSpan={2}  />
				
					<Item dataField="ID_NguonTin" colSpan={2}  />
				
					<Item dataField="NgayXuatBan" colSpan={2}  />
				
					<Item dataField="LienKet" colSpan={2}  />
				
					<Item dataField="ThoiGianCrawl" colSpan={2}  />
				
					<Item dataField="LinkAnhDaiDien" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="IDs_ChuDe" colSpan={2}  />
				
					<Item dataField="ID_NguoiCapNhat" colSpan={2}  />
				
					<Item dataField="ThoiGianCapNhat" colSpan={2}  />
				
					<Item dataField="NoiBat" colSpan={2}  />
				
					<Item dataField="TrinhLanhDao" colSpan={2}  />
				
					<Item dataField="VungHienThi" colSpan={2}  />
				
					<Item dataField="ThoiGianUuTien" colSpan={2}  />
				
					<Item dataField="NgayBatDau" colSpan={2}  />
				
					<Item dataField="NgayHetHan" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TieuDe" dataType="string" caption="TieuDe" >
					</Column>
				
					<Column dataField="MoTa" dataType="string" caption="MoTa" >
					</Column>
				
					<Column dataField="ID_NguonTin" dataType="string" caption="ID_NguonTin" >
					</Column>
				
					<Column dataField="NgayXuatBan" dataType="string" caption="NgayXuatBan" >
					</Column>
				
					<Column dataField="LienKet" dataType="string" caption="LienKet" >
					</Column>
				
					<Column dataField="ThoiGianCrawl" dataType="string" caption="ThoiGianCrawl" >
					</Column>
				
					<Column dataField="LinkAnhDaiDien" dataType="string" caption="LinkAnhDaiDien" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="IDs_ChuDe" dataType="string" caption="IDs_ChuDe" >
					</Column>
				
					<Column dataField="ID_NguoiCapNhat" dataType="string" caption="ID_NguoiCapNhat" >
					</Column>
				
					<Column dataField="ThoiGianCapNhat" dataType="string" caption="ThoiGianCapNhat" >
					</Column>
				
					<Column dataField="NoiBat" dataType="string" caption="NoiBat" >
					</Column>
				
					<Column dataField="TrinhLanhDao" dataType="string" caption="TrinhLanhDao" >
					</Column>
				
					<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" >
					</Column>
				
					<Column dataField="ThoiGianUuTien" dataType="string" caption="ThoiGianUuTien" >
					</Column>
				
					<Column dataField="NgayBatDau" dataType="string" caption="NgayBatDau" >
					</Column>
				
					<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" >
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

