/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ButtonIcon,
  ButtonImage,
  ButtonSpecial,
  CardNotice,
  CardQuickLinks,
  type ButtonIconProps,
  type ButtonImageProps,
  type ButtonSpecialProps,
  type CardImageProps,
  type CardNoticeProps,
} from '@/components';
import './SideBar.scss';
import { useEffect, useState, type ReactNode } from 'react';
import { getHomeBanner } from '@/services/config';
import { HttpStatusCode } from 'axios';
import { APP_DATA_CONFIG } from '@/configs';
import { getUrlImage } from '@/utils/image';
import { getLang } from '@/services';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';

export interface AboutSidebarProps {
  ctaImage: CardImageProps;
  ctaButton: ButtonIconProps;
  ctaButton2: ButtonSpecialProps;
  notice: CardNoticeProps;
  ctaImage2: CardImageProps;
  buttons: ButtonImageProps[];
}
interface HomeBannerWidget {
  isButton?: boolean;
  isSpecial?: boolean;
  label?: string;
  image?: string | ReactNode;
  alt?: string;
  url: string;
  urlTarget?: '_blank' | '';
  className?: string;
  order?: number;
}
export const AboutSidebar = ({ notice }: AboutSidebarProps) => {
  const [banners, setBanners] = useState<ButtonImageProps[]>([]);

  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.QUICK_LINK_DOWN.VI : APP_DATA_CONFIG.QUICK_LINK_DOWN.EN,
        );
        if (response.status === HttpStatusCode.Ok) {
          setBanners(
            response.data.data.map((f) => {
              return {
                linkProps: { to: f.URL },
                style: {
                  backgroundImage: `url(${getUrlImage(f.AnhBannerUrl)}`,
                },
                label: f.TenBanner,
              };
            }),
          );
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  const [widgets, setWidgets] = useState<HomeBannerWidget[]>([]);
  useEffect(() => {
    const fetchDidMoundData = async () => {
      try {
        const response = await getHomeBanner(
          getLang() === 'vi' ? APP_DATA_CONFIG.WIDGET.VI : APP_DATA_CONFIG.WIDGET.EN,
        );
        setWidgets(
          response?.data?.data?.map((item: any) => ({
            url: item?.URL || '/',
            image: getUrlImage(item?.AnhBannerUrl) || '',
            title: item?.TenBanner || '',
          })),
        );
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchDidMoundData();
  }, []);

  const renderWidgets = (a: HomeBannerWidget[]) => {
    return a.map((item) => {
      if (item.isSpecial)
        return <ButtonSpecial key={item.url} className={item.className} to="/#" label="ĐẢNG BỘ NỘI VỤ" />;
      return item.isButton ? (
        <ButtonIcon
          key={item.url}
          linkProps={{ to: item.url }}
          icon={
            typeof item.image === 'string' ? (
              <div className="mh-home-banner-image">
                <Image src={item.image} alt={item.alt} loading="lazy" />
              </div>
            ) : (
              item.image
            )
          }
          label={item.label || ''}
          style={{ whiteSpace: 'nowrap', height: 64, justifyContent: 'center' }}
          className="mh-home-banner-image md"
          {...(item.order && { style: { order: item.order } })}
        />
      ) : (
        <Link
          key={item.url}
          to={item.url}
          className={item.className}
          {...(item.order && { style: { order: item.order } })}
        >
          {typeof item.image === 'string' ? <Image src={item.image} alt={item.alt} loading="lazy" fluid /> : item.image}
          {item.label ? <span>{item.label}</span> : <></>}
        </Link>
      );
    });
  };
  return (
    <div className="mh-about-sidebar">
      {renderWidgets(widgets)}
      <CardNotice {...notice} bodyStyle={{ maxHeight: 384 }} />
      <CardQuickLinks />
      <div className="mh-about-sidebar-block">
        {banners.map((item, index) => (
          <ButtonImage key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
