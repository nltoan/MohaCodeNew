
import { useState } from 'react';
import {
  TabbedItem, Tab, SimpleItem, Form, ButtonItem, CompareRule, Label} from 'devextreme-react/form';
import { createCustomStore, notify, request, requestXFormRaw } from '../utils/api';
import { useAuth } from '../contexts/auth';

export default function Profile() {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    UserID: auth.user.UserID,
    Email: auth.user.EmailAddress,
    IsTwoFA: auth.user.IsTwoFA,
    IsReceiveEmail: auth.user.IsReceiveEmail,
  });
  const [authenSetupImg, setAuthenSetupImg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.Password) {
      if (!formData.CurrentPassword) { notify("Vui lòng nhập mật khẩu hiện tại.", "error"); return; }
      if (formData.Password.length < 12) { notify("Mật khẩu mới cần từ 12 ký tự trở lên.", "error"); return; }
      if (formData.Password !== formData.ConfirmPassword) { notify("Mật khẩu nhập lại không khớp.", "error"); return; }
    }
    const res = await requestXFormRaw(`Home/UpdateProfile`, {
      method: "POST",
      body: new URLSearchParams({ values: JSON.stringify(formData) }).toString(),
    });
    if (!res.ok || !res.data || res.data.status == "ko") {
      const reason = res.data?.error
        || (res.status === 401 ? "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." : `Lỗi máy chủ (mã ${res.status}).`);
      notify(`Cập nhật thông tin không thành công! : ${reason}`, "error");
      return;
    }
    notify("Cập nhật thông tin thành công!", "success");
    auth.signOut();
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
              title="Collapse"
            >
              <i className="fas fa-minus" />
            </button>
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="remove"
              title="Remove"
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        <div className="card-body">
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
                  <SimpleItem dataField="Email" colSpan={2} label="Email" />
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
                      message="Password and Confirm Password do not match"
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
                      text: "Bật google authenticator",
                      value: !!formData.IsTwoFA,
                      enableThreeStateBehavior: false,
                      onValueChanged: async (e) => {
                        if (e.value == true) {
                          const vbs = await request(
                            `Home/GenerateAuthenticateSecret`,
                          );
                          setAuthenSetupImg(vbs.imageUrl);
                          setFormData({
                            ...formData,
                            EntryKey: vbs.entryKey,
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
                  {!!formData.IsTwoFA &&
                  <SimpleItem
                    colSpan={2}
                    render={(e) => {
                      return (
                        <>
                          <img
                            src={authenSetupImg}
                          />
                        </>
                      );
                    }}
                  />}
                  <SimpleItem dataField="EntryKey" editorOptions={{readOnly:true}} />
                  <SimpleItem dataField="Code" editorType="dxTextBox">
                    <Label text="Mã code để kích hoạt/bỏ kích hoạt" />
                  </SimpleItem>
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
        <div className="card-footer"></div>
      </div>
    </>
  );
}
