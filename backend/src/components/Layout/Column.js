import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import DropZone from "./DropZone";
import Component from "./Component";
import { Popup } from "devextreme-react";
import {
    Form,
    SimpleItem,
    ButtonItem
} from 'devextreme-react/form';

// Do rong cot theo luoi 12 cot. Gia tri luu van la lop CSS (truong "class" nhu truoc), vi du "col-md-6".
const WIDTH_NAMES = {
  12: "Toàn trang",
  9: "3/4 trang",
  8: "2/3 trang",
  6: "Nửa trang",
  4: "1/3 trang",
  3: "1/4 trang",
  2: "1/6 trang",
};
const WIDTH_OPTIONS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => ({
  value: `col-md-${n}`,
  text: WIDTH_NAMES[n] ? `${n}/12 - ${WIDTH_NAMES[n]}` : `${n}/12`,
}));

export function columnWidthLabel(cssClass) {
  if (!cssClass) return "Độ rộng: tự động";
  const m = /(?:^|\s)col-(?:[a-z]+-)?(\d{1,2})(?:\s|$)/.exec(cssClass);
  const n = m ? Number(m[1]) : 0;
  if (n >= 1 && n <= 12) {
    return `Độ rộng: ${n}/12${WIDTH_NAMES[n] ? ` (${WIDTH_NAMES[n]})` : ""}`;
  }
  return `Lớp CSS: ${cssClass}`;
}

function widthItems(current) {
  if (current && !WIDTH_OPTIONS.some((o) => o.value === current)) {
    // Giu gia tri da luu truoc day (nhap tay) de khong lam mat bo cuc cu.
    return [{ value: current, text: `${current} (giá trị đang dùng)` }, ...WIDTH_OPTIONS];
  }
  return WIDTH_OPTIONS;
}

const style = {};
const Column = ({
  data,
  components,
  handleDrop,
  handleColumnChange,
  handleComponentChange,
  path,
}) => {
  const ref = useRef(null);
  const configForm = useRef();
  const [popupVisible, setPopupVisible] = useState();

  const [{ isDragging }, drag] = useDrag({
    type: "column",
    item: {
      id: data.id,
      children: data.children,
      path,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const renderComponent = (component, currentPath) => {
    return (
      <Component
        key={component.id}
        data={component}
        handleComponentChange={handleComponentChange}
        components={components}
        path={currentPath}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = configForm.current.props.formData.cssClass;
    handleColumnChange(data.id, value || undefined);
    setPopupVisible(false);
  };
  return (
    <div
      ref={ref}
      style={{ ...style, opacity }}
      className="base draggable column"
    >
      <Popup
        hideOnOutsideClick={true}
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        showTitle={true}
        title="Cấu hình cột"
        width={480}
        height="auto"
      >
        <form onSubmit={handleSubmit}>
          <Form formData={{ cssClass: data.class }} ref={configForm}>
            <SimpleItem
              dataField="cssClass"
              label={{ text: "Độ rộng cột" }}
              editorType="dxSelectBox"
              editorOptions={{
                items: widthItems(data.class),
                valueExpr: "value",
                displayExpr: "text",
                showClearButton: true,
                placeholder: "Tự động (chia đều)",
              }}
              helpText="Trang được chia thành 12 phần; tổng độ rộng các cột trong một hàng nên bằng 12/12."
            />
            <ButtonItem
              horizontalAlignment="left"
              buttonOptions={{
                text: "Lưu",
                type: "success",
                useSubmitBehavior: true,
              }}
            />
          </Form>
        </form>
      </Popup>
      <i
        className="fa fa-cog"
        title="Cấu hình cột"
        onClick={() => setPopupVisible(!popupVisible)}
      ></i>
      <small style={{ marginLeft: 6, color: "#555" }}>{columnWidthLabel(data.class)}</small>
      {data.children &&
        data.children.map((component, index) => {
          const currentPath = `${path}-${index}`;
          return (
            <React.Fragment key={component.id}>
              <DropZone
                data={{
                  path: currentPath,
                  childrenCount: data.children.length,
                }}
                onDrop={handleDrop}
              />
              {renderComponent(component, currentPath)}
            </React.Fragment>
          );
        })}
      <DropZone
        data={{
          path: `${path}-${data.children.length}`,
          childrenCount: data.children.length,
        }}
        onDrop={handleDrop}
        isLast
      />
    </div>
  );
};
export default Column;
