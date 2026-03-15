
import { useState } from 'react';
import {
  TabbedItem, Tab, SimpleItem, Form, ButtonItem, CompareRule, Label} from 'devextreme-react/form';
import { createCustomStore, notify, request, requestXForm } from '../utils/api';
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
    let res = await requestXForm(`Home/UpdateProfile`, {
      method: "POST",
      body: `values=${JSON.stringify(formData)}`,
    });
    if (res.status == "ko") {
      notify(`Cập nhật thông tin không thành công! : ${res.error}`, "error");
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
          <form onSubmit={handleSubmit}>
            <Form formData={formData}>
              <TabbedItem colSpan={2}>
                <Tab title="Thông tin cá nhân" colCount={2}>
                  <SimpleItem dataField="Email" colSpan={2} label="Email" />
                  <SimpleItem dataField="Password" editorType="dxTextBox">
                    <Label text="Mật khẩu" />
                  </SimpleItem>
                  <SimpleItem name="ConfirmPassword" editorType="dxTextBox">
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
