/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { HttpStatusCode } from 'axios';

// Components
import { MinisterBanner } from './components/banner/Banner';
import { MinisterCTASection } from './components/cta/CTA';
import { MediaSection } from './components/media/MediaSection';
import { MinisterSidebar } from '../components/sidebar/Sidebar';
import { MinisterTopNews, type MinisterTopNewsProps } from './components/top-news/TopNews';
import { MinisterTopCategory, type MinisterTopCategoryProps } from './components/top-category/TopCategory';

// Services & Utils
import { getPostsByCategory } from '@/services/news';
import { getHomeBanner } from '@/services/config';
import { getLang } from '@/services';
import { getUrlImage } from '@/utils/image';
import { getNewURL } from '@/utils/getSlugKey';
import { APP_DATA_CONFIG, MINISTER_DATA_CONFIG, getConfigId } from '@/configs';

import './MinisterHomePage.scss';
import { vnFormatter } from '@/utils';
import { useTranslation } from 'react-i18next';
import { LoadingFallback } from '@/components/LoadingFallback';
import { DeferredSection } from '@/pages/home/components/DeferredSection';

// --- Types ---
interface NewsItem {
  id: string | number;
  image: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

interface BannerItem {
  title: string;
  url: string;
  image: string;
}

// --- Helpers ---
const mapResponseToItem = (item: any): NewsItem => ({
  id: item?.ID,
  image: getUrlImage(item?.AnhDaiDienUrl),
  url: getNewURL('bo-truong/tin-tuc', item?.TieuDe, item?.ID),
  title: item?.TieuDe,
  date: vnFormatter(item?.NgayXuatBan),
  description: item?.MoTa || ""
});

type Section = 'activities' | 'speech' | 'direction' | 'others';
type SectionStatus = Record<Section, 'loading' | 'ready' | 'error'>;
const allLoading: SectionStatus = { activities: 'loading', speech: 'loading', direction: 'loading', others: 'loading' };

export const MinisterHomePage = () => {
  const { t, i18n } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  // Status belongs to one request (retry counter + language); a new request starts from "loading" without a reset inside the effect.
  const requestKey = `${attempt}|${i18n.resolvedLanguage}`;
  const [statusState, setStatusState] = useState<{ key: string; value: SectionStatus }>({ key: requestKey, value: allLoading });
  const status = statusState.key === requestKey ? statusState.value : allLoading;
  const renderSection = (key: Section, content: React.ReactNode) => status[key] === 'loading' ? <LoadingFallback /> : status[key] === 'error' ? <div role="alert">Không tải được dữ liệu. <button type="button" onClick={() => setAttempt(value => value + 1)}>Thử lại</button></div> : content;
  // --- State ---
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [otherNews, setOtherNews] = useState<MinisterTopNewsProps>({ id: '', title: '', items: [] });
  const [speechsNews, setSpeechsNews] = useState<MinisterTopNewsProps>({ id: '', title: '', items: [] });
  const [directionNews, setDirectionNews] = useState<MinisterTopCategoryProps>({ id: '', items: [], title: '' });
  const [activitiesNews, setActivitiesNews] = useState<MinisterTopNewsProps>({ id: '', items: [], title: '' });

  // Derived state for the main banner (first item) and the rest
  const mainBanner = useMemo(() =>
    banners.length > 0 ? { title1: banners[0].title, url: banners[0].url, image: banners[0].image } : undefined
    , [banners]);

  const subBanners = useMemo(() => banners.slice(1), [banners]);

  // Each section renders as soon as its own request completes.
  useEffect(() => {
    let active = true;
    const language = getLang() === 'vi' ? 'VI' : 'EN';
    const loadNews = async (key: Section, config: { VI: string; EN: string }, count: number, title: string, setter: (value: any) => void) => {
      try {
        const id = getConfigId(config, getLang());
        let response;
        try {
          response = await getPostsByCategory(id, 1, count);
        } catch {
          // Recover one transient API failure without requiring a page refresh.
          if (!active) return;
          response = await getPostsByCategory(id, 1, count);
        }
        if (!Array.isArray(response?.data)) throw new Error('Invalid news response');
        if (!active) return;
        setter({ id, title, items: response.data.map(mapResponseToItem) });
        setStatusState(previous => ({ key: requestKey, value: { ...(previous.key === requestKey ? previous.value : allLoading), [key]: 'ready' } }));
      } catch {
        if (active) setStatusState(previous => ({ key: requestKey, value: { ...(previous.key === requestKey ? previous.value : allLoading), [key]: 'error' } }));
      }
    };
    void loadNews('activities', MINISTER_DATA_CONFIG.HOME_ACTIVITIES, 4, t('minister.home_page.activities'), setActivitiesNews);
    void loadNews('speech', MINISTER_DATA_CONFIG.HOME_SPEECH, 10, t('minister.home_page.speech'), setSpeechsNews);
    void loadNews('direction', MINISTER_DATA_CONFIG.HOME_DIRECTION, 3, t('minister.home_page.direction'), setDirectionNews);
    void loadNews('others', MINISTER_DATA_CONFIG.HOME_OTHERS, 10, t('minister.home_page.others'), setOtherNews);
    void getHomeBanner(APP_DATA_CONFIG.NOTI_BANNER[language]).then(response => {
      if (active && response.status === HttpStatusCode.Ok) setBanners((response.data.data || []).map((item: any) => ({ title: item.TenBanner, url: item.URL, image: getUrlImage(item.AnhBannerUrl) })));
    }).catch(() => { if (active) setBanners([]); });
    return () => { active = false; };
  }, [attempt, i18n.resolvedLanguage, t, requestKey]);

  return (
    <div className="mh-minister">
      {/* Banner Section */}
      <div className="mh-minister-section">
        <Container>
          <MinisterBanner />
        </Container>
      </div>

      {/* Top News & Speech Sidebar */}
      <div className="mh-minister-section">
        <Container>
          <Row>
            <Col xl={8}>
              {renderSection('activities', <MinisterTopNews title={activitiesNews.title} id={activitiesNews.id} items={activitiesNews.items} />)}
            </Col>
            <Col xl={4}>
              {renderSection('speech', <MinisterSidebar items={speechsNews.items} id={speechsNews.id} title={speechsNews.title} />)}
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA / Banners */}
      <MinisterCTASection items={subBanners} main={mainBanner} />

      {/* Lower Section (Directions & Other News) */}
      <div className="mh-minister-section">
        <Container>
          <Row>
            <Col xl={8}>
              {renderSection('direction', <MinisterTopCategory title={directionNews.title} id={directionNews.id} items={directionNews.items} />)}
            </Col>
            <Col xl={4}>
              {renderSection('others', <MinisterSidebar title={otherNews.title} id={otherNews.id} items={otherNews.items} />)}
            </Col>
          </Row>
        </Container>
      </div>

      <DeferredSection><MediaSection /></DeferredSection>
    </div>
  );
};
