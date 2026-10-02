import { Helmet } from 'react-helmet-async';
import { Container, Image } from 'react-bootstrap';
import './Gallery.scss';
import { Pagination } from '@/components';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { vnFormatter } from '@/utils';
import { getVideoAlbums, getVideoAlbum } from '@/services/multimedia';
import { getIdFromSlug, getNewURL } from '@/utils/getSlugKey';
import { getUrlImage } from '@/utils/image';
import { t } from 'i18next';

interface MediaItem {
  ID: number;
  TieuDe: string;
  MoTa: string;
  UrlAnh: string;
  ThoiGianXuatBan?: string;
}

export const VideoAlbumDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const keyQuery = getIdFromSlug(slug || '') || '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [album, setAlbum] = useState<any>();
  const [pagination, setPagination] = useState({
    albums: [] as MediaItem[],
    activePage: 1,
    totalPages: 10,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVideoAlbums(pagination.activePage, pagination.pageSize);
        setPagination((prev) => ({
          ...prev,
          albums: res.data,
          totalPages: Math.ceil(res.totalCount / prev.pageSize),
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [pagination.activePage, pagination.pageSize]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getVideoAlbum(keyQuery!);
          setAlbum(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    loadData();
  }, [keyQuery]);

  return (
    <div className="mh-gallery">
      <Helmet><title>{album?.TieuDe || 'Thư viện đa phương tiện - Bộ Nội vụ'}</title></Helmet>
      <Container>
        <div className="mh-gallery-content">
          <div className="mh-gallery-header">
            <h1>{album?.TieuDe}</h1>
          </div>
          <div className="mh-gallery-slide">
            {album?.AlbumVideo_Files?.length > 0 &&
              <video width="100%" height="auto" controls autoPlay>
                <source src={getUrlImage(album?.AlbumVideo_Files[0].File?.LinkLuuTru)} type="video/mp4" />
              </video>
            }
          </div>
          {pagination?.albums && (
            <div className="mh-gallery-body">
              <div className="mh-gallery-items">
                <div style={{height:"20px"}}></div>
                <div className="mh-gallery-item-title">{t("multimedia.otherAlbum")}</div>
                {pagination?.albums?.map((item) => (
                  <div className="mh-gallery-item" key={item?.ID}>
                    <Link to={getNewURL('video', item.TieuDe, item?.ID)} className="mh-gallery-item-image">
                      <Image src={getUrlImage(item?.UrlAnh)} alt={item?.TieuDe} />
                    </Link>
                    <div className="mh-gallery-item-info">
                      <Link to={getNewURL('video', item.TieuDe, item?.ID)} className="mh-gallery-item-title">
                        {item?.TieuDe}
                      </Link>
                      <div className="mh-gallery-item-description" dangerouslySetInnerHTML={{ __html: item?.MoTa }} />
                    </div>
                    <div className="mh-gallery-item-date">{vnFormatter(item?.ThoiGianXuatBan)}</div>
                  </div>
                ))}
              </div>

              <Pagination
                showPageSizeSelector
                totalPages={pagination.totalPages}
                activePage={pagination.activePage}
                pageSize={pagination.pageSize}
                onPageChange={(page) => {
                  setPagination((prev) => ({ ...prev, activePage: page }));
                }}
                onPageSizeChange={(size) => {
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: size,
                    activePage: 1,
                  }));
                }}
                maxVisiblePages={3}
                wrapStyle={{ marginBottom: 48 }}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};
