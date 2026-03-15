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
import { createCustomStore } from '../utils/api';

export default function Crawler_ChuDe() {
  const dataSourceOptions = createCustomStore("Crawler_ChuDe");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý chủ đề crawl</h3>
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
          dataSource={dataSourceOptions}
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
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={false}
          >
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="TenChuyenMuc" />
              <Item dataField="MoTa" />
              <Item dataField="TrangThai" />
            </Form>
          </Editing>

          <Column dataField="TenChuyenMuc" dataType="string" caption="Tên" />
          <Column dataField="MoTa" dataType="string" caption="Mô tả" />
          <Column dataField="ID_ChuDeCha" caption="Cha" width={125}>
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceOptions}
              allowColumnResizing={true}
              valueExpr="ID"
              displayExpr="TenChuyenMuc"
            />
          </Column>
          <Column
            dataField="TrangThai"
            dataType="string"
            caption="Trạng thái"
            visible={false}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không hoạt động" },
                { Val: 1, Name: "Hoạt động" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="DanhSachCha"
            dataType="string"
            caption="DanhSachCha"
          />
          <Column
            dataField="SoThuTu"
            dataType="number"
            caption="Số thứ tự"
            defaultSortOrder="asc"
          />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
