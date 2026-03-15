import './Pagination.scss';
import type { CSSProperties } from 'react';
import { Pagination as BsPagination, type PaginationProps as BsPaginationProps } from 'react-bootstrap';

interface PaginationxProps extends BsPaginationProps {
  wrapStyle?: CSSProperties;
  showPageSizeSelector?: boolean;
  onPageSizeChange?: (size: number) => void;
  pageSizes?: number[];
  pageSize?: number;
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination = ({
  wrapStyle,
  showPageSizeSelector = false,
  onPageSizeChange,
  pageSizes = [10, 20, 50, 100],
  pageSize = 10,
  totalPages,
  activePage,
  onPageChange,
  maxVisiblePages = 5,
  ...props
}: PaginationxProps) => {
  const getPages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(2, activePage - half);
      let end = Math.min(totalPages - 1, activePage + half);

      if (activePage <= half + 1) {
        start = 2;
        end = maxVisiblePages;
      }
      if (activePage >= totalPages - half) {
        start = totalPages - maxVisiblePages + 1;
        end = totalPages - 1;
      }

      pages.push(1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mh-pagination-wrap" style={wrapStyle}>
      {showPageSizeSelector ? (
        <div className="mh-pagination-info">
          <span>Số bài trên trang</span>
          <select className="form-select" value={pageSize} onChange={(e) => onPageSizeChange?.(Number(e.target.value))}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div></div>
      )}
      <nav aria-label="Page navigation example">
        <BsPagination className="mh-pagination" {...props}>
          <BsPagination.Prev
            disabled={activePage <= 1}
            onClick={() => activePage > 1 && onPageChange(activePage - 1)}
          />
          {getPages().map((page, idx) =>
            page === '...' ? (
              <BsPagination.Ellipsis key={`ellipsis-${idx}`} disabled />
            ) : (
              <BsPagination.Item
                key={page}
                active={page === activePage}
                onClick={() => page !== activePage && onPageChange(Number(page))}
              >
                {page}
              </BsPagination.Item>
            ),
          )}
          <BsPagination.Next
            disabled={activePage >= totalPages}
            onClick={() => activePage < totalPages && onPageChange(activePage + 1)}
          />
        </BsPagination>
      </nav>
      <div></div>
    </div>
  );
};
