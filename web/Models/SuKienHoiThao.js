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

const url = "http://moha.ptdl.tk/api/SuKienHoiThaos"
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

export default function SuKienHoiThao() {
  return (
    <LayoutAdmin title={"SuKienHoiThao"}>
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
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="TenHoiThao" />
									<Item dataField="LoaiHoiThao" />
									<Item dataField="ThoiGianTu" />
									<Item dataField="ThoiGianDen" />
									<Item dataField="DonViTaiTro" />
									<Item dataField="DiaDiemToChuc" />
									<Item dataField="ThanhPhanThamGia" />
									<Item dataField="DonViToChucChinh" />
									<Item dataField="FileNoiDung" />
									<Item dataField="NoiDungThongTinMoi" />
									<Item dataField="ChoPhepDangKy" />
									<Item dataField="TrangThai" />
									<Item dataField="Lang" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenHoiThao" dataType="string" caption="TenHoiThao" />
									<Column dataField="LoaiHoiThao" dataType="string" caption="LoaiHoiThao" />
									<Column dataField="ThoiGianTu" dataType="string" caption="ThoiGianTu" />
									<Column dataField="ThoiGianDen" dataType="string" caption="ThoiGianDen" />
									<Column dataField="DonViTaiTro" dataType="string" caption="DonViTaiTro" />
									<Column dataField="DiaDiemToChuc" dataType="string" caption="DiaDiemToChuc" />
									<Column dataField="ThanhPhanThamGia" dataType="string" caption="ThanhPhanThamGia" />
									<Column dataField="DonViToChucChinh" dataType="string" caption="DonViToChucChinh" />
									<Column dataField="FileNoiDung" dataType="string" caption="FileNoiDung" />
									<Column dataField="NoiDungThongTinMoi" dataType="string" caption="NoiDungThongTinMoi" />
									<Column dataField="ChoPhepDangKy" dataType="string" caption="ChoPhepDangKy" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="Lang" dataType="string" caption="Lang" />
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

