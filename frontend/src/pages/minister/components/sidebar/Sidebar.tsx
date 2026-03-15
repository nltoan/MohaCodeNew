import { CardSectionBanner } from '@/components/card-section/CardSectionBanner';
import './Sidebar.scss';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import type { ReactNode } from 'react';
import { getNewURL } from '@/utils/getSlugKey';
export interface MinisterSidebarItem {
  url: string;
  image?: string;
  title: string;
  date: string;
}
export interface MinisterSidebarProps {
  id: string;
  title: string;
  headerAdditional?: ReactNode;
  scrollHeight?: number;
  mainItem?: MinisterSidebarItem;
  items: MinisterSidebarItem[];
}
export const MinisterSidebar = ({
  id,
  title,
  headerAdditional,
  scrollHeight = 470,
  mainItem,
  items,  
}: MinisterSidebarProps) => {
  
  return (
    <CardSectionBanner className="mh-minister-sidebar" title={title} url={getNewURL('bo-truong/chuyen-muc', title, id)} headerAdditional={headerAdditional}>
      <div className="mh-minister-sidebar-inner">
        {mainItem ? (
          <Link to={mainItem.url} className="mh-minister-sidebar-card">
            <div className="mh-minister-sidebar-card-image">
              <Image src={mainItem.image} alt={mainItem.title} />
            </div>
            <div className="mh-minister-sidebar-title">{mainItem.title}</div>
          </Link>
        ) : (
          <></>
        )}

        <div className="mh-minister-sidebar-body" style={{ maxHeight: scrollHeight }}>
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
