/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                         TERRA LUXE - MAIN APPLICATION                     ║
 * ║                                                                            ║
 * ║ Premium Tiles & Furnishings eCommerce Portfolio Project                   ║
 * ║ Built with vanilla HTML5, CSS3, and JavaScript (no frameworks)            ║
 * ║                                                                            ║
 * ║ KEY FEATURES:                                                              ║
 * ║ • Product Catalog (Wall/Floor/Special tiles with 64+ SKUs)                ║
 * ║ • Product Comparison System (up to 3 products side-by-side)               ║
 * ║ • Interactive Tile Calculator (area calculation with waste estimates)     ║
 * ║ • Hero Slideshow (auto-rotating, 5s interval)                            ║
 * ║ • Expert Corner (buying guides, blog articles, educational videos)        ║
 * ║ • Contact Form with Email Validation & Toast Notifications               ║
 * ║ • Google Maps Integration with Geolocation Distance Calculator           ║
 * ║ • Mobile-Responsive Design (dark theme, luxury aesthetic)                ║
 * ║ • Security-Hardened (XSS protection, form validation)                    ║
 * ║                                                                            ║
 * ║ ARCHITECTURE:                                                              ║
 * ║ • Direct DOM manipulation with event delegation                           ║
 * ║ • Modular functions organized by feature                                 ║
 * ║ • CSS custom properties for theming                                       ║
 * ║ • Intersection Observer API for animations                               ║
 * ║                                                                            ║
 * ║ Authors: Claude AI & Project Owner                                       ║
 * ║ Last Updated: April 2, 2026                                              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

