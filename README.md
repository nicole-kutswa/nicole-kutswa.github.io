# Portfolio site — setup notes

## Folder structure
```
portfolio/
├── index.html
├── styles.css
├── script.js
└── assets/
    ├── images/
    │   ├── profile-placeholder.jpg   ← replace with your headshot (480×600)
    │   ├── og-cover.jpg              ← replace with your social preview image (1200×630)
    │   └── favicon.ico               ← replace with your own icon
    └── cv/
        └── jordan-cole-cv.pdf        ← replace with your actual CV (keep the filename or update the href in index.html)
```

## Places to edit in `index.html`
Search for these and swap in your own details — they're also marked with HTML comments in the file:

- `<title>` and meta description/keywords near the top
- `Jordan Cole` — appears in the nav brand, hero, about section, and footer
- `https://linkedin.com/in/yourprofile` — three occurrences (nav, about, footer)
- `https://github.com/yourusername` — three occurrences (nav, about, footer)
- `hello@yourdomain.com` — footer contact email
- `assets/cv/jordan-cole-cv.pdf` — CV download link
- The "Professional summary" paragraphs in the About section
- Project cards inside each `.tab-panel` — titles, descriptions, tools, and deliverables are all placeholder content based on common project types per industry; replace with your own work

## Notes
- No build step required — open `index.html` directly in a browser, or serve the folder with any static file server.
- No external JS frameworks or icon libraries are used; social icons are inline SVG.
- Fonts (Manrope, IBM Plex Sans, IBM Plex Mono) load from Google Fonts — replace the `<link>` tags in `<head>` if you'd rather self-host them.
- Color palette, spacing, and radius values are all defined as CSS variables at the top of `styles.css` under `:root`, so the whole site can be re-themed from one place.
