/**
 * Central master data of the website.
 *
 * TODO: Before going live, replace the values marked PLATZHALTER with the real
 * data of the practice – the Webflow export carried dummy text for them.
 */
export const site = {
  name: 'Physiotherapie Simon Wechdorn',
  shortName: 'SW Physio',
  owner: 'Simon Wechdorn',
  claim: 'Physiotherapie aus Leidenschaft',
  description:
    'Physiotherapie Simon Wechdorn in Herzogenburg – Orthopädie, Traumatologie und Sportphysiotherapie, dazu die Kooperation mit dem Fit2me Kraftwerk Böheimkirchen.',
  domain: 'https://sw-physio.at',

  /**
   * Default preview image for social networks, relative to the site root.
   * Pages can override it through the `image` prop of BaseLayout.
   */
  ogImage: {
    path: '/images/uploads/hero-home.jpg',
    width: 2400,
    height: 1600,
    type: 'image/jpeg',
  },

  address: {
    street: 'Wiener Straße 8',
    postalCode: '3130',
    city: 'Herzogenburg',
    district: 'St. Pölten Land',
    state: 'Niederösterreich',
    country: 'Österreich',
  },

  /** Wiener Straße 8, 3130 Herzogenburg – for geo metadata and the map. */
  geo: {
    lat: 48.28675,
    lng: 15.69747,
  },

  phone: '+436605636807',
  phoneDisplay: '0660 / 563 68 07',
  email: 'PLATZHALTER@sw-physio.at',

  /** An empty string hides the respective link. */
  social: {
    instagram: 'https://www.instagram.com/sw_physio/',
    instagramHandle: 'sw_physio',
  },

  legal: {
    owner: 'Simon Wechdorn, BSc',
    businessPurpose: 'Freiberufliche Physiotherapie',
    authority: 'Bezirkshauptmannschaft St. Pölten',
    chamber: 'PLATZHALTER',
  },
} as const;

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/ueber-mich/', label: 'Über mich' },
  { href: '/angebote/', label: 'Angebote' },
  { href: '/fit2me/', label: 'Fit2me' },
  { href: '/kontakt/', label: 'Kontakt' },
] as const;

export const addressOneLine = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

/** Digits only – for `tel:` links. */
export const phoneHref = `tel:${site.phone.replace(/\s/g, '')}`;
