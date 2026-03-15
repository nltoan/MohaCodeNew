import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup,
  Lookup,
  Form,
  FormItem,
  FilterRow,
  HeaderFilter} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import 'devextreme/ui/html_editor/converters/markdown';

export default function VanBanDuThao_GopY() {
  const dataSourceOptions = createCustomStore("VanBanDuThao_GopYs");
  const dataSourceVanBanOptions = createLookupStore("VanBanDuThaos");
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Góp ý dự thảo văn bản</h3>
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
            <Popup title="Ý kiến đóng góp" showTitle={true} />
            <Form>
              <Item dataField="VanBanDuThaoID" colSpan={2} />
              <Item dataField="NgayGui" colSpan={2} />
              <Item dataField="HoTen" colSpan={2} />
              <Item dataField="SoDienThoai" colSpan={2} />
              <Item dataField="Email" colSpan={2} />
              <Item dataField="DiaChi" colSpan={2} />
              <Item dataField="NoiDung" colSpan={2} />
            </Form>
          </Editing>
          <Column
            dataField="ID"
            caption="ID"
            width={70}
            defaultSortOrder={"desc"}
          />
          <Column
            dataField="VanBanDuThaoID"
            caption="Văn bản dự thảo"
            visible={false}
          >
            <FormItem
              dataField="VanBanDuThaoID"
              colSpan={2}
              editorType="dxLookup"
              editorOptions={{
                readOnly: true,
                dataSource: dataSourceVanBanOptions,
                valueExpr: "ID",
                displayExpr: "TieuDe",
              }}
            />
          </Column>
          <Column dataField="VanBanDuThaoID" caption="Văn bản dự thảo">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceVanBanOptions}
              valueExpr="ID"
              displayExpr="TieuDe"
            />
          </Column>
          <Column
            dataField="NgayGui"
            dataType="date"
            caption="Ngày gửi"
            width={100}
          >
            <FormItem colSpan={2} editorOptions={{ readOnly: true }} />
          </Column>
          <Column dataField="HoTen" caption="Họ tên">
            <FormItem
              colSpan={2}
              editorOptions={{ readOnly: true }}
              width={200}
            />
          </Column>
          <Column dataField="SoDienThoai" caption="Số điện thoại" width={100}>
            <FormItem colSpan={2} editorOptions={{ readOnly: true }} />
          </Column>
          <Column dataField="Email" caption="Email" width={200}>
            <FormItem colSpan={2} editorOptions={{ readOnly: true }} />
          </Column>
          <Column dataField="DiaChi" caption="Địa chỉ" visible={false}>
            <FormItem colSpan={2} editorOptions={{ readOnly: true }} />
          </Column>
          <Column dataField="NoiDung" caption="Nội dung" visible={false}>
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={{ readOnly: true }}
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
