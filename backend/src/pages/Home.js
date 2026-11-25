import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadIndicator } from "devextreme-react/load-indicator";

import { request } from "../utils/api";
import { getFrontEndURL } from "../utils/helpers";

// O so lieu; co "to" thi bam vao mo danh sach tuong ung.
function StatBox({ label, value, to, icon, color = "bg-info" }) {
  const content = (
    <div className="info-box">
      <span className={`info-box-icon ${color}`}>
        <i className={icon} />
      </span>
      <div className="info-box-content">
        <span className="info-box-text" style={{ whiteSpace: "normal" }}>{label}</span>
        <span className="info-box-number">{value ?? 0}</span>
      </div>
    </div>
  );
  return (
    <div className="col-md-3 col-sm-6 col-12">
      {to ? (
        <Link to={to} className="text-reset" title={`Mở danh sách: ${label}`} style={{ textDecoration: "none" }}>
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
}

export default function Home() {
  const [statistic, setStatistic] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | error

  const load = useCallback(async () => {
    setStatus("loading");
    let data = null;
    try {
      data = await request(`/Home/Statistic`);
    } catch {
      data = null;
    }
    if (data) {
      setStatistic(data);
      setStatus("ok");
    } else {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading" && !statistic) {
    return (
      <div className="d-flex align-items-center" style={{ gap: 12, padding: 24 }} role="status">
        <LoadIndicator height={32} width={32} />
        <span>Đang tải số liệu…</span>
      </div>
    );
  }

  if (status === "error" && !statistic) {
    return (
      <div className="alert alert-warning d-flex align-items-center flex-wrap" style={{ gap: 12 }} role="alert">
        <span>Không tải được số liệu tổng quan. Vui lòng kiểm tra kết nối rồi thử lại.</span>
        <button type="button" className="btn btn-sm btn-outline-dark" onClick={load}>
          Thử lại
        </button>
      </div>
    );
  }

  const topPost = statistic.topPost || [];
  const byPeople = statistic.totalPostInMonthByPeople || [];

  return (
    <>
      <div className="row">
        <StatBox label="Tổng số bài viết" value={statistic.totalPost} to="/News/TinTucAll" icon="fas fa-newspaper" />
        <StatBox label="Văn bản quy phạm pháp luật" value={statistic.totalVBPL} to="/VanBan/VanBan/101" icon="fas fa-balance-scale" color="bg-primary" />
        <StatBox label="Văn bản chỉ đạo điều hành" value={statistic.totalCDDH} to="/VanBan/VanBan/104" icon="fas fa-file-signature" color="bg-primary" />
        <StatBox label="Văn bản quốc tế" value={statistic.totalQT} icon="fas fa-globe-asia" color="bg-secondary" />
      </div>
      <div className="row">
        <StatBox label="Bài viết trong tháng" value={statistic.totalPostInMonth} to="/News/TinTucAll" icon="fas fa-calendar-alt" color="bg-success" />
        <StatBox label="Bài đang chờ duyệt" value={statistic.totalWait} to="/News/TinTuc/approving" icon="fas fa-hourglass-half" color="bg-warning" />
      </div>
      <div className="row">
        <div className="col-sm-6 col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tin xem nhiều nhất trong tháng</h3>
            </div>
            <div className="card-body">
              {topPost.length === 0 ? (
                <p className="text-muted mb-0">Chưa có số liệu lượt xem trong tháng.</p>
              ) : (
                <ol className="mb-0 pl-3">
                  {topPost.map((item, index) => (
                    <li key={item.ID ?? index}>
                      <a
                        href={`${getFrontEndURL("tin-tuc", item.TieuDe, item.ID)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Mở bài trên cổng thông tin (tab mới)"
                      >
                        {item.TieuDe}
                      </a>{" "}
                      <span className="text-muted">({item.PageCount} lượt xem)</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tài khoản đăng nhiều tin nhất trong tháng</h3>
            </div>
            <div className="card-body">
              {byPeople.length === 0 ? (
                <p className="text-muted mb-0">Chưa có bài đăng trong tháng.</p>
              ) : (
                <ol className="mb-0 pl-3">
                  {byPeople.map((item, index) => (
                    <li key={item.TenTruyCap ?? index}>
                      {item.TenTruyCap} <span className="text-muted">({item.total} bài)</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
