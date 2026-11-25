import ScrollView from 'devextreme-react/scroll-view';
import { useState, useEffect, useRef, useMemo } from 'react';
import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  Editing,
  Form,
  FilterRow, HeaderFilter, Button as DataGridButton
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore, notify } from '../utils/api';
import { confirmDiscard, setBeforeUnload } from '../utils/unsaved';
import LayoutBuilder from '../components/LayoutBuilder';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import "./styles.css"
import { Popup } from 'devextreme-react';

const dataSourceOptions = createCustomStore("BlockConfigs");
const dataSourceBlocksOptions = createLookupStore("Blocks");

function parseLayout(code) {
  if (!code) return [];
  try {
    const parsed = JSON.parse(code);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    notify("Dữ liệu bố cục hiện tại không đọc được, bố cục sẽ bắt đầu trống.", "warning");
    return [];
  }
}

export default function BlockConfig() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [initialLayout, setInitialLayout] = useState();
  const [item, setItem] = useState();
  const [layout, setLayout] = useState();
  const [sidebars, setSidebars] = useState([]);
  const [openSeq, setOpenSeq] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Ban JSON cua bo cuc khi mo popup, de biet co thay doi chua luu hay khong.
  const baselineRef = useRef("[]");
  const dirtyRef = useRef(false);
  const allowCloseRef = useRef(false);

  useEffect(() => {
    dataSourceBlocksOptions.load().then((data) => {
      let sidebars = data.map((x) => {
        return {
          id: x.ID,
          type: "sidebarItem",
          Title: x.Title,
          Code: x.Code,
          Path: x.Path,
          Config: x.Config,
        };
      });
      setSidebars(sidebars);
    });
  }, []);
  // Bo cuc ban dau chi tinh lai khi doi ban ghi; danh sach khoi (sidebars) tai xong sau
  // khong duoc lam mat nhung gi nguoi dung dang sua.
  useEffect(() => {
    const tmpLayout = item ? parseLayout(item.Code) : [];
    baselineRef.current = JSON.stringify(tmpLayout);
    dirtyRef.current = false;
    setIsDirty(false);
    setInitialLayout(tmpLayout);
  }, [item]);
  const initialData = useMemo(
    () => (initialLayout ? { layout: initialLayout, sidebars: sidebars || [] } : undefined),
    [initialLayout, sidebars],
  );

  useEffect(() => {
    setBeforeUnload(popupVisible && isDirty);
  }, [popupVisible, isDirty]);
  useEffect(() => () => setBeforeUnload(false), []);

  const handleChangeLayout = (newLayout) => {
    setLayout(newLayout);
    const dirty = JSON.stringify(newLayout || []) !== baselineRef.current;
    dirtyRef.current = dirty;
    setIsDirty(dirty);
  };

  const closePopup = () => {
    allowCloseRef.current = true;
    setPopupVisible(false);
  };

  const requestClose = () => {
    if (!dirtyRef.current) {
      closePopup();
      return;
    }
    confirmDiscard().then((ok) => {
      if (ok) closePopup();
    });
  };

  const handleUpdateLayout = () => {
    if (!item || isSaving) return;
    setIsSaving(true);
    const code = JSON.stringify(layout || []);
    dataSourceOptions
      .store()
      .update(item.ID, { Code: code })
      .then(
        () => {
          setIsSaving(false);
          dirtyRef.current = false;
          setIsDirty(false);
          // Mo lai ngay (truoc khi luoi tai xong) van thay bo cuc vua luu.
          setItem((prev) => (prev && prev.ID === item.ID ? { ...prev, Code: code } : prev));
          dataSourceOptions.reload();
          closePopup();
        },
        (error) => {
          setIsSaving(false);
          const detail = error && error.message ? ` ${error.message}` : "";
          notify(`Lưu bố cục thất bại.${detail}`, "error");
        },
      );
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cấu hình hiển thị</h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
              title="Thu gọn"
            >
              <i className="fas fa-minus" />
            </button>
          </div>
        </div>
        <div className="card-body">
          {item && initialData && (
            <Popup
              className="popupLayout"
              fullScreen={true}
              visible={popupVisible}
              dragEnabled={false}
              hideOnOutsideClick={false}
              showCloseButton={true}
              onHiding={(e) => {
                if (allowCloseRef.current || !dirtyRef.current) return;
                e.cancel = true;
                confirmDiscard().then((ok) => {
                  if (ok) closePopup();
                });
              }}
              onHidden={() => {
                allowCloseRef.current = false;
                setPopupVisible(false);
                setBeforeUnload(false);
              }}
              showTitle={true}
              title={`Cấu hình bố cục: ${item.Title || ""}${isDirty ? " (chưa lưu)" : ""}`}
              toolbarItems={[
                {
                  widget: "dxButton",
                  toolbar: "bottom",
                  location: "after",
                  options: {
                    text: isSaving ? "Đang lưu…" : "Lưu",
                    type: "success",
                    icon: "save",
                    disabled: isSaving,
                    onClick: handleUpdateLayout,
                  },
                },
                {
                  widget: "dxButton",
                  toolbar: "bottom",
                  location: "after",
                  options: {
                    text: "Hủy",
                    disabled: isSaving,
                    onClick: requestClose,
                  },
                },
              ]}
            >
              <ScrollView width="100%" height="100%">
                <h3>Hệ thống tính theo lưới: 1 trang được chia thành 12 cột</h3>
                <DndProvider backend={HTML5Backend}>
                  <LayoutBuilder
                    key={`${item.ID}-${openSeq}`}
                    initialData={initialData}
                    onChangeLayout={handleChangeLayout}
                  />
                </DndProvider>
              </ScrollView>
            </Popup>
          )}
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
            <SearchPanel visible={true} />
            <Editing
              mode="popup"
              useIcons={true}
              allowUpdating={true}
              allowAdding={false}
              allowDeleting={false}
            >
              <Popup title="Thông tin" showTitle={true} />
              <Form>
                <Item dataField="Title" colSpan={2} />
                <Item dataField="Description" colSpan={2} />
                <Item
                  dataField="Code"
                  colSpan={2}
                  editorType="dxTextArea"
                  editorOptions={{ readOnly: true, height: 120 }}
                  helpText="Chỉ xem. Dùng nút Cấu hình bố cục trên dòng để sửa."
                />
              </Form>
            </Editing>
            <Column
              dataField="ID"
              dataType="string"
              caption="id"
              visible={false}
            />
            <Column dataField="Title" dataType="string" caption="Tiêu đề" />
            <Column dataField="Description" dataType="string" caption="Mô tả" />
            <Column
              dataField="Code"
              dataType="string"
              caption="Mã bố cục"
              visible={false}
            />
            <Column type="buttons">
              <DataGridButton name="edit" />
              <DataGridButton
                hint="Cấu hình bố cục"
                icon="copy"
                onClick={(e) => {
                  allowCloseRef.current = false;
                  setOpenSeq((n) => n + 1);
                  setItem(e.row.data);
                  setPopupVisible(true);
                }}
              />
            </Column>
            <Paging defaultPageSize={20} />
          </DataGrid>
        </div>
        <div className="card-footer"></div>
      </div>
    </>
  );
}
