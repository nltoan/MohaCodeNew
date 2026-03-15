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

const url = "http://moha.ptdl.tk/api/GLTT_CauHois"
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

export default function GLTT_CauHoi() {
  return (
    <LayoutAdmin title={"GLTT_CauHoi"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý GLTT_CauHoi</h3>
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
									<Item dataField="TenNguoiHoi" />
									<Item dataField="DiaChi" />
									<Item dataField="Email" />
									<Item dataField="DienThoai" />
									<Item dataField="TieuDeCauHoi" />
									<Item dataField="NoiDungCauHoi" />
									<Item dataField="ThoiGianHoi" />
									<Item dataField="ID_ChuDe" />
									<Item dataField="ID_PhienGiaoLuu" />
									<Item dataField="IDs_CauHoi" />
									<Item dataField="TieuDeTraLoi" />
									<Item dataField="NoiDungTraLoi" />
									<Item dataField="ThoiGianTraLoi" />
									<Item dataField="NguoiTraLoi" />
									<Item dataField="NguoiXuatBan" />
									<Item dataField="TrangThai" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenNguoiHoi" dataType="string" caption="TenNguoiHoi" />
									<Column dataField="DiaChi" dataType="string" caption="DiaChi" />
									<Column dataField="Email" dataType="string" caption="Email" />
									<Column dataField="DienThoai" dataType="string" caption="DienThoai" />
									<Column dataField="TieuDeCauHoi" dataType="string" caption="TieuDeCauHoi" />
									<Column dataField="NoiDungCauHoi" dataType="string" caption="NoiDungCauHoi" />
									<Column dataField="ThoiGianHoi" dataType="string" caption="ThoiGianHoi" />
									<Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" />
									<Column dataField="ID_PhienGiaoLuu" dataType="string" caption="ID_PhienGiaoLuu" />
									<Column dataField="IDs_CauHoi" dataType="string" caption="IDs_CauHoi" />
									<Column dataField="TieuDeTraLoi" dataType="string" caption="TieuDeTraLoi" />
									<Column dataField="NoiDungTraLoi" dataType="string" caption="NoiDungTraLoi" />
									<Column dataField="ThoiGianTraLoi" dataType="string" caption="ThoiGianTraLoi" />
									<Column dataField="NguoiTraLoi" dataType="string" caption="NguoiTraLoi" />
									<Column dataField="NguoiXuatBan" dataType="string" caption="NguoiXuatBan" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
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

