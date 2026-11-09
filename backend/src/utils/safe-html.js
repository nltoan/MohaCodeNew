import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export default function safeParse(value) { return parse(DOMPurify.sanitize(value || '')); }