/* ─────────────────────────────────────────
   UTILITIES: Escape HTML & Toast Notifications
───────────────────────────────────────── */
// Escape HTML special characters to prevent XSS attacks
// This sanitizes user input and product data before rendering in DOM
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Show toast notification with auto-dismiss (replaces alert() for better UX)
// @param message {string} - Notification message to display
// @param type {string} - 'info', 'success', 'warning', or 'error'
function showToast(message, type = 'info') {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Validate email format using regex pattern
// @param email {string} - Email address to validate
// @returns {boolean} - True if valid email format
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─────────────────────────────────────────
   DATA: Products
───────────────────────────────────────── */
const wallProducts = {
    bathroom: [
        { name: 'Aqua Pearl', size: '300 × 600mm', badge: 'Popular', pattern: 'tile-pattern-marble', tags: ['Water Resistant', 'Gloss', 'Rectified'], desc: 'High-gloss marble-effect tile for luxury bathroom walls. Moisture-sealed glaze.' },
        { name: 'Mist White', size: '300 × 600mm', badge: null, pattern: 'tile-pattern-2', tags: ['Anti-Fungal', 'Matt', 'Easy Clean'], desc: 'Soft matte white ceramic with anti-fungal surface treatment.' },
        { name: 'Anthracite Grid', size: '600 × 600mm', badge: 'New', pattern: 'tile-pattern-6', tags: ['Bold', 'Matt', 'Rectified'], desc: 'Dark anthracite with subtle grid texture for dramatic feature walls.' },
        { name: 'Travertine Ivory', size: '300 × 900mm', badge: null, pattern: 'tile-pattern-1', tags: ['Natural Look', 'Satin', 'Large Format'], desc: 'Travertine-inspired surface with fine veining and warm ivory tones.' },
    ],
    kitchen: [
        { name: 'Metro Gloss White', size: '75 × 300mm', badge: 'Classic', pattern: 'tile-pattern-2', tags: ['Splashback', 'Easy Clean', 'Gloss'], desc: 'Timeless subway tile for kitchen backsplashes. Brilliant white glaze.' },
        { name: 'Industrial Slate', size: '300 × 600mm', badge: null, pattern: 'tile-pattern-5', tags: ['Matt', 'Stain Resistant', 'Anti-Slip'], desc: 'Slate-look matte tile with textured grip surface for working kitchens.' },
        { name: 'Herringbone Cream', size: '75 × 225mm', badge: 'Trending', pattern: 'tile-pattern-1', tags: ['Herringbone', 'Gloss', 'Classic'], desc: 'Perfect for herringbone installations, this cream gloss tile adds warmth.' },
        { name: 'Sage Green Zellige', size: '100 × 100mm', badge: 'New', pattern: 'tile-pattern-4', tags: ['Handmade Look', 'Zellige', 'Artisan'], desc: 'Zellige-inspired imperfection and depth in a sophisticated sage green.' },
    ],
    outdoor: [
        { name: 'Stone Cladding Grey', size: '300 × 600mm', badge: null, pattern: 'tile-pattern-6', tags: ['Frost Proof', 'Anti-Slip', 'UV Resistant'], desc: 'Durable stone-look exterior cladding tile. Tested to -20°C frost resistance.' },
        { name: 'Rustic Terracotta', size: '300 × 300mm', badge: 'Popular', pattern: 'tile-pattern-3', tags: ['Anti-Slip', 'Outdoor', 'Natural'], desc: 'Classic terracotta feel with modern durability for exterior walls and paths.' },
        { name: 'Lava Stone Black', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-5', tags: ['Volcanic', 'Anti-Slip', 'Bold'], desc: 'Bold lava stone texture for dramatic exterior feature walls.' },
        { name: 'Coastal Pebble Mix', size: '300 × 300mm', badge: 'New', pattern: 'tile-pattern-2', tags: ['Mosaic', 'Slip Resistant', 'Natural'], desc: 'Natural pebble mosaic sheet for garden walls and water features.' },
    ],
    'living-room': [
        { name: 'Calacatta Oro', size: '600 × 1200mm', badge: 'Luxury', pattern: 'tile-pattern-marble', tags: ['Marble Look', 'Polished', 'Large Format'], desc: 'Stunning Calacatta marble reproduction with gold veining. Floor-to-ceiling impact.' },
        { name: 'Concrete Pearl', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-6', tags: ['Concrete Look', 'Matt', 'Modern'], desc: 'Industrial-refined concrete aesthetic for contemporary living rooms.' },
        { name: 'Sahara Gold', size: '300 × 600mm', badge: 'Trending', pattern: 'tile-pattern-1', tags: ['Warm Tones', 'Satin', 'Feature Wall'], desc: 'Warm golden-ochre tones for statement feature walls.' },
        { name: 'Midnight Wood', size: '200 × 1000mm', badge: null, pattern: 'tile-pattern-wood', tags: ['Wood Look', 'Long Format', 'Matt'], desc: 'Long-format wood-look tile for vertical cladding and accent panels.' },
    ],
    bedroom: [
        { name: 'Powder Blush', size: '300 × 600mm', badge: null, pattern: 'tile-pattern-1', tags: ['Soft', 'Satin', 'Feature'], desc: 'Delicate blush-rose satin tile for headboard feature walls.' },
        { name: 'Dove Grey Linen', size: '300 × 600mm', badge: 'Calm', pattern: 'tile-pattern-2', tags: ['Subtle', 'Linen Texture', 'Matt'], desc: 'Soft linen-textured grey for understated, restful bedrooms.' },
        { name: 'Champagne Arabesque', size: '200 × 200mm', badge: 'New', pattern: 'tile-pattern-1', tags: ['Pattern', 'Arabesque', 'Feature'], desc: 'Arabesque-cut champagne tiles for decorative feature walls.' },
        { name: 'Warm Oak Plank', size: '150 × 600mm', badge: null, pattern: 'tile-pattern-wood', tags: ['Wood Look', 'Warm', 'Matt'], desc: 'Warm oak-effect planks bring natural warmth to bedroom walls.' },
    ],
    commercial: [
        { name: 'Corporate White', size: '600 × 1200mm', badge: 'Specification', pattern: 'tile-pattern-2', tags: ['Bulk Available', 'Rectified', 'Cleanroom'], desc: 'Large format white specification tile for corporate and retail environments.' },
        { name: 'Executive Stone', size: '800 × 800mm', badge: null, pattern: 'tile-pattern-6', tags: ['Heavy Duty', 'Stain Proof', 'Anti-Slip'], desc: 'High-wear stone-look commercial tile for lobbies and corridors.' },
        { name: 'Hospitality Marble', size: '600 × 600mm', badge: 'Hotel Grade', pattern: 'tile-pattern-marble', tags: ['Hotel', 'Luxury', 'Slip Resistant'], desc: 'Luxury marble-look tile widely used in 5-star hotel interiors.' },
        { name: 'Retail Terrazzo', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-terrazzo', tags: ['Terrazzo', 'Retail', 'Durable'], desc: 'Modern terrazzo patterns ideal for retail floors and feature walls.' },
    ],
};

const floorProducts = {
    bathroom: [
        { name: 'Slip Guard Marble', size: '300 × 300mm', badge: 'R9 Rated', pattern: 'tile-pattern-marble', tags: ['Anti-Slip', 'Wet Areas', 'Matt'], desc: 'Matte marble-look with R9 anti-slip rating for safe wet bathroom floors.' },
        { name: 'Pebble Mosaic', size: '300 × 300mm', badge: null, pattern: 'tile-pattern-2', tags: ['Mosaic', 'Grip', 'Natural'], desc: 'Natural pebble mosaic sheet, ideal for shower floors.' },
        { name: 'Hexagon White', size: '250mm hex', badge: 'Trending', pattern: 'tile-pattern-2', tags: ['Hexagon', 'Matt', 'Timeless'], desc: 'Classic white hexagon matte floor tile for retro and contemporary bathrooms.' },
        { name: 'Deep Slate Matt', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-6', tags: ['Slate Look', 'R10', 'Bold'], desc: 'R10-rated deep slate matt floor tile for stylish wet rooms.' },
    ],
    kitchen: [
        { name: 'Quartzite Stone', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-1', tags: ['Durable', 'Stain Proof', 'Natural'], desc: 'Hard-wearing quartzite-look floor tile for busy kitchens and dining areas.' },
        { name: 'Cement Pattern', size: '200 × 200mm', badge: 'Artisan', pattern: 'tile-pattern-terrazzo', tags: ['Pattern', 'Encaustic', 'Retro'], desc: 'Cement-effect encaustic pattern tiles for character kitchen floors.' },
        { name: 'Warm Travertine', size: '400 × 800mm', badge: 'Popular', pattern: 'tile-pattern-1', tags: ['Warm', 'Long Format', 'Matt'], desc: 'Warm travertine floor tile that bridges kitchen and living spaces.' },
        { name: 'Grigio Industrial', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-6', tags: ['Matt', 'Industrial', 'Practical'], desc: 'Neutral grey industrial tile for high-traffic kitchen floors.' },
    ],
    outdoor: [
        { name: 'Sandstone Anti-Slip', size: '600 × 600mm', badge: 'R11 Rated', pattern: 'tile-pattern-1', tags: ['R11', 'Outdoor', 'UV Stable'], desc: 'R11-rated sandstone-look outdoor floor tile. Frost-resistant and UV stable.' },
        { name: 'Granite Effect Black', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-6', tags: ['Granite', 'Bold', 'Pool Area'], desc: 'Dark granite-effect tile with textured surface for terraces and pool surrounds.' },
        { name: 'Natural Cotto', size: '300 × 300mm', badge: 'Classic', pattern: 'tile-pattern-3', tags: ['Cotto', 'Natural', 'Courtyard'], desc: 'Traditional cotto-style outdoor tile with natural earth tones.' },
        { name: 'Timber Deck Porcelain', size: '200 × 1000mm', badge: 'New', pattern: 'tile-pattern-wood', tags: ['Wood Look', 'Anti-Slip', 'Long Format'], desc: 'Wood-effect porcelain deck tile — the look of timber without the maintenance.' },
    ],
    'living-room': [
        { name: 'Polished Marble White', size: '800 × 800mm', badge: 'Luxury', pattern: 'tile-pattern-marble', tags: ['Polished', 'PVT', 'Reflective'], desc: 'Ultra-polished marble-white PVT for expansive, luminous living floors.' },
        { name: 'Herringbone Oak', size: '150 × 900mm', badge: 'Trending', pattern: 'tile-pattern-wood', tags: ['Herringbone', 'Wood Look', 'Warm'], desc: 'Long wood-look planks laid in herringbone for striking visual drama.' },
        { name: 'Venetian Terrazzo', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-terrazzo', tags: ['Terrazzo', 'Modern', 'Speckle'], desc: 'Contemporary Venetian terrazzo for sophisticated living room floors.' },
        { name: 'Nero Marquina', size: '600 × 1200mm', badge: 'Bold', pattern: 'tile-pattern-6', tags: ['Black Marble', 'GVT', 'Statement'], desc: 'Dramatic black marble with white veining for statement flooring.' },
    ],
    bedroom: [
        { name: 'Warm Beige Plank', size: '200 × 1200mm', badge: 'Cozy', pattern: 'tile-pattern-wood', tags: ['Wood Feel', 'Warm', 'Long Format'], desc: 'Soft warm beige wood-look plank tiles for comfortable bedroom floors.' },
        { name: 'Champagne Polish', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-1', tags: ['Champagne', 'Polished', 'Elegant'], desc: 'Light champagne polished tile that reflects morning light beautifully.' },
        { name: 'Dove Matt Linen', size: '300 × 600mm', badge: null, pattern: 'tile-pattern-2', tags: ['Linen', 'Soft', 'Matt'], desc: 'Understated linen-texture tile for a calm, restful bedroom atmosphere.' },
        { name: 'Pale Oak Herringbone', size: '75 × 300mm', badge: 'New', pattern: 'tile-pattern-wood', tags: ['Herringbone', 'Oak', 'Pattern'], desc: 'Pale oak herringbone tile floor — classic pattern in a modern format.' },
    ],
    commercial: [
        { name: 'Heavy Duty Granite', size: '600 × 600mm', badge: 'Class 5', pattern: 'tile-pattern-6', tags: ['Class 5', 'Heavy Traffic', 'Commercial'], desc: 'Class 5 PEI-rated tile engineered for the heaviest commercial foot traffic.' },
        { name: 'Anti-Slip Lobby Stone', size: '800 × 800mm', badge: 'Specification', pattern: 'tile-pattern-2', tags: ['R9', 'Lobby', 'Large Format'], desc: 'Premium large-format lobby stone for corporate reception and retail entrance.' },
        { name: 'Industrial Concrete', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-5', tags: ['Concrete', 'Warehouse', 'Tough'], desc: 'Rugged concrete-look tile for warehouses, gyms, and industrial floors.' },
        { name: 'Retail Wood Plank', size: '200 × 1200mm', badge: 'Trending', pattern: 'tile-pattern-wood', tags: ['Wood Look', 'Retail', 'Warm'], desc: 'Warm wood-look planks for retail stores, restaurants, and hospitality.' },
    ],
};

const specialProducts = {
    'germ-free': [
        { name: 'BioGuard Kitchen White', size: '300 × 600mm', badge: 'Anti-Viral', pattern: 'tile-pattern-2', tags: ['ISO 22196', '99.9% Kill Rate', 'FDA Compliant'], desc: 'Silver-ion glaze eliminates bacteria and viruses on contact. Certified to ISO 22196.' },
        { name: 'SaniShield Countertop', size: '600 × 600mm', badge: 'Certified', pattern: 'tile-pattern-marble', tags: ['Food Safe', 'Anti-Bacterial', 'Seamless'], desc: 'Hygienic countertop tile for food prep surfaces. Smooth, seamless, easy to disinfect.' },
        { name: 'HygieneGlaze ICU', size: '300 × 600mm', badge: 'Medical Grade', pattern: 'tile-pattern-2', tags: ['Hospital Grade', 'Anti-Fungal', 'Joint-Free'], desc: 'Medical-grade hygienic wall tile for ICUs, operating rooms, and clean rooms.' },
        { name: 'PureWall Glossy', size: '300 × 900mm', badge: null, pattern: 'tile-pattern-2', tags: ['Anti-Mould', 'Bright White', 'Long Format'], desc: 'Bright white anti-mould glossy tile for hospital corridors and patient rooms.' },
    ],
    tac: [
        { name: 'TAC Yellow Blister', size: '300 × 300mm', badge: 'Compliant', pattern: 'tile-pattern-1', tags: ['ISO 21542', 'Tactile', 'Non-Slip'], desc: 'Standard yellow blister-pattern tactile attention tile. ISO 21542 compliant.' },
        { name: 'TAC Grey Directional', size: '300 × 300mm', badge: null, pattern: 'tile-pattern-6', tags: ['Ribbed', 'Directional', 'Subtle'], desc: 'Grey ribbed directional tile for guidance paths in public spaces.' },
        { name: 'TAC Granite Blend', size: '300 × 300mm', badge: 'Architect Fav', pattern: 'tile-pattern-2', tags: ['Aesthetic', 'ADA', 'Transit'], desc: 'Granite-blend tactile tile that integrates aesthetically with premium public spaces.' },
        { name: 'TAC Safety Red', size: '300 × 300mm', badge: 'Warning', pattern: 'tile-pattern-5', tags: ['Warning Zone', 'Red', 'High Visibility'], desc: 'High-visibility red tactile tile for hazard warning zones near platforms and drops.' },
    ],
    'anti-static': [
        { name: 'ESD Control Grey', size: '600 × 600mm', badge: 'ESD Rated', pattern: 'tile-pattern-6', tags: ['<1MΩ', 'Data Center', 'Clean Room'], desc: 'Conductive tile meeting IEC 61340 ESD standards for data centers.' },
        { name: 'StaticSafe White', size: '600 × 600mm', badge: 'Certified', pattern: 'tile-pattern-2', tags: ['Clean Room', 'Anti-Static', 'Pharmaceutical'], desc: 'White anti-static tile for pharmaceutical clean rooms and sensitive labs.' },
        { name: 'ESD Industrial Black', size: '600 × 600mm', badge: null, pattern: 'tile-pattern-5', tags: ['Manufacturing', 'Heavy Duty', 'ESD'], desc: 'Durable black ESD tile for electronics manufacturing and assembly floors.' },
        { name: 'ConductaFloor Silver', size: '300 × 300mm', badge: 'New', pattern: 'tile-pattern-6', tags: ['Dissipative', 'Server Room', 'Anti-Static'], desc: 'Static-dissipative tile for server rooms, telecom centers, and IT suites.' },
    ],
    'cool-roof': [
        { name: 'SolarReflect White', size: '600 × 600mm', badge: 'SRI 104', pattern: 'tile-pattern-2', tags: ['Solar Reflective Index 104', 'Terrace', 'Reduces Heat'], desc: 'Ultra-white solar-reflective tile with SRI of 104. Reduces rooftop temperature by up to 30°C.' },
        { name: 'CoolTone Grey', size: '600 × 600mm', badge: 'Energy Rated', pattern: 'tile-pattern-6', tags: ['SRI 78', 'Courtyard', 'Durable'], desc: 'Mid-grey cool roof tile offering both aesthetics and energy performance for terraces.' },
        { name: 'ThermaClad Cream', size: '600 × 600mm', badge: 'Popular', pattern: 'tile-pattern-1', tags: ['Warm Tone', 'Cool Roof', 'Anti-Slip'], desc: 'Warm cream cool-roof tile that blends aesthetics with heat management.' },
        { name: 'ArcticShield Premium', size: '600 × 1200mm', badge: 'Flagship', pattern: 'tile-pattern-marble', tags: ['SRI 110', 'Large Format', 'Premium'], desc: 'Premium large-format cool roof tile with highest SRI rating in our range.' },
    ],
};

/* ─────────────────────────────────────────
   COMPARISON STATE
───────────────────────────────────────── */
let compareList = [];

/* ─────────────────────────────────────────
   ROUTING: Page Management
───────────────────────────────────────── */
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    // Show target
    const target = document.getElementById('page-' + pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Update nav active state
    document.querySelectorAll('.nav-link[data-page]').forEach(l => {
        l.classList.toggle('active', l.dataset.page === pageId);
    });
    // Show/hide footer
    const footer = document.getElementById('site-footer');
    footer.style.display = 'block';
    // Move footer inside active page if needed — simpler: always show at bottom of body
    // Initialize page content
    if (pageId === 'wall-tiles') renderProducts('wall', 'bathroom');
    if (pageId === 'floor-tiles') renderProducts('floor', 'bathroom');
    if (pageId === 'special-tiles') renderSpecialProducts('germ-free');
    // Observe fade-in
    setTimeout(() => observeFadeIn(), 100);
}

function showSubPage(pageId, subId) {
    showPage(pageId);
    setTimeout(() => {
        if (pageId === 'wall-tiles') {
            renderProducts('wall', subId);
            activateTab('wall', subId);
        } else if (pageId === 'floor-tiles') {
            renderProducts('floor', subId);
            activateTab('floor', subId);
        } else if (pageId === 'special-tiles') {
            renderSpecialProducts(subId);
            activateTab('special', subId);
        }
    }, 50);
}

function activateTab(type, subId) {
    const map = {
        wall: { container: 'wall-tabs', tabLabel: ['bathroom', 'kitchen', 'outdoor', 'living-room', 'bedroom', 'commercial'] },
        floor: { container: 'floor-tabs', tabLabel: ['bathroom', 'kitchen', 'outdoor', 'living-room', 'bedroom', 'commercial'] },
        special: { container: 'special-tabs', tabLabel: ['germ-free', 'tac', 'anti-static', 'cool-roof'] },
    };
    const cfg = map[type];
    const tabs = document.querySelectorAll(`#${cfg.container} .sub-tab`);
    const idx = cfg.tabLabel.indexOf(subId);
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

/* ─────────────────────────────────────────
   PRODUCT RENDERING
───────────────────────────────────────── */
// Renders product grid for wall or floor tiles
// @param type {string} - 'wall' or 'floor'
// @param subId {string} - Category subcategory (bathroom, kitchen, etc)
function renderProducts(type, subId) {
    const data = type === 'wall' ? wallProducts : floorProducts;
    const products = data[subId] || [];
    const gridId = type + '-products-grid';
    const titleId = type + '-section-title';
    const subTitleId = type + '-section-sub';
    const labelMap = {
        bathroom: 'Bathroom', kitchen: 'Kitchen', outdoor: 'Outdoor', 'living-room': 'Living Room', bedroom: 'Bedroom', commercial: 'Commercial Spaces'
    };
    const subTitleMap = {
        wall: { bathroom: 'Moisture-resistant luxury', kitchen: 'Splashbacks & feature walls', outdoor: 'Weather-proof & durable', 'living-room': 'Statement walls & accents', bedroom: 'Calm & elegant surfaces', commercial: 'Specification-grade tiles' },
        floor: { bathroom: 'Safe, beautiful wet-area floors', kitchen: 'Durable, stylish kitchen floors', outdoor: 'All-weather outdoor flooring', 'living-room': 'Expansive, luminous floors', bedroom: 'Comfortable, warm underfoot', commercial: 'Heavy-duty performance tiles' },
    };
    const label = labelMap[subId] + ' ' + (type === 'wall' ? 'Wall Tiles' : 'Floor Tiles');
    document.getElementById(titleId).textContent = label;
    document.getElementById(subTitleId).innerHTML = subTitleMap[type][subId] + ' <em>— explore the range</em>';
    const grid = document.getElementById(gridId);
    grid.innerHTML = products.map((p, i) => productCardHTML(p, i)).join('');
}

function renderSpecialProducts(subId) {
    const products = specialProducts[subId] || [];
    const descMap = {
        'germ-free': 'Anti-bacterial and anti-viral tiles featuring proprietary ionic silver glaze. Certified to ISO 22196 and FDA-compliant for food service and healthcare environments.',
        tac: 'Tactile attention coridor (TAC) tiles engineered to international accessibility standards. Provide essential tactile guidance for visually impaired users in public spaces.',
        'anti-static': 'Electrostatic discharge (ESD) control tiles for sensitive environments. Compliant with IEC 61340 standard for data centers, clean rooms, and manufacturing facilities.',
        'cool-roof': 'Solar-reflective tiles for terraces, balconies, and rooftops. Our Cool Roof range reflects up to 80% of solar radiation, reducing surface temperatures by up to 30°C.',
    };
    const titleMap = {
        'germ-free': 'Germ Free Tiles', tac: 'TAC Tiles', 'anti-static': 'Anti-Static Tiles', 'cool-roof': 'Cool Roof Tiles'
    };
    const subTitleMap = {
        'germ-free': 'Clinically tested <em>anti-microbial</em> surfaces', tac: 'Tactile tiles for <em>inclusive</em> design', 'anti-static': 'ESD-control tiles for <em>sensitive environments</em>', 'cool-roof': 'Heat-reflective tiles for <em>cooler spaces</em>'
    };
    document.getElementById('special-section-title').textContent = titleMap[subId];
    document.getElementById('special-section-sub').innerHTML = subTitleMap[subId];
    document.getElementById('special-desc').textContent = descMap[subId];
    const grid = document.getElementById('special-products-grid');
    grid.innerHTML = products.map((p, i) => productCardHTML(p, i)).join('');
}

// Generates HTML for a single product card
// SECURITY: All product data is escaped to prevent XSS injection
// @param p {object} - Product object with name, size, tags, etc
// @param i {number} - Product index in grid
// @returns {string} - HTML string for product card
function productCardHTML(p, i) {
    const inList = compareList.find(c => c.name === p.name);
    const checked = inList ? 'checked' : '';
    const checkedClass = inList ? ' checked' : '';
    const escapedName = escapeHTML(p.name);
    const escapedSize = escapeHTML(p.size);
    const escapedDesc = escapeHTML(p.desc);
    const escapedTags = p.tags.map(t => escapeHTML(t));

    return `
  <div class="product-card" data-name="${escapedName}">
    <div class="product-img">
      <div class="product-img-bg ${p.pattern}"></div>
      ${p.badge ? `<div class="product-badge">${escapeHTML(p.badge)}</div>` : ''}
      <div class="compare-check${checkedClass}" onclick="toggleCompare(this, '${escapedName.replace(/'/g, "\\'")}', '${escapedSize.replace(/'/g, "\\'")}', '${escapedTags.join(',')}', '${escapedDesc.replace(/'/g, "\\'")}')" title="Compare">✓</div>
    </div>
    <div class="product-info">
      <div class="product-name">${escapedName}</div>
      <div class="product-size">${escapedSize}</div>
      <div class="product-features">
        ${escapedTags.map(t => `<span class="feat-tag">${t}</span>`).join('')}
      </div>
      <div style="font-size:0.78rem;color:var(--c-text-muted);margin-bottom:18px;line-height:1.6">${escapedDesc}</div>
      <div class="product-actions">
        <a class="btn-sm btn-sm-gold" onclick="downloadDoc('${escapedName.replace(/'/g, "\\'")}')" >Spec Sheet ↓</a>
        <a class="btn-sm" onclick="showToast('Sample request sent for: ${escapedName}', 'success')">Request Sample</a>
      </div>
    </div>
  </div>`;
}

/* ─────────────────────────────────────────
   SUB-TAB SWITCHING
───────────────────────────────────────── */
function switchSubTab(type, subId, el) {
    const containers = { wall: '#wall-tabs', floor: '#floor-tabs', special: '#special-tabs' };
    document.querySelectorAll(containers[type] + ' .sub-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    if (type === 'wall') renderProducts('wall', subId);
    else if (type === 'floor') renderProducts('floor', subId);
    else if (type === 'special') renderSpecialProducts(subId);
    window.scrollTo({ top: document.querySelector('.products-section')?.offsetTop - 80 || 300, behavior: 'smooth' });
}

/* ─────────────────────────────────────────
   COMPARISON SYSTEM

   Allows users to compare up to 3 products side-by-side in a modal
   Features:
   • Dynamic comparison bar at bottom showing selected products
   • Feature-rich table with column highlighting
   • Full product descriptions and specifications
───────────────────────────────────────── */
// Toggle product in comparison list (max 3 products)
// @param el {HTMLElement} - Checkbox element being toggled
// @param name {string} - Product name (escaped)
// @param size {string} - Product size (escaped)
// @param tagsStr {string} - Comma-separated tags
// @param desc {string} - Product description (escaped)
function toggleCompare(el, name, size, tagsStr, desc) {
    const idx = compareList.findIndex(c => c.name === name);
    if (idx > -1) {
        compareList.splice(idx, 1);
        el.classList.remove('checked');
    } else {
        if (compareList.length >= 3) {
            showToast('You can compare up to 3 products at a time. Remove one first.', 'warning');
            return;
        }
        compareList.push({ name, size, tags: tagsStr.split(','), desc });
        el.classList.add('checked');
    }
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    const btn = document.getElementById('compare-btn');
    if (compareList.length === 0) {
        bar.classList.remove('visible');
        return;
    }
    bar.classList.add('visible');
    for (let i = 1; i <= 3; i++) {
        const slot = document.getElementById('slot-' + i);
        if (compareList[i - 1]) {
            slot.textContent = compareList[i - 1].name;
            slot.classList.add('filled');
        } else {
            slot.textContent = '— Select product —';
            slot.classList.remove('filled');
        }
    }
    if (compareList.length >= 2) {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    } else {
        btn.style.opacity = '0.4';
        btn.style.pointerEvents = 'none';
    }
}

function clearComparison() {
    compareList = [];
    document.querySelectorAll('.compare-check.checked').forEach(el => el.classList.remove('checked'));
    document.getElementById('compare-bar').classList.remove('visible');
}

function openComparison() {
    if (compareList.length < 2) return;
    const allTags = [...new Set(compareList.flatMap(p => p.tags))];
    let html = `
  <table class="compare-table">
    <thead>
      <tr>
        <th style="width:160px">Feature</th>
        ${compareList.map(p => `<th>${p.name}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="compare-feature-label">Size</td>
        ${compareList.map(p => `<td>${p.size}</td>`).join('')}
      </tr>
      ${allTags.map(tag => `
      <tr>
        <td class="compare-feature-label">${tag}</td>
        ${compareList.map(p => `<td>${p.tags.includes(tag) ? '<span style="color:var(--c-gold)">✓</span>' : '—'}</td>`).join('')}
      </tr>`).join('')}
      <tr>
        <td class="compare-feature-label">Description</td>
        ${compareList.map(p => `<td style="font-size:0.78rem">${p.desc}</td>`).join('')}
      </tr>
    </tbody>
  </table>`;
    document.getElementById('compare-table-container').innerHTML = html;
    document.getElementById('compareModal').classList.add('open');
    document.body.classList.add('no-scroll');
}

function closeComparison() {
    document.getElementById('compareModal').classList.remove('open');
    document.body.classList.remove('no-scroll');
}

/* ─────────────────────────────────────────
   HERO SLIDESHOW

   Auto-rotating hero carousel with manual dot navigation
   • Cycles through 3 product category slides every 5 seconds
   • Smooth CSS transitions for professional UX
───────────────────────────────────────── */
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

// Navigate to specific slide
// @param n {number} - Slide index to display
function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
}, 5000);

/* ─────────────────────────────────────────
   TILE CALCULATOR

   Interactive tool for calculating tile requirements
   • Accepts room dimensions and tile specifications
   • Accounts for waste factors (5%, 10%, 15%, 20%)
   • Supports floor, single wall, and all-walls calculations
   • Returns: tiles needed, total area, estimated boxes
───────────────────────────────────────── */
// Calculate tiles required for a project
// Validates input, calculates area, applies waste factor, returns results
function calculateTiles() {
    const length = parseFloat(document.getElementById('roomLength').value) || 0;
    const width = parseFloat(document.getElementById('roomWidth').value) || 0;
    const tileL = parseInt(document.getElementById('tileLength').value) / 1000;
    const tileW = parseInt(document.getElementById('tileWidth').value) / 1000;
    const waste = parseInt(document.getElementById('wastePercent').value) / 100;
    const areaType = document.getElementById('areaType').value;

    if (!length || !width) {
        showToast('Please enter room dimensions.', 'warning');
        return;
    }

    let area = length * width;
    if (areaType === 'all-walls') {
        // Perimeter × height (use width as height for all-walls)
        area = 2 * (length + width) * width;
    }

    const tileArea = tileL * tileW;
    const tilesBase = Math.ceil(area / tileArea);
    const tilesWithWaste = Math.ceil(tilesBase * (1 + waste));
    const boxes = Math.ceil(tilesWithWaste / 4);

    document.getElementById('tilesNeeded').textContent = tilesWithWaste;
    document.getElementById('areaCalc').textContent = area.toFixed(2) + ' m²';
    document.getElementById('boxesNeeded').textContent = boxes;
    document.getElementById('calcResult').classList.add('visible');
    showToast('Calculation complete! Check results below.', 'success');
}

/* ─────────────────────────────────────────
   CATALOGUE DOWNLOAD (simulated)
───────────────────────────────────────── */
function downloadCatalogue(type) {
    const names = { gvt: 'Glazed Vitrified Tiles', ceramic: 'Ceramic Tiles', pvt: 'Polished Vitrified Tiles', special: 'Special Technology Tiles' };
    // In a real deployment this would trigger an actual PDF download
    showToast(`Preparing download: Terra Luxe — ${names[type]} Catalogue 2025`, 'success');
}

/* ─────────────────────────────────────────
   SPEC SHEET DOWNLOAD (simulated)
───────────────────────────────────────── */
function downloadDoc(productName) {
    showToast(`Preparing specification sheet for: ${productName}`, 'success');
}

/* ─────────────────────────────────────────
   CONTACT FORM

   Form submission with comprehensive validation:
   • Email format validation (regex pattern)
   • Message minimum length (10 characters)
   • Required field checking
   • Success feedback via toast notification
───────────────────────────────────────── */
// Submit contact form with validation
// Validates email format, message length, and required fields
// Shows success toast and clears form on valid submission
function submitForm() {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const phone = document.getElementById('cphone').value.trim();
    const message = document.getElementById('cmessage').value.trim();

    // Validation
    if (!email || !message) {
        showToast('Please fill in at least your email and message.', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    if (message.length < 10) {
        showToast('Message must be at least 10 characters long.', 'warning');
        return;
    }

    // Success
    document.getElementById('formSuccess').classList.add('visible');
    ['fname', 'lname', 'cemail', 'cphone', 'cmessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    showToast('Thank you! Your message has been sent. We\'ll be in touch soon.', 'success');
    setTimeout(() => document.getElementById('formSuccess').classList.remove('visible'), 6000);
}

/* ─────────────────────────────────────────
   GEOLOCATION & MAP

   Uses HTML5 Geolocation API to:
   • Calculate distance from user to company showroom
   • Display Haversine distance formula calculation
   • Provide integrated contact experience
───────────────────────────────────────── */
// Request user's geolocation and calculate distance to showroom
// Displays distance in toast notification and scrolls to map
function showCompanyLocation() {
    // Check if geolocation API is available
    if (navigator.geolocation) {
        showToast('Getting your location...', 'info');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Company location: Karachi, Pakistan (example coordinates)
                const companyLat = 24.8607343;
                const companyLng = 66.9970361;

                // Calculate distance using Haversine formula
                const distance = calculateDistance(userLat, userLng, companyLat, companyLng);
                showToast(`You are approximately ${distance.toFixed(1)} km from our showroom!`, 'success');

                // Scroll to map
                document.querySelector('.map-embed')?.scrollIntoView({ behavior: 'smooth' });
            },
            function(error) {
                showToast('Please enable location access to calculate distance to our showroom.', 'warning');
            }
        );
    } else {
        showToast('Geolocation not supported by your browser.', 'error');
    }
}

// Haversine formula to calculate great-circle distance between two geographic points
// Used for calculating distance from user location to company showroom
// @param lat1, lon1 {number} - User's latitude and longitude
// @param lat2, lon2 {number} - Company's latitude and longitude
// @returns {number} - Distance in kilometers
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toggleMobile() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}
function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
}

/* ─────────────────────────────────────────
   NAVBAR SCROLL
───────────────────────────────────────── */
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

/* ─────────────────────────────────────────
   FADE-IN OBSERVER
───────────────────────────────────────── */
function observeFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        els.forEach(el => obs.observe(el));
    } else {
        els.forEach(el => el.classList.add('visible'));
    }
}

/* ─────────────────────────────────────────
   FOOTER: append to each page
───────────────────────────────────────── */
// Move footer inside currently active page on page change
function attachFooter(pageId) {
    const footer = document.getElementById('site-footer');
    const page = document.getElementById('page-' + pageId);
    if (page) {
        footer.style.display = 'block';
        page.appendChild(footer);
    }
}

/* Override showPage to also attach footer */
const _showPage = showPage;
window.showPage = function (pageId) {
    _showPage(pageId);
    attachFooter(pageId);
};

/* ─────────────────────────────────────────
   INITIALIZATION & EVENT LISTENERS

   DOMContentLoaded triggers:
   • Fade-in animation observer for all fade-in elements
   • Footer attachment to pages
   • Modal overlay click handlers
   • Keyboard navigation (Escape key to close modals)

   Also sets up:
   • Navbar scroll listener for shadow effect
   • Hero slideshow auto-rotation (5s interval)
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    observeFadeIn();
    attachFooter('home');

    // Close modal on overlay click
    const compareModal = document.getElementById('compareModal');
    compareModal.addEventListener('click', function (e) {
        if (e.target === this) closeComparison();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && compareModal.classList.contains('open')) {
            closeComparison();
        }
    });
});
