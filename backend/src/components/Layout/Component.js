import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Popup } from "devextreme-react";
import {
    Form,
    SimpleItem,
    ButtonItem
} from 'devextreme-react/form';

function parseConfig(config) {
  if (!config) return null;
  try {
    const parsed = JSON.parse(config);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

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

  // Khoi vua keo vao co the chua co trong danh sach components -> dung chinh du lieu trong bo cuc.
  const component = (components && components[data.id]) || data;
  const configData = parseConfig(component.Config);
  const propertyNames = configData ? Object.keys(configData) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    handleComponentChange(component.id, configForm.current.props.formData);
    setPopupVisible(false);
  };
  return (
    <>
      <Popup
        hideOnOutsideClick={true}
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        showTitle={true}
        title={`Cấu hình khối: ${component.Title || ""}`}
        width={480}
        height="auto"
      >
        {propertyNames.length === 0 ? (
          <p>Khối này không có thông số để cấu hình.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Form ref={configForm} formData={configData}>
              {propertyNames.map((name) => (
                <SimpleItem key={name} dataField={name} />
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
        )}
      </Popup>
      <div ref={ref} style={{ opacity }} className="component draggable">
        <i
          className="fa fa-cog"
          title="Cấu hình khối"
          onClick={() => setPopupVisible(!popupVisible)}
        ></i>
        <div>{component.Title}</div>
      </div>
    </>
  );
};
export default Component;
