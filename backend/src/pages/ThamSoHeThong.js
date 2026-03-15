
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

const dataSourceOptions = createCustomStore("ThamSoHeThongs");


export default function ThamSoHeThong() {
  let textAreaOptions = {
    minHeight: 100,
  }
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý cấu hình tham số hệ thống</h3>
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
            allowAdding={false}
            allowDeleting={false}>
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="DongBoDuLieu" isRequired={true} />
              <Item dataField="ThoiGianCrawl" />
              <Item dataField="QuyenLanhDao" />
              <Item dataField="TenLanhDao" />
              <Item dataField="Theme" />
              <Item dataField="DuongDanCrawl" />
              <Item dataField="NoiDungHeader" editorType={"dxTextArea"} editorOptions={textAreaOptions} />
              <Item dataField="NoiDungHeader_English" editorType={"dxTextArea"} editorOptions={textAreaOptions} />
              <Item dataField="NoiDungFooter" editorType={"dxTextArea"} editorOptions={textAreaOptions} />
              <Item dataField="NoiDungFooter_English" editorType={"dxTextArea"} editorOptions={textAreaOptions} />
              <Item dataField="MoTa_HuongDan_GuiYKien" />
              <Item dataField="MoTa_HuongDan_ThuTucHanhChinh" />
              <Item dataField="HitCount" />
              <Item dataField="HienThi_IconPrefix" />
              <Item dataField="MoTa_HoTroDoanhNghiep" />
              <Item dataField="ADConfig" />
              <Item dataField="EmailAddress" />
              <Item dataField="EmailPassword" />
              <Item dataField="EmailHost" />
              <Item dataField="EmailPort" />
            </Form>
          </Editing>

          <Column dataField="Title" dataType="string" caption="Cấu hình" />
          <Column dataField="DongBoDuLieu" dataType="string" caption="Đồng bộ dữ liệu" visible={false} />
          <Column dataField="ThoiGianCrawl" dataType="string" caption="Thời gian crawl" visible={false} />
          <Column dataField="QuyenLanhDao" dataType="string" caption="Quyền lãnh đạo" visible={false} />
          <Column dataField="TenLanhDao" dataType="string" caption="Tên lãnh đạo" visible={false} />
          <Column dataField="Theme" dataType="string" caption="Theme" visible={false} />
          <Column dataField="DuongDanCrawl" dataType="string" caption="Đường dẫn crawler" visible={false} />
          <Column dataField="NoiDungHeader" dataType="string" caption="Nội dung Header" visible={false} />
          <Column dataField="NoiDungHeader_English" dataType="string" caption="Nội dung Header (english)" visible={false} />
          <Column dataField="NoiDungFooter" dataType="string" caption="Nội dung footer" visible={false} />
          <Column dataField="NoiDungFooter_English" dataType="string" caption="Nội dung footer (english)" visible={false} />
          <Column dataField="MoTa_HuongDan_GuiYKien" dataType="string" caption="Mô tả hướng dẫn gửi kiến nghị" visible={false} />
          <Column dataField="MoTa_HuongDan_ThuTucHanhChinh" dataType="string" caption="Mô tả hướng dẫn thủ tục hành chính" visible={false} />
          <Column dataField="HitCount" dataType="string" caption="HitCount" visible={false} />
          <Column dataField="HienThi_IconPrefix" dataType="string" caption="HienThi_IconPrefix" visible={false} />
          <Column dataField="MoTa_HoTroDoanhNghiep" dataType="string" caption="Mô tả hỗ trợ doanh nghiệp" visible={false} />
          <Column dataField="ADConfig" dataType="string" caption="Cấu hình AD" visible={false} />
          <Column dataField="EmailAddress" dataType="string" caption="Email gửi" visible={false} />
          <Column dataField="EmailPassword" dataType="string" caption="Mật khẩu mail" visible={false} />
          <Column dataField="EmailHost" dataType="string" caption="Email Host" visible={false} />
          <Column dataField="EmailPort" dataType="string" caption="Email Port" visible={false} />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} visible={false} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

