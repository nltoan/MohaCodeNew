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

const url = "http://moha.ptdl.tk/api/Crawler_LienKets"
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

export default function Crawler_LienKet() {
  return (
    <LayoutAdmin title={"Crawler_LienKet"}>
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
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="TieuDe" />
									<Item dataField="MoTa" />
									<Item dataField="ID_NguonTin" />
									<Item dataField="NgayXuatBan" />
									<Item dataField="LienKet" />
									<Item dataField="ThoiGianCrawl" />
									<Item dataField="LinkAnhDaiDien" />
									<Item dataField="TrangThai" />
									<Item dataField="IDs_ChuDe" />
									<Item dataField="ID_NguoiCapNhat" />
									<Item dataField="ThoiGianCapNhat" />
									<Item dataField="SyncStt" />
									<Item dataField="TrinhLanhDao" />
									<Item dataField="VungHienThi" />
									<Item dataField="ThoiGianUuTien" />
									<Item dataField="NgayBatDau" />
									<Item dataField="NgayHetHan" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TieuDe" dataType="string" caption="TieuDe" />
									<Column dataField="MoTa" dataType="string" caption="MoTa" />
									<Column dataField="ID_NguonTin" dataType="string" caption="ID_NguonTin" />
									<Column dataField="NgayXuatBan" dataType="string" caption="NgayXuatBan" />
									<Column dataField="LienKet" dataType="string" caption="LienKet" />
									<Column dataField="ThoiGianCrawl" dataType="string" caption="ThoiGianCrawl" />
									<Column dataField="LinkAnhDaiDien" dataType="string" caption="LinkAnhDaiDien" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="IDs_ChuDe" dataType="string" caption="IDs_ChuDe" />
									<Column dataField="ID_NguoiCapNhat" dataType="string" caption="ID_NguoiCapNhat" />
									<Column dataField="ThoiGianCapNhat" dataType="string" caption="ThoiGianCapNhat" />
									<Column dataField="SyncStt" dataType="string" caption="SyncStt" />
									<Column dataField="TrinhLanhDao" dataType="string" caption="TrinhLanhDao" />
									<Column dataField="VungHienThi" dataType="string" caption="VungHienThi" />
									<Column dataField="ThoiGianUuTien" dataType="string" caption="ThoiGianUuTien" />
									<Column dataField="NgayBatDau" dataType="string" caption="NgayBatDau" />
									<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" />
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

