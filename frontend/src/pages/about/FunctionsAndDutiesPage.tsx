/* eslint-disable @typescript-eslint/no-explicit-any */
import { AboutBody } from './components/body/AboutBody';
import { PageFooter, PageHeader } from '@/components';
import { IconPdfFile } from '@/components/icons';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/services';
import DOMPurify from 'dompurify';
import { useLocation, useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

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

  if (!data) return null;

  return (
    <>
      <Helmet>
        <title>{`${t('seo.moha')} - ${data.TieuDe}`}</title>
      </Helmet>
      <div ref={contentRef} className='printContentRef'>
        <PageHeader title={data.TieuDe} date={data.NgayXuatBan} viewCount={data.PageCount} onPrint={handlePrint} />
        <AboutBody>
          <div
            className={isHistory ? 'mh-about-history' : undefined}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize((isHistory ? data?.NoiDung?.replace(/&nbsp;|\u00a0/g, ' ') : data?.NoiDung)?.replace(/contenteditable="true"/g, 'contenteditable="false"')),
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
        onShare={() => {}}
      />
    </>
  );
};
