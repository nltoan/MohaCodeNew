import { locale } from "devextreme/localization";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getUser, signIn as sendSignInRequest } from "../api/auth";
import { clearToken, getToken } from "../utils/token";

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
    locale(lng);
  }, []);

  const signIn = useCallback(async (email, password, code, type) => {
    const result = await sendSignInRequest(email, password, code, type);
    if (result.isOk) {
      setUser(result.data);
      navigate(result.setupRequired ? "/Profile" : "/");
    }

    return result;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("user");
    clearToken();
    localStorage.removeItem("setup_required");
    setUser(undefined);
  }, []);

  const isLogin = () => {
    if (!getToken() || !user) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    (async function () {
      const access_token = getToken();
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
