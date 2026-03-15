import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request } from '../utils/api';
import { Popup, TextArea } from 'devextreme-react';
import parse from 'html-react-parser';

export default function ApprovePopup({ ID, onHidden }) {
  const [item, setItem] = useState();
  const [id, setId] = useState(ID);
  const [popupApproveVisible, setPopupApproveVisible] = useState();
  const [comment, setComment] = useState();
  useEffect(() => {
    setId(ID);
  }, [ID]);

  useEffect(() => {
    (async function () {
      if (id == undefined) {
        return;
      }
      setPopupApproveVisible(true);
      const item = await request(
        `/TinTucs/Get?type=undefined&skip=0&take=20&requireTotalCount=true&filter=[["ID","=","${id}"]]`,
      );
      setItem(item);
    })();
  }, [id]);
  return (
    <Popup
      showTitle={true}
      title="Phê duyệt tin tức"
      hideOnOutsideClick={true}
      visible={popupApproveVisible}
      onHidden={() => {
        setPopupApproveVisible(false);
        onHidden();
      }}
      contentRender={() => {
        return (
          <>
            {item && item.data.length > 0 && (
              <>
                <h4>{item.data[0].TieuDe}</h4>
                <p>{parse(item.data[0].MoTa ? item.data[0].MoTa : "")}</p>
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
                      `/TinTucs/Action?ID=${ID}&action=approve&comment=${comment}`,
                    );
                    if (item.isOk == false) {
                      notify("Phê duyệt thất bại!", "error");
                      return;
                    }
                    notify("Phê duyệt thành công!");
                    setPopupApproveVisible(false);
                  }}
                >
                  Đồng ý
                </Button>
                <Button
                  type="danger"
                  onClick={async (e) => {
                    const item = await request(
                      `/TinTucs/Action?ID=${ID}&action=reject&comment=${comment}`,
                    );
                    if (item.isOk == false) {
                      notify("Hủy phê duyệt thất bại!", "error");
                      return;
                    }
                    notify("Hủy phê duyệt thành công!");
                    setPopupApproveVisible(false);
                  }}
                >
                  Từ chối duyệt
                </Button>
                <Button
                  onClick={async (e) => {
                    setPopupApproveVisible(false);
                  }}
                >
                  Tạm bỏ qua
                </Button>
              </>
            )}
          </>
        );
      }}
    ></Popup>
  );
}
