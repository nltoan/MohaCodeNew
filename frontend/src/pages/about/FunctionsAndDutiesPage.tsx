import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { resolveContentMedia } from '@/utils/image';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AboutBody } from './components/body/AboutBody';
import { PageFooter, PageHeader } from '@/components';
import { IconPdfFile } from '@/components/icons';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/services';
import { useLocation, useParams } from 'react-router-dom';
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
  const isHistory = useLocation().pathname.startsWith('/gioi-thieu/lich-su-bo/');

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    if (getLang() === 'en') return;
    const loadData = async () => {
      const keyQuery = getIdFromSlug(slug || '');
      if (keyQuery !== '') {
        try {
          const res = await axiosInstance.get(`/PostDetail?ID=${keyQuery}&lang=vi`);

          setData(res.data.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    loadData();
  }, [slug]);

  if (getLang() === 'en') return <ArticleLanguageUnavailable />;
  if (!data) return null;

  return (
    <>
      <DublinCore title={data.TieuDe} description={data.MoTa} creator={data.TacGia} date={data.NgayXuatBan} subject={data.TuKhoa} />
      <Helmet>
        <title>{`${t('seo.moha')} - ${data.TieuDe}`}</title>
      </Helmet>
      <div ref={contentRef} className='printContentRef'>
        <PageHeader title={data.TieuDe} date={data.NgayXuatBan} viewCount={data.PageCount} onPrint={handlePrint} />
        <AboutBody>
          <div
            className={isHistory ? 'mh-about-history' : undefined}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(resolveContentMedia(isHistory ? data?.NoiDung?.replace(/&nbsp;|\u00a0/g, ' ') : data?.NoiDung)?.replace(/contenteditable="true"/g, 'contenteditable="false"')),
            }}
          />
        </AboutBody>
      </div>

      <PageFooter
        files={data.TinTuc_Files?.map((fileInfo: any) => {
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
