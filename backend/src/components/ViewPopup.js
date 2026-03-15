import { useEffect, useState, useRef } from 'react';
import { createCustomStore, createLookupStore } from '../utils/api';
import { DataGrid, Form, Popup } from 'devextreme-react';
import { Item, Tab, TabbedItem } from 'devextreme-react/form';
import { Column, FilterRow, HeaderFilter, Lookup, SearchPanel, Button as DataGridButton } from 'devextreme-react/data-grid';

export default function ViewPopup({ rowview }) {
  const dataSourceChuyenMucOptions = createLookupStore("ChuyenMucs");
  const dataSourceLoaiTinOptions = createLookupStore("DM_LoaiTin");
  const dataSourceBlockOptions = createLookupStore("Blocks");
  const dataSourceBuocQuyTrinhsOptions = createLookupStore("BuocQuyTrinhs");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  const dataSourceUsersOptions = createLookupStore("User_Account", "UserID");
  const [popupVisible, setPopupVisible] = useState();
  const [rowData, setRowData] = useState();
  const formRef = useRef();
  useEffect(() => {
    setPopupVisible(true);
    setRowData(rowview);
  }, [rowview]);
  return (
    <Popup
      showTitle={true}
      title="Chi tiết tin bài"
      hideOnOutsideClick={true}
      visible={popupVisible}
      fullScreen={true}
      onHidden={() => {
        setPopupVisible(false);
      }}
      onShown={(e) => {
        formRef.current._instance._refresh();
      }}
      contentRender={() => {
        return (
          <>
            <Form ref={formRef} formData={rowData} colCount={2}>
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin chung">
                  <Item dataField="ID" />
                  <Item
                    dataField="IDChuyenMuc"
                    editorType={"dxSelectBox"}
                    editorOptions={{
                      dataSource: dataSourceChuyenMucOptions,
                      valueExpr: "ID",
                      displayExpr: "TenChuyenMuc",
                    }}
                    label={{ text: "Chuyên mục", alignment: "left" }}
                  />
                  <Item
                    dataField="TieuDe"
                    dataType="string"
                    label={{ text: "Tiêu đề" }}
                    colSpan={2}
                  />
                  <Item
                    dataField="MoTa"
                    colSpan={2}
                    label={{ text: "Mô tả" }}
                  />
                  <Item
                    dataField="NoiDung"
                    colSpan={2}
                    label={{ text: "Nội dung" }}
                  />
                  <Item
                    dataField="TacGia"
                    dataType="string"
                    label={{ text: "Tác giả" }}
                  />
                  <Item
                    dataField="ChoPhepGuiPhanHoi"
                    editorType="dxCheckBox"
                    label={{ text: "Cho phép phản hồi" }}
                  />
                  <Item
                    dataField="AnhDaiDien"
                    label={{ text: "Ảnh đại diện" }}
                  />
                  <Item
                    dataField="NgayXuatBan"
                    dataType="date"
                    format={"dd/MM/yyyy"}
                    label={{ text: "Ngày xuất bản" }}
                  />
                  <Item
                    dataField="LoaiTin"
                    editorType={"dxSelectBox"}
                    editorOptions={{
                      dataSource: dataSourceLoaiTinOptions,
                      valueExpr: "ID",
                      displayExpr: "TenLoaiTin",
                    }}
                    label={{ text: "Loại Tin" }}
                  />
                  <Item
                    dataField="NoiBat"
                    editorType={"dxCheckBox"}
                    label={{ text: "Nổi bật" }}
                  />
                </Tab>
                <Tab title="Vùng hiển thị">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />

                    <Column
                      dataField="TinTucID"
                      caption="Tin tức"
                      visible={false}
                    />
                    <Column dataField="BlockID" caption="Tên vùng">
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceBlockOptions}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="Title"
                      />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Các tin liên quan">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Column dataField="LienQuanID" caption="Tiêu đề">
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={createLookupStore({
                          loadUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Get?type=publish`,
                        })}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="TieuDe"
                      />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Danh sách file đính kèm">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />
                    <Column
                      dataField="FileID"
                      dataType="string"
                      caption="Link file"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceFileOptions}
                        remoteOperations={true}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="Ten"
                      />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Danh sách bình luận">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />

                    <Column
                      dataField="Comment"
                      dataType="string"
                      caption="Bình luận"
                    />
                    <Column
                      dataField="NgayTao"
                      dataType="datetime"
                      caption="Ngày tạo"
                    />
                    <Column
                      dataField="NguoiTao"
                      dataType="string"
                      caption="Người tạo"
                    />
                  </DataGrid>
                </Tab>
                <Tab title="Lịch sử chỉnh sửa">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />

                    <Column
                      dataField="ID"
                      dataType="string"
                      caption="ID"
                      defaultSortOrder={"desc"}
                    />
                    <Column
                      dataField="UpdatedAt"
                      dataType="datetime"
                      caption="Ngày cập nhật"
                    />
                    <Column
                      dataField="UserId"
                      dataType="string"
                      caption="Người cập nhật"
                    />
                    <Column type="buttons">
                      <DataGridButton
                        text="Xem khác biệt"
                        onClick={(e) => {
                          window
                            .open(`/DiffPage?ID=${e.row.data.ID}`, "_blank")
                            .focus();
                        }}
                      />
                    </Column>
                  </DataGrid>
                </Tab>
                <Tab title="Lịch sử xử lý">
                  <DataGrid
                    dataSource={createCustomStore({
                      loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                    })}
                    allowColumnResizing={true}
                    allowColumnReordering={true}
                    rowAlternationEnabled={true}
                    showBorders={true}
                  >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <SearchPanel visible={true} highlightCaseSensitive={true} />

                    <Column
                      dataField="ID"
                      dataType="string"
                      caption="ID"
                      defaultSortOrder={"desc"}
                    />
                    <Column
                      dataField="BuocQuyTrinhID"
                      dataType="string"
                      caption="Bước thực hiện"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceBuocQuyTrinhsOptions}
                        allowColumnResizing={true}
                        valueExpr="ID"
                        displayExpr="TenBuocQuyTrinh"
                      />
                    </Column>
                    <Column
                      dataField="NguoiXuLyID"
                      dataType="string"
                      caption="Người xử lý thực hiện"
                    >
                      <Lookup
                        allowClearing={true}
                        searchEnabled={true}
                        dataSource={dataSourceUsersOptions}
                        allowColumnResizing={true}
                        valueExpr="UserID"
                        displayExpr="TenTruyCap"
                      />
                    </Column>
                    <Column
                      dataField="BinhLuan"
                      dataType="datetime"
                      caption="Ghi chú xử lý"
                    />
                    <Column
                      dataField="NgayTao"
                      dataType="datetime"
                      caption="Ngày xử lý"
                    />
                  </DataGrid>
                </Tab>
              </TabbedItem>
            </Form>
          </>
        );
      }}
    ></Popup>
  );
}
