import { IconArrowRight, IconSearch } from '@/components/icons';
import { Fragment, type MouseEvent } from 'react';
import { Container, FormControl } from 'react-bootstrap';
import './HeaderUtils.scss';
import { Link } from 'react-router-dom';
import { getLang } from '@/services';
import { GlobalFontScaler } from './GlobalFontScaler';
import { getVietnameseDate } from '@/utils/dateUtils';
interface HeaderBreadcrumb {
  label: string;
  active?: boolean;
  path?: string;
}
interface HeaderUtilsProps {
  breadcrumbs: HeaderBreadcrumb[];
  onSearch: (e?: MouseEvent) => void;
  onLanguageChange?: (lang: string) => void;
  minister?: boolean;
  nqtw4?: boolean;
  searchPlaceholder?: string;
  language?: string;
  keyword?: string;
  onKeywordChange?: React.ChangeEventHandler<HTMLInputElement>;
  onLanguageClick?: (e: MouseEvent) => void;
}
export const HeaderUtils = ({
  breadcrumbs,
  onSearch,
  onLanguageChange = () => {},
  minister,
  nqtw4,
  searchPlaceholder,
  language,
  keyword,
  onKeywordChange,
  onLanguageClick,
}: HeaderUtilsProps) => {
  return (
    <div className={`mh-header-utils ${minister ? 'mh-header-utils-minister' : (nqtw4 ? '' : '')}`}>
      <Container>
        <div className="mh-header-utils-inner">
          <div className="mh-header-utils-left">
            <span>{getVietnameseDate(new Date())}</span>
            {breadcrumbs.length > 1 && breadcrumbs.map((item, index) => {
              const isActive = breadcrumbs.length > 1 && index === breadcrumbs.length - 1;
              return (
                <Fragment key={item.label}>
                  {item.path ? (
                    <Link to={item.path} className="mh-header-utils-text">
                      {item.label}
                    </Link>
                  ) : (
                    <div className={`mh-header-utils-text ${isActive ? 'active' : ''}`}>{item.label}</div>
                  )}
                  {index < breadcrumbs.length - 1 ? <IconArrowRight /> : <></>}
                </Fragment>
              );
            })}
          </div>
          {minister ? (
            <>
              <div className="mh-header-utils-minister-search">
                <button type="button" aria-label="Tìm kiếm" onClick={onSearch}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.66659 14C11.1644 14 13.9999 11.1645 13.9999 7.66671C13.9999 4.1689 11.1644 1.33337 7.66659 1.33337C4.16878 1.33337 1.33325 4.1689 1.33325 7.66671C1.33325 11.1645 4.16878 14 7.66659 14Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.6666 14.6667L13.3333 13.3334"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <FormControl
                  type="search"
                  placeholder={searchPlaceholder}
                  value={keyword}
                  onChange={onKeywordChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (onSearch) {
                        onSearch();
                      }
                    }
                  }}
                />
              </div>
              <GlobalFontScaler />
              <div className="mh-header-utils-minister-language">
                <button type="button" onClick={onLanguageClick}>
                  {language}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mh-header-utils-search">
                <button type="button" onClick={() => onSearch()}>
                  <IconSearch />
                </button>
              </div>
              <GlobalFontScaler />
              <div className="mh-header-utils-language">
                <button
                  type="button" translate='no'
                  onClick={() => onLanguageChange('vi')}
                  className={getLang() === 'vi' ? 'active' : ''}
                >
                  VN
                </button>
                <button
                  type="button" translate='no'
                  onClick={() => onLanguageChange('en')}
                  className={getLang() === 'en' ? 'active' : ''}
                >
                  EN
                </button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};
