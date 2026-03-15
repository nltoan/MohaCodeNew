/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Loading, PageFooter } from '@/components';
import { AboutBody } from './components/body/AboutBody';
import { IconPdfFile } from '@/components/icons';
import { useEffect, useState } from 'react';
import { getHistory, getLeadersByTerm } from '@/services/about';
import { getUrlImage } from '@/utils/image';

export const HistoryAndDevelopmentPage = () => {
  const [histories, setHistories] = useState<any>([]);
  const [leaders, setLeaders] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial organization structure data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getHistory();
        const leaders = await getLeadersByTerm();

        // Safety check: only set data if the result is an array
        if (Array.isArray(result)) {
          setHistories(result);
        }

        if (Array.isArray(leaders)) {
          setLeaders(leaders);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AboutBody>
        <div className="mh-about-document">
          {histories.map((item: any, idx: number) => (
            <div className="mh-about-document-item" key={idx}>
              <div className="mh-about-document-item-name">{item.TenThoiKy}</div>
              <Link to={item.link}>
                <IconPdfFile />
                <span>Tải về</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="mh-about-history">
          <div className="mh-about-history-title"></div>
          <div className="mh-about-history-items">
            {leaders.map((leader: any, idx: number) => (
              <div className="mh-about-history-item" key={idx}>
                <div className="mh-about-history-item-image">
                  <img src={getUrlImage(leader.AnhDaiDien)} alt={leader.HoTenLanhDao} />
                </div>
                <div className="mh-about-history-item-info">
                  <div className="mh-about-history-item-title">Bộ trưởng Bộ Nội vụ</div>
                  <div className="mh-about-history-item-name">Họ và tên: {leader.HoTenLanhDao ?? '-'}</div>
                  <div className="mh-about-history-item-date">Ngày sinh: {leader.NgaySinh ?? '-'}</div>
                  <div className="mh-about-history-item-position">Chức danh: {leader.ChucDanh ?? '-'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AboutBody>
      <PageFooter />
    </>
  );
};
