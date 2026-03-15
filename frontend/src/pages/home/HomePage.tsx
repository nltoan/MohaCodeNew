import { Image } from 'react-bootstrap';
import { HomeBanner } from './components/banner/HomeBanner';
import { HomeCategorySection, type HomeCategorySectionProps } from './components/category/HomeCategory';
import { HomeCTASection } from './components/cta/HomeCTA';
import { HomeInteractSection, type HomeInteractSectionProps } from './components/interact/HomeInteract';
import { HomeOtherSection, type HomeOtherSectionProps } from './components/other/HomeOther';
import { HomeRefsSection } from './components/refs/HomeRefs';
import { HomeMediaSection, type HomeMediaSectionProps } from './components/media/HomeMedia';
import image4 from '../../assets/images/PieChart.png';

import { IconPlayFill } from '@/components/icons';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { t } = useTranslation();

  const CATEGORY_CONFIG: HomeCategorySectionProps = {
    notice: {
      title: t('home.notice'),
    },
    event: {
      title: t('home.event'),
    },
  };

  const OTHER_CONFIG: Omit<HomeOtherSectionProps, 'onDownload' | 'onDisscuss'> = {
    tab1: { title: <>{t('home.directive')}</> },
    tab2: { title: <>{t('home.legal')}</> },
    tab3: { title: t('home.draft') },
  };
  const INTERACT_CONFIG: HomeInteractSectionProps = {
    title: t('home.ministry'),
    chartArea: <Image src={image4} alt="" />,
  };
  const MEDIA_CONFIG: HomeMediaSectionProps = {
    icon: <IconPlayFill />,
    title: t('home.media'),
  };

  return (
    <>
      <Helmet>
        <title>BỘ NỘI VỤ - MINISTRY OF HOME AFFAIRS OF THE SOCIALIST REPUBLIC OF VIETNAM</title>
      </Helmet>
      <HomeBanner />
      <HomeCategorySection {...CATEGORY_CONFIG} />
      <HomeCTASection />
      <HomeOtherSection
        {...OTHER_CONFIG}
        onDownload={(item) => console.log(item)}
        onDisscuss={(item) => console.log(item)}
      />
      <HomeInteractSection {...INTERACT_CONFIG} />
      <HomeMediaSection {...MEDIA_CONFIG} />
      <HomeRefsSection title={t('home.components')} />
    </>
  );
};
