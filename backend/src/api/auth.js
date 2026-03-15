import Notify from "devextreme/ui/notify";
import Cookies from "universal-cookie";

import { request } from "../utils/api";

export async function signIn(email, password, code, type) {
  try {
    //
    if (type == "ldap") {
      email = `${email}@molisa.gov.vn`;
    }
    // Send request
    const response = await fetch(
      `${window.env.REACT_APP_API_URL}/Token?type=${type}&code=${code}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `grant_type=password&username=${email}&password=${password}&code=${code}`,
      },
    );
    var data = await response.json();
    // console.log(data);
    if (data.access_token == undefined && data.error == "invalid_grant") {
      Notify(
        {
          message: `Đăng nhập không thành công!`,
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
    });
    var data = await request(
      `/User_Account/GetLoginUser?filter=["TenTruyCap","=","${email}"]`,
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
