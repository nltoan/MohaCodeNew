import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import DropZone from "./DropZone";
import Column from "./Column";
import { Popup } from "devextreme-react";
import {
    Form,
    SimpleItem,
    ButtonItem
} from 'devextreme-react/form';

const style = {};
const Row = ({
  data,
  components,
  handleDrop,
  handleRowChange,
  handleColumnChange,
  handleComponentChange,
  path,
}) => {
  const ref = useRef(null);
  const configForm = useRef();
  const [popupVisible, setPopupVisible] = useState();

  const [{ isDragging }, drag] = useDrag({
    type: "row",
    item: {
      type: "row",
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

  const renderColumn = (column, currentPath) => {
    return (
      <Column
        key={column.id}
        data={column}
        components={components}
        handleDrop={handleDrop}
        handleColumnChange={handleColumnChange}
        handleComponentChange={handleComponentChange}
        path={currentPath}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRowChange(data.id, configForm.current.props.formData.cssClass);
    setPopupVisible(!popupVisible);
  };
  return (
    <>
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
      <div
        ref={ref}
        style={{ ...style, opacity }}
        className="base draggable row"
      >
        <i class="fa fa-cog" onClick={() => setPopupVisible(!popupVisible)}></i>
        <div className="columns">
          {data.children.map((column, index) => {
            const currentPath = `${path}-${index}`;

            return (
              <React.Fragment key={column.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: data.children.length,
                  }}
                  onDrop={handleDrop}
                  className="horizontalDrag"
                />
                {renderColumn(column, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${path}-${data.children.length}`,
              childrenCount: data.children.length,
            }}
            onDrop={handleDrop}
            className="horizontalDrag"
            isLast
          />
        </div>
      </div>
    </>
  );
};
export default Row;
