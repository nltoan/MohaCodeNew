import type { MouseEvent } from "react";
import "./PageHeader.scss";
import { vnFormatter } from "@/utils";
export interface PageHeaderProps {
  title?: string;
  date?: string;
  viewCount?: number;
  onPrint?: (event: MouseEvent) => void;
  onInZoomText?: () => void;
  onDeZoomText?: () => void;
}

const TextIncreaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-zoom-in-icon lucide-zoom-in"
  >
    <circle cx={11} cy={11} r={8} />
    <line x1={21} x2="16.65" y1={21} y2="16.65" />
    <line x1={11} x2={11} y1={8} y2={14} />
    <line x1={8} x2={14} y1={11} y2={11} />
  </svg>
);

const TextDecreaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-zoom-out-icon lucide-zoom-out"
  >
    <circle cx={11} cy={11} r={8} />
    <line x1={21} x2="16.65" y1={21} y2="16.65" />
    <line x1={8} x2={14} y1={11} y2={11} />
  </svg>
);


export const PageHeader = ({ title, date, viewCount, onPrint, onInZoomText, onDeZoomText }: PageHeaderProps) => {
  return (
    <div className="mh-page-header">
      {title ? <h1>{title}</h1> : <></>}
      {date || viewCount || onPrint ? (
        <div className="mh-page-header-meta">
          {date ? <span>{vnFormatter(date)}</span> : <></>}
          {onPrint ? (
            <button type="button" onClick={onPrint}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.25 7H16.75V5C16.75 3 16 2 13.75 2H10.25C8 2 7.25 3 7.25 5V7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 15V19C16 21 15 22 13 22H11C9 22 8 21 8 19V15H16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 10V15C21 17 20 18 18 18H16V15H8V18H6C4 18 3 17 3 15V10C3 8 4 7 6 7H18C20 7 21 8 21 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 15H15.79H7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 11H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>In trang</span>
            </button>
          ) : (
            <></>
          )}
          {viewCount ? (
            <span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15.58 11.9999C15.58 13.9799 13.98 15.5799 12 15.5799C10.02 15.5799 8.42001 13.9799 8.42001 11.9999C8.42001 10.0199 10.02 8.41992 12 8.41992C13.98 8.41992 15.58 10.0199 15.58 11.9999Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20.2697C15.53 20.2697 18.82 18.1897 21.11 14.5897C22.01 13.1797 22.01 10.8097 21.11 9.39973C18.82 5.79973 15.53 3.71973 12 3.71973C8.47 3.71973 5.18 5.79973 2.89 9.39973C1.99 10.8097 1.99 13.1797 2.89 14.5897C5.18 18.1897 8.47 20.2697 12 20.2697Z"
                  stroke="#292D32"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Lượt xem: {viewCount.toLocaleString()}</span>
            </span>
          ) : (
            <></>
          )}
          {onDeZoomText && onInZoomText && (
            <>
              <div style={{ cursor: "pointer" }} onClick={onInZoomText}>
                <TextIncreaseIcon />
              </div>
              <div style={{ cursor: "pointer" }} onClick={onDeZoomText}>
                <TextDecreaseIcon />
              </div>
            </>
          )}

        </div>
      ) : (
        <></>
      )}

    </div>
  );
};
