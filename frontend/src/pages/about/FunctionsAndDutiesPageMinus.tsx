import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { resolveContentMedia } from '@/utils/image';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AboutBodyMinus } from './components/body/AboutBody';
import { PageFooter, PageHeader } from '@/components';
import { IconPdfFile } from '@/components/icons';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { DublinCore } from '@/components/DublinCore';
import { ArticleLanguageUnavailable } from '@/components/ArticleLanguageUnavailable';
import { getLang } from '@/services';

export const FunctionsAndDutiesPage = () => {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const [data, setData] = useState<any>();
  const { slug } = useParams<{ slug: string }>();

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    if (getLang() === 'en') return;
    let active = true;
    setData(undefined);
    const loadData = async () => {
      try {
      let id = getIdFromSlug(slug || '', 'gtbtid');
      if (!id) {
        id = getIdFromSlug(slug || '', 'id');
        if (!id) { if (active) setData(null); return; }
        const res = await axiosInstance.get(`/PostDetail?ID=${id}&lang=vi`);
        if (active) setData(res.data.data);
      } else {
        const res = await axiosInstance.get(`/PostDetailBygtbtid?ID=${id}&lang=vi`);
        if (active) setData(res.data.data);
      }
      } catch { if (active) setData(null); }
    };

    loadData();
    return () => { active = false; };
  }, [slug]);

  if (getLang() === 'en') return <ArticleLanguageUnavailable />;
  if (!data) return <p className="py-4">{data === null ? 'Không tải được nội dung. Vui lòng thử lại.' : 'Đang tải nội dung…'}</p>;

  return (
    <>
      <DublinCore title={data.TieuDe} description={data.MoTa} creator={data.TacGia} date={data.NgayXuatBan} subject={data.TuKhoa} />
      <Helmet>
        <title>{`${t('seo.moha')} - ${data.TieuDe}`}</title>
      </Helmet>
      <div ref={contentRef} className='printContentRef'>
        <PageHeader title={data.TieuDe} date={data.NgayXuatBan} viewCount={data.PageCount} onPrint={handlePrint} />
        <AboutBodyMinus>
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(resolveContentMedia(data?.NoiDung)?.replace(/contenteditable="true"/g, 'contenteditable="false"')),
            }}
          />
        </AboutBodyMinus>
      </div>
      <PageFooter
        files={(data.TinTuc_Files || []).filter((fileInfo: any) => fileInfo.File).map((fileInfo: any) => {
          const fileDetails = fileInfo.File;

          return {
            fileName: fileDetails.Ten,
            to: fileDetails.LinkLuuTru,
            icon: fileDetails.Ten.toLowerCase().endsWith('.pdf') ? <IconPdfFile /> : <IconPdfFile />,
            target: '_blank',
            className: 'custom-file-link',
          };
        })}
      />
    </>
  );
};
