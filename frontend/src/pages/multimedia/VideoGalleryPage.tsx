import { getVideoAlbums } from '@/services/multimedia';
import { MediaGalleryPage } from './MediaGalleryPage';

export const VideoGalleryPage = () => (
  <MediaGalleryPage getAlbums={getVideoAlbums} seoTitleKey="seo.videoLibrary" heading="Thư viện Video" basePath="video" />
);
