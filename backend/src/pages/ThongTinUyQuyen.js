
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

const dataSourceOptions = createCustomStore("ThongTinUyQuyens");


export default function ThongTinUyQuyen() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý ThongTinUyQuyen</h3>
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

              <Item dataField="NguoiUyQuyen" isRequired={true} />
              <Item dataField="NguoiDuocUyQuyen" isRequired={true} />
              <Item dataField="NguoiCapNhat" isRequired={true} />
              <Item dataField="ThoiGianBatDau" isRequired={true} />
              <Item dataField="ThoiGianKetThuc" isRequired={true} />
              <Item dataField="ThoiGianCapNhat" isRequired={true} />
              <Item dataField="TaiKhoanUyQuyen" isRequired={true} />
              <Item dataField="TaiKhoanDuocUyQuyen" isRequired={true} />
              <Item dataField="TaiKhoanCapNhat" isRequired={true} />
              <Item dataField="TenDonVi" isRequired={true} />
            </Form>
          </Editing>

          <Column dataField="NguoiUyQuyen" dataType="string" caption="NguoiUyQuyen" />
          <Column dataField="NguoiDuocUyQuyen" dataType="string" caption="NguoiDuocUyQuyen" />
          <Column dataField="NguoiCapNhat" dataType="string" caption="NguoiCapNhat" />
          <Column dataField="ThoiGianBatDau" dataType="string" caption="ThoiGianBatDau" />
          <Column dataField="ThoiGianKetThuc" dataType="string" caption="ThoiGianKetThuc" />
          <Column dataField="ThoiGianCapNhat" dataType="string" caption="ThoiGianCapNhat" />
          <Column dataField="TaiKhoanUyQuyen" dataType="string" caption="TaiKhoanUyQuyen" />
          <Column dataField="TaiKhoanDuocUyQuyen" dataType="string" caption="TaiKhoanDuocUyQuyen" />
          <Column dataField="TaiKhoanCapNhat" dataType="string" caption="TaiKhoanCapNhat" />
          <Column dataField="TenDonVi" dataType="string" caption="Tên đơn vị" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

