import { SectionNewsDetailPage } from '../news-shared/SectionNewsDetailPage';
import { getDetailPostBynqid, getRelatedPostBynqid } from '@/services/news';

export const NewsDetailPage = () => (
  <SectionNewsDetailPage
    idPrefix="nqid"
    basePath="nghi-quyet-tw4/tin-tuc"
    getDetailByPrefix={getDetailPostBynqid}
    getRelatedByPrefix={getRelatedPostBynqid}
  />
);
