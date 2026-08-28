import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
/* Imported straight from zod – `z` re-exported by astro:content is deprecated. */
import { z } from 'zod';

/** Weekday names as shown on the site – editorial values, kept in German. */
const WEEKDAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
] as const;

/**
 * Decap CMS does not drop emptied fields from the frontmatter, it writes an
 * empty string instead (`from: ""`). For fields with a format check that would
 * break schema validation – so an empty value is treated as "not set" here.
 */
const emptyAsUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

/** Time of day in "HH:MM" format – an empty field is allowed. */
const timeOfDay = z.preprocess(
  emptyAsUndefined,
  z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format muss HH:MM sein')
    .optional(),
);

/** Path of an uploaded image, e.g. "/images/uploads/portrait-simon.jpg". */
const imagePath = z
  .string()
  .regex(/^\/.+\.(jpe?g|png|webp|avif|svg)$/i, 'Pfad muss mit / beginnen und ein Bild sein');

const optionalImagePath = z.preprocess(emptyAsUndefined, imagePath.optional());

/** Absolute http(s) URL – used for external links the CMS can set. */
const externalUrl = z.preprocess(
  emptyAsUndefined,
  z.url('Bitte eine vollständige Adresse mit https:// angeben').optional(),
);

/** Recurring shape of a section heading (see SectionHeading.astro). */
const section = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  text: z.string().optional(),
});

/** Recurring shape of a page hero (see PageHero.astro). */
const hero = z.object({
  image: optionalImagePath,
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
});

/** Single entry – the editorial texts of the home page. */
const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: '**/*.md' }),
  schema: z.object({
    hero,
    welcome: section,
    /** The three linked boxes below the welcome heading. */
    teasers: z
      .array(
        z.object({
          title: z.string().min(1),
          subtitle: z.string().optional(),
          image: imagePath,
          imageAlt: z.string().optional(),
          href: z.string().startsWith('/', 'Pfad muss mit / beginnen'),
          linkLabel: z.string().default('Mehr'),
        }),
      )
      .min(1)
      .max(6),
    faq: section,
    gallery: section,
  }),
});

/** Single entry – the "Über mich" page. */
const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  schema: z.object({
    hero,
    intro: section.extend({
      image: optionalImagePath,
      imageAlt: z.string().optional(),
    }),
    resume: z.object({
      title: z.string().min(1),
      image: optionalImagePath,
      imageAlt: z.string().optional(),
      entries: z
        .array(
          z.object({
            /** Year or period, e.g. "2021-2024" or "2025-aktuell". */
            period: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .default([]),
    }),
  }),
});

/** Single entry – the headings of the "Angebote" page. */
const offers = defineCollection({
  loader: glob({ base: './src/content/offers', pattern: '**/*.md' }),
  schema: z.object({
    hero,
    services: section,
    prices: section,
  }),
});

/** Single entry – the "Fit2me" cooperation page. */
const fit2me = defineCollection({
  loader: glob({ base: './src/content/fit2me', pattern: '**/*.md' }),
  schema: z.object({
    hero,
    intro: z.object({
      title: z.string().min(1),
      text: z.string().optional(),
      image: optionalImagePath,
      imageAlt: z.string().optional(),
    }),
    gallery: z.preprocess(
      (value) => value ?? [],
      z.array(
        z.object({
          image: imagePath,
          imageAlt: z.string().optional(),
        }),
      ),
    ),
    partner: z.object({
      label: z.string().min(1),
      url: externalUrl,
    }),
  }),
});

/** Single entry – the "Kontakt" page with its locations. */
const contact = defineCollection({
  loader: glob({ base: './src/content/contact', pattern: '**/*.md' }),
  schema: z.object({
    hero,
    intro: section,
    locations: z
      .array(
        z.object({
          title: z.string().min(1),
          street: z.string().min(1),
          postalCode: z.string().regex(/^\d{4}$/, 'Postleitzahl muss vierstellig sein'),
          city: z.string().min(1),
          note: z.string().optional(),
          /**
           * `src` of the Google-Maps embed. Only the iframe address is stored,
           * the markup itself lives in MapEmbed.astro.
           */
          mapUrl: z.preprocess(
            emptyAsUndefined,
            z
              .url()
              .startsWith(
                'https://www.google.com/maps/embed',
                'Bitte die Einbettungs-Adresse aus „Karte teilen → Karte einbetten“ verwenden',
              )
              .optional(),
          ),
        }),
      )
      .min(1),
  }),
});

/** The treatment techniques shown on the "Angebote" page. */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: optionalImagePath,
    imageAlt: z.string().optional(),
    /** Lower number = further to the front. */
    order: z.number().int().default(100),
  }),
});

const prices = defineCollection({
  loader: glob({ base: './src/content/prices', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    durationMinutes: z.number().int().positive(),
    price: z.number().nonnegative(),
    description: z.string().optional(),
    /** Drawn with a stronger border on the price grid. */
    highlighted: z.boolean().default(false),
    order: z.number().int().default(100),
  }),
});

const faq = defineCollection({
  loader: glob({ base: './src/content/faq', pattern: '**/*.md' }),
  schema: z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    order: z.number().int().default(100),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    image: imagePath,
    /** Alt text for screen readers – falls back to the title. */
    imageAlt: z.string().optional(),
    description: z.string().optional(),
    order: z.number().int().default(100),
  }),
});

const openingHours = defineCollection({
  loader: glob({ base: './src/content/opening-hours', pattern: '**/*.md' }),
  schema: z
    .object({
      day: z.enum(WEEKDAYS),
      /** Sort order Mon=1 … Sun=7 */
      order: z.number().int().min(1).max(7),
      closed: z.boolean().default(false),
      /** "HH:MM" format – only relevant while closed === false */
      from: timeOfDay,
      until: timeOfDay,
      /** e.g. "Termine nur nach Vereinbarung" */
      note: z.string().optional(),
    })
    /**
     * On a closed day, times left over in the CMS do not count – the file keeps
     * them (handy when switching back), the website ignores them reliably.
     */
    .transform((day) =>
      day.closed ? { ...day, from: undefined, until: undefined } : day,
    ),
});

/** Impressum and AGB – text lives in the markdown body. */
const legal = defineCollection({
  loader: glob({ base: './src/content/legal', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = {
  home,
  about,
  offers,
  fit2me,
  contact,
  services,
  prices,
  faq,
  gallery,
  openingHours,
  legal,
};
