## Code is English, content is German

Never write German code. No `klasse` instead of `class`, no `berechneSumme`,
no `$anfrage`, no `text-marke-950`. Everything the compiler, the browser or a
developer reads is English:

- variable, function, type, class and property names
- file and directory names
- CSS classes and design tokens
- code comments and JSDoc
- data attributes, HTML `id`s and SVG ids
- frontmatter keys of the content collections, and the matching `name:` fields
  in `public/admin/config.yml`
- JSON keys of the PHP endpoints, form field names and config keys

German stays only where a human reader sees it:

- all content and UI text (`Termin vereinbaren`, `Häufige Fragen`)
- public URLs (`/ueber-mich/`, `/angebote/`) and content slugs
- the CMS interface: `label`, `label_singular`, `hint`, `description` in
  `public/admin/config.yml`
- enum *values* that are rendered as they are (`Montag`, `Heimtherapie`)
- error and status messages shown to visitors
- `README.md` and this file

## Never commit `local_backend: true`

`public/admin/config.yml` must always be committed with `local_backend: false`.

Running `just`, `just dev` or `just cms` flips it to `true` through the
`local-backend-on` recipe, so it changes without anyone editing the file. If
that lands on `main`, the live CMS at sw-physio.at/admin/ looks for a local
proxy on port 8081 instead of talking to GitHub — editors are locked out.

Before every commit, check the flag and reset it if needed:

```
grep '^local_backend' public/admin/config.yml   # must read: local_backend: false
just local-backend-off                          # resets it
```

Also check it explicitly whenever you stage with `git add -A`, and never let it
slip into a commit as an unrelated side change.

## Content is validated by zod, twice

Every collection has a zod schema in `src/content.config.ts` and a matching
field list in `public/admin/config.yml`. The CMS is the first line of defence
(`required`, `pattern`, `min`), the zod schema is the one that actually fails
the build. When a field is added, changed or removed, both files have to move
together — otherwise editors can save something the build then rejects.

Decap never drops an emptied field, it writes an empty string. Optional fields
with a format check therefore go through the `emptyAsUndefined` preprocessor in
`src/content.config.ts` instead of a bare `.optional()`.

## Layout

The visual base layout comes from the original Webflow site and stays that way:
black page, orange brand accent (`--color-brand-*`), Roboto for text and
PT Sans for the wordmark, a fixed header, sticky parallax page heroes and the
contact block above the footer. `webflow-export/` keeps the original HTML and
CSS for reference — it is not built and not deployed.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
