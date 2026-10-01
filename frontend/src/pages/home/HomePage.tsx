import { lazy, Suspense } from 'react';
import { DeferredSection } from './components/DeferredSection';
import { Image } from 'react-bootstrap';
import { HomeBanner } from './components/banner/HomeBanner';
import { HomeCategorySection, type HomeCategorySectionProps } from './components/category/HomeCategory';
import { HomeCTASection } from './components/cta/HomeCTA';
import type { HomeInteractSectionProps } from './components/interact/HomeInteract';
const HomeInteractSection = lazy(() => import('./components/interact/HomeInteract').then(m => ({ default: m.HomeInteractSection })));
import type { HomeOtherSectionProps } from './components/other/HomeOther';
const HomeOtherSection = lazy(() => import('./components/other/HomeOther').then(m => ({ default: m.HomeOtherSection })));
const HomeRefsSection = lazy(() => import('./components/refs/HomeRefs').then(m => ({ default: m.HomeRefsSection })));
import type { HomeMediaSectionProps } from './components/media/HomeMedia';
const HomeMediaSection = lazy(() => import('./components/media/HomeMedia').then(m => ({ default: m.HomeMediaSection })));
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
      <h1 className="visually-hidden">Cổng thông tin điện tử Bộ Nội vụ</h1>
      <HomeBanner />
      <HomeCategorySection {...CATEGORY_CONFIG} />
      <HomeCTASection />
      <DeferredSection><Suspense fallback={<div style={{ minHeight: 360 }} aria-hidden="true" />}><HomeOtherSection
        {...OTHER_CONFIG}
        onDownload={(item) => console.log(item)}
        onDisscuss={(item) => console.log(item)}
      /></Suspense></DeferredSection>
      <DeferredSection><Suspense fallback={<div style={{ minHeight: 360 }} aria-hidden="true" />}><HomeInteractSection {...INTERACT_CONFIG} /></Suspense></DeferredSection>
      <DeferredSection><Suspense fallback={<div style={{ minHeight: 360 }} aria-hidden="true" />}><HomeMediaSection {...MEDIA_CONFIG} /></Suspense></DeferredSection>
      <DeferredSection><Suspense fallback={<div style={{ minHeight: 360 }} aria-hidden="true" />}><HomeRefsSection title={t('home.components')} /></Suspense></DeferredSection>
    </>
  );
};
