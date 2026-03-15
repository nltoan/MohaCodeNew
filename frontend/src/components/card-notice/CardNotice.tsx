import { Link } from 'react-router-dom';
import { CardSection } from '../card-section/CardSection';
import './CardNotice.scss';
import { useEffect, useState, type CSSProperties } from 'react';
import { HttpStatusCode } from 'axios';
import { getNotify } from '@/services/config';
import { getNewURL } from '@/utils/getSlugKey';
export interface CardNoticeProps {
  title: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
}

export interface LegalDocument {
  ID: number;
  TieuDe: string;
  NgayDang: string;
  DonViBanHanh: string | null;
  NoiDung: string;
  DanhSachFile: string;
}

export interface FileAttachment {
  ID: number;
  Ten: string;
}

export const CardNotice = ({ title, style, bodyStyle }: CardNoticeProps) => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  useEffect(() => {
    const fetchAppMenus = async () => {
      try {
        const response = await getNotify();
        if (response.status === HttpStatusCode.Ok) {
          setDocuments(response.data.data);
        }
      } catch (error) {
        console.log('err', error);
      }
    };
    fetchAppMenus();
  }, []);

  // const parseFiles = (jsonString: string): FileAttachment[] => {
  //   try {
  //     return JSON.parse(jsonString);
  //   } catch (e) {
  //     console.error("Lỗi parse file:", e);
  //     return [];
  //   }
  // };
  return (
    <div className="mh-card-notice" style={style}>
      <CardSection title={title}>
        <div className="mh-card-notice-body" style={bodyStyle}>
          <ul>
            {documents.map((item) => (
              <li key={item.ID}>
                <Link to={getNewURL('thong-bao', item.TieuDe, item.ID)}>{item.TieuDe}</Link>
              </li>
            ))}
          </ul>
        </div>
      </CardSection>
    </div>
  );
};
