import { useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import { notify, request, requestAction } from '../utils/api';
import { Popup, TextArea } from 'devextreme-react';
import parse from '../utils/safe-html';
import NewsPreviewPopup from './NewsPreviewPopup';

// Phe duyet tin theo quy trinh (TinTucsController.Action):
// - approve: o buoc cuoi (CanApprove) thi tin duoc xuat ban; o buoc giua (CanSendNext) thi chuyen sang buoc ke tiep.
// - reject: neu con buoc truoc thi tra ve buoc truoc, neu dang o buoc dau thi tra ve cho nguoi viet (rejectapprove).
export default function ApprovePopup({ ID, onHidden }) {
  const [item, setItem] = useState();
  const [id, setId] = useState(ID);
  const [popupApproveVisible, setPopupApproveVisible] = useState();
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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

  const row = item && item.data && item.data.length > 0 ? item.data[0] : null;
  // CanApprove = nguoi duyet o buoc cuoi: duyet la xuat ban. CanSendNext = buoc giua: duyet la chuyen buoc tiep.
  const isFinalStep = row ? Number(row.CanApprove) === 1 : false;
  const approveText = isFinalStep ? "Duyệt và xuất bản" : "Duyệt, chuyển bước tiếp";
  // BuocThu (API) = vi tri buoc hien tai; buoc 1 (hoac khong ro) thi tra ve la tra cho nguoi viet.
  const returnsToWriter = !row || row.BuocThu == null || Number(row.BuocThu) <= 1;
  const rejectText = returnsToWriter ? "Trả về cho người viết" : "Trả về bước trước";
  const stepText = row && row.BuocThu != null && row.TongSoBuoc != null
    ? `Bước ${row.BuocThu}/${row.TongSoBuoc}${row.TenBuocHienTai ? `: ${row.TenBuocHienTai}` : ""}`
    : "";

  async function doAction(action) {
    if (action === "reject" && !(comment || "").trim()) {
      setCommentError("Vui lòng ghi rõ lý do trả về để người viết biết cần sửa gì.");
      return;
    }
    setCommentError("");
    setBusy(true);
    const result = await requestAction(
      `/TinTucs/Action?ID=${ID}&action=${action}&comment=${encodeURIComponent(comment ?? "")}`, { method: "POST" });
    setBusy(false);
    if (!result.ok) {
      notify(result.message || (action === "reject" ? "Trả bài thất bại!" : "Phê duyệt thất bại!"), "error");
      return;
    }
    if (action === "reject") {
      notify(returnsToWriter ? "Đã trả bài về cho người viết" : "Đã trả bài về bước trước");
    } else {
      notify(isFinalStep ? "Đã duyệt và xuất bản tin." : "Đã duyệt, tin được chuyển sang bước tiếp theo.");
    }
    setPopupApproveVisible(false);
  }

  return (
    <>
      <Popup
        showTitle={true}
        title="Phê duyệt tin tức"
        hideOnOutsideClick={false}
        visible={popupApproveVisible}
        onHidden={() => {
          setPopupApproveVisible(false);
          onHidden();
        }}
        contentRender={() => {
          return (
            <>
              {row && (
                <>
                  <h4>{row.TieuDe}</h4>
                  {stepText && <p className="text-muted">Tin đang ở {stepText}</p>}
                  <div>{parse(row.MoTa ? row.MoTa : "")}</div>
                  <Button
                    icon="doc"
                    text="Xem toàn văn"
                    stylingMode="outlined"
                    onClick={() => setShowPreview(true)}
                  />
                  <h5 className="mt-3">Ghi chú</h5>
                  <TextArea
                    defaultValue={comment}
                    height={90}
                    placeholder="Ý kiến của người duyệt (bắt buộc khi trả về)"
                    onValueChange={(e) => {
                      setComment(e);
                      if (commentError && (e || "").trim()) setCommentError("");
                    }}
                  />
                  {commentError && <div className="text-danger mt-1">{commentError}</div>}
                  <br />
                  <Button
                    type="success"
                    text={approveText}
                    disabled={busy}
                    onClick={() => doAction("approve")}
                  />
                  <Button
                    type="danger"
                    text={rejectText}
                    disabled={busy}
                    onClick={() => doAction("reject")}
                  />
                  <Button
                    text="Tạm bỏ qua"
                    onClick={() => {
                      setPopupApproveVisible(false);
                    }}
                  />
                </>
              )}
            </>
          );
        }}
      ></Popup>
      {showPreview && (
        <NewsPreviewPopup ID={ID} onHidden={() => setShowPreview(false)} />
      )}
    </>
  );
}
