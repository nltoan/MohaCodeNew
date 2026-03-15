
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

const dataSourceOptions = createCustomStore("QLDA_HoSo");
const dataSourceDuAnDeAnOptions = createLookupStore("QLDA_DuAnDeAn", 'id');


export default function QLDA_HoSo() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý hồ sơ dự án</h3>
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
              <Item dataField="NoiDung" />
              <Item dataField="DuAnDeAnID" />
              <Item dataField="CapBanHanh" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="NgayTao" />
              <Item dataField="FileDinhKem" />
            </Form>
          </Editing>

          <Column dataField="Ten" dataType="string" caption="Tên" />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
          <Column dataField="DuAnDeAnID" dataType="string" caption="Dự án đề án" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDuAnDeAnOptions} valueExpr="id" displayExpr="Ten" />
          </Column>
          <Column dataField="CapBanHanh" dataType="string" caption="Cấp ban hành" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
          <Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

