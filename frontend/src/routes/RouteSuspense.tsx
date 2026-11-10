import { Suspense, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingFallback } from '@/components/LoadingFallback';
import { ArticleLanguageUnavailable } from '@/components/ArticleLanguageUnavailable';
import { getLang } from '@/services';

const RouteComponent = ({ component: Component }: { component: FC }) => {
  const { pathname } = useLocation();
  const newsList = /^\/(?:tin-tuc\/?$|chuyen-muc(?:\/|$)|tim-kiem(?:\/|$)|(?:bo-truong|nghi-quyet-tw4)\/(?:tin-tuc\/?$|chuyen-muc(?:\/|$)))/.test(pathname);
  if (getLang() === 'en' && newsList) return <ArticleLanguageUnavailable collection />;
  return <Component key={pathname} />;
};

/** Suspense + per-pathname remount wrapper used by every route element. */
export const RouteSuspense = ({ component }: { component: FC }) => (
  <Suspense fallback={<LoadingFallback />}>
    <RouteComponent component={component} />
  </Suspense>
);
