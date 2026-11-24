import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/auth';
import './header.css';

export default function Header() {
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Dong menu tai khoan khi bam ra ngoai hoac nhan Esc.
  useEffect(() => {
    if (!show) return undefined;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShow(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setShow(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [show]);

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            aria-label="Mở/đóng menu"
            title="Mở/đóng menu"
          >
            <i className="fas fa-bars" aria-hidden="true" />
          </a>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown" ref={menuRef}>
          <a
            href="#"
            className="nav-link"
            role="button"
            aria-haspopup="true"
            aria-expanded={show}
            onClick={(e) => {
              e.preventDefault();
              setShow(!show);
            }}
          >
            <img
              src="/avatar.png"
              width="28px"
              className="img img-circle  img-responsive"
              alt=""
            />
            {auth.user && auth.user.TenTruyCap}
            <i className="fa fa-angle-down right ml-1" aria-hidden="true"></i>
          </a>
          <div
            className={`dropdown-menu dropdown-menu-lg dropdown-menu-right ${show ? "show" : ""}`}
          >
            <div className="dropdown-divider"></div>
            <Link to={"/Profile"} className={`dropdown-item`} onClick={() => setShow(false)}>
              <i className="fas fa-user mr-2" aria-hidden="true"></i> Thông tin tài khoản
            </Link>
            <a
              href="/Login"
              onClick={(e) => {
                e.preventDefault();
                setShow(false);
                auth.signOut();
                navigate("/Login", { replace: true });
              }}
              className="dropdown-item dropdown-footer bg-gray"
            >
              <i className="fas fa-sign-out-alt mr-2" aria-hidden="true"></i> Đăng xuất
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
}
