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

const url = "http://moha.ptdl.tk/api/DVC2_ThuTucHanhChinhs"
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

export default function DVC2_ThuTucHanhChinh() {
  return (
    <LayoutAdmin title={"DVC2_ThuTucHanhChinh"}>
      <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quản lý DVC2_ThuTucHanhChinh</h3>
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
									<Item dataField="TenThuTucHanhChinh" />
									<Item dataField="NoiDung" />
									<Item dataField="HienThi" />
									<Item dataField="ThoiGianXuatBan" />
									<Item dataField="ID_CoQuan" />
									<Item dataField="ID_LinhVuc" />
									<Item dataField="TrinhTuThucHien" />
									<Item dataField="CachThucThucHien" />
									<Item dataField="ThanhPhanSoLuongHoSo" />
									<Item dataField="ThoiHanGiaiQuyet" />
									<Item dataField="DoiTuongThucHien" />
									<Item dataField="KetQuaThucHien" />
									<Item dataField="ChiPhi" />
									<Item dataField="MauDonMauToKhai" />
									<Item dataField="YeuCau" />
									<Item dataField="CoSoPhapLy" />
									<Item dataField="FileDinhKem" />
				                </Form>
              </Editing>
									<Column dataField="ID" dataType="string" caption="ID" />
									<Column dataField="TenThuTucHanhChinh" dataType="string" caption="TenThuTucHanhChinh" />
									<Column dataField="NoiDung" dataType="string" caption="NoiDung" />
									<Column dataField="HienThi" dataType="string" caption="HienThi" />
									<Column dataField="ThoiGianXuatBan" dataType="string" caption="ThoiGianXuatBan" />
									<Column dataField="ID_CoQuan" dataType="string" caption="ID_CoQuan" />
									<Column dataField="ID_LinhVuc" dataType="string" caption="ID_LinhVuc" />
									<Column dataField="TrinhTuThucHien" dataType="string" caption="TrinhTuThucHien" />
									<Column dataField="CachThucThucHien" dataType="string" caption="CachThucThucHien" />
									<Column dataField="ThanhPhanSoLuongHoSo" dataType="string" caption="ThanhPhanSoLuongHoSo" />
									<Column dataField="ThoiHanGiaiQuyet" dataType="string" caption="ThoiHanGiaiQuyet" />
									<Column dataField="DoiTuongThucHien" dataType="string" caption="DoiTuongThucHien" />
									<Column dataField="KetQuaThucHien" dataType="string" caption="KetQuaThucHien" />
									<Column dataField="ChiPhi" dataType="string" caption="ChiPhi" />
									<Column dataField="MauDonMauToKhai" dataType="string" caption="MauDonMauToKhai" />
									<Column dataField="YeuCau" dataType="string" caption="YeuCau" />
									<Column dataField="CoSoPhapLy" dataType="string" caption="CoSoPhapLy" />
									<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" />
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

