import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCtxAppConfig } from '@/services/config';
import { LoadingFallback } from './LoadingFallback';

// Resolve the section landing page from the same configured menu as the header.
export function PortalSectionIndex({ prefix, title }: { prefix: string; title: string }) {
  const [target, setTarget] = useState<string>();
  useEffect(() => {
    let active = true;
    getCtxAppConfig().then(response => {
      const items = response.data?.data;
      const item = Array.isArray(items) ? items.find(item => item.URL?.startsWith(prefix)) : undefined;
      if (active) setTarget(item?.URL || '');
    }).catch(() => { if (active) setTarget(''); });
    return () => { active = false; };
  }, [prefix]);
  if (target === undefined) return <LoadingFallback />;
  if (target) return <Navigate to={target} replace />;
  return <div className="py-4"><h1>{title}</h1><p>Nội dung đang được cập nhật. Vui lòng chọn mục trên thanh điều hướng.</p></div>;
}
