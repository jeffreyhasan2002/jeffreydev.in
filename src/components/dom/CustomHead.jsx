import NextHead from 'next/head';
import { useRouter } from 'next/router';

const SITE_URL = 'https://jeffreydev.in';
const OG_IMAGE = `${SITE_URL}/og.png`;

const getSchema = () => ({
  '@context': 'http://schema.org',
  '@type': 'Person',
  name: 'jeffrey hasan',
  jobTitle: 'Senior Frontend Developer',
  url: SITE_URL,
  image: OG_IMAGE,
  email: 'mailto:jefyjery10@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/jeffreyhasan',
    'https://github.com/jeffreyhasan10',
    'https://twitter.com/jeffreyhasan',
    'https://www.instagram.com/jeffx_.17',
    'https://medium.com/@jefyjery10',
  ],
});

function CustomHead({ title = '', description = '', keywords = [], image }) {
  const router = useRouter();
  const url = `${SITE_URL}${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`;
  const ogImage = image ? `${SITE_URL}${image}` : OG_IMAGE;

  return (
    <NextHead>
      {/* General Meta Tags */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="x-dns-prefetch-control" content="off" />
      <meta name="robots" content={process.env.NODE_ENV !== 'development' ? 'index,follow' : 'noindex,nofollow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(',')} />
      <meta name="author" content="jeffrey hasan" />
      <meta name="referrer" content="no-referrer" />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical and Title */}
      <link rel="canonical" href={url} />
      <title>{title}</title>

      {/* OpenGraph Meta Tags */}
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333333" />
      <meta name="msapplication-TileColor" content="#f0f4f1" />
      <meta name="theme-color" content="#f0f4f1" />

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()) }} />
    </NextHead>
  );
}

export default CustomHead;
