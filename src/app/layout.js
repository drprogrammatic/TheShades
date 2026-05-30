import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import AppChrome from '@/components/AppChrome';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata = {
  title: {
    default: 'The Shades — Premium Window Blinds, Curtains & Interior Solutions in Delhi NCR',
    template: '%s | The Shades',
  },
  description: 'Transform your space with luxury custom window blinds, curtains, wallpapers & flooring from The Shades. 7+ years of excellence in Delhi NCR. Free consultation.',
  keywords: ['window blinds', 'curtains', 'wallpapers', 'wooden flooring', 'interior design', 'Delhi NCR', 'The Shades', 'roller blinds', 'venetian blinds'],
  authors: [{ name: 'The Shades' }],
  creator: 'The Shades',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://theshades.co.in',
    siteName: 'The Shades',
    title: 'The Shades — Premium Window Blinds & Interior Solutions',
    description: 'Transform your space with luxury custom window blinds, curtains, wallpapers & flooring. Free consultation in Delhi NCR.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Shades — Premium Window Blinds & Interior Solutions',
    description: 'Transform your space with luxury custom window blinds, curtains, wallpapers & flooring.',
  },
  robots: { index: true, follow: true },
  // NOTE: No global canonical here — each page sets its own via generateMetadata
};

const LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://theshades.co.in/#business",
  name: "The Shades",
  url: "https://theshades.co.in",
  logo: "https://theshades.co.in/logo.png",
  image: "https://theshades.co.in/logo.png",
  description: "Premium custom window blinds, curtains, wallpapers & flooring solutions in Delhi NCR. 7+ years of excellence.",
  telephone: "+91-9953042031",
  email: "theshades74@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3rd Floor, Vardhman Crown Mall, 337, Sector 19, Dwarka",
    addressLocality: "Delhi",
    postalCode: "110075",
    addressRegion: "Delhi",
    addressCountry: "IN"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.5921,
    longitude: 77.0460
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "10:00",
      closes: "19:00"
    }
  ],
  areaServed: [
    { "@type": "City", name: "Delhi" },
    { "@type": "City", name: "Gurgaon" },
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Faridabad" },
    { "@type": "City", name: "Ghaziabad" }
  ],
  hasMap: "https://maps.google.com/?q=Vardhman+Crown+Mall+Dwarka+Delhi",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9953042031",
    contactType: "sales",
    email: "theshades74@gmail.com",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Google AdSense verification */}
        <meta name="google-adsense-account" content="ca-pub-3513014389949536" />

        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T6LN4239');`}
        </Script>

        {/* LocalBusiness structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
        />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3513014389949536"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T6LN4239"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <AppChrome>{children}</AppChrome>

        {/* WhatsApp floating button */}
        <a
          href="https://wa.me/919953042031?text=Hi%2C%20I%20am%20interested%20in%20window%20blinds%20for%20my%20home.%20Can%20you%20help%3F"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#25D366',
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            transition: 'transform 0.2s',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </body>
    </html>
  );
}

