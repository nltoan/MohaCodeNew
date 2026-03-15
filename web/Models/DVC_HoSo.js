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

const url = "http://moha.ptdl.tk/api/DVC_HoSos"
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

export default function DVC_HoSo() {
  return (
    <LayoutAdmin title={"DVC_HoSo"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DVC_HoSo</h3>
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
									<Item dataField="TenHoSo" />
									<Item dataField="TenDichVuCong" />
									<Item dataField="NguoiGui" />
									<Item dataField="LinkLuuTru" />
									<Item dataField="ThoiGianTao" />
									<Item dataField="TrangThai" />
									<Item dataField="ID_DichVuCong3" />
									<Item dataField="ArrayIDsFiles" />
									<Item dataField="ID_HoSoGoc" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenHoSo" dataType="string" caption="TenHoSo" />
									<Column dataField="TenDichVuCong" dataType="string" caption="TenDichVuCong" />
									<Column dataField="NguoiGui" dataType="string" caption="NguoiGui" />
									<Column dataField="LinkLuuTru" dataType="string" caption="LinkLuuTru" />
									<Column dataField="ThoiGianTao" dataType="string" caption="ThoiGianTao" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="ID_DichVuCong3" dataType="string" caption="ID_DichVuCong3" />
									<Column dataField="ArrayIDsFiles" dataType="string" caption="ArrayIDsFiles" />
									<Column dataField="ID_HoSoGoc" dataType="string" caption="ID_HoSoGoc" />
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

