import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// Article records currently do not identify their language or translation.
// Fail closed in English until the CMS supplies a trustworthy language mapping.
export function ArticleLanguageUnavailable({ collection = false }: { collection?: boolean }) {
  return <div className="container py-5" role="status">
    <Helmet><title>{collection ? 'News unavailable' : 'Article unavailable'} - Ministry of Home Affairs</title><meta name="robots" content="noindex, follow" /></Helmet>
    <h1>{collection ? 'News unavailable' : 'Article unavailable'}</h1>
    <p>{collection ? 'News is not available in English.' : 'This article is not available in English.'}</p>
    <Link to="/">Return to the homepage</Link>
  </div>;
}
