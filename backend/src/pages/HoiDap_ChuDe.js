
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
import TreeList, {
  Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup, Form, Editing, Popup, FilterRow
} from 'devextreme-react/tree-list';
import { Item } from 'devextreme-react/form';
import LayoutAdmin from '../layouts/LayoutAdmin';
import config from '../config';
import { createCustomStore } from '../utils/api';

const dataSourceOptions = createCustomStore("HoiDap_ChuDe");


export default function HoiDap_ChuDe() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý chủ đề hỏi đáp</h3>
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
        <TreeList
          dataSource={dataSourceOptions}
          allowColumnResizing={true}
          showBorders={true}
          useIcons={true}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          keyExpr="ID"
          parentIdExpr="ID_ChuDeCha"
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

              <Item dataField="TenChuDe" isRequired={true} />
              <Item dataField="ID_ChuDeCha" />
              <Item dataField="TrangThai" isRequired={true} editorType="dxCheckBox" />
              <Item dataField="MoTa" />
              <Item dataField="Email" />
            </Form>
          </Editing>

          <Column dataField="TenChuDe" dataType="string" caption="Tên" />
          <Column dataField="ID_ChuDeCha" caption="Cha" width={125}>
            <Lookup allowClearing={true} searchEnabled={true} dataSource={dataSourceOptions} valueExpr="ID" displayExpr="TenChuDe" />
          </Column>
          <Column dataField="TrangThai" dataType="string" caption="Trạng thái">
            <Lookup allowClearing={true} searchEnabled={true} dataSource={[{ Val: 0, Name: "Không hoạt động" }, { Val: 1, Name: "Hoạt động" },]} valueExpr="Val" displayExpr="Name" />
          </Column>
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="Email" dataType="string" caption="Email" />
        </TreeList>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

