import ScrollView from 'devextreme-react/scroll-view';
import { useState, useEffect } from 'react';
import DataGrid, {
  Column,
  Paging,
  SearchPanel,
  Editing,
  Form,
  FilterRow, HeaderFilter, Button as DataGridButton
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import { createCustomStore, createLookupStore } from '../utils/api';
import LayoutBuilder from '../components/LayoutBuilder';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import "./styles.css"
import { Button, Popup } from 'devextreme-react';

export default function BlockConfig() {
  const dataSourceOptions = createCustomStore("BlockConfigs");
  const dataSourceBlocksOptions = createLookupStore("Blocks");
  const [popupVisible, setPopupVisible] = useState();
  const [initialData, setInitialData] = useState();
  const [item, setItem] = useState();
  const [layout, setLayout] = useState();
  const [sidebars, setSidebars] = useState();

  useEffect(() => {
    dataSourceBlocksOptions.load().then((data) => {
      let sidebars = data.map((x) => {
        return {
          id: x.ID,
          type: "sidebarItem",
          Title: x.Title,
          Code: x.Code,
          Path: x.Path,
        };
      });
      setSidebars(sidebars);
    });
  }, []);
  useEffect(() => {
    if (!item || !item.Code) {
      setInitialData({
        layout: [],
        sidebars: sidebars,
      });
      return;
    }
    let tmpLayout = JSON.parse(item.Code);
    setInitialData({
      layout: tmpLayout,
      sidebars: sidebars,
    });
  }, [item]);
  const handleUpdateLayout = (event) => {
    dataSourceOptions
      .store()
      .update(item.ID, { Code: JSON.stringify(layout) })
      .then(
        (dataObj) => {
          dataSourceOptions.reload();
          setPopupVisible(false);
        },
        (error) => {
          /* ... */
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
          {item && initialData && (
            <Popup
              className="popupLayout"
              fullScreen={true}
              visible={popupVisible}
              dragEnabled={false}
              hideOnOutsideClick={true}
              showCloseButton={true}
              onHidden={() => {
                setPopupVisible(false);
              }}
              showTitle={true}
              title="Cấu hình layout"
            >
              <ScrollView width="100%" height="100%">
                <Button onClick={handleUpdateLayout}>Lưu</Button>
                <h3>Hệ thống tính theo grid, 1 trang được chia thành 12 cột</h3>
                <DndProvider backend={HTML5Backend}>
                  <LayoutBuilder
                    initialData={initialData}
                    onChangeLayout={(layout) => setLayout(layout)}
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
                <Item dataField="Title" colSpan={2} />
                <Item dataField="Description" colSpan={2} />
                <Item dataField="Code" colSpan="2" editorType="dxTextArea" />
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
              caption="Code"
              visible={false}
            />
            <Column type="buttons">
              <DataGridButton
                hint="Cấu hình"
                icon="copy"
                onClick={(item) => {
                  setItem(item.row.data);
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
