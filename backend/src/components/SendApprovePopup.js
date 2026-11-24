import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request, requestAction } from '../utils/api';
import { Popup, TextArea } from 'devextreme-react';
import parse from '../utils/safe-html';

export default function SendApprovePopup({ ID, action, onHidden }) {
  const [item, setItem] = useState();
  const [id, setId] = useState(ID);
  const [comment, setComment] = useState("");
  const [popupVisible, setPopupVisible] = useState();
  const [busy, setBusy] = useState(false);
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
      title="Gửi duyệt tin"
      hideOnOutsideClick={false}
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
                <div>{parse(item.data[0].MoTa ?? "")}</div>
                <h5>Ghi chú</h5>
                <TextArea
                  onValueChange={(e) => {
                    setComment(e);
                  }}
                />
                <br />
                <Button
                  type="success"
                  disabled={busy}
                  onClick={async (e) => {
                    // Chan bam hai lan lien tiep (gui duyet trung).
                    setBusy(true);
                    const result = await requestAction(
                      `/TinTucs/Action?ID=${ID}&action=${action}&comment=${encodeURIComponent(comment ?? "")}`, { method: "POST" });
                    setBusy(false);
                    if (!result.ok) {
                      notify(result.message, "error");
                      return;
                    }
                    notify("Đã gửi tin lên người duyệt.");
                    setPopupVisible(false);
                  }}
                >
                  Gửi duyệt
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
