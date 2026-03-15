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
    handleColumnChange(data.id, configForm.current.props.formData.cssClass);
    setPopupVisible(!popupVisible);
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
      >
        <form onSubmit={handleSubmit}>
          <Form formData={{ cssClass: data.class }} ref={configForm}>
            <SimpleItem dataField="cssClass" />
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
      <i class="fa fa-cog" onClick={() => setPopupVisible(!popupVisible)}></i>
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
