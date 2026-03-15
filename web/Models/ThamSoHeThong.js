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

const url = "http://moha.ptdl.tk/api/ThamSoHeThongs"
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

export default function ThamSoHeThong() {
  return (
    <LayoutAdmin title={"ThamSoHeThong"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý ThamSoHeThong</h3>
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
									<Item dataField="DongBoDuLieu" />
									<Item dataField="ThoiGianCrawl" />
									<Item dataField="QuyenLanhDao" />
									<Item dataField="TenLanhDao" />
									<Item dataField="Theme" />
									<Item dataField="DuongDanCrawl" />
									<Item dataField="NoiDungFooter" />
									<Item dataField="NoiDungFooter_English" />
									<Item dataField="MoTa_HuongDan_GuiYKien" />
									<Item dataField="MoTa_HuongDan_ThuTucHanhChinh" />
									<Item dataField="HitCount" />
									<Item dataField="HienThi_IconPrefix" />
									<Item dataField="MoTa_HoTroDoanhNghiep" />
									<Item dataField="Title" />
									<Item dataField="ADConfig" />
									<Item dataField="EmailAddress" />
									<Item dataField="EmailPassword" />
									<Item dataField="EmailHost" />
									<Item dataField="EmailPort" />
									<Item dataField="NoiDungHeader" />
									<Item dataField="NoiDungHeader_English" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="DongBoDuLieu" dataType="string" caption="DongBoDuLieu" />
									<Column dataField="ThoiGianCrawl" dataType="string" caption="ThoiGianCrawl" />
									<Column dataField="QuyenLanhDao" dataType="string" caption="QuyenLanhDao" />
									<Column dataField="TenLanhDao" dataType="string" caption="TenLanhDao" />
									<Column dataField="Theme" dataType="string" caption="Theme" />
									<Column dataField="DuongDanCrawl" dataType="string" caption="DuongDanCrawl" />
									<Column dataField="NoiDungFooter" dataType="string" caption="NoiDungFooter" />
									<Column dataField="NoiDungFooter_English" dataType="string" caption="NoiDungFooter_English" />
									<Column dataField="MoTa_HuongDan_GuiYKien" dataType="string" caption="MoTa_HuongDan_GuiYKien" />
									<Column dataField="MoTa_HuongDan_ThuTucHanhChinh" dataType="string" caption="MoTa_HuongDan_ThuTucHanhChinh" />
									<Column dataField="HitCount" dataType="string" caption="HitCount" />
									<Column dataField="HienThi_IconPrefix" dataType="string" caption="HienThi_IconPrefix" />
									<Column dataField="MoTa_HoTroDoanhNghiep" dataType="string" caption="MoTa_HoTroDoanhNghiep" />
									<Column dataField="Title" dataType="string" caption="Title" />
									<Column dataField="ADConfig" dataType="string" caption="ADConfig" />
									<Column dataField="EmailAddress" dataType="string" caption="EmailAddress" />
									<Column dataField="EmailPassword" dataType="string" caption="EmailPassword" />
									<Column dataField="EmailHost" dataType="string" caption="EmailHost" />
									<Column dataField="EmailPort" dataType="string" caption="EmailPort" />
									<Column dataField="NoiDungHeader" dataType="string" caption="NoiDungHeader" />
									<Column dataField="NoiDungHeader_English" dataType="string" caption="NoiDungHeader_English" />
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

