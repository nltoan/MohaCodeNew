import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { portalCanonical } from './PortalSeo';
import { assignedMetadataDate } from '@/utils/assignedMetadataDate';

type Props = {
  title?: string | null;
  description?: string | null;
  creator?: string | null;
  publisher?: string | null;
  date?: string | null;
  dateKind?: 'Issued' | 'Created';
  subject?: string | null;
  allowAssignedDate?: boolean;
};

function plainText(value?: string | null) {
  if (!value) return '';
  const doc = new DOMParser().parseFromString(value, 'text/html');
  return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
}

// Keep the source calendar date; do not shift it through the browser time zone.
function isoDate(value?: string | null) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/);
  if (!match) return '';
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.getUTCFullYear() === Number(year) && date.getUTCMonth() + 1 === Number(month) && date.getUTCDate() === Number(day)
    ? `${year}-${month}-${day}` : '';
}

export function DublinCore({ title, description, creator, publisher, date, dateKind = 'Issued', subject, allowAssignedDate = false }: Props) {
  const { pathname } = useLocation();
  const cleanTitle = plainText(title);
  if (!cleanTitle) return null;
  const sourceDescription = plainText(description);
  const cleanDescription = sourceDescription && sourceDescription !== cleanTitle
    ? sourceDescription : `Thông tin ${cleanTitle} trên Cổng thông tin điện tử Bộ Nội vụ.`;
  const cleanCreator = plainText(creator) || 'Bộ Nội vụ';
  const cleanPublisher = plainText(publisher) || 'Bộ Nội vụ';
  const issued = isoDate(date);
  const assigned = !issued && allowAssignedDate;
  const cleanSubject = plainText(subject).split(/[,;]+/).map((part) => part.trim()).filter(Boolean).join('; ');
  return <Helmet>
    <meta name="DC.Title" content={cleanTitle} data-dc-source="record" />
    <meta name="DC.Creator" content={cleanCreator} />
    <meta name="DC.Publisher" content={cleanPublisher} />
    <meta name="DC.Description" content={cleanDescription.slice(0, 500)} />
    <meta name="DC.Identifier" content={portalCanonical(pathname)} />
    {(issued || assigned) && <meta name="DC.Date" content={issued || assignedMetadataDate(pathname)} />}
    {assigned && <meta name="DC.Date.Source" content="owner-assigned" />}
    {issued && <meta name={`DC.Date.${dateKind}`} content={issued} />}
    {cleanSubject && <meta name="DC.Subject" content={cleanSubject} />}
  </Helmet>;
}
