import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Editing,
  Popup as DataGridPopup,
  Button as DataGridButton,
  Lookup,
  Form,
  FormItem,
  FilterRow, HeaderFilter, ToolbarItem,
  Scrolling,
} from 'devextreme-react/data-grid';
import {
  TabbedItem, Tab,
} from 'devextreme-react/form';
import 'devextreme-react/html-editor';

import {getFrontEndURL} from '../utils/helpers';
import { Item } from 'devextreme-react/form';
import config from '../config';
import { createCustomStore, createFilterLookupStore, createLookupStore } from '../utils/api';
import { Popup } from 'devextreme-react';
import MyImageFileUploader from '../components/MyImageFileUploader';
import MyFileFileUploader from '../components/MyFileFileUploader';
import MyCustomHtmlEditor from '../components/MyCustomHtmlEditor';
import CKEditorWrapper from '../components/CKEditorWrapper';
import MyTreeCombobox from '../components/MyTreeCombobox';
import { useSearchParams } from 'react-router-dom';
import ApprovePopup from '../components/ApprovePopup';
import ActionPopup from '../components/ActionPopup';
import SendApprovePopup from '../components/SendApprovePopup';
import ViewPopup from '../components/ViewPopup';
import { useWindowSize } from "../utils/windowResize"; 

