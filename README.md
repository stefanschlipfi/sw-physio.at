# sw-physio.at

Website der **Physiotherapie Simon Wechdorn** (Herzogenburg, Niederösterreich).
Statisch generiert mit [Astro](https://astro.build), gestylt mit
[Tailwind CSS](https://tailwindcss.com), redaktionell gepflegt über
[Decap CMS](https://decapcms.org). Package Manager und Runtime: **Bun**.

Die Seite wird komplett zu HTML gebaut. Auf dem Server läuft PHP nur für eine
Sache, die statisch nicht geht: den CMS-Login (`public/oauth/`).

## Schnellstart

Mit [just](https://github.com/casey/just) startet beides zusammen:

```bash
just                 # Dev-Server + CMS-Proxy, Strg+C beendet beide
```

Von Hand geht es auch – dann braucht es zwei Terminals:

```bash
bun install
bun run dev          # → http://localhost:4321
bun run cms          # decap-server auf Port 8081
```

Das Redaktionssystem liegt dann unter <http://localhost:4321/admin/>. `just`
setzt dafür `local_backend: true` in `public/admin/config.yml`, damit Decap
direkt in die Markdown-Dateien schreibt – **ohne Git-Login**. Vor dem Commit mit
`just local-backend-off` wieder zurückstellen.

| Befehl                   | Wirkung                                       |
| ------------------------ | --------------------------------------------- |
| `just`                   | Dev-Server und CMS-Proxy zusammen             |
| `just dev-only`          | nur der Astro-Dev-Server                      |
| `just check`             | `astro check` (Astro- und TypeScript-Prüfung) |
| `just build`             | Produktions-Build nach `dist/`                |
| `just preview`           | Build lokal ausliefern                        |
| `just clean`             | `dist/` und den Astro-Cache löschen           |
| `just local-backend-off` | CMS wieder auf das GitHub-Backend stellen     |

Dieselben Schritte gibt es als `bun run dev` / `build` / `preview` / `cms`.

## Seiten und Inhalte

| Seite          | Adresse        | Inhalt kommt aus                                 |
| -------------- | -------------- | ------------------------------------------------ |
| **Startseite** | `/`            | `home/` + `faq/` + `gallery/` + `opening-hours/` |
| **Über mich**  | `/ueber-mich/` | `about/`                                         |
| **Angebote**   | `/angebote/`   | `offers/` + `services/` + `prices/`              |
| **Fit2me**     | `/fit2me/`     | `fit2me/`                                        |
| **Kontakt**    | `/kontakt/`    | `contact/` + `src/lib/site.ts`                   |
| **Impressum**  | `/impressum/`  | `legal/impressum.md`                             |
| **AGB**        | `/agb/`        | `legal/agb.md`                                   |
| **Redaktion**  | `/admin/`      | Decap CMS + GitHub-OAuth                         |

Adresse, Telefonnummer, E-Mail und Instagram stehen **nicht** im CMS, sondern in
`src/lib/site.ts` – sie werden auch für die strukturierten Daten (schema.org)
und die Metadaten gebraucht.

## Validierung

Jede Collection hat zwei Beschreibungen, die zusammenpassen müssen:

- `src/content.config.ts` – das zod-Schema. Es entscheidet, ob gebaut wird: ein
  fehlender Pflichtwert, ein negativer Preis oder eine Uhrzeit im falschen
  Format brechen den Build mit einer konkreten Fehlermeldung ab.
- `public/admin/config.yml` – die Felder im CMS. `required`, `pattern` und
  `min`/`max` fangen dasselbe schon beim Speichern ab.

Wird ein Feld hinzugefügt, geändert oder entfernt, müssen **beide** Dateien
angepasst werden.

Decap löscht ein geleertes Feld nicht, sondern schreibt einen leeren String.
Optionale Felder mit Formatprüfung laufen deshalb über den Vorverarbeiter
`emptyAsUndefined` in `src/content.config.ts`.

## Design

Layout, Farben und Typografie stammen aus der ursprünglichen Webflow-Seite:
schwarze Fläche, oranger Akzent (`#ce6707`), Roboto für Text, PT Sans für den
Schriftzug, fester Header, feststehende Titelbilder und der Kontaktblock über
dem Footer. Die Farben liegen als Tailwind-Tokens in `src/styles/global.css`
(`--color-ink-*`, `--color-paper-*`, `--color-brand-*`).

Der Webflow-Export liegt unverändert in `webflow-export/` als Referenz. Er wird
weder gebaut noch ausgeliefert; Tailwind scannt ihn nicht (siehe `@source` in
`src/styles/global.css`).

## Bilder

Die Bilder aus dem Webflow-Export wurden auf maximal 2000–2400 px verkleinert
(64 MB → 4,6 MB) und liegen unter `public/images/uploads/`. Das ist auch der
Medienordner des CMS, neue Uploads landen dort. Bitte Fotos vor dem Hochladen
auf etwa 2000 px Breite verkleinern.

## CMS-Login einrichten

Decap läuft im Browser und committet über die GitHub-API. Nur der Login braucht
einen Server: `public/oauth/index.php` tauscht den Authorization Code gegen ein
Token. Dafür ist eine GitHub-OAuth-App nötig:

- Homepage URL: `https://sw-physio.at`
- Authorization callback URL: `https://sw-physio.at/oauth/`

Client-ID und Secret gehören in `public/oauth/config.php` auf dem Server – die
Datei ist über `.gitignore` ausgeschlossen. Als Vorlage dient
`public/oauth/config.example.php`.

## Offene Punkte vor dem Livegang

- **E-Mail-Adresse**: in `src/lib/site.ts` steht `PLATZHALTER@sw-physio.at`.
  Der Webflow-Export enthielt an dieser Stelle nur den Text „simpn“.
- **Preise**: die drei Einträge unter `src/content/prices/` sind Platzhalter.
  Webflow zeigte dreimal dasselbe Dummy-Angebot („60 MIN / 90 €“).
- **Behandlungstechniken und häufige Fragen**: die Einträge unter
  `src/content/services/` und `src/content/faq/` sind neu geschrieben – die
  Originaltexte lagen in der Webflow-CMS-Datenbank und waren nicht im Export
  enthalten. Bitte fachlich prüfen.
- **Impressum und AGB**: Vorlagen mit `PLATZHALTER`-Stellen, rechtlich prüfen
  lassen.
- **Fit2me-Adresse und Website**: Straße und Hausnummer in
  `src/content/contact/index.md` sowie der Link in `src/content/fit2me/index.md`
  sind zu ergänzen bzw. zu bestätigen.
