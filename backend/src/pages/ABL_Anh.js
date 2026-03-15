import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, 
  HeaderFilter} from 'devextreme-react/data-grid';
import {
  Item
} from 'devextreme-react/form';
import config from '../config';
import { createCustomStore } from '../utils/api';

export default function ABL_Anh() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý ảnh</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="collapse"
            title="Collapse"
          >
            <i className="fas fa-minus" />
          </button>
          <button
            type="button"
            className="btn btn-tool"
            data-card-widget="remove"
            title="Remove"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <DataGrid
          dataSource={createCustomStore("ABL_Anh")}
          remoteOperations={true}
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
            allowDeleting={true}
          >
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="LinkAnh" />
              <Item dataField="ThuTu" />
              <Item dataField="MoTa" />
              <Item dataField="IDAlbumAnh" />
            </Form>
          </Editing>

          <Column
            dataField="LinkAnh"
            dataType="string"
            caption="Link ảnh"
            cellRender={config.defaultImageCellRender}
          />
          <Column dataField="ThuTu" dataType="string" caption="Thứ tự" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column
            dataField="IDAlbumAnh"
            dataType="string"
            caption="IDAlbumAnh"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
