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
import { NghiQuyetTW4_DATA_CONFIG } from '@/configs';

import './NghiQuyetTW4HomePage.scss';
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
  // --- State ---
  const [captureNews, setCaptureNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', title: '', items: [] });
  const [reportsNews, setReportsNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', title: '', items: [] });
  const [directionNews, setDirectionNews] = useState<NghiQuyetTW4TopCategoryProps>({ id: '', items: [], title: '' });
  const [news, setNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', items: [], title: '' });
  const [protectionNews, setProtectionNews] = useState<NghiQuyetTW4TopNewsProps>({ id: '', items: [], title: '' });
  const [contestNews, setContestNews] = useState<NghiQuyetTW4TopCategoryProps>({ id: '', items: [], title: '' });

  // --- Effects ---
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [reportsNewsRes, captureNewsRes, directionNewsRes, protectionNewsRes, contestNewsRes, newsRes] = await Promise.all([
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.VI : NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.EN, 1, 5),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.EN, 1, 5),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_DIRECTION.VI : NghiQuyetTW4_DATA_CONFIG.HOME_DIRECTION.EN, 1, 5),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_PROTECTION.VI : NghiQuyetTW4_DATA_CONFIG.HOME_PROTECTION.EN, 1, 4),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CONTEST.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CONTEST.EN, 1, 3),
          getPostsByCategory(getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_NEWS.VI : NghiQuyetTW4_DATA_CONFIG.HOME_NEWS.EN, 1, 10)
        ]);

        if (reportsNewsRes?.data) {
          setReportsNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.VI : NghiQuyetTW4_DATA_CONFIG.HOME_REPORT.EN,
            title: t('nghiquyettw4.home_page.report'),
            items: reportsNewsRes.data.map(mapResponseToItem)
          });
        }

        if (captureNewsRes?.data) {
          setCaptureNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CAPTURE.EN,
            title: t('nghiquyettw4.home_page.documentaryPhotography'),
            items: captureNewsRes.data.map(mapResponseToItem)
          });
        }

        if (directionNewsRes?.data) {
          setDirectionNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_DIRECTION.VI : NghiQuyetTW4_DATA_CONFIG.HOME_DIRECTION.EN,
            title: t('nghiquyettw4.home_page.direction'),
            items: directionNewsRes.data.map(mapResponseToItem)
          });
        }

        if (protectionNewsRes?.data) {
          setProtectionNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_PROTECTION.VI : NghiQuyetTW4_DATA_CONFIG.HOME_PROTECTION.EN,
            title: t('nghiquyettw4.home_page.protection'),
            items: protectionNewsRes.data.map(mapResponseToItem)
          });
        }

        if (contestNewsRes?.data) {
          setContestNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_CONTEST.VI : NghiQuyetTW4_DATA_CONFIG.HOME_CONTEST.EN,
            title: t('nghiquyettw4.home_page.contest'),
            items: contestNewsRes.data.map(mapResponseToItem)
          });
        }

        if (newsRes?.data) {
          setNews({
            id: getLang() === 'vi' ? NghiQuyetTW4_DATA_CONFIG.HOME_NEWS.VI : NghiQuyetTW4_DATA_CONFIG.HOME_NEWS.EN,
            title: t('nghiquyettw4.home_page.news'),
            items: newsRes.data.map(mapResponseToItem)
          });
        }
      } catch (error) {
        console.error('Error fetching NghiQuyetTW4 Home Page data:', error);
      }
    };

    fetchPageData();
  }, []);

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
              <NghiQuyetTW4TopNews title={news.title} id={news.id} items={news.items} />
            </Col>
            <Col xl={4}>
              <NghiQuyetTW4Sidebar items={reportsNews.items} id={reportsNews.id} title={reportsNews.title} />
            </Col>
          </Row>
        </Container>
      </div>

      <div className="mh-nqtw4-section">
        <Container>
          <Row>
            <Col xl={8}>
              <NghiQuyetTW4TopNews title={protectionNews.title} id={protectionNews.id} items={protectionNews.items} />
            </Col>
            <Col xl={4}>
              <NghiQuyetTW4Sidebar items={directionNews.items} id={directionNews.id} title={directionNews.title} />
            </Col>
          </Row>
        </Container>
      </div>

      <div className="mh-nqtw4-section">
        <Container>
          <Row>
            <Col xl={8}>
              <NghiQuyetTW4TopCategory title={contestNews.title} id={contestNews.id} items={contestNews.items} />
            </Col>
            <Col xl={4}>
              <NghiQuyetTW4Sidebar title={captureNews.title} id={captureNews.id} items={captureNews.items} />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};