export default function TinTuc() {
  //const dataSourceChuyenMucOptions = createLookupStore("ChuyenMucs");
  const dataSourceChuyenMucOptions = createFilterLookupStore("ChuyenMucs",["IsVisible", "=", 1]);
  const dataSourceLoaiTinOptions = createLookupStore("DM_LoaiTin");
  const dataSourceBlockOptions = createLookupStore("Blocks");
  const dataSourceBuocQuyTrinhsOptions = createLookupStore("BuocQuyTrinhs");
  const dataSourceFileOptions = createLookupStore({
    loadUrl: `${window.env.REACT_APP_API_URL}/Files/GetLookUp`,
  });
  const dataSourceUsersOptions = createLookupStore("User_Account", "UserID");
  const [dataSourceOptions, setDataSourceOptions] = useState(null);
  const [title, setTitle] = useState("Quản lý tin tức");
  const [action, setAction] = useState();
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const actionParam = searchParams.get("action");
  const ID = searchParams.get("ID");

  const gridRef = useRef();
  let rowData;
  const size = useWindowSize();

  useEffect(() => {
    if (actionParam) {
      setAction({
        type: actionParam,
        data: ID,
      });
    }
  }, []);

  useEffect(() => {
    setDataSourceOptions(
      createCustomStore({
        loadUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Get?type=${type}`,
        insertUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Post?type=${type}`,
        updateUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Put?type=${type}`,
        deleteUrl: `${window.env.REACT_APP_API_URL}/TinTucs/Delete?type=${type}`,
      }),
    );
    if (type == "owner") {
      setTitle("Danh sách tin của tôi");
    } else if (type == "publish") {
      setTitle("Danh sách tin xuất bản của tôi");
    } else if (type == "unpublish") {
      setTitle("Danh sách tin hủy xuất bản của tôi");
    } else if (type == "wait") {
      setTitle("Danh sách tin gửi duyệt của tôi");
    } else if (type == "cancel") {
      setTitle("Danh sách tin bị trả về của tôi");
    } else if (type == "draft") {
      setTitle("Danh sách tin lưu nháp của tôi");
    } else if (type == "approving") {
      setTitle("Danh sách tin đang kiểm duyệt của tôi");
    } else if (type == "ownerApproving") {
      setTitle("Danh sách tin chờ tôi kiểm duyệt");
    } else if (type == "publishUnPublish") {
      setTitle("Danh sách tin xuất bản/ hủy xuất bản");
    } else if (type == "infographic") {
      setTitle("Danh sách tin infographic");
    } else if (type == "emagazine") {
      setTitle("Danh sách tin EMagazine");
    }
  }, [type]);
  function canCreate() {
    return (
      type == "owner" ||
      type == undefined ||
      type == "infographic" ||
      type == "emagazine"
    );
  }
  function treeviewChuyenMucEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceChuyenMucOptions}
          keyExpr={"ID"}
          displayExpr={"TenChuyenMuc"}
          parentIdExpr={"ChuyenMucCha"}
          selectionMode="single"
          defaultValue={data.row.data.IDChuyenMuc}
          onValueChanged={(e) => {
            if (e.value && e.value.length > 0) {
              data.setValue(e.value[0]);
            } else {
              data.setValue(null);
            }
          }}
        />
      </>
    );
  }
  function treeviewChuyenMucThemEditCellRender(data) {
    return (
      <>
        <MyTreeCombobox
          treeDataSource={dataSourceChuyenMucOptions}
          keyExpr={"ID"}
          displayExpr={"TenChuyenMuc"}
          parentIdExpr={"ChuyenMucCha"}
          selectionMode="multiple"
          defaultValue={data.row.data.ChuyenMucHienThiThem ? JSON.parse(data.row.data.ChuyenMucHienThiThem) : []}
          onValueChanged={(e) => {
            data.setValue(e.value);
          }}
        />
      </>
    );
  }
  function gjsEditCellRender(data) {
    return (
      <>
        <MyCustomHtmlEditor
          defaultValue={data.row.data.NoiDung}
          onValueChange={(e) => {
            data.setValue(e.value);
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
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
          {action && action.type == "view" && (
            <ViewPopup rowview={action.data} />
          )}
          {action && action.type == "approve" && (
            <ApprovePopup
              ID={action.data}
              onHidden={() => {
                gridRef.current._instance.refresh();
                setAction({type:"",data:""});
              }}
            />
          )}
          {action && action.type == "sendapprove" && (
            <SendApprovePopup
              ID={action.data}
              action={action.type}
              onHidden={() => {
                gridRef.current._instance.refresh();
                setAction({type:"",data:""});
              }}
            />
          )}
          {action &&
            (action.type == "cancelpublic" ||
              action.type == "public" ||
              action.type == "star" ||
              action.type == "unstar") && (
              <ActionPopup
                ID={action.data}
                action={action.type}
                onHidden={() => {
                  gridRef.current._instance.refresh();
                  setAction({type:"",data:""});
                }}
              />
            )}
          <DataGrid
            ref={gridRef}
            dataSource={dataSourceOptions}
            remoteOperations={true}
            allowColumnResizing={true}
            allowColumnReordering={true}
            rowAlternationEnabled={true}
            wordWrapEnabled={true}
            height="calc(100vh - 190px)"
            showBorders={true}
            onInitNewRow={(e) => {
              rowData = null;
              e.data.NgayXuatBan = new Date();
              e.data.NoiBat = 1;
              if (type === "infographic") {
                e.data.Type = 4;
                e.data.Infographich = 1;
              }
              if (type === "emagazine") {
                e.data.Type = 3;
              }
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
            <Scrolling
                    useNative={false}
                    scrollByContent={true}
                    scrollByThumb={true}
                    showScrollbar="onHover" />
            <Editing
              mode="popup"
              useIcons={true}
              allowUpdating={true}
              allowAdding={canCreate()}
              allowDeleting={true}
            >
              <DataGridPopup
                title="Thông tin"
                showTitle={true}
                fullScreen={true}
              >
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={{
                    icon: "email",
                    text: "Xem trước",
                    onClick: (e) => {
                      gridRef.current._instance.saveEditData();
                      let tmpUrl = `${getFrontEndURL("tin-tuc", e.row.data.TieuDe, e.row.data.ID)}`;
                      window.open(tmpUrl, "_blank", "noopener,noreferrer");
                    },
                  }}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={{
                    icon: "save",
                    text: "Lưu",
                    onClick: (e) => {
                      gridRef.current._instance.saveEditData();
                    },
                  }}
                />
                <ToolbarItem
                  widget="dxButton"
                  toolbar="bottom"
                  location="after"
                  options={{
                    icon: "close",
                    text: "Hủy",
                    onClick: (e) => {
                      gridRef.current._instance.cancelEditData();
                    },
                  }}
                />
              </DataGridPopup>
              <Form
                onInitialized={(e) => {
                  e.component.option("items[0].tabs[1].visible", !!rowData);
                  e.component.option("items[0].tabs[2].visible", !!rowData);
                  e.component.option("items[0].tabs[3].visible", !!rowData);
                  e.component.option("items[0].tabs[4].visible", !!rowData);
                  e.component.option("items[0].tabs[5].visible", !!rowData);
                  e.component.option("items[0].tabs[6].visible", !!rowData);
                }}
              >
                <TabbedItem colSpan={2}>
                  <Tab title="Thông tin chung" colCount={2}>
                    <Item
                      dataField="IDChuyenMuc"
                      isRequired={true}
                      colSpan={2}
                    />
                    <Item
                      dataField="ChuyenMucHienThiThem"
                      editorType="dxTagBox"
                      colSpan={2}
                    />
                    <Item dataField="TieuDe" colSpan={2} isRequired={true} />
                    <Item dataField="MoTa" colSpan={2} />
                    <Item dataField="NoiDung" colSpan={2} />
                    <Item dataField="TacGia" />
                    <Item
                      dataField="ChoPhepGuiPhanHoi"
                      editorType="dxCheckBox"
                    />
                    <Item dataField="AnhDaiDien" />
                    <Item dataField="NgayXuatBan" />
                    {/* <Item dataField="Type" /> */}
                    <Item dataField="TuKhoa" />
                    <Item dataField="LoaiTin" />
                    <Item dataField="NoiBat" editorType="dxCheckBox" />
                  </Tab>
                  <Tab title="Vùng hiển thị">
                    <DataGrid
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Block/Delete`,
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
                        e.data.TinTucID = rowData.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item dataField="BlockID" colSpan={2} />
                          <Item dataField="TinTucID" visible={false} />
                        </Form>
                      </Editing>

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
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_LienQuan/Delete`,
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
                        e.data.TinTucID = rowData.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item dataField="LienQuanID" colSpan={2} />
                        </Form>
                      </Editing>
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
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_Files/Delete`,
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
                        e.data.TinTucID = rowData.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <Popup title="Thông tin" showTitle={true} />
                        <Form>
                          <Item dataField="FileID" colSpan={2} />
                        </Form>
                      </Editing>
                      <Column
                        dataField="FileID"
                        dataType="string"
                        caption="Link file"
                        editCellRender={(cellInfo) => (
                          <MyFileFileUploader cellInfo={cellInfo} />
                        )}
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
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_BinhLuan/Delete`,
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
                        e.data.TinTucID = rowData.ID;
                      }}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />
                      <Editing
                        mode="popup"
                        useIcons={true}
                        allowUpdating={false}
                        allowAdding={true}
                        allowDeleting={true}
                      >
                        <DataGridPopup
                          title="Thông tin bình luận"
                          showTitle={true}
                        />
                        <Form>
                          <Item dataField="Comment" colSpan={2} />
                        </Form>
                      </Editing>

                      <Column
                        dataField="Comment"
                        dataType="string"
                        caption="Bình luận"
                      />
                      <Column
                        dataField="NgayTao"
                        dataType="date"
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
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_History/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />

                      <Column
                        dataField="ID"
                        dataType="string"
                        caption="ID"
                        defaultSortOrder={"desc"}
                      />
                      <Column
                        dataField="UpdatedAt"
                        dataType="date"
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
                      onInitialized={(e) => {
                        setTimeout(function () {
                          var tmpDs = createCustomStore({
                            loadUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Get?filter=[['TinTucID','=',${rowData ? rowData.ID : ""}]]`,
                            insertUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Post`,
                            updateUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Put`,
                            deleteUrl: `${window.env.REACT_APP_API_URL}/TinTuc_QuyTrinh/Delete`,
                          });
                          e.component.option("dataSource", tmpDs);
                        }, 0);
                      }}
                      allowColumnResizing={true}
                      allowColumnReordering={true}
                      rowAlternationEnabled={true}
                      showBorders={true}
                    >
                      <FilterRow visible={true} />
                      <HeaderFilter visible={true} />
                      <SearchPanel
                        visible={true}
                        highlightCaseSensitive={true}
                      />

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
                      <Column dataField="BinhLuan" caption="Ghi chú xử lý" />
                      <Column
                        dataField="NgayTao"
                        dataType="date"
                        format={"dd/MM/yyyy"}
                        caption="Ngày xử lý"
                      />
                    </DataGrid>
                  </Tab>
                </TabbedItem>
              </Form>
            </Editing>

            <Column dataField="ID" dataType="string" caption="ID" width={60} />
            <Column dataField="TieuDe" dataType="string" caption="Tiêu đề" />
            <Column
              dataField="IDChuyenMuc"
              dataType="string"
              caption="Chuyên mục"
              editCellRender={treeviewChuyenMucEditCellRender}
              width={120}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceChuyenMucOptions}
                allowColumnResizing={true}
                valueExpr="ID"
                displayExpr="TenChuyenMuc"
              />
            </Column>
            <Column
              dataField="ChuyenMucHienThiThem"
              allowSearch={false}
              dataType="string"
              caption="Chuyên mục hiển thị thêm"
              visible={false}
              editCellRender={treeviewChuyenMucThemEditCellRender}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceChuyenMucOptions}
                valueExpr="ID"
                displayExpr="TenChuyenMuc"
              />
            </Column>            
            <Column
              dataField="TacGia"
              dataType="string"
              caption="Tác giả"
              visible={false}
            />
            <Column
              dataField="NoiDung"
              dataType="string"
              caption="Nội dung"
              visible={false}
              allowSearch={false}
              // editCellRender={gjsEditCellRender}
              editCellRender={(cellInfo) => {
                return (
                  <CKEditorWrapper
                    value={cellInfo.value}
                    instanceName={`editor_${cellInfo.key || cellInfo.rowIndex}`}
                    onValueChanged={(newValue) => {
                        cellInfo.setValue(newValue);
                    }}
                  />
                );}}
            />
            <Column
              dataField="MoTa"
              dataType="string"
              caption="Mô tả"
              visible={false}
            >
              <FormItem
                colSpan={2}
                editorType="dxHtmlEditor"
                editorOptions={{...config.htmlEditorMediumOptions, elementAttr:{class: 'cke_ignored'}}}
              />
            </Column>
            <Column
              dataField="NgayTao"
              dataType="date"
              format={"dd/MM/yyyy"}
              caption="Ngày tạo"
              visible={false}
            />
            <Column
              dataField="TrangThai"
              dataType="string"
              caption="Trạng thái"
              width={90}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: "cancelpublic", Name: "Hủy xuất bản" },
                  { Val: "public", Name: "Xuất bản" },
                  { Val: "waitapprove", Name: "Chờ duyệt" },
                  { Val: "rejectapprove", Name: "Trả về" },
                  { Val: "draft", Name: "Lưu nháp" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="TuKhoa"
              dataType="string"
              caption="Từ khóa"
              visible={false}
            />
            <Column
              dataField="ChoPhepGuiPhanHoi"
              dataType="string"
              caption="Cho phép gửi phản hồi"
              visible={false}
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
            <Column
              dataField="NoiBat"
              dataType="string"
              caption="Nổi bật chuyên mục?"
              visible={false}
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
            <Column
              dataField="NgayXuatBan"
              dataType="datetime"
              format={"dd/MM/yyyy hh:mm a"}
              caption="Ngày xuất bản"
              defaultSortOrder={"desc"}
              width={100}
            />
            <Column
              dataField="NguoiTao"
              dataType="string"
              caption="Người tạo"
              visible={false}
            />
            <Column
              dataField="PageCount"
              dataType="string"
              caption="Lượt xem"
              width={70}
            />
            <Column
              dataField="ThoiGianUuTien"
              dataType="string"
              caption="ThoiGianUuTien"
              visible={false}
            />
            <Column
              dataField="AnhDaiDien"
              dataType="string"
              caption="Ảnh đại diện"
              visible={false}
              cellRender={config.defaultImageCellRender}
              editCellRender={(cellInfo) => (
                <MyImageFileUploader cellInfo={cellInfo} />
              )}
            />
            <Column
              dataField="LoaiTin"
              dataType="string"
              caption="Loại tin"
              visible={false}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={dataSourceLoaiTinOptions}
                valueExpr="ID"
                displayExpr="TenLoaiTin"
              />
            </Column>
            <Column
              dataField="Infographich"
              dataType="string"
              caption="Infographic"
              visible={false}
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
            <Column
              dataField="Type"
              dataType="string"
              caption="Loại trình bày"
              width={80}
            >
              <Lookup
                allowClearing={true}
                searchEnabled={true}
                dataSource={[
                  { Val: 4, Name: "Infographic" },
                  { Val: 3, Name: "EMagazine" },
                  { Val: 2, Name: "Video" },
                  { Val: 1, Name: "Audio" },
                  { Val: 0, Name: "Tin tức" },
                ]}
                valueExpr="Val"
                displayExpr="Name"
              />
            </Column>
            <Column
              dataField="PreFix"
              dataType="string"
              caption="PreFix"
              visible={false}
            />
            <Column type="buttons">
              <DataGridButton
                hint={"Xem web"}
                cssClass={"fas fa-eye"}
                onClick={(e) => {
                  window
                    .open(
                      `${getFrontEndURL("tin-tuc", e.row.data.TieuDe, e.row.data.ID)}`,
                      "_blank",
                    )
                    .focus();
                }}
              />
              <DataGridButton
                hint={"Xem lịch sử"}
                cssClass={"fas far fa-history"}
                onClick={(e) => {
                  setAction({
                    type: "view",
                    data: e.row.data,
                  });
                }}
              />
              <DataGridButton
                hint={"Đánh dấu nổi bật chuyên mục"}
                cssClass={"fas fa-heart"}
                visible={(e) => {
                  return e.row.data.CanUnPublish == 1 && e.row.data.NoiBat != 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "star",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Bỏ Đánh dấu nổi bật chuyên mục"}
                cssClass={"fas fa-heart-broken"}
                visible={(e) => {
                  return e.row.data.CanUnPublish == 1 && e.row.data.NoiBat == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "unstar",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Xuất bản tin"}
                cssClass={"fas far fa-check-circle"}
                visible={(e) => {
                  return e.row.data.CanPublish == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "public",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Hủy xuất bản tin"}
                cssClass={"fas fa-ban"}
                visible={(e) => {
                  return e.row.data.CanUnPublish == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "cancelpublic",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Duyệt xuất bản"}
                cssClass={"fas far fa-check-circle"}
                visible={(e) => {
                  return e.row.data.CanApprove == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "approve",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Duyệt để chuyển tiếp"}
                cssClass={"fas fa-paper-plane"}
                visible={(e) => {
                  return e.row.data.CanSendNext == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "approve",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                hint={"Gửi duyệt"}
                cssClass={"fas fa-paper-plane"}
                visible={(e) => {
                  return e.row.data.CanSendApprove == 1;
                }}
                onClick={(e) => {
                  setAction({
                    type: "sendapprove",
                    data: e.row.data.ID,
                  });
                }}
              />
              <DataGridButton
                useIcons={true}
                name="edit"
                visible={(e) => {
                  return e.row.data.CanEdit == 1 || e.row.data.CanSendNext == 1;
                }}
              />
              <DataGridButton
                name="delete"
                useIcons={true}
                visible={(e) => {
                  return e.row.data.CanEdit == 1;
                }}
              />
            </Column>
            <Pager
              allowedPageSizes={[20, 50, 100]}
              showPageSizeSelector={true}
            />
            <Paging defaultPageSize={20} />
          </DataGrid>
        </div>
        <div className="card-footer"></div>
      </div>
    </>
  );
}
