
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
import config from '../config';
import { createCustomStore } from '../utils/api';

const dataSourceOptions = createCustomStore("DM_GiaDat");

const url2 = `${window.env.REACT_APP_API_URL}/DM_LoaiDat`
const dataSourceLoaiDatOptions = createStore({
  key: 'ID',
  loadUrl: `${url2}/Get`,
  insertUrl: `${url2}/Post`,
  updateUrl: `${url2}/Put`,
  deleteUrl: `${url2}/Delete`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: false };
  },
});
const url3 = `${window.env.REACT_APP_API_URL}/DM_DiaChi`
const dataSourceDiaChiOptions = createStore({
  key: 'ID',
  loadUrl: `${url3}/Get`,
  insertUrl: `${url3}/Post`,
  updateUrl: `${url3}/Put`,
  deleteUrl: `${url3}/Delete`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: false };
  },
});

export default function DM_GiaDat() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý danh mục giá đất</h3>
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
          dataSource={dataSourceOptions} remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}>
            <Popup title="Thông tin" showTitle={true} />
            <Form>

              <Item dataField="TenDat" />
              <Item dataField="IDLoaiDat" />
              <Item dataField="IDDiaChi" />
              <Item dataField="IDGiaiDoan" />
              <Item dataField="GiaDat" />
              <Item dataField="ViTri" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="GhiChu" />
            </Form>
          </Editing>

          <Column dataField="TenDat" dataType="string" caption="TenDat" />
          <Column dataField="IDLoaiDat" caption="Loại đất" width={125}>
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceLoaiDatOptions} valueExpr="ID" displayExpr="TenLoaiDat" />
          </Column>
          <Column dataField="IDDiaChi" caption="Địa chỉ" width={125}>
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDiaChiOptions} valueExpr="ID" displayExpr="TenDiaChi" />
          </Column>
          <Column dataField="IDGiaiDoan" dataType="string" caption="IDGiaiDoan" />
          <Column dataField="GiaDat" dataType="string" caption="GiaDat" />
          <Column dataField="ViTri" dataType="string" caption="ViTri" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="GhiChu" dataType="string" caption="Ghi chú" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

