
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

const dataSourceOptions = createCustomStore("DuAnDauThaus");


export default function DuAnDauThau() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý DuAnDauThau</h3>
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

              <Item dataField="TenCoQuanDangKy" />
              <Item dataField="DiaChi" />
              <Item dataField="DienThoai" />
              <Item dataField="Fax" />
              <Item dataField="Email" />
              <Item dataField="TenDuAn" />
              <Item dataField="LoaiDuAn" />
              <Item dataField="TenChuDauTu" />
              <Item dataField="TenGoiThau" />
              <Item dataField="GiaGoiThau" />
              <Item dataField="NoiDung" />
              <Item dataField="FileDinhKem" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="HanDuAn" />
              <Item dataField="IDLinhVuc" />
              <Item dataField="GiaiDoanThucHien" />
              <Item dataField="SoHieuVanBan" />
              <Item dataField="TuKhoa" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
            </Form>
          </Editing>

          <Column dataField="TenCoQuanDangKy" dataType="string" caption="TenCoQuanDangKy" />
          <Column dataField="DiaChi" dataType="string" caption="Địa chỉ" />
          <Column dataField="DienThoai" dataType="string" caption="Điện thoại" />
          <Column dataField="Fax" dataType="string" caption="Fax" />
          <Column dataField="Email" dataType="string" caption="Email" />
          <Column dataField="TenDuAn" dataType="string" caption="TenDuAn" />
          <Column dataField="LoaiDuAn" dataType="string" caption="LoaiDuAn" />
          <Column dataField="TenChuDauTu" dataType="string" caption="TenChuDauTu" />
          <Column dataField="TenGoiThau" dataType="string" caption="TenGoiThau" />
          <Column dataField="GiaGoiThau" dataType="string" caption="GiaGoiThau" />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
          <Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="HanDuAn" dataType="string" caption="HanDuAn" />
          <Column dataField="IDLinhVuc" dataType="string" caption="IDLinhVuc" />
          <Column dataField="GiaiDoanThucHien" dataType="string" caption="GiaiDoanThucHien" />
          <Column dataField="SoHieuVanBan" dataType="string" caption="SoHieuVanBan" />
          <Column dataField="TuKhoa" dataType="string" caption="TuKhoa" />
          <Column dataField="HienThi" dataType="string" caption="Hiển thị">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không" }, { Val: 1, Name: "Có" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

