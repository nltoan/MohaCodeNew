import { useRef } from 'react';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Lookup,
  FilterRow,
  HeaderFilter,
  Toolbar,
  Item as GridToolbarItem,
  Button as DataGridButton,
} from 'devextreme-react/data-grid';
import { createCustomStore, createLookupStore } from '../utils/api';
import { exportButtonOptions } from '../utils/exportCsv';
import GopYChiTietPopup from '../components/GopYChiTietPopup';

const dataSourceOptions = createCustomStore("VanBanDuThao_GopYs");
const dataSourceVanBanOptions = createLookupStore("VanBanDuThaos");

export default function VanBanDuThao_GopY() {
  const dataGridRef = useRef(null);
  const chiTietPopupRef = useRef(null);

  // Gop y do nguoi dan gui tu portal: chi xem (va xoa neu can), khong them/sua tren trang quan tri.
  function xemChiTiet(data) {
    if (!data) return;
    let tenDuThao = "";
    const grid = dataGridRef.current && dataGridRef.current.instance;
    const lookup = grid && grid.columnOption("VanBanDuThaoID", "lookup");
    if (lookup && lookup.calculateCellValue && data.VanBanDuThaoID != null) {
      tenDuThao = lookup.calculateCellValue(data.VanBanDuThaoID) || "";
    }
    chiTietPopupRef.current.open(data, tenDuThao);
  }

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
          ref={dataGridRef}
          dataSource={dataSourceOptions}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
          height="calc(100vh - 190px)"
          onRowDblClick={(e) => {
            if (e.rowType === "data") xemChiTiet(e.data);
          }}
        >
          <FilterRow visible={true} />
          <HeaderFilter visible={true} />
          <SearchPanel
            visible={true}
            width={260}
            placeholder="Tìm họ tên, email, số điện thoại..."
          />
          <Toolbar>
            <GridToolbarItem
              location="after"
              widget="dxButton"
              options={exportButtonOptions(
                () => dataGridRef.current.instance,
                "gop-y-du-thao-van-ban",
                { columns: ["ID", "VanBanDuThaoID", "NgayGui", "HoTen", "SoDienThoai", "Email", "DiaChi", "NoiDung"] },
              )}
            />
            <GridToolbarItem name="searchPanel" />
          </Toolbar>
          <Editing
            mode="popup"
            useIcons={true}
            allowUpdating={false}
            allowAdding={false}
            allowDeleting={true}
          />
          <Column type="buttons" width={70}>
            <DataGridButton
              hint="Xem chi tiết"
              icon="info"
              onClick={(e) => xemChiTiet(e.row.data)}
            />
            <DataGridButton name="delete" />
          </Column>
          <Column
            dataField="ID"
            caption="ID"
            width={70}
            defaultSortOrder={"desc"}
          />
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
            format={"dd/MM/yyyy"}
            caption="Ngày gửi"
            width={100}
          />
          <Column dataField="HoTen" caption="Họ tên" />
          <Column dataField="SoDienThoai" caption="Số điện thoại" width={110} />
          <Column dataField="Email" caption="Email" width={200} />
          <Column dataField="DiaChi" caption="Địa chỉ" visible={false} />
          <Column dataField="NoiDung" caption="Nội dung" visible={false} />
          <Pager allowedPageSizes={[20, 50, 100]} showPageSizeSelector={true} />
          <Paging defaultPageSize={20} />
        </DataGrid>
        <GopYChiTietPopup ref={chiTietPopupRef} />
      </div>
      <div className="card-footer"></div>
    </div>
  );
}
