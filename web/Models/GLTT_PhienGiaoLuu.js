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

const url = "http://moha.ptdl.tk/api/GLTT_PhienGiaoLuus"
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

export default function GLTT_PhienGiaoLuu() {
  return (
    <LayoutAdmin title={"GLTT_PhienGiaoLuu"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý GLTT_PhienGiaoLuu</h3>
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
									<Item dataField="TenPhienGiaoLuu" />
									<Item dataField="ID_ChuDe" />
									<Item dataField="MoTa" />
									<Item dataField="ThoiGianBatDau" />
									<Item dataField="ThoiGianKetThuc" />
									<Item dataField="NhomBienTapCauHoi" />
									<Item dataField="NhomTongBienTap" />
									<Item dataField="NhomBienTapTraLoi" />
									<Item dataField="NhomBienTapXuatBan" />
									<Item dataField="HienThi" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenPhienGiaoLuu" dataType="string" caption="TenPhienGiaoLuu" />
									<Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" />
									<Column dataField="MoTa" dataType="string" caption="MoTa" />
									<Column dataField="ThoiGianBatDau" dataType="string" caption="ThoiGianBatDau" />
									<Column dataField="ThoiGianKetThuc" dataType="string" caption="ThoiGianKetThuc" />
									<Column dataField="NhomBienTapCauHoi" dataType="string" caption="NhomBienTapCauHoi" />
									<Column dataField="NhomTongBienTap" dataType="string" caption="NhomTongBienTap" />
									<Column dataField="NhomBienTapTraLoi" dataType="string" caption="NhomBienTapTraLoi" />
									<Column dataField="NhomBienTapXuatBan" dataType="string" caption="NhomBienTapXuatBan" />
									<Column dataField="HienThi" dataType="string" caption="HienThi" />
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

