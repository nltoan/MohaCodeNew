/* eslint-disable @typescript-eslint/no-explicit-any */
import { AboutBodyMinus } from './components/body/AboutBody';
import { PageFooter, PageHeader } from '@/components';
import { IconPdfFile } from '@/components/icons';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/services';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

export const FunctionsAndDutiesPage = () => {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const [data, setData] = useState<any>();
  const { slug } = useParams<{ slug: string }>();

  const handlePrint = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    const loadData = async () => {
      let id = getIdFromSlug(slug || '', 'gtbtid');
      if (!id) {
        id = getIdFromSlug(slug || '', 'id');
        const res = await axiosInstance.get(`/PostDetail?ID=${id}&lang=vi`);
        setData(res.data.data);
      } else {
        const res = await axiosInstance.get(`/PostDetailBygtbtid?ID=${id}&lang=vi`);
        setData(res.data.data);
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
        <AboutBodyMinus>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.NoiDung),
            }}
          />
        </AboutBodyMinus>
      </div>
      <PageFooter
        files={data.TinTuc_Files.map((fileInfo: any) => {
          const fileDetails = fileInfo.File;

          return {
            fileName: fileDetails.Ten,
            to: fileDetails.LinkLuuTru,
            icon: fileDetails.Ten.toLowerCase().endsWith('.pdf') ? <IconPdfFile /> : <IconPdfFile />,
            target: '_blank',
            className: 'custom-file-link',
          };
        })}
        onShare={() => { }}
      />
    </>
  );
};
