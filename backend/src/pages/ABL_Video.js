import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Form,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';

export default function ABL_Video() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý video</h3>
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

              <Item dataField="LinkVideo" />
              <Item dataField="ThuTu" />
              <Item dataField="MoTa" />
              <Item dataField="IDAlbumVideo" />
              <Item dataField="LinkDownloadVideo" />
              <Item dataField="AnhDaiDien" />
            </Form>
          </Editing>

          <Column dataField="LinkVideo" dataType="string" caption="LinkVideo" />
          <Column dataField="ThuTu" dataType="string" caption="Thứ tự" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="IDAlbumVideo" dataType="string" caption="IDAlbumVideo" />
          <Column dataField="LinkDownloadVideo" dataType="string" caption="LinkDownloadVideo" />
          <Column dataField="AnhDaiDien" dataType="string" caption="Ảnh đại diện" cellRender={config.defaultImageCellRender} />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer">
      </div>
    </div>

  );
}

