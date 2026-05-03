import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title: string;
  description: string;
  /** Override the canonical path. Defaults to the current route. */
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_URL = 'https://ianedmundson.github.io';
const SITE_NAME = 'Ian Edmundson';
const DEFAULT_IMAGE = '/og-image.jpg';

const Seo: React.FC<SeoProps> = ({ title, description, path, image = DEFAULT_IMAGE, jsonLd }) => {
  const location = useLocation();
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const url = `${SITE_URL}${path ?? location.pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;