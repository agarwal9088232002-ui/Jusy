# jusy_washere — personal site

A single-page site that presents you as a **Web Developer** while giving
Technology, Anime Edits, and Everything Else their own equal space —
styled like an open code editor with four tabs, one per side of what you make.

## Files

```
index.html      structure / content
css/style.css   all styling (one file, organised by section)
js/main.js      nav behaviour, typewriter effect, card content, copy-to-clipboard
```

No build step, no dependencies to install. Open `index.html` in a browser,
or upload the folder as-is to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or your own hosting).

## Adding real work

Open `js/main.js` and find the `CONTENT` object near the top. Each of the four
tabs (`webdev`, `tech`, `anime`, `other`) is a plain array — duplicate an
entry, edit the text, and add a `href` if it should link out (e.g. straight to
a YouTube video or a live project). Leave `href` off and it renders as an
open placeholder card instead, so the site never claims a project exists
before you've added it.

## Socials

Only **YouTube** (`@jusy_washere`) and **Discord** (`jusy_washere`) are linked,
since those were the only confirmed handles. The Discord card copies the
username to the clipboard on tap/click (Discord usernames aren't public
profile links). Instagram and Facebook were mentioned but no handles were
given, so they're intentionally left off — add them yourself in the
`#connect` section of `index.html` once you have the links. No WhatsApp
anywhere, as requested.

## Design notes

- Palette: near-black base (`#0B0E14`) with three accent signals —
  mint-cyan for dev, amber for tech, pink for anime edits, violet for
  everything else — used consistently as the four "tab" colours throughout.
- Type: Space Grotesk (display), Inter (body), JetBrains Mono (nav/labels/code-flavoured accents).
- Brand mark: `</jusy>` — a closing HTML tag as a logotype, doubling as a nod to web dev and a personal wordmark.
- Fully responsive: collapses to a hamburger-driven tab list under 760px, card grids step down from 3 → 2 → 1 columns.
