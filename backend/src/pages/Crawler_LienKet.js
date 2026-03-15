import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
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
  Button as DataGridButton,
  FilterRow, HeaderFilter,
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createLookupStore } from '../utils/api';

export default function Crawler_LienKet() {
  const dataSourceNguonOptions = createLookupStore("Crawler_Nguon");
  const [dataSourceOptions, setDataSourceOptions] = useState(null);
  const [title, setTitle] = useState("Quản lý tin tức");
  const { type } = useParams();
  useEffect(() => {
    setDataSourceOptions(
      createCustomStore({
        loadUrl: `${window.env.REACT_APP_API_URL}/Crawler_LienKet/Get?type=${type}`,
        insertUrl: `${window.env.REACT_APP_API_URL}/Crawler_LienKet/Post?type=${type}`,
        updateUrl: `${window.env.REACT_APP_API_URL}/Crawler_LienKet/Put?type=${type}`,
        deleteUrl: `${window.env.REACT_APP_API_URL}/Crawler_LienKet/Delete?type=${type}`,
      }),
    );
    if (type == 1) {
      setTitle("Danh sách tin video tiếng việt");
    } else if (type == 57) {
      setTitle("Danh sách tin video tiếng anh");
    } else if (type == 58) {
      setTitle("Danh sách tin audio");
    } else if (type == 59) {
      setTitle("Danh sách tin album");
    }
  }, [type]);
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Quản lý tin crawl</h3>
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
          wordWrapEnabled={true}
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
            allowDeleting={false}
          >
            <Popup title="Thông tin" showTitle={true} />
            <Form>
              <Item dataField="TieuDe" colSpan={2} />
              <Item dataField="MoTa" colSpan={2} />
              <Item dataField="ID_NguonTin" />
              <Item dataField="NgayXuatBan" />
              <Item dataField="LienKet" />
              <Item dataField="ThoiGianCrawl" />
              <Item dataField="LinkAnhDaiDien" />
              <Item dataField="TrangThai" />
              <Item dataField="ThoiGianCapNhat" />
              <Item dataField="ThoiGianUuTien" />
              <Item dataField="NoiBat" />
            </Form>
          </Editing>

          <Column dataField="ID" dataType="string" caption="ID" width={60} />
          <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
          <Column
            dataField="MoTa"
            dataType="string"
            caption="Mô tả"
            visible={false}
          >
            <FormItem
              colSpan={2}
              editorType="dxHtmlEditor"
              editorOptions={config.htmlEditorOptions}
            />
          </Column>
          <Column dataField="ID_NguonTin" caption="Nguồn">
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={dataSourceNguonOptions}
              valueExpr="ID"
              displayExpr="TenNguon"
            />
          </Column>
          <Column
            dataField="ThoiGianCrawl"
            dataType="datetime"
            format={"dd/MM/yyyy"}
            caption="Thời gian lấy"
            width={100}
          />
          <Column
            dataField="NgayXuatBan"
            dataType="datetime"
            format={"dd/MM/yyyy"}
            caption="Ngày xuất bản"
            defaultSortOrder={"desc"}
            width={100}
          />
          <Column
            dataField="TrangThai"
            dataType="number"
            caption="Trạng thái"
            width={120}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không xuất bản" },
                { Val: 1, Name: "Xuất bản" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column
            dataField="NoiBat"
            dataType="number"
            caption="Nổi bật"
            width={80}
          >
            <Lookup
              allowClearing={true}
              searchEnabled={true}
              dataSource={[
                { Val: 0, Name: "Không" },
                { Val: 1, Name: "Có" },
              ]}
              valueExpr="Val"
              displayExpr="Name"
            />
          </Column>
          <Column type="buttons">
            <DataGridButton
              cssClass={"fas fa-eye"}
              onClick={(e) => {
                window.open(`${e.row.data.LienKet}`, "_blank").focus();
              }}
            />
            <DataGridButton name="edit" />
            <DataGridButton name="delete" />
          </Column>
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
