import { useState } from 'react';
import { Link } from 'react-router-dom';
import LayoutLogin from '../layouts/LayoutLogin';

export default function ForgotPassword() {
  const [error, setError] = useState(null);
  return (
    <LayoutLogin title={"Quên mật khẩu"}>
      <div className="login-box">
        <div className="login-logo">
          <a className="text-white" href="/">
            Quên mật khẩu
          </a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            {error && <p>{error}</p>}
            <div className="form-group row">
              <label
                for="email"
                className="col-md-12 col-form-label text-center"
              >
                E-Mail Address
              </label>
              <div className="col-md-12">
                <input
                  id="email"
                  type="email"
                  className="form-control "
                  name="email"
                  value=""
                  required=""
                  autocomplete="email"
                  autofocus=""
                />
              </div>
            </div>

            <div className="form-group row mb-0">
              <div className="col-md-12 text-center">
                <button type="submit" className="btn btn-primary btn-block">
                  Send Password Reset Link
                </button>
                <Link to="/Login" className={``}>
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
}
