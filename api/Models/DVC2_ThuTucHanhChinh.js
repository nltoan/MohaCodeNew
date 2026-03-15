
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
  FormItem,
  FilterRow, 
  HeaderFilter,
  RequiredRule
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

const dataSourceOptions = createCustomStore("DVC2_ThuTucHanhChinhs");

export default function DVC2_ThuTucHanhChinh() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý DVC2_ThuTucHanhChinh" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="TenThuTucHanhChinh" colSpan={2}  />
				
					<Item dataField="NoiDung" colSpan={2}  />
				
					<Item dataField="HienThi" colSpan={2}  />
				
					<Item dataField="ThoiGianXuatBan" colSpan={2}  />
				
					<Item dataField="ID_CoQuan" colSpan={2}  />
				
					<Item dataField="ID_LinhVuc" colSpan={2}  />
				
					<Item dataField="TrinhTuThucHien" colSpan={2}  />
				
					<Item dataField="CachThucThucHien" colSpan={2}  />
				
					<Item dataField="ThanhPhanSoLuongHoSo" colSpan={2}  />
				
					<Item dataField="ThoiHanGiaiQuyet" colSpan={2}  />
				
					<Item dataField="DoiTuongThucHien" colSpan={2}  />
				
					<Item dataField="KetQuaThucHien" colSpan={2}  />
				
					<Item dataField="ChiPhi" colSpan={2}  />
				
					<Item dataField="MauDonMauToKhai" colSpan={2}  />
				
					<Item dataField="YeuCau" colSpan={2}  />
				
					<Item dataField="CoSoPhapLy" colSpan={2}  />
				
					<Item dataField="FileDinhKem" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="TenThuTucHanhChinh" dataType="string" caption="TenThuTucHanhChinh" >
					</Column>
				
					<Column dataField="NoiDung" dataType="string" caption="NoiDung" >
					</Column>
				
					<Column dataField="HienThi" dataType="string" caption="HienThi" >
					</Column>
				
					<Column dataField="ThoiGianXuatBan" dataType="string" caption="ThoiGianXuatBan" >
					</Column>
				
					<Column dataField="ID_CoQuan" dataType="string" caption="ID_CoQuan" >
					</Column>
				
					<Column dataField="ID_LinhVuc" dataType="string" caption="ID_LinhVuc" >
					</Column>
				
					<Column dataField="TrinhTuThucHien" dataType="string" caption="TrinhTuThucHien" >
					</Column>
				
					<Column dataField="CachThucThucHien" dataType="string" caption="CachThucThucHien" >
					</Column>
				
					<Column dataField="ThanhPhanSoLuongHoSo" dataType="string" caption="ThanhPhanSoLuongHoSo" >
					</Column>
				
					<Column dataField="ThoiHanGiaiQuyet" dataType="string" caption="ThoiHanGiaiQuyet" >
					</Column>
				
					<Column dataField="DoiTuongThucHien" dataType="string" caption="DoiTuongThucHien" >
					</Column>
				
					<Column dataField="KetQuaThucHien" dataType="string" caption="KetQuaThucHien" >
					</Column>
				
					<Column dataField="ChiPhi" dataType="string" caption="ChiPhi" >
					</Column>
				
					<Column dataField="MauDonMauToKhai" dataType="string" caption="MauDonMauToKhai" >
					</Column>
				
					<Column dataField="YeuCau" dataType="string" caption="YeuCau" >
					</Column>
				
					<Column dataField="CoSoPhapLy" dataType="string" caption="CoSoPhapLy" >
					</Column>
				
					<Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" >
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

