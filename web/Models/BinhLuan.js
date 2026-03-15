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

const url = "http://moha.ptdl.tk/api/BinhLuans"
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

export default function BinhLuan() {
  return (
    <LayoutAdmin title={"BinhLuan"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý BinhLuan</h3>
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
									<Item dataField="ID_ThongTin" />
									<Item dataField="NoiDung" />
									<Item dataField="TenBanDoc" />
									<Item dataField="Email" />
									<Item dataField="Trangthai" />
									<Item dataField="NgayTao" />
									<Item dataField="NgayKiemDuyet" />
									<Item dataField="TieuDe" />
									<Item dataField="IDCha" />
									<Item dataField="DiaChi" />
									<Item dataField="FileDinhKem" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="ID_ThongTin" dataType="string" caption="ID_ThongTin" />
									<Column dataField="NoiDung" dataType="string" caption="NoiDung" />
									<Column dataField="TenBanDoc" dataType="string" caption="TenBanDoc" />
									<Column dataField="Email" dataType="string" caption="Email" />
									<Column dataField="Trangthai" dataType="string" caption="Trangthai" />
									<Column dataField="NgayTao" dataType="string" caption="NgayTao" />
									<Column dataField="NgayKiemDuyet" dataType="string" caption="NgayKiemDuyet" />
									<Column dataField="TieuDe" dataType="string" caption="TieuDe" />
									<Column dataField="IDCha" dataType="string" caption="IDCha" />
									<Column dataField="DiaChi" dataType="string" caption="DiaChi" />
									<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
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

