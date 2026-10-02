import type { MouseEvent, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import "./PageFooter.scss";
import { getUrlPdfFile } from '@/utils/image';
export interface FileItem extends LinkProps {
  icon: string | ReactNode;
  fileName: string;
  className?: string;
}
export interface PageFooterProps {
  files?: FileItem[];
  onPrint?: (event: MouseEvent) => void;
  onShare?: (event: MouseEvent) => void;
}
export const PageFooter = ({ files, onPrint, onShare }: PageFooterProps) => {
  return (
    <div className="mh-page-footer">
      {files && files.length > 0 ? (
        <div>
          {files.map((file, index) => (
            <div key={index} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 15,
                    paddingBottom: 20,
                  }}>
            <Link to={typeof file.to === 'string' ? getUrlPdfFile(file.to) : file.to} target={file.target} className={`mh-page-footer-file ${file.className || ""}`}>
              {typeof file.icon === "string" ? (
                <img src={file.icon} alt={file.fileName} height={40} /> 
              ) : (
                file.icon
              )}
              <span>{file.fileName}</span>
            </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-files"></div>
      )}
      <div className="mh-page-footer-actions">
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
        {onShare ? (
          <button type="button" onClick={onShare}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.39999 6.32015L15.89 3.49015C19.7 2.22015 21.77 4.30015 20.51 8.11015L17.68 16.6002C15.78 22.3102 12.66 22.3102 10.76 16.6002L9.91999 14.0802L7.39999 13.2402C1.68999 11.3402 1.68999 8.23015 7.39999 6.32015Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.11 13.6496L13.69 10.0596"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Chia sẻ</span>
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
