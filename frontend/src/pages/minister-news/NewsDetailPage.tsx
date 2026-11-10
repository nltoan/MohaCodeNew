import { SectionNewsDetailPage } from '../news-shared/SectionNewsDetailPage';
import { getDetailPostBybtid, getRelatedPostBybtid } from '@/services/news';

export const NewsDetailPage = () => (
  <SectionNewsDetailPage
    idPrefix="btid"
    basePath="bo-truong/tin-tuc"
    getDetailByPrefix={getDetailPostBybtid}
    getRelatedByPrefix={getRelatedPostBybtid}
  />
);
