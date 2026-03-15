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

const url = "http://moha.ptdl.tk/api/QLDA_VanBans"
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

export default function QLDA_VanBan() {
  return (
    <LayoutAdmin title={"QLDA_VanBan"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý QLDA_VanBan</h3>
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
									<Item dataField="Ten" />
									<Item dataField="SoKyHieu" />
									<Item dataField="NgayBanHanh" />
									<Item dataField="TrichYeu" />
									<Item dataField="DonViBanHanhID" />
									<Item dataField="DuAnDeAnID" />
									<Item dataField="NgayCoHieuLuc" />
									<Item dataField="NgayHetHieuLuc" />
									<Item dataField="TrangThai" />
									<Item dataField="Loai" />
									<Item dataField="NguoiKyID" />
									<Item dataField="FileDinhKem" />
									<Item dataField="NgayTao" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="Ten" dataType="string" caption="Ten" />
									<Column dataField="SoKyHieu" dataType="string" caption="SoKyHieu" />
									<Column dataField="NgayBanHanh" dataType="string" caption="NgayBanHanh" />
									<Column dataField="TrichYeu" dataType="string" caption="TrichYeu" />
									<Column dataField="DonViBanHanhID" dataType="string" caption="DonViBanHanhID" />
									<Column dataField="DuAnDeAnID" dataType="string" caption="DuAnDeAnID" />
									<Column dataField="NgayCoHieuLuc" dataType="string" caption="NgayCoHieuLuc" />
									<Column dataField="NgayHetHieuLuc" dataType="string" caption="NgayHetHieuLuc" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="Loai" dataType="string" caption="Loai" />
									<Column dataField="NguoiKyID" dataType="string" caption="NguoiKyID" />
									<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
									<Column dataField="NgayTao" dataType="string" caption="NgayTao" />
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

