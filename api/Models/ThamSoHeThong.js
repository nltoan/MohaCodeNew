
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

const dataSourceOptions = createCustomStore("ThamSoHeThongs");

export default function ThamSoHeThong() {
  return (
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
		useIcons={true}
                allowUpdating={true}
                allowAdding={true}
                allowDeleting={true}>
                <Popup title="Quản lý ThamSoHeThong" showTitle={true} />
                <Form>
				
					<Item dataField="ID" colSpan={2}  />
				
					<Item dataField="DongBoDuLieu" colSpan={2}  />
				
					<Item dataField="ThoiGianCrawl" colSpan={2}  />
				
					<Item dataField="QuyenLanhDao" colSpan={2}  />
				
					<Item dataField="TenLanhDao" colSpan={2}  />
				
					<Item dataField="Theme" colSpan={2}  />
				
					<Item dataField="DuongDanCrawl" colSpan={2}  />
				
					<Item dataField="NoiDungFooter" colSpan={2}  />
				
					<Item dataField="NoiDungFooter_English" colSpan={2}  />
				
					<Item dataField="MoTa_HuongDan_GuiYKien" colSpan={2}  />
				
					<Item dataField="MoTa_HuongDan_ThuTucHanhChinh" colSpan={2}  />
				
					<Item dataField="HitCount" colSpan={2}  />
				
					<Item dataField="HienThi_IconPrefix" colSpan={2}  />
				
					<Item dataField="MoTa_HoTroDoanhNghiep" colSpan={2}  />
				
					<Item dataField="Title" colSpan={2}  />
				
					<Item dataField="ADConfig" colSpan={2}  />
				
					<Item dataField="EmailAddress" colSpan={2}  />
				
					<Item dataField="EmailPassword" colSpan={2}  />
				
					<Item dataField="EmailHost" colSpan={2}  />
				
					<Item dataField="EmailPort" colSpan={2}  />
				
					<Item dataField="NoiDungHeader" colSpan={2}  />
				
					<Item dataField="NoiDungHeader_English" colSpan={2}  />
				
                </Form>
              </Editing>
				
					<Column dataField="ID" dataType="string" caption="ID" >
					</Column>
				
					<Column dataField="DongBoDuLieu" dataType="string" caption="DongBoDuLieu" >
					</Column>
				
					<Column dataField="ThoiGianCrawl" dataType="string" caption="ThoiGianCrawl" >
					</Column>
				
					<Column dataField="QuyenLanhDao" dataType="string" caption="QuyenLanhDao" >
					</Column>
				
					<Column dataField="TenLanhDao" dataType="string" caption="TenLanhDao" >
					</Column>
				
					<Column dataField="Theme" dataType="string" caption="Theme" >
					</Column>
				
					<Column dataField="DuongDanCrawl" dataType="string" caption="DuongDanCrawl" >
					</Column>
				
					<Column dataField="NoiDungFooter" dataType="string" caption="NoiDungFooter" >
					</Column>
				
					<Column dataField="NoiDungFooter_English" dataType="string" caption="NoiDungFooter_English" >
					</Column>
				
					<Column dataField="MoTa_HuongDan_GuiYKien" dataType="string" caption="MoTa_HuongDan_GuiYKien" >
					</Column>
				
					<Column dataField="MoTa_HuongDan_ThuTucHanhChinh" dataType="string" caption="MoTa_HuongDan_ThuTucHanhChinh" >
					</Column>
				
					<Column dataField="HitCount" dataType="string" caption="HitCount" >
					</Column>
				
					<Column dataField="HienThi_IconPrefix" dataType="string" caption="HienThi_IconPrefix" >
					</Column>
				
					<Column dataField="MoTa_HoTroDoanhNghiep" dataType="string" caption="MoTa_HoTroDoanhNghiep" >
					</Column>
				
					<Column dataField="Title" dataType="string" caption="Title" >
					</Column>
				
					<Column dataField="ADConfig" dataType="string" caption="ADConfig" >
					</Column>
				
					<Column dataField="EmailAddress" dataType="string" caption="EmailAddress" >
					</Column>
				
					<Column dataField="EmailPassword" dataType="string" caption="EmailPassword" >
					</Column>
				
					<Column dataField="EmailHost" dataType="string" caption="EmailHost" >
					</Column>
				
					<Column dataField="EmailPort" dataType="string" caption="EmailPort" >
					</Column>
				
					<Column dataField="NoiDungHeader" dataType="string" caption="NoiDungHeader" >
					</Column>
				
					<Column dataField="NoiDungHeader_English" dataType="string" caption="NoiDungHeader_English" >
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

