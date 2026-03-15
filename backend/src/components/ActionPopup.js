import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request } from '../utils/api';
import { Popup } from 'devextreme-react';

export default function ActionPopup({ ID, action, onHidden }) {
  const [popupVisible, setPopupVisible] = useState();
  useEffect(() => {
    setPopupVisible(true);
  }, [action]);
  return (
    <Popup
      showTitle={true}
      title="Xác nhận"
      hideOnOutsideClick={true}
      visible={popupVisible}
      onHidden={() => {
        setPopupVisible(false);
        onHidden();
      }}
      position={{
        my: "center",
        at: "center",
        of: window,
      }}
      contentRender={() => {
        return (
          <>
            <h5>Bạn có đồng ý thực hiện hành động này?</h5>
            <br />
            <Button
              type="success"
              onClick={async (e) => {
                const item = await request(
                  `/TinTucs/Action?ID=${ID}&action=${action}`,
                );
                if (item.isOk == false) {
                  notify("Thao tác thất bại!", "error");
                  return;
                }
                notify("Thao tác thành công!");
                setPopupVisible(false);
              }}
            >
              Đồng ý
            </Button>
            <Button
              onClick={async (e) => {
                setPopupVisible(false);
              }}
            >
              Tạm hủy
            </Button>
          </>
        );
      }}
    ></Popup>
  );
}
