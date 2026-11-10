import Notify from "devextreme/ui/notify";

import { request } from "../utils/api";
import { setToken } from "../utils/token";

export async function signIn(email, password, code, type) {
  try {
    //
    if (type === "ldap") {
      email = email.trim();
      const domain = (window.env.REACT_APP_LDAP_DOMAIN || 'molisa.gov.vn').replace(/^@/, '');
      if (!email.includes('@')) email = `${email}@${domain}`;
    }
    // Send request
    const response = await fetch(
      `${window.env.REACT_APP_API_URL}/Token?${new URLSearchParams({type, code: code || ""})}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({grant_type: "password", username: email, password, code: code || ""}).toString(),
      },
    );
    var data = await response.json();
    if (!response.ok || !data.access_token) {
      const visibleErrors = new Set([
        'LDAP chưa được cấu hình xác thực an toàn.',
        'Không thể xác thực tài khoản AD.',
        'Tài khoản chưa được cấp quyền sử dụng hệ thống.',
        'Mã xác nhận không đúng!',
        'Vui lòng thử lại sau một phút.',
      ]);
      Notify(
        {
          message: visibleErrors.has(data.error_description) ? data.error_description : 'Đăng nhập không thành công!',
          height: 45,
          width: 150,
          minWidth: 150,
          type: "error",
          displayTime: 3500,
        },
        {
          position: "top right",
        },
      );
      return {
        isOk: false,
        message: data.error_description,
      };
    }
    setToken(data.access_token, data.expires_in);
    // Mat khau mac dinh het luot dang nhap: server chi cho doi mat khau + bat 2FA.
    if (data.setup_required) localStorage.setItem("setup_required", "1");
    else localStorage.removeItem("setup_required");
    const userResp = await request(
      `/User_Account/GetLoginUser`,
    );
    if (!userResp?.data?.length) {
      return {
        isOk: false,
        message: "Authentication failed",
      };
    }
    localStorage.setItem("user", JSON.stringify(userResp.data[0]));
    return {
      isOk: true,
      data: userResp.data[0],
      setupRequired: localStorage.getItem("setup_required") === "1",
    };
  } catch (ex) {
    console.error(ex);
    return {
      isOk: false,
      message: "Authentication failed",
    };
  }
}

export async function getUser() {
  try {
    let user = localStorage.getItem("user");
    if (user) {
      return {
        isOk: true,
        data: JSON.parse(user),
      };
    }
    return {
      isOk: false,
      data: null,
    };
  } catch {
    return {
      isOk: false,
    };
  }
}

