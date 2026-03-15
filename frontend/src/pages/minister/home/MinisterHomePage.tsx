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
import { APP_DATA_CONFIG, MINISTER_DATA_CONFIG } from '@/configs';

import './MinisterHomePage.scss';
import { vnFormatter } from '@/utils';
import { t } from 'i18next';

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

export const MinisterHomePage = () => {
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

  // --- Effects ---
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const langConfig = getLang() === 'vi' ? APP_DATA_CONFIG.NOTI_BANNER.VI : APP_DATA_CONFIG.NOTI_BANNER.EN;

        // Fetch all data in parallel for better performance
        const [bannerRes, speechsNewsRes, activitiesNewsRes, directionNewsRes, otherNewsRes] = await Promise.all([
          getHomeBanner(langConfig),
          getPostsByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_SPEECH.VI : MINISTER_DATA_CONFIG.HOME_SPEECH.EN, 1, 10),
          getPostsByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_ACTIVITIES.VI : MINISTER_DATA_CONFIG.HOME_ACTIVITIES.EN, 1, 4),
          getPostsByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_DIRECTION.VI : MINISTER_DATA_CONFIG.HOME_DIRECTION.EN, 1, 3),
          getPostsByCategory(getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_OTHERS.VI : MINISTER_DATA_CONFIG.HOME_OTHERS.EN, 1, 10)
        ]);

        if (bannerRes.status === HttpStatusCode.Ok) {
          const bannerData = bannerRes.data.data.map((f: any) => ({
            title: f.TenBanner,
            url: f.URL,
            image: getUrlImage(f.AnhBannerUrl),
          }));
          setBanners(bannerData);
        }

        if (speechsNewsRes?.data) {
          setSpeechsNews({
            id: getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_SPEECH.VI : MINISTER_DATA_CONFIG.HOME_SPEECH.EN,
            title: t('minister.home_page.speech'),
            items: speechsNewsRes.data.map(mapResponseToItem)
          });
        }

        if (activitiesNewsRes?.data) {
          setActivitiesNews({
            id: getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_ACTIVITIES.VI : MINISTER_DATA_CONFIG.HOME_ACTIVITIES.EN,
            title: t('minister.home_page.activities'),
            items: activitiesNewsRes.data.map(mapResponseToItem)
          });
        }

        if (directionNewsRes?.data) {
          setDirectionNews({
            id: getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_DIRECTION.VI : MINISTER_DATA_CONFIG.HOME_DIRECTION.EN,
            title: t('minister.home_page.direction'),
            items: directionNewsRes.data.map(mapResponseToItem)
          });
        }

        if (otherNewsRes?.data) {
          setOtherNews({
            id: getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_OTHERS.VI : MINISTER_DATA_CONFIG.HOME_OTHERS.EN,
            title: t('minister.home_page.others'),
            items: otherNewsRes.data.map(mapResponseToItem)
          });
        }
      } catch (error) {
        console.error('Error fetching Minister Home Page data:', error);
      }
    };

    fetchPageData();
  }, []);

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
              <MinisterTopNews title={activitiesNews.title} id={activitiesNews.id} items={activitiesNews.items} />
            </Col>
            <Col xl={4}>
              <MinisterSidebar items={speechsNews.items} id={speechsNews.id} title={speechsNews.title} />
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
              <MinisterTopCategory title={directionNews.title} id={directionNews.id} items={directionNews.items} />
            </Col>
            <Col xl={4}>
              <MinisterSidebar title={otherNews.title} id={otherNews.id} items={otherNews.items} />
            </Col>
          </Row>
        </Container>
      </div>

      <MediaSection />
    </div>
  );
};