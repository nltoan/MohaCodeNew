import Drawer from 'devextreme-react/drawer';
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

const url = "http://moha.ptdl.tk/api/Menu_Backends"
const dataSourceOptions = createStore({
  key: 'ID',
  loadUrl: `${url}/List`,
  insertUrl: `${url}/Insert`,
  updateUrl: `${url}/Update`,
  deleteUrl: `${url}/Delete`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: false };
  },
});

export default function Menu_Backend() {
  return (
    <LayoutAdmin title={"Menu_Backend"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý Menu_Backend</h3>
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
              dataSource={dataSourceOptions}
              allowColumnReordering={true}
              rowAlternationEnabled={true}
              showBorders={true}
            >
              <FilterRow visible={true} />
              <HeaderFilter visible={true} />
              <SearchPanel visible={true} highlightCaseSensitive={true} />
              <Editing
                mode="popup"
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Thông tin banner" showTitle={true} />
                <Form>
									<Item dataField="ID" />
									<Item dataField="TenMenu" />
									<Item dataField="URL" />
									<Item dataField="STT" />
									<Item dataField="IDMenuCha" />
									<Item dataField="QuyenTruyCap" />
									<Item dataField="FunctionGetNoti" />
									<Item dataField="CoCanhBao" />
									<Item dataField="QuyenKhongTruyCap" />
									<Item dataField="ClassCSS" />
									<Item dataField="HienThi" />
									<Item dataField="TenTruyCap" />
									<Item dataField="FunctionTruyCap" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenMenu" dataType="string" caption="TenMenu" />
									<Column dataField="URL" dataType="string" caption="URL" />
									<Column dataField="STT" dataType="string" caption="STT" />
									<Column dataField="IDMenuCha" dataType="string" caption="IDMenuCha" />
									<Column dataField="QuyenTruyCap" dataType="string" caption="QuyenTruyCap" />
									<Column dataField="FunctionGetNoti" dataType="string" caption="FunctionGetNoti" />
									<Column dataField="CoCanhBao" dataType="string" caption="CoCanhBao" />
									<Column dataField="QuyenKhongTruyCap" dataType="string" caption="QuyenKhongTruyCap" />
									<Column dataField="ClassCSS" dataType="string" caption="ClassCSS" />
									<Column dataField="HienThi" dataType="string" caption="HienThi" />
									<Column dataField="TenTruyCap" dataType="string" caption="TenTruyCap" />
									<Column dataField="FunctionTruyCap" dataType="string" caption="FunctionTruyCap" />
				              <Pager allowedPageSizes={[10, 25, 50, 100]} showPageSizeSelector={true} />
              <Paging defaultPageSize={10} />
            </DataGrid>
          </div>
          <div className="card-footer">
          </div>
      </div>
    </LayoutAdmin>
  );
}

