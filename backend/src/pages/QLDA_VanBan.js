
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
import { createCustomStore, createLookupStore } from '../utils/api';

const dataSourceOptions = createLookupStore("QLDA_VanBan");
const dataSourceDonViOptions = createLookupStore("QLDA_DonVi");
const dataSourceDuAnOptions = createLookupStore("QLDA_DuAnDeAn", "id");


export default function QLDA_VanBan() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý văn bản liên quan</h3>
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
          dataSource={createCustomStore("QLDA_VanBan")} remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
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

              <Item dataField="Ten" />
              <Item dataField="SoKyHieu" />
              <Item dataField="NgayBanHanh" />
              <Item dataField="TrichYeu" />
              <Item dataField="DonViBanHanhID" />
              <Item dataField="DuAnDeAnID" />
              <Item dataField="NgayCoHieuLuc" />
              <Item dataField="NgayHetHieuLuc" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="Loai" />
              <Item dataField="NguoiKyID" />
              <Item dataField="FileDinhKem" />
              <Item dataField="NgayTao" />
            </Form>
          </Editing>

          <Column dataField="Ten" dataType="string" caption="Tên" />
          <Column dataField="SoKyHieu" dataType="string" caption="Số ký hiệu" />
          <Column dataField="NgayBanHanh" dataType="datetime" caption="Ngày ban hành" />
          <Column dataField="TrichYeu" dataType="string" caption="Trích yếu" />
          <Column dataField="DonViBanHanhID" dataType="string" caption="Đơn vị ban hành"  >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="DuAnDeAnID" dataType="int" caption="Dự án đề án"  >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDuAnOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="NgayHetHieuLuc" dataType="datetime" caption="Ngày hết hiệu lực" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
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

