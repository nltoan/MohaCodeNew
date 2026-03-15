
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

const dataSourceOptions = createCustomStore("DVC_HoSos");


export default function DVC_HoSo() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý DVC_HoSo</h3>
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

              <Item dataField="TenHoSo" />
              <Item dataField="TenDichVuCong" />
              <Item dataField="NguoiGui" />
              <Item dataField="LinkLuuTru" />
              <Item dataField="ThoiGianTao" />
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="ID_DichVuCong3" />
              <Item dataField="ArrayIDsFiles" />
              <Item dataField="ID_HoSoGoc" />
            </Form>
          </Editing>

          <Column dataField="TenHoSo" dataType="string" caption="TenHoSo" />
          <Column dataField="TenDichVuCong" dataType="string" caption="TenDichVuCong" />
          <Column dataField="NguoiGui" dataType="string" caption="NguoiGui" />
          <Column dataField="LinkLuuTru" dataType="string" caption="LinkLuuTru" />
          <Column dataField="ThoiGianTao" dataType="datetime" caption="Thời gian tạo" />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="ID_DichVuCong3" dataType="string" caption="ID_DichVuCong3" />
          <Column dataField="ArrayIDsFiles" dataType="string" caption="ArrayIDsFiles" />
          <Column dataField="ID_HoSoGoc" dataType="string" caption="ID_HoSoGoc" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

