import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Popup } from "devextreme-react";
import {
    Form,
    SimpleItem,
    ButtonItem
} from 'devextreme-react/form';

const Component = ({ data, components, handleComponentChange, path }) => {
  const ref = useRef(null);
  const configForm = useRef();
  const [popupVisible, setPopupVisible] = useState();

  const [{ isDragging }, drag] = useDrag({
    type: "component",
    item: { id: data.id, path },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(ref);

  const component = components[data.id];
  let propertyNames = [];
  if (component.Config) {
    propertyNames = Object.keys(JSON.parse(component.Config));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleComponentChange(component.id, configForm.current.props.formData);
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
          <Form
            ref={configForm}
            formData={component.Config ? JSON.parse(component.Config) : null}
          >
            {propertyNames &&
              propertyNames.map((item, index) => (
                <SimpleItem dataField={item} />
              ))}

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
      <div ref={ref} style={{ opacity }} className="component draggable">
        <i class="fa fa-cog" onClick={() => setPopupVisible(!popupVisible)}></i>
        <div>{component.Title}</div>
      </div>
    </>
  );
};
export default Component;
