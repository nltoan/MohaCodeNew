import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import LayoutLogin from '../layouts/LayoutLogin';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  async function signInProcess(email, password, code, type) {
    auth.setLoading(true);
    let ret = await auth.signIn(email, password, code, type);
    if (ret.isOk == false) {
      setError(ret.message);
    }
    auth.setLoading(false);
    if (url) {
      navigate(url);
    }
  }
  return (
    <LayoutLogin title={"Login"} loading={auth.loading}>
      <div className="login-box">
        <div className="login-logo">
          <a className="text-white" href="/">
            Hệ thống CMS
          </a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            {error && <p>{error}</p>}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="code"
                className="form-control"
                placeholder="Authenticator code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="icheck-primary">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  onClick={() =>
                    signInProcess(email, password, code, "password")
                  }
                  className="btn btn-primary btn-block"
                >
                  Sign In
                </button>
                <button
                  onClick={() => signInProcess(email, password, code, "ldap")}
                  className="btn btn-primary btn-block"
                >
                  Sign In sử dụng AD
                </button>
              </div>
            </div>
            <p className="mb-1">
              <Link to="/ForgotPassword">Quên mật khẩu</Link>
            </p>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
}
