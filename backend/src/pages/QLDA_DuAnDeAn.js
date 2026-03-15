
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
  Popup as DataGridPopup,
  Lookup,
  Form,
  FormItem,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab, Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';

const dataSourceOptions = createLookupStore("QLDA_DuAnDeAn", 'id');
const dataSourceLinhVucOptions = createLookupStore("QLDA_LinhVuc");
const dataSourcePhamViOptions = createLookupStore("QLDA_PhamVi");
const dataSourceGiaiDoanOptions = createLookupStore("QLDA_GiaiDoan");
const dataSourceDonViOptions = createLookupStore("QLDA_DonVi");
const dataSourceLoaiOptions = createLookupStore("QLDA_LoaiDuAn");


export default function QLDA_DuAnDeAn() {
  let rowData;
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Danh sách Chương trình, Đề án, Dự án</h3>
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
          dataSource={createCustomStore("QLDA_DuAnDeAn", 'id')}
          remoteOperations={true}
          allowColumnResizing={true}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          onInitNewRow={(e) => {
            rowData = null;
          }}
          onEditingStart={(e) => {
            rowData = e.data;
          }}
          onRowInserted={(e) => {
            e.component.navigateToRow(e.key).done(function () {
              var rowindex = e.component.getRowIndexByKey(e.key);
              e.component.editRow(rowindex);
            });
          }}
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
            <DataGridPopup title="Thông tin" showTitle={true} fullScreen={true} />
            <Form
              onInitialized={(e) => {
                e.component.option("items[0].tabs[1].visible", !!rowData);
                e.component.option("items[0].tabs[2].visible", !!rowData);
              }}
            >
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung" colCount={2}>
                  <Item dataField="Ten" colSpan={2} isRequired={true} />
                  <Item dataField="IDCha" />
                  <Item dataField="LoaiID" isRequired={true} />
                  <Item dataField="TenChuDauTu" colSpan={2} isRequired={true} />
                  <Item dataField="TenGoiThau" colSpan={2} />
                  <Item dataField="GiaGoiThau" />
                  <Item dataField="NgayHetHan" />
                  <Item dataField="NoiDung" colSpan={2} />
                  <Item dataField="LinhVucID" />
                  <Item dataField="GiaiDoanThucHienID" />
                  <Item dataField="TrangThaiDuAn" />
                  <Item dataField="TuKhoa" />
                  <Item dataField="DauThau" />
                  <Item dataField="TrangThai" editorType="dxCheckBox" />
                </Tab>
                <Tab title="Văn bản liên quan" >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/QLDA_VanBan/Get?filter=[['DuAnDeAnID','=',${rowData ? rowData.id : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/QLDA_VanBan/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/QLDA_VanBan/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/QLDA_VanBan/Delete`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowInserted={(e) => {
                      e.component.refresh();
                    }}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    onInitNewRow={(e) => {
                      e.data.DuAnDeAnID = rowData.id;
                    }}
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
                      <DataGridPopup title="Thông tin văn bản liên quan" showTitle={true} />
                      <Form>
                        <Item dataField="Ten" />
                        <Item dataField="SoKyHieu" />
                        <Item dataField="NgayBanHanh" />
                        <Item dataField="TrichYeu" />
                        <Item dataField="DonViBanHanhID" />
                        <Item dataField="NgayCoHieuLuc" />
                        <Item dataField="NgayHetHieuLuc" />
                        <Item dataField="TrangThai" editorType="dxCheckBox" />
                        <Item dataField="Loai" />
                        <Item dataField="NguoiKyID" />
                        <Item dataField="FileDinhKem" />
                        <Item dataField="NgayTao" />
                      </Form>
                    </Editing>

                    <Column dataField="Ten" dataType="string" caption="Tên" />
                    <Column dataField="SoKyHieu" dataType="string" caption="Số ký hiệu" visible={false} />
                    <Column dataField="NgayBanHanh" dataType="datetime" caption="Ngày ban hành" visible={false} />
                    <Column dataField="TrichYeu" dataType="string" caption="Trích yếu" visible={false} />
                    <Column dataField="DonViBanHanhID" dataType="string" caption="Đơn vị ban hành" visible={false}>
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
                    </Column>
                    <Column dataField="NgayHetHieuLuc" dataType="datetime" caption="Ngày hết hiệu lực" visible={false} />
                    <Column dataField="NgayCoHieuLuc" dataType="datetime" caption="Ngày có hiệu lực" visible={false} />
                    <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Hồ sơ liên quan" >
                  <DataGrid
                    onInitialized={(e) => {
                      setTimeout(function () {
                        var tmpDs = createCustomStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/QLDA_HoSo/Get?filter=[['DuAnDeAnID','=',${rowData ? rowData.id : ""}]]`,
                          insertUrl: `${window.env.REACT_APP_API_URL}/QLDA_HoSo/Post`,
                          updateUrl: `${window.env.REACT_APP_API_URL}/QLDA_HoSo/Put`,
                          deleteUrl: `${window.env.REACT_APP_API_URL}/QLDA_HoSo/Delete`,
                        });
                        e.component.option("dataSource", tmpDs);
                      }, 0);
                    }}
                    onRowInserted={(e) => {
                      e.component.refresh();
                    }}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                    onInitNewRow={(e) => {
                      e.data.DuAnDeAnID = rowData.id;
                    }}
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
                      <DataGridPopup title="Thông tin hồ sơ liên quan" showTitle={true} />
                      <Form>
                        <Item dataField="Ten" />
                        <Item dataField="NoiDung" />
                        <Item dataField="CapBanHanh" />
                        <Item dataField="TrangThai" editorType="dxCheckBox" />
                        <Item dataField="NgayTao" />
                        <Item dataField="FileDinhKem" />
                      </Form>
                    </Editing>


                    <Column dataField="Ten" dataType="string" caption="Tên" />
                    <Column dataField="NoiDung" dataType="string" caption="Nội dung" />
                    <Column dataField="DuAnDeAnID" dataType="string" caption="Dự án đề án" >
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceOptions} valueExpr="id" displayExpr="Ten" />
                    </Column>
                    <Column dataField="CapBanHanh" dataType="string" caption="Cấp ban hành">
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
                    </Column>
                    <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
                      <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
                    </Column>
                    <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" />
                  </DataGrid>
                </Tab>
              </TabbedItem>
            </Form>
          </Editing>
          <Column dataField="id" dataType="string" caption="id" defaultSortOrder={"desc"} />
          <Column dataField="IDCha" caption="Cha" visible={false}>
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceOptions}
              allowColumnResizing={true} valueExpr="id" displayExpr="Ten" />
          </Column>
          <Column dataField="Ten" dataType="string" caption="Tên" width={300} />
          <Column dataField="NoiDung" dataType="string" caption="Nội dung" visible={false}>
            <FormItem colSpan={2} editorType="dxHtmlEditor" editorOptions={config.htmlEditorLargeOptions} />
          </Column>
          <Column dataField="LinhVucID" dataType="string" caption="Lĩnh vực" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceLinhVucOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="PhamVi" dataType="string" caption="Phạm vi" visible={false} >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourcePhamViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="PhamViThucHienID" dataType="string" caption="Phạm vi thực hiện" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourcePhamViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="GiaiDoan" dataType="string" caption="Giai đoạn" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceGiaiDoanOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="GiaiDoanThucHienID" dataType="string" caption="Giai đoạn thực hiện" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceGiaiDoanOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="DonViChuTriID" dataType="string" caption="Đơn vị chủ trì" visible={false} >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="DonViThucHien" dataType="string" caption="Đơn vị thực hiện" visible={false} >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="DonViPhoiHop" dataType="string" caption="Đơn vị phối hợp" visible={false} >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceDonViOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="TrangThaiDuAn" dataType="string" caption="Trạng thái dự án" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 1, Name: "Đã thực hiện" }, { Val: 2, Name: "Đang thực hiện" }, { Val: 3, Name: "Dự kiến" }]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái hiển thị">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="LoaiID" dataType="string" caption="Loại dự án" visible={false} >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceLoaiOptions} valueExpr="ID" displayExpr="Ten" />
          </Column>
          <Column dataField="NgayTao" dataType="datetime" caption="Ngày tạo" visible={false} />
          <Column dataField="TuKhoa" dataType="string" caption="Từ khóa" visible={false} />
          <Column dataField="TenChuDauTu" dataType="string" caption="Tên chủ đầu tư" visible={false} />
          <Column dataField="TenGoiThau" dataType="string" caption="Tên gói thầu" visible={false} />
          <Column dataField="GiaGoiThau" dataType="string" caption="Giá gói thầu" visible={false} />
          <Column dataField="FileDinhKem" dataType="string" caption="FileDinhKem" visible={false} />
          <Column dataField="NgayHetHan" dataType="datetime" caption="Ngày hết hạn" visible={false} />
          <Column dataField="DauThau" dataType="string" caption="Là dự án đấu thầu" >
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không" }, { Val: 1, Name: "Đúng" },]} valueExpr="Val" displayExpr="Name" />
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

