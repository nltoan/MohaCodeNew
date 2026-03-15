import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request } from '../utils/api';
import { Popup, TextArea } from 'devextreme-react';
import parse from 'html-react-parser';;

export default function SendApprovePopup({ ID, action, onHidden }) {
  const [item, setItem] = useState();
  const [id, setId] = useState(ID);
  const [comment, setComment] = useState();
  const [popupVisible, setPopupVisible] = useState();
  useEffect(() => {
    setId(ID);
  }, [ID]);

  useEffect(() => {
    (async function () {
      if (id == undefined) {
        return;
      }
      setPopupVisible(true);
      const item = await request(
        `/TinTucs/Get?type=undefined&skip=0&take=20&requireTotalCount=true&filter=[["ID","=","${id}"]]`,
      );
      setItem(item);
    })();
  }, [id]);
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
      contentRender={() => {
        return (
          <>
            {item && item.data.length > 0 && (
              <>
                <h4>{item.data[0].TieuDe}</h4>
                <p>{parse(item.data[0].MoTa ?? "")}</p>
                <h5>Ghi chú</h5>
                <TextArea
                  onValueChange={(e) => {
                    setComment(e);
                  }}
                />
                <br />
                <Button
                  type="success"
                  onClick={async (e) => {
                    const item = await request(
                      `/TinTucs/Action?ID=${ID}&action=${action}&comment=${comment}`,
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
            )}
          </>
        );
      }}
    ></Popup>
  );
}
