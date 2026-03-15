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

const url = "http://moha.ptdl.tk/api/QLDA_DuAnDeAns"
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

export default function QLDA_DuAnDeAn() {
  return (
    <LayoutAdmin title={"QLDA_DuAnDeAn"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý QLDA_DuAnDeAn</h3>
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
									<Item dataField="id" />
									<Item dataField="IDCha" />
									<Item dataField="Ten" />
									<Item dataField="NoiDung" />
									<Item dataField="PhamViThucHienID" />
									<Item dataField="GiaiDoanThucHienID" />
									<Item dataField="PhamVi" />
									<Item dataField="GiaiDoan" />
									<Item dataField="LinhVucID" />
									<Item dataField="DonViChuTriID" />
									<Item dataField="DonViThucHien" />
									<Item dataField="DonViPhoiHop" />
									<Item dataField="TrangThaiDuAn" />
									<Item dataField="TrangThai" />
									<Item dataField="LoaiID" />
									<Item dataField="NgayTao" />
									<Item dataField="TuKhoa" />
									<Item dataField="NgaybatDau" />
									<Item dataField="NgayKetThuc" />
									<Item dataField="NganSach" />
									<Item dataField="MenhGia" />
									<Item dataField="TenChuDauTu" />
									<Item dataField="TenGoiThau" />
									<Item dataField="GiaGoiThau" />
									<Item dataField="FileDinhKem" />
									<Item dataField="NgayHetHan" />
									<Item dataField="DauThau" />
				                </Form>
              </Editing>
									<Column dataField="id" dataType="string" caption="id" />
									<Column dataField="IDCha" dataType="string" caption="IDCha" />
									<Column dataField="Ten" dataType="string" caption="Ten" />
									<Column dataField="NoiDung" dataType="string" caption="NoiDung" />
									<Column dataField="PhamViThucHienID" dataType="string" caption="PhamViThucHienID" />
									<Column dataField="GiaiDoanThucHienID" dataType="string" caption="GiaiDoanThucHienID" />
									<Column dataField="PhamVi" dataType="string" caption="PhamVi" />
									<Column dataField="GiaiDoan" dataType="string" caption="GiaiDoan" />
									<Column dataField="LinhVucID" dataType="string" caption="LinhVucID" />
									<Column dataField="DonViChuTriID" dataType="string" caption="DonViChuTriID" />
									<Column dataField="DonViThucHien" dataType="string" caption="DonViThucHien" />
									<Column dataField="DonViPhoiHop" dataType="string" caption="DonViPhoiHop" />
									<Column dataField="TrangThaiDuAn" dataType="string" caption="TrangThaiDuAn" />
									<Column dataField="TrangThai" dataType="string" caption="TrangThai" />
									<Column dataField="LoaiID" dataType="string" caption="LoaiID" />
									<Column dataField="NgayTao" dataType="string" caption="NgayTao" />
									<Column dataField="TuKhoa" dataType="string" caption="TuKhoa" />
									<Column dataField="NgaybatDau" dataType="string" caption="NgaybatDau" />
									<Column dataField="NgayKetThuc" dataType="string" caption="NgayKetThuc" />
									<Column dataField="NganSach" dataType="string" caption="NganSach" />
									<Column dataField="MenhGia" dataType="string" caption="MenhGia" />
									<Column dataField="TenChuDauTu" dataType="string" caption="TenChuDauTu" />
									<Column dataField="TenGoiThau" dataType="string" caption="TenGoiThau" />
									<Column dataField="GiaGoiThau" dataType="string" caption="GiaGoiThau" />
									<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
									<Column dataField="NgayHetHan" dataType="string" caption="NgayHetHan" />
									<Column dataField="DauThau" dataType="string" caption="DauThau" />
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

