import {loadMessages, locale } from "devextreme/localization";
import * as viMessages from "devextreme/localization/messages/vi.json";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import { getUser, signIn as sendSignInRequest } from "../api/auth";

function AuthProvider(props) {
  const [user, setUser] = useState();
  const [language, setLanguage] = useState();
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = useCallback((lng) => {
    localStorage.setItem("lng", lng);
    i18n.changeLanguage(lng);
    setLanguage(lng);
    loadMessages(viMessages);
    locale(lng);
  }, []);

  const signIn = useCallback(async (email, password, code, type) => {
    const result = await sendSignInRequest(email, password, code, type);
    if (result.isOk) {
      setUser(result.data);
      navigate("/");
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    const cookies = new Cookies();
    cookies.remove("access_token");
    setUser(undefined);
  }, []);

  const isLogin = () => {
    const cookies = new Cookies();
    let access_token = cookies.get("access_token");
    if (!access_token || !user) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    (async function () {
      const cookies = new Cookies();
      let access_token = cookies.get("access_token");
      const result = await getUser();
      if (!access_token || result.isOk == false) {
        signOut();
        setLoading(false);
        return;
      }
      setUser(result.data);

      let lng = localStorage.getItem("lng");
      if (!lng) {
        lng = "vi";
      }
      changeLanguage(lng);
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLogin,
        language,
        signIn,
        signOut,
        changeLanguage,
        loading,
        setLoading,
      }}
      {...props}
    />
  );
}

const AuthContext = createContext({ loading: false });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
