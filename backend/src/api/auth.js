import Notify from "devextreme/ui/notify";
import Cookies from "universal-cookie";

import { request } from "../utils/api";

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
    // console.log(data);
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
    const cookies = new Cookies();
    localStorage.setItem("access_token", data.access_token);
    cookies.set("access_token", data.access_token, {
      path: "/",
      maxAge: data.expires_in,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });
    var data = await request(
      `/User_Account/GetLoginUser`,
    );
    if (data.data.length == 0) {
      return {
        isOk: false,
        message: "Authentication failed",
      };
    }
    localStorage.setItem("user", JSON.stringify(data.data[0]));
    return {
      isOk: true,
      data: data.data[0],
    };
  } catch (ex) {
    console.log(ex);
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

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to change password",
    };
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true,
    };
  } catch {
    return {
      isOk: false,
      message: "Failed to reset password",
    };
  }
}
