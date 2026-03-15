import Slider from 'react-slick';
import './Banner.scss';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getNewURL } from '@/utils/getSlugKey';
import { getUrlImage } from '@/utils/image';
import { getLang } from '@/services';
import { getPostsByQuery } from '@/services/news';
import { MINISTER_DATA_CONFIG } from '@/configs';
import { vnFormatter } from '@/utils';

interface MinisterBannerItem {
  url: string;
  image: string;
  title: string;
  date: string;
}
export interface MinisterBannerProps {
  items: MinisterBannerItem[];
}

interface NewsItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  NgayXuatBan: string; // or Date if you prefer to parse this into a Date object
  TenAnhDaiDien: string;
  AnhDaiDienUrl: string;
}
export const MinisterBanner = () => {
  const slideSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const [topNews, setTopNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getPostsByQuery(`PostsByCategory?lang=${getLang()}&ID=${getLang() === 'vi' ? MINISTER_DATA_CONFIG.HOME_TOPNEWS.VI : MINISTER_DATA_CONFIG.HOME_TOPNEWS.EN}&filter=%5B"NoiBat","%3D","1"%5D&sort=%5B%7B"selector"%3A"NgayXuatBan"%2C"desc"%3Atrue%7D%5D&skip=0&take=4&requireTotalCount=false`);
        setTopNews(response.data || []);
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, []);


  return (
    <div className="mh-minister-banner">
      <Slider {...slideSettings}>
        {topNews?.length && topNews.map((news) => (
          <div key={news.ID}>
            <div className="mh-minister-banner-item">
              <div className="mh-minister-banner-item-image">
                <Link
                  to={getNewURL('bo-truong/tin-tuc', news?.TieuDe || '', news?.ID || '')}>
                  <Image
                    src={getUrlImage(news?.AnhDaiDienUrl)}
                    alt={news.TenAnhDaiDien} />
                </Link>
              </div>
              <div className="mh-minister-banner-item-info">
                <Link
                  to={getNewURL('bo-truong/tin-tuc', news?.TieuDe || '', news?.ID || '')}
                  className="mh-minister-banner-item-title">
                  {news.TieuDe}
                </Link>
                <div className="mh-minister-banner-item-date">{vnFormatter(news?.NgayXuatBan)}</div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
