
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

const dataSourceOptions = createCustomStore("ThongTinLanhDaos");

export default function ThongTinLanhDao() {
  return (
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ThongTinLanhDao</h3>
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
                <Popup title="Quản lý ThongTinLanhDao" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="HoTenLanhDao" colSpan={2}  />
				
					<Item dataField="NhiemKy" colSpan={2}  />
				
					<Item dataField="NgaySinh" colSpan={2}  />
				
					<Item dataField="GioiTinh" colSpan={2}  />
				
					<Item dataField="SoFax" colSpan={2}  />
				
					<Item dataField="Email" colSpan={2}  />
				
					<Item dataField="SoDienThoai" colSpan={2}  />
				
					<Item dataField="NguyenQuan" colSpan={2}  />
				
					<Item dataField="TieuSuBanThan" colSpan={2}  />
				
					<Item dataField="AnhDaiDien" colSpan={2}  />
				
					<Item dataField="ChucDanh" colSpan={2}  />
				
					<Item dataField="Hang" colSpan={2}  />
				
					<Item dataField="Cot" colSpan={2}  />
				
					<Item dataField="HienThiTieuSu" colSpan={2}  />
				
					<Item dataField="TrangThai" colSpan={2}  />
				
					<Item dataField="ThuKy" colSpan={2}  />
				
					<Item dataField="Lang" colSpan={2}  />
				
					<Item dataField="TrinhDo" colSpan={2}  />
				
					<Item dataField="DangVien" colSpan={2}  />
				
					<Item dataField="SoQDBoNhiem" colSpan={2}  />
				
					<Item dataField="NgayQDBoNhiem" colSpan={2}  />
				
					<Item dataField="NguoiKyQDBoNhiem" colSpan={2}  />
				
					<Item dataField="ThoiHanBoNhiem" colSpan={2}  />
				
					<Item dataField="BatDauBoNhiem" colSpan={2}  />
				
					<Item dataField="ChucVuCu" colSpan={2}  />
				
					<Item dataField="ChucVuMoi" colSpan={2}  />
				
					<Item dataField="DonViCu" colSpan={2}  />
				
					<Item dataField="DonViMoi" colSpan={2}  />
				
					<Item dataField="QuaTrinhCongTac" colSpan={2}  />
				
					<Item dataField="LinkQDBoNhiem" colSpan={2}  />
				
					<Item dataField="TrinhDoLLCT" colSpan={2}  />
				
					<Item dataField="ThongTinQĐBoNhiem" colSpan={2}  />
				
					<Item dataField="DanToc" colSpan={2}  />
				
					<Item dataField="TonGiao" colSpan={2}  />
				
					<Item dataField="NgayVaoDang" colSpan={2}  />
				
					<Item dataField="NgayVaoDangChinhThuc" colSpan={2}  />
				
					<Item dataField="ChucVuDang" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="HoTenLanhDao" dataType="string" caption="HoTenLanhDao" >
					</Column>
				
					<Column dataField="NhiemKy" dataType="string" caption="NhiemKy" >
					</Column>
				
					<Column dataField="NgaySinh" dataType="string" caption="NgaySinh" >
					</Column>
				
					<Column dataField="GioiTinh" dataType="string" caption="GioiTinh" >
					</Column>
				
					<Column dataField="SoFax" dataType="string" caption="SoFax" >
					</Column>
				
					<Column dataField="Email" dataType="string" caption="Email" >
					</Column>
				
					<Column dataField="SoDienThoai" dataType="string" caption="SoDienThoai" >
					</Column>
				
					<Column dataField="NguyenQuan" dataType="string" caption="NguyenQuan" >
					</Column>
				
					<Column dataField="TieuSuBanThan" dataType="string" caption="TieuSuBanThan" >
					</Column>
				
					<Column dataField="AnhDaiDien" dataType="string" caption="AnhDaiDien" >
					</Column>
				
					<Column dataField="ChucDanh" dataType="string" caption="ChucDanh" >
					</Column>
				
					<Column dataField="Hang" dataType="string" caption="Hang" >
					</Column>
				
					<Column dataField="Cot" dataType="string" caption="Cot" >
					</Column>
				
					<Column dataField="HienThiTieuSu" dataType="string" caption="HienThiTieuSu" >
					</Column>
				
					<Column dataField="TrangThai" dataType="string" caption="TrangThai" >
					</Column>
				
					<Column dataField="ThuKy" dataType="string" caption="ThuKy" >
					</Column>
				
					<Column dataField="Lang" dataType="string" caption="Lang" >
					</Column>
				
					<Column dataField="TrinhDo" dataType="string" caption="TrinhDo" >
					</Column>
				
					<Column dataField="DangVien" dataType="string" caption="DangVien" >
					</Column>
				
					<Column dataField="SoQDBoNhiem" dataType="string" caption="SoQDBoNhiem" >
					</Column>
				
					<Column dataField="NgayQDBoNhiem" dataType="string" caption="NgayQDBoNhiem" >
					</Column>
				
					<Column dataField="NguoiKyQDBoNhiem" dataType="string" caption="NguoiKyQDBoNhiem" >
					</Column>
				
					<Column dataField="ThoiHanBoNhiem" dataType="string" caption="ThoiHanBoNhiem" >
					</Column>
				
					<Column dataField="BatDauBoNhiem" dataType="string" caption="BatDauBoNhiem" >
					</Column>
				
					<Column dataField="ChucVuCu" dataType="string" caption="ChucVuCu" >
					</Column>
				
					<Column dataField="ChucVuMoi" dataType="string" caption="ChucVuMoi" >
					</Column>
				
					<Column dataField="DonViCu" dataType="string" caption="DonViCu" >
					</Column>
				
					<Column dataField="DonViMoi" dataType="string" caption="DonViMoi" >
					</Column>
				
					<Column dataField="QuaTrinhCongTac" dataType="string" caption="QuaTrinhCongTac" >
					</Column>
				
					<Column dataField="LinkQDBoNhiem" dataType="string" caption="LinkQDBoNhiem" >
					</Column>
				
					<Column dataField="TrinhDoLLCT" dataType="string" caption="TrinhDoLLCT" >
					</Column>
				
					<Column dataField="ThongTinQĐBoNhiem" dataType="string" caption="ThongTinQĐBoNhiem" >
					</Column>
				
					<Column dataField="DanToc" dataType="string" caption="DanToc" >
					</Column>
				
					<Column dataField="TonGiao" dataType="string" caption="TonGiao" >
					</Column>
				
					<Column dataField="NgayVaoDang" dataType="string" caption="NgayVaoDang" >
					</Column>
				
					<Column dataField="NgayVaoDangChinhThuc" dataType="string" caption="NgayVaoDangChinhThuc" >
					</Column>
				
					<Column dataField="ChucVuDang" dataType="string" caption="ChucVuDang" >
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

