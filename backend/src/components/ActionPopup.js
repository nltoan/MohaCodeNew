import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request, requestAction } from '../utils/api';
import { Popup } from 'devextreme-react';

// Noi dung xac nhan theo tung thao tac: neu ro hanh dong va ten tin de nguoi dung khong bam nham.
const ACTIONS = {
  public: {
    title: 'Xuất bản tin',
    question: (t) => `Xuất bản tin «${t}» lên cổng thông tin?`,
    confirmText: 'Xuất bản',
    type: 'success',
    done: 'Đã xuất bản tin lên cổng thông tin.',
  },
  cancelpublic: {
    title: 'Gỡ tin khỏi cổng',
    question: (t) => `Gỡ tin «${t}» khỏi cổng thông tin?`,
    note: 'Người xem trên cổng sẽ không còn thấy tin này. Có thể xuất bản lại sau.',
    confirmText: 'Gỡ xuất bản',
    type: 'danger',
    done: 'Đã gỡ tin khỏi cổng thông tin.',
  },
  star: {
    title: 'Đánh dấu nổi bật',
    question: (t) => `Đánh dấu tin «${t}» là tin nổi bật của chuyên mục?`,
    confirmText: 'Đánh dấu nổi bật',
    type: 'success',
    done: 'Đã đánh dấu tin nổi bật.',
  },
  unstar: {
    title: 'Bỏ đánh dấu nổi bật',
    question: (t) => `Bỏ đánh dấu nổi bật cho tin «${t}»?`,
    confirmText: 'Bỏ nổi bật',
    type: 'default',
    done: 'Đã bỏ đánh dấu tin nổi bật.',
  },
};

export default function ActionPopup({ ID, action, title, onHidden }) {
  const [popupVisible, setPopupVisible] = useState();
  const [busy, setBusy] = useState(false);
  const [loadedTitle, setLoadedTitle] = useState("");
  useEffect(() => {
    setPopupVisible(true);
  }, [action]);
  // Mo tu duong dan (?action=...&ID=...) thi chua co tieu de: nap tieu de tin de cau hoi xac nhan neu ro tin nao.
  useEffect(() => {
    let active = true;
    if (title || ID == undefined || ID === "") return undefined;
    request(`/TinTucs/Get?skip=0&take=1&filter=${encodeURIComponent(JSON.stringify(["ID", "=", Number(ID)]))}`)
      .then((res) => {
        if (active && res?.data?.length) setLoadedTitle(res.data[0].TieuDe || "");
      })
      .catch(() => {});
    return () => { active = false; };
  }, [ID, title]);
  const cfg = ACTIONS[action] || {
    title: 'Xác nhận',
    question: () => 'Bạn có đồng ý thực hiện thao tác này?',
    confirmText: 'Đồng ý',
    type: 'success',
    done: 'Thao tác thành công!',
  };
  const articleTitle = title || loadedTitle || `mã ${ID}`;
  return (
    <Popup
      showTitle={true}
      title={cfg.title}
      hideOnOutsideClick={false}
      visible={popupVisible}
      width={520}
      height="auto"
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
            <h5>{cfg.question(articleTitle)}</h5>
            {cfg.note && <p className="text-muted">{cfg.note}</p>}
            <br />
            <Button
              type={cfg.type}
              text={cfg.confirmText}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                const result = await requestAction(
                  `/TinTucs/Action?ID=${ID}&action=${action}`, { method: "POST" });
                setBusy(false);
                if (!result.ok) {
                  notify(result.message, "error");
                  return;
                }
                notify(cfg.done);
                setPopupVisible(false);
              }}
            />
            <Button
              text="Không, quay lại"
              onClick={() => {
                setPopupVisible(false);
              }}
            />
          </>
        );
      }}
    ></Popup>
  );
}
