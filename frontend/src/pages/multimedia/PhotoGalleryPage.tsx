import { getPhotoAlbums } from '@/services/multimedia';
import { MediaGalleryPage } from './MediaGalleryPage';

export const PhotoGalleryPage = () => (
  <MediaGalleryPage getAlbums={getPhotoAlbums} seoTitleKey="seo.photoLibrary" heading="Thư viện Ảnh" basePath="photo" />
);
