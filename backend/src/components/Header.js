import { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/auth';
import { useTranslation } from 'react-i18next';
import './header.css';

export default function Header({}) {
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="navbar-search"
            href="#"
            role="button"
          >
            <i className="fas fa-search" />
          </a>
          <div className="navbar-search-block">
            <form className="form-inline">
              <div className="input-group input-group-sm">
                <input
                  className="form-control form-control-navbar"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <div className="input-group-append">
                  <button className="btn btn-navbar" type="submit">
                    <i className="fas fa-search" />
                  </button>
                  <button
                    className="btn btn-navbar"
                    type="button"
                    data-widget="navbar-search"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>
        {/* <li className="nav-item dropdown">
          <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" className="nav-link dropdown-toggle">{auth.language}</a>
          <ul aria-labelledby="dropdownSubMenu1" className="dropdown-menu border-0 shadow">
              <li><a onClick={() => auth.changeLanguage('en')} className="dropdown-item">English</a></li>
              <li><a onClick={() => auth.changeLanguage('vi')} className="dropdown-item">Vietnam</a></li>
          </ul>
        </li> */}
        <li className="nav-item dropdown">
          <a href="#" className="nav-link" onClick={() => setShow(!show)}>
            <img
              src="/avatar.png"
              width="28px"
              className="img img-circle  img-responsive"
              alt="User Image"
            />
            {auth.user && auth.user.TenTruyCap}
            <i className="fa fa-angle-down right"></i>
          </a>
          <div
            className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${show ? "show" : ""}`}
          >
            <div className="dropdown-divider"></div>
            <Link to={"/Profile"} className={`dropdown-item`}>
              <i className="fa fa-sign-out mr-2"></i> Profile
            </Link>
            <a
              href="#"
              onClick={() => auth.signOut()}
              className="dropdown-item dropdown-footer bg-gray"
            >
              <i className="fa fa-sign-out mr-2"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}
