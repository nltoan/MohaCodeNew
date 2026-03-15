
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

const dataSourceOptions = createCustomStore("HoiDap_CauHoi");


export default function HoiDap_CauHoi() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách câu hỏi hỏi đáp</h3>
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
            allowAdding={false}
            allowDeleting={false}>
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="CauHoi" />
              <Item dataField="HoTen" />
              <Item dataField="Email" />
              <Item dataField="DienThoai" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="DiaChi" />
              <Item dataField="ID_ChuDe" />
              <Item dataField="PhanCongTraLoi" />
              <Item dataField="DonViTraLoi" />
              <Item dataField="DonViDongXuLy" />
              <Item dataField="ThoiGianTao" />
              <Item dataField="ThoiGianXuatBan" />
              <Item dataField="FileDinhKems" />
              <Item dataField="Attachments" />
              <Item dataField="TieuDe" />
              <Item dataField="ID_ChuDe_New" />
            </Form>
          </Editing>

          <Column dataField="CauHoi" dataType="string" caption="Câu hỏi" width={300} />
          <Column dataField="HoTen" dataType="string" caption="Người hỏi" />
          <Column dataField="Email" dataType="string" caption="Email" />
          <Column dataField="DienThoai" dataType="string" caption="Điện thoại" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Chưa xuất bản" }, { Val: 1, Name: "Xuất bản" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="DiaChi" dataType="string" caption="Địa chỉ" visible={false} />
          <Column dataField="ID_ChuDe" dataType="string" caption="ID_ChuDe" visible={false} />
          <Column dataField="ThoiGianTao" dataType="datetime" caption="ThoiGianTao" visible={false} sortOrder={"desc"} />
          <Column dataField="ThoiGianXuatBan" dataType="datetime" caption="ThoiGianXuatBan" visible={false} />
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" visible={false} />
          <Column dataField="ID_ChuDe_New" dataType="string" caption="ID_ChuDe_New" visible={false} />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

