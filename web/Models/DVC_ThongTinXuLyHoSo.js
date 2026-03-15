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

const url = "http://moha.ptdl.tk/api/DVC_ThongTinXuLyHoSos"
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

export default function DVC_ThongTinXuLyHoSo() {
  return (
    <LayoutAdmin title={"DVC_ThongTinXuLyHoSo"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DVC_ThongTinXuLyHoSo</h3>
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
									<Item dataField="ID_HoSo" />
									<Item dataField="TrangThaiHoSo" />
									<Item dataField="NguoiXuLy" />
									<Item dataField="ThoiGianXuLy" />
									<Item dataField="GhiChu" />
									<Item dataField="ID_BuocQuyTrinh" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="ID_HoSo" dataType="string" caption="ID_HoSo" />
									<Column dataField="TrangThaiHoSo" dataType="string" caption="TrangThaiHoSo" />
									<Column dataField="NguoiXuLy" dataType="string" caption="NguoiXuLy" />
									<Column dataField="ThoiGianXuLy" dataType="string" caption="ThoiGianXuLy" />
									<Column dataField="GhiChu" dataType="string" caption="GhiChu" />
									<Column dataField="ID_BuocQuyTrinh" dataType="string" caption="ID_BuocQuyTrinh" />
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

