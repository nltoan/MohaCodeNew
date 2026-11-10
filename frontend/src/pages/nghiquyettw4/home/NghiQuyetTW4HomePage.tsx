/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

// Components
import { NghiQuyetTW4Banner } from './components/banner/Banner';
import { NghiQuyetTW4Sidebar } from '../components/sidebar/Sidebar';
import { NghiQuyetTW4TopNews, type NghiQuyetTW4TopNewsProps } from './components/top-news/TopNews';
import { NghiQuyetTW4TopCategory, type NghiQuyetTW4TopCategoryProps } from './components/top-category/TopCategory';

// Services & Utils
import { getPostsByCategory } from '@/services/news';
import { getLang } from '@/services';
import { getUrlImage } from '@/utils/image';
import { getNewURL } from '@/utils/getSlugKey';
import { NghiQuyetTW4_DATA_CONFIG, getConfigId } from '@/configs';

import './NghiQuyetTW4HomePage.scss';
import { vnFormatter } from '@/utils';
import { useTranslation } from 'react-i18next';
import { LoadingFallback } from '@/components/LoadingFallback';
import type { ReactNode } from 'react';

// --- Types ---
interface NewsItem {
  id: string | number;
  image: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

// --- Helpers ---
const mapResponseToItem = (item: any): NewsItem => ({
  id: item?.ID,
  image: getUrlImage(item?.AnhDaiDienUrl),
  url: getNewURL('nghi-quyet-tw4/tin-tuc', item?.TieuDe, item?.ID),
  title: item?.TieuDe,
  date: vnFormatter(item?.NgayXuatBan),
  description: item?.MoTa || ""
});

export const NghiQuyetTW4HomePage = () => {
  const { t, i18n } = useTranslation();
  type Section = 'news' | 'reports' | 'capture' | 'direction' | 'protection' | 'contest';
  const [status, setStatus] = useState<Partial<Record<Section, 'loading' | 'ready' | 'error'>>>({});
  const [attempt, setAttempt] = useState(0);
  const renderSection = (key: Section, content: ReactNode) => !status[key] || status[key] === 'loading' ? <LoadingFallback /> : status[key] === 'error' ? <div role="alert">Không tải được dữ liệu. <button type="button" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div> : content;
  // --- State ---
  const [captureNews, setCaptureNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', title: '', items: [] });
  const [reportsNews, setReportsNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', title: '', items: [] });
  const [directionNews, setDirectionNews] = useState<NghiQuyetTW4TopCategoryProps>({ id: '', items: [], title: '' });
  const [news, setNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', items: [], title: '' });
  const [protectionNews, setProtectionNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', items: [], title: '' });
  const [contestNews, setContestNews] = useState<NghiQuyetTW4TopCategoryProps>({ id: '', items: [], title: '' });

  useEffect(() => {
    let active = true;
    setStatus({});
    const load = async (key: Section, config: { VI: string; EN: string }, count: number, label: string, setter: (value: any) => void) => {
      try {
        const id = getConfigId(config, getLang());
        let response;
        try { response = await getPostsByCategory(id, 1, count); }
        catch {
          if (!active) return;
          response = await getPostsByCategory(id, 1, count);
        }
        if (!Array.isArray(response?.data)) throw new Error('Invalid news response');
        if (!active) return;
        setter({ id, title: t(label), items: response.data.map(mapResponseToItem) });
        setStatus(previous => ({ ...previous, [key]: 'ready' }));
      } catch {
        if (active) setStatus(previous => ({ ...previous, [key]: 'error' }));
      }
    };
    void load('news', NghiQuyetTW4_DATA_CONFIG.HOME_NEWS, 10, 'nghiquyettw4.home_page.news', setNews);
    void load('reports', NghiQuyetTW4_DATA_CONFIG.HOME_REPORT, 5, 'nghiquyettw4.home_page.report', setReportsNews);
    void load('capture', NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE, 5, 'nghiquyettw4.home_page.documentaryPhotography', setCaptureNews);
    void load('direction', NghiQuyetTW4_DATA_CONFIG.HOME_DIRECTION, 5, 'nghiquyettw4.home_page.direction', setDirectionNews);
    void load('protection', NghiQuyetTW4_DATA_CONFIG.HOME_PROTECTION, 4, 'nghiquyettw4.home_page.protection', setProtectionNews);
    void load('contest', NghiQuyetTW4_DATA_CONFIG.HOME_CONTEST, 3, 'nghiquyettw4.home_page.contest', setContestNews);
    return () => { active = false; };
  }, [attempt, i18n.resolvedLanguage, t]);

  return (
    <div className="mh-nqtw4">
      <div className="mh-nqtw4-section">
        <Container>
          <NghiQuyetTW4Banner />
        </Container>
      </div>

      <div className="mh-nqtw4-section">
        <Container>
          <Row>
            <Col xl={8}>
              {renderSection('news', <NghiQuyetTW4TopNews title={news.title} id={news.id} items={news.items} />)}
            </Col>
            <Col xl={4}>
              {renderSection('reports', <NghiQuyetTW4Sidebar items={reportsNews.items} id={reportsNews.id} title={reportsNews.title} />)}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="mh-nqtw4-section">
        <Container>
          <Row>
            <Col xl={8}>
              {renderSection('protection', <NghiQuyetTW4TopNews title={protectionNews.title} id={protectionNews.id} items={protectionNews.items} />)}
            </Col>
            <Col xl={4}>
              {renderSection('direction', <NghiQuyetTW4Sidebar items={directionNews.items} id={directionNews.id} title={directionNews.title} />)}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="mh-nqtw4-section">
        <Container>
          <Row>
            <Col xl={8}>
              {renderSection('contest', <NghiQuyetTW4TopCategory title={contestNews.title} id={contestNews.id} items={contestNews.items} />)}
            </Col>
            <Col xl={4}>
              {renderSection('capture', <NghiQuyetTW4Sidebar title={captureNews.title} id={captureNews.id} items={captureNews.items} />)}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
