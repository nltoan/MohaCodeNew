
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

const dataSourceOptions = createCustomStore("DVC2_LinhVucs");


export default function DVC2_LinhVuc() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý DVC2_LinhVuc</h3>
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

              <Item dataField="TenLinhVuc" />
              <Item dataField="MoTa" />
              <Item dataField="HienThi" editorType="dxCheckBox" />
              <Item dataField="STT" />
              <Item dataField="ThoiGianTao" />
              <Item dataField="IDs_CoQuan" />
            </Form>
          </Editing>

          <Column dataField="TenLinhVuc" dataType="string" caption="Tên" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="HienThi" dataType="string" caption="Hiển thị">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không" }, { Val: 1, Name: "Có" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="STT" dataType="string" caption="STT" />
          <Column dataField="ThoiGianTao" dataType="datetime" caption="Thời gian tạo" />
          <Column dataField="IDs_CoQuan" dataType="string" caption="IDs_CoQuan" />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

