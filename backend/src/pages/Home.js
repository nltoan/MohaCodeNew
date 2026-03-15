import { useEffect,useState } from "react";

import { request } from "../utils/api";
import { getFrontEndURL } from "../utils/helpers";

export default function Home() {
  const [statistic, setStatistic] = useState();

  useEffect(() => {
    (async function () {
      const data2 = await request(`/Home/Statistic`);
      setStatistic(data2);
    })();
  }, []);
  return (
    <>
      {statistic && (
        <>
          <div className="row">
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số bài viết</span>
                  <span className="info-box-number">{statistic.totalPost}</span>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số VB QPPL</span>
                  <span className="info-box-number">{statistic.totalVBPL}</span>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số VB CDDH</span>
                  <span className="info-box-number">{statistic.totalCDDH}</span>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số VB quốc tế</span>
                  <span className="info-box-number">{statistic.totalQT}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số bài trong tháng</span>
                  <span className="info-box-number">
                    {statistic.totalPostInMonth}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 col-12">
              <div className="info-box">
                <div className="info-box-content">
                  <span className="info-box-text">Số bài chờ duyệt</span>
                  <span className="info-box-number">{statistic.totalWait}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Tin xem nhiều nhất trong tháng</h3>
                </div>

                <div className="card-body">
                  <ul>
                    {statistic.topPost &&
                      statistic.topPost.map((item, index) => (
                        <>
                          <li>
                            <a
                              href={`${getFrontEndURL("tin-tuc", item.TieuDe, item.ID)}`}
                            >
                              {item.TieuDe} ({item.PageCount})
                            </a>
                          </li>
                        </>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Account đăng nhiều tin nhất</h3>
                </div>

                <div className="card-body">
                  <ul>
                    {statistic.totalPostInMonthByPeople &&
                      statistic.totalPostInMonthByPeople.map((item, index) => (
                        <>
                          <li>
                            {item.TenTruyCap} ({item.total})
                          </li>
                        </>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
