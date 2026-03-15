
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
import MyImageUploader from '../components/MyImageUploader';



export default function ThiTruongLaoDong() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý thị trường lao động</h3>
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
          dataSource={createCustomStore("ThiTruongLaoDongs")} remoteOperations={true}
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

              <Item dataField="TieuDe" colSpan={2} />
              <Item dataField="AnhDaiDien" colSpan={2} />
              {/* <Item dataField="FileDinhKem" /> */}
              <Item dataField="TrangThai" editorType="dxCheckBox" />
              <Item dataField="LoaiTin" />
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" defaultSortOrder={"desc"} />
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
          <Column dataField="AnhDaiDien" dataType="string" caption="Ảnh đại diện"
            cellRender={config.defaultImageCellRender}
            editCellRender={(cellInfo) => <MyImageUploader cellInfo={cellInfo} />}
          />
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="LoaiTin" dataType="string" caption="Loại tin">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 1, Name: "Thị trường lao động" }, { Val: 2, Name: "Niêm giám thống kê" },]} valueExpr="Val" displayExpr="Name" />
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

