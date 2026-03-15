import DataGrid, {
  Column,
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
import { createCustomStore, createLookupStore } from '../utils/api';

export default function Crawler_Nguon() {
  const dataSourceCrawlerChuDeOptions = createLookupStore("Crawler_ChuDe");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý danh sách nguồn tin</h3>
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
          dataSource={createCustomStore("Crawler_Nguon")}
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
              <Item dataField="TenNguon" />
              <Item dataField="ChuDeID" />
              <Item dataField="LinkLienKet" />
              <Item dataField="LoaiLienKet" />
              <Item dataField="KichHoat" />
              <Item dataField="BaseUrl" />
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" />
          <Column dataField="TenNguon" dataType="string" caption="Tên" />
          <Column dataField="LinkLienKet" dataType="string" caption="Link" />
          <Column
            dataField="LoaiLienKet"
            dataType="string"
            caption="Loại liên kết"
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 1, Name: "Html" },
                { Val: 2, Name: "Json API" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="BaseUrl"
            dataType="string"
            caption="Link gốc"
            visible={false}
          />
          <Column
            dataField="MoTa"
            dataType="string"
            caption="Mô tả"
            visible={false}
          />
          <Column dataField="KichHoat" dataType="string" caption="Trạng thái">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không kích hoạt" },
                { Val: 1, Name: "Kích hoạt" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="ChuDeID"
            dataType="string"
            caption="Chủ đề"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceCrawlerChuDeOptions}
              valueExpr="ID"
              displayExpr="TenChuyenMuc"
            />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
