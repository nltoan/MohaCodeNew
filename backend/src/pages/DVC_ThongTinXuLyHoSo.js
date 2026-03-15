
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

const dataSourceOptions = createCustomStore("DVC_ThongTinXuLyHoSos");


export default function DVC_ThongTinXuLyHoSo() {
  return (
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

              <Item dataField="ID_HoSo" />
              <Item dataField="TrangThaiHoSo" />
              <Item dataField="NguoiXuLy" />
              <Item dataField="ThoiGianXuLy" />
              <Item dataField="GhiChu" />
              <Item dataField="ID_BuocQuyTrinh" />
            </Form>
          </Editing>

          <Column dataField="ID_HoSo" dataType="string" caption="ID_HoSo" />
          <Column dataField="TrangThaiHoSo" dataType="string" caption="TrangThaiHoSo" />
          <Column dataField="NguoiXuLy" dataType="string" caption="NguoiXuLy" />
          <Column dataField="ThoiGianXuLy" dataType="string" caption="ThoiGianXuLy" />
          <Column dataField="GhiChu" dataType="string" caption="Ghi chú" />
          <Column dataField="ID_BuocQuyTrinh" dataType="string" caption="ID_BuocQuyTrinh" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

