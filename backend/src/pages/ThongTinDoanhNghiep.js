
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

const dataSourceOptions = createCustomStore("ThongTinDoanhNghieps");


export default function ThongTinDoanhNghiep() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý thông tin doanh nghiệp</h3>
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

              <Item dataField="TenDoanhNghiep" />
              <Item dataField="MaSoDoanhNghiep" />
              <Item dataField="DiaChi" />
              <Item dataField="DienThoai" />
              <Item dataField="EmailAddress" />
              <Item dataField="Website" />
              <Item dataField="CoQuanThucHien" />
              <Item dataField="NguoiDaiDien" />
              <Item dataField="ChucVuNguoiDaiDien" />
              <Item dataField="DienThoaiNguoiDaiDien" />
              <Item dataField="EmailNguoiDaiDien" />
              <Item dataField="NoiDung" />
              <Item dataField="FilesDinhKem" />
              <Item dataField="Fax" />
            </Form>
          </Editing>

          <Column dataField="TenDoanhNghiep" dataType="string" caption="TenDoanhNghiep" />
          <Column dataField="MaSoDoanhNghiep" dataType="string" caption="MaSoDoanhNghiep" />
          <Column dataField="DiaChi" dataType="string" caption="Địa chỉ" />
          <Column dataField="DienThoai" dataType="string" caption="Điện thoại" />
          <Column dataField="EmailAddress" dataType="string" caption="EmailAddress" />
          <Column dataField="Website" dataType="string" caption="Website" />
          <Column dataField="CoQuanThucHien" dataType="string" caption="CoQuanThucHien" />
          <Column dataField="NguoiDaiDien" dataType="string" caption="NguoiDaiDien" />
          <Column dataField="ChucVuNguoiDaiDien" dataType="string" caption="ChucVuNguoiDaiDien" />
          <Column dataField="DienThoaiNguoiDaiDien" dataType="string" caption="DienThoaiNguoiDaiDien" />
          <Column dataField="EmailNguoiDaiDien" dataType="string" caption="EmailNguoiDaiDien" />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
          <Column dataField="FilesDinhKem" dataType="string" caption="FilesDinhKem" />
          <Column dataField="Fax" dataType="string" caption="Fax" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

