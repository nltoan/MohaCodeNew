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
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import LayoutAdmin from '../layouts/LayoutAdmin';

const url = "http://moha.ptdl.tk/api/ThongTinLanhDaos"
const dataSourceOptions = createStore({
  key: 'ID',
  loadUrl: `${url}/List`,
  insertUrl: `${url}/Insert`,
  updateUrl: `${url}/Update`,
  deleteUrl: `${url}/Delete`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: false };
  },
});

export default function ThongTinLanhDao() {
  return (
    <LayoutAdmin title={"ThongTinLanhDao"}>
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
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="HoTenLanhDao" />
									<Item dataField="NhiemKy" />
									<Item dataField="NgaySinh" />
									<Item dataField="GioiTinh" />
									<Item dataField="SoFax" />
									<Item dataField="Email" />
									<Item dataField="SoDienThoai" />
									<Item dataField="NguyenQuan" />
									<Item dataField="TieuSuBanThan" />
									<Item dataField="AnhDaiDien" />
									<Item dataField="ChucDanh" />
									<Item dataField="Hang" />
									<Item dataField="Cot" />
									<Item dataField="HienThiTieuSu" />
									<Item dataField="TrangThai" />
									<Item dataField="ThuKy" />
									<Item dataField="Lang" />
									<Item dataField="TrinhDo" />
									<Item dataField="DangVien" />
									<Item dataField="SoQDBoNhiem" />
									<Item dataField="NgayQDBoNhiem" />
									<Item dataField="NguoiKyQDBoNhiem" />
									<Item dataField="ThoiHanBoNhiem" />
									<Item dataField="BatDauBoNhiem" />
									<Item dataField="ChucVuCu" />
									<Item dataField="ChucVuMoi" />
									<Item dataField="DonViCu" />
									<Item dataField="DonViMoi" />
									<Item dataField="QuaTrinhCongTac" />
									<Item dataField="LinkQDBoNhiem" />
									<Item dataField="TrinhDoLLCT" />
									<Item dataField="ThongTinQĐBoNhiem" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="HoTenLanhDao" dataType="string" caption="HoTenLanhDao" />
									<Column dataField="NhiemKy" dataType="string" caption="NhiemKy" />
									<Column dataField="NgaySinh" dataType="string" caption="NgaySinh" />
									<Column dataField="GioiTinh" dataType="string" caption="GioiTinh" />
									<Column dataField="SoFax" dataType="string" caption="SoFax" />
									<Column dataField="Email" dataType="string" caption="Email" />
									<Column dataField="SoDienThoai" dataType="string" caption="SoDienThoai" />
									<Column dataField="NguyenQuan" dataType="string" caption="NguyenQuan" />
									<Column dataField="TieuSuBanThan" dataType="string" caption="TieuSuBanThan" />
									<Column dataField="AnhDaiDien" dataType="string" caption="AnhDaiDien" />
									<Column dataField="ChucDanh" dataType="string" caption="ChucDanh" />
									<Column dataField="Hang" dataType="string" caption="Hang" />
									<Column dataField="Cot" dataType="string" caption="Cot" />
									<Column dataField="HienThiTieuSu" dataType="string" caption="HienThiTieuSu" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="ThuKy" dataType="string" caption="ThuKy" />
									<Column dataField="Lang" dataType="string" caption="Lang" />
									<Column dataField="TrinhDo" dataType="string" caption="TrinhDo" />
									<Column dataField="DangVien" dataType="string" caption="DangVien" />
									<Column dataField="SoQDBoNhiem" dataType="string" caption="SoQDBoNhiem" />
									<Column dataField="NgayQDBoNhiem" dataType="string" caption="NgayQDBoNhiem" />
									<Column dataField="NguoiKyQDBoNhiem" dataType="string" caption="NguoiKyQDBoNhiem" />
									<Column dataField="ThoiHanBoNhiem" dataType="string" caption="ThoiHanBoNhiem" />
									<Column dataField="BatDauBoNhiem" dataType="string" caption="BatDauBoNhiem" />
									<Column dataField="ChucVuCu" dataType="string" caption="ChucVuCu" />
									<Column dataField="ChucVuMoi" dataType="string" caption="ChucVuMoi" />
									<Column dataField="DonViCu" dataType="string" caption="DonViCu" />
									<Column dataField="DonViMoi" dataType="string" caption="DonViMoi" />
									<Column dataField="QuaTrinhCongTac" dataType="string" caption="QuaTrinhCongTac" />
									<Column dataField="LinkQDBoNhiem" dataType="string" caption="LinkQDBoNhiem" />
									<Column dataField="TrinhDoLLCT" dataType="string" caption="TrinhDoLLCT" />
									<Column dataField="ThongTinQĐBoNhiem" dataType="string" caption="ThongTinQĐBoNhiem" />
				              <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
              <Paging defaultPageSize={10} />
            </DataGrid>
          </div>
          <div className="card-footer">
          </div>
      </div>
    </LayoutAdmin>
  );
}

