# TerraLuxe

A luxury tiles and furnishings eCommerce front-end built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

Built as a collaborative portfolio project.

---

## Tech

- HTML5, CSS3, Vanilla JS (ES6+)
- Google Fonts (Cormorant Garamond, Playfair Display, DM Sans)
- Geolocation API, Intersection Observer API, Google Maps Embed

---

## Features

- 64 products across Wall, Floor, and Special tile categories
- Product comparison — select up to 3 products, view side-by-side feature matrix
- Tile calculator — estimates quantity, area, and boxes needed based on room dimensions and waste allowance
- Hero slideshow with auto-rotation
- Expert Corner — buying guides, blog articles, video library
- Contact form with input validation and XSS protection
- Distance calculator using the Haversine formula + browser Geolocation API
- Fully responsive — mobile menu, adaptive grids, touch-friendly
- Dark luxury theme with CSS custom properties

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/Scar-face-69/TerraLuxe.git
cd TerraLuxe

# Open with Live Server in VS Code
# or run a local server
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Structure

```
TerraLuxe/
├── index.html
├── css/
│   └── style.css
└── js/
    └── main.js
```

---

## Notes

Front-end only — no backend, no real payments or auth. Forms, PDF downloads, and video links are simulated. The focus was UI/UX, code organization, and writing clean vanilla JS without leaning on a framework.
