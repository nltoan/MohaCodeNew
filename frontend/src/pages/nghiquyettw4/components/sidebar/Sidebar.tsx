import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import './Sidebar.scss';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import type { ReactNode } from 'react';
import { getNewURL } from '@/utils/getSlugKey';
export interface NghiQuyetTW4SidebarItem {
  url: string;
  image?: string;
  title: string;
  date: string;
}
export interface NghiQuyetTW4SidebarProps {
  id: string;
  title: string;
  headerAdditional?: ReactNode;
  scrollHeight?: number;
  mainItem?: NghiQuyetTW4SidebarItem;
  items: NghiQuyetTW4SidebarItem[];
}
export const NghiQuyetTW4Sidebar = ({
  id,
  title,
  headerAdditional,
  scrollHeight = 470,
  mainItem,
  items,  
}: NghiQuyetTW4SidebarProps) => {
  
  return (
    <CardSectionBanner className="mh-nqtw4-sidebar" title={title} url={getNewURL('nghi-quyet-tw4/chuyen-muc', title, id)} headerAdditional={headerAdditional}>
      <div className="mh-nqtw4-sidebar-inner">
        {mainItem ? (
          <Link to={mainItem.url} className="mh-nqtw4-sidebar-card">
            <div className="mh-nqtw4-sidebar-card-image">
              <Image src={mainItem.image} alt={mainItem.title} />
            </div>
            <div className="mh-nqtw4-sidebar-title">{mainItem.title}</div>
          </Link>
        ) : (
          <></>
        )}

        <div className="mh-nqtw4-sidebar-body" style={{ maxHeight: scrollHeight }}>
          <ul>
            {items.map((item) => (
              <li key={item.title}>
                <Link to={item.url}>
                  <strong>{item.title}</strong>
                  <span>{item.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </CardSectionBanner>
  );
};
