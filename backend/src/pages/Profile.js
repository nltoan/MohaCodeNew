
import { useState } from 'react';
import {
  TabbedItem, Tab, SimpleItem, Form, ButtonItem, CompareRule, Label} from 'devextreme-react/form';
import { notify, request, requestXFormRaw } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

export default function Profile() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserID: auth.user.UserID,
    Email: auth.user.EmailAddress,
    IsTwoFA: auth.user.IsTwoFA,
    IsReceiveEmail: auth.user.IsReceiveEmail,
  });
  const [authenSetupImg, setAuthenSetupImg] = useState('');
  const [profileError, setProfileError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setProfileError('');
    const showError = (message) => { setProfileError(message); notify(message, 'error'); };
    if (formData.Password) {
      if (!formData.CurrentPassword) { showError("Vui lòng nhập mật khẩu hiện tại."); return; }
      if (formData.Password.length < 12 || formData.Password.length > 255) { showError("Mật khẩu mới cần từ 12 đến 255 ký tự."); return; }
      if (formData.Password === formData.CurrentPassword) { showError("Mật khẩu mới phải khác mật khẩu hiện tại."); return; }
      if (formData.Password !== formData.ConfirmPassword) { showError("Mật khẩu nhập lại không khớp."); return; }
    }
    const passwordChanged = !!formData.Password;
    // Server chi bat/tat 2FA khi co ma xac nhan; khong co ma thi thay doi bi bo qua am tham.
    const twoFAToggled = !!formData.IsTwoFA !== !!auth.user.IsTwoFA;
    if (twoFAToggled && !String(formData.Code || "").trim()) {
      showError(formData.IsTwoFA
        ? "Vui lòng quét mã QR bằng Google Authenticator và nhập mã xác nhận để bật xác thực 2 lớp."
        : "Vui lòng nhập mã xác nhận từ Google Authenticator để tắt xác thực 2 lớp.");
      return;
    }
    const res = await requestXFormRaw(`Home/UpdateProfile`, {
      method: "POST",
      body: new URLSearchParams({ values: JSON.stringify(formData) }).toString(),
    });
    if (!res.ok || !res.data || res.data.status == "ko") {
      const reason = res.data?.error
        || (res.status === 401 ? "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." : `Lỗi máy chủ (mã ${res.status}).`);
      showError(`Cập nhật thông tin không thành công: ${reason}`);
      return;
    }
    if (passwordChanged || twoFAToggled) {
      // Doi mat khau thu hoi token hien tai (token_revoked); bat/tat 2FA cung yeu cau dang nhap lai.
      notify(passwordChanged
        ? "Đã đổi mật khẩu, vui lòng đăng nhập lại."
        : "Đã cập nhật xác thực 2 lớp, vui lòng đăng nhập lại.", "success");
      auth.signOut();
      navigate("/Login", { replace: true });
      return;
    }
    // Chi doi tuy chon nhan email: cap nhat thong tin dang nhap tai cho, khong dang xuat.
    auth.updateUser({ IsReceiveEmail: formData.IsReceiveEmail ? 1 : 0 });
    setFormData((prev) => ({ ...prev, CurrentPassword: "", Password: "", ConfirmPassword: "", Code: "" }));
    notify("Cập nhật thành công", "success");
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Thay đổi thông tin</h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
              title="Thu gọn"
            >
              <i className="fas fa-minus" />
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="alert alert-info">Khi đổi mật khẩu, nhập mật khẩu hiện tại và mật khẩu mới từ 12 đến 255 ký tự, khác mật khẩu hiện tại. Nhập lại mật khẩu mới để xác nhận.</div>
          {profileError && <div className="alert alert-danger" role="alert">{profileError}</div>}
          {localStorage.getItem("setup_required") === "1" && (
            <div className="alert alert-warning">
              Mật khẩu mặc định đã hết số lần đăng nhập cho phép. Vui lòng nhập mật khẩu hiện tại,
              đặt mật khẩu mới (từ 12 ký tự), bật Google Authenticator và nhập mã xác nhận,
              sau đó bấm Cập nhật để tiếp tục sử dụng hệ thống.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Form formData={formData}>
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin cá nhân" colCount={2}>
                  <SimpleItem dataField="Email" colSpan={2} editorOptions={{ readOnly: true }} helpText="Liên hệ quản trị hệ thống nếu cần đổi email.">
                    <Label text="Email" />
                  </SimpleItem>
                  <SimpleItem dataField="CurrentPassword" editorType="dxTextBox" editorOptions={{ mode: "password" }}><Label text="Mật khẩu hiện tại" /></SimpleItem>
                  <SimpleItem dataField="Password" editorType="dxTextBox" editorOptions={{ mode: "password" }}>
                    <Label text="Mật khẩu" />
                  </SimpleItem>
                  <SimpleItem dataField="ConfirmPassword" editorType="dxTextBox" editorOptions={{ mode: "password" }}>
                    <Label text="Nhập lại mật khẩu" />
                    <CompareRule
                      comparisonTarget={() => {
                        return formData.Password;
                      }}
                      message="Mật khẩu nhập lại không khớp."
                    />
                  </SimpleItem>
                  <SimpleItem
                    colSpan={2}
                    editorType="dxCheckBox"
                    editorOptions={{
                      text: "Bật nhận email",
                      value: !!formData.IsReceiveEmail,
                      enableThreeStateBehavior: false,
                      onValueChanged: async (e) => {
                        setFormData({
                          ...formData,
                          IsReceiveEmail: e.value,
                        });
                      },
                    }}
                  >
                    <Label visible={false} />
                  </SimpleItem>
                  <SimpleItem
                    colSpan={2}
                    editorType="dxCheckBox"
                    editorOptions={{
                      text: "Bật xác thực 2 lớp (Google Authenticator)",
                      value: !!formData.IsTwoFA,
                      enableThreeStateBehavior: false,
                      onValueChanged: async (e) => {
                        if (e.value == true) {
                          const vbs = await request(
                            `Home/GenerateAuthenticateSecret`,
                          );
                          if (!vbs?.imageUrl) notify("Không tạo được mã QR, vui lòng thử lại.", "error");
                          setAuthenSetupImg(vbs?.imageUrl || '');
                          setFormData({
                            ...formData,
                            EntryKey: vbs?.entryKey,
                            IsTwoFA: e.value,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            EntryKey: '',
                            IsTwoFA: e.value,
                          });
                        }
                      },
                    }}
                  >
                    <Label visible={false} />
                  </SimpleItem>
                  {!!formData.IsTwoFA && !!auth.user.IsTwoFA && !authenSetupImg &&
                  <SimpleItem
                    colSpan={2}
                    render={() => (
                      <div className="text-success">
                        <i className="fas fa-check-circle" /> Xác thực 2 lớp đang bật. Mỗi lần đăng nhập, nhập mã 6 số trong ứng dụng Google Authenticator.
                      </div>
                    )}
                  />}
                  {!!formData.IsTwoFA && !!authenSetupImg &&
                  <SimpleItem
                    colSpan={2}
                    render={() => (
                      <div>
                        <ol className="pl-3 mb-2">
                          <li>Cài ứng dụng Google Authenticator (hoặc ứng dụng tương tự) trên điện thoại.</li>
                          <li>Trong ứng dụng, chọn thêm tài khoản rồi quét mã QR bên dưới (hoặc nhập tay khóa thiết lập).</li>
                          <li>Nhập mã 6 số ứng dụng hiển thị vào ô "Mã xác nhận" rồi bấm Cập nhật.</li>
                        </ol>
                        <img src={authenSetupImg} alt="Mã QR thiết lập Google Authenticator" />
                      </div>
                    )}
                  />}
                  {!!formData.IsTwoFA && !!authenSetupImg &&
                  <SimpleItem dataField="EntryKey" editorOptions={{readOnly:true}}>
                    <Label text="Khóa thiết lập (nhập tay nếu không quét được mã QR)" />
                  </SimpleItem>}
                  {!!formData.IsTwoFA !== !!auth.user.IsTwoFA &&
                  <SimpleItem
                    dataField="Code"
                    editorType="dxTextBox"
                    editorOptions={{ inputAttr: { inputmode: "numeric", autocomplete: "one-time-code" }, maxLength: 6 }}
                    helpText={formData.IsTwoFA
                      ? "Mã 6 số trong ứng dụng sau khi quét mã QR, để xác nhận bật xác thực 2 lớp."
                      : "Mã 6 số hiện tại trong ứng dụng, để xác nhận tắt xác thực 2 lớp."}
                  >
                    <Label text="Mã xác nhận" />
                  </SimpleItem>}
                  <ButtonItem
                    horizontalAlignment="left"
                    buttonOptions={{
                      text: "Cập nhật",
                      type: "success",
                      useSubmitBehavior: true,
                    }}
                  />
                </Tab>
              </TabbedItem>
            </Form>
          </form>
        </div>
      </div>
    </>
  );
}
