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

const url = "http://moha.ptdl.tk/api/HoiDap_CauHois"
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

export default function HoiDap_CauHoi() {
  return (
    <LayoutAdmin title={"HoiDap_CauHoi"}>
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
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="HoTen" />
									<Item dataField="Email" />
									<Item dataField="DienThoai" />
									<Item dataField="DiaChi" />
									<Item dataField="CauHoi" />
									<Item dataField="TrangThai" />
									<Item dataField="ID_ChuDe" />
									<Item dataField="PhanCongTraLoi" />
									<Item dataField="DonViTraLoi" />
									<Item dataField="DonViDongXuLy" />
									<Item dataField="ThoiGianTao" />
									<Item dataField="ThoiGianXuatBan" />
									<Item dataField="FileDinhKems" />
									<Item dataField="Attachments" />
									<Item dataField="TieuDe" />
									<Item dataField="ID_ChuDe_New" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="HoTen" dataType="string" caption="HoTen" />
									<Column dataField="Email" dataType="string" caption="Email" />
									<Column dataField="DienThoai" dataType="string" caption="DienThoai" />
									<Column dataField="DiaChi" dataType="string" caption="DiaChi" />
									<Column dataField="CauHoi" dataType="string" caption="CauHoi" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" />
									<Column dataField="PhanCongTraLoi" dataType="string" caption="PhanCongTraLoi" />
									<Column dataField="DonViTraLoi" dataType="string" caption="DonViTraLoi" />
									<Column dataField="DonViDongXuLy" dataType="string" caption="DonViDongXuLy" />
									<Column dataField="ThoiGianTao" dataType="string" caption="ThoiGianTao" />
									<Column dataField="ThoiGianXuatBan" dataType="string" caption="ThoiGianXuatBan" />
									<Column dataField="FileDinhKems" dataType="string" caption="FileDinhKems" />
									<Column dataField="Attachments" dataType="string" caption="Attachments" />
									<Column dataField="TieuDe" dataType="string" caption="TieuDe" />
									<Column dataField="ID_ChuDe_New" dataType="string" caption="ID_ChuDe_New" />
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

