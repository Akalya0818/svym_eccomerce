# Celestia Boutique - Premium Dress Storefront

An elegant, high-fashion single-page e-commerce storefront specializing in designer dresses. The boutique utilizes a "constellation" themed wishlist feature, allowing users to save dresses as stars in space. This application is deployable as a static site to GitHub Pages with zero configuration, running directly from `index.html` using plain HTML, vanilla CSS, and vanilla JS.

## Architecture and Design Decisions

### Product Catalog Pivot: Designer Dresses
The product catalog is composed of 24 premium dress designs distributed across 5 celestial-inspired fashion categories:
- **Celestial Gowns**: High-end evening gowns and gala wear.
- **Nebula Casuals**: Daywear sundresses and linen fabrics.
- **Supernova Party**: Cocktail dresses and sequin outfits.
- **Astral Bridal**: Luxury wedding gowns and bridal wear.
- **Orbit Silhouette**: Mid-cut wrap dresses and silk slip dresses.

### Multi-View SPA Tab Router
To support a real-life retail experience, the header navigation features functional tabs that render dynamically in a zero-config SPA environment:
1. **Shop**: The main grid showcase supporting search inputs, category dropdown filtering, tag pills, and 3D hover spotlight spotlights.
2. **Categories**: A visual portal of dress collections. Clicking any category card filters the products catalog and redirects the user back to the Shop.
3. **Deals**: Offers copyable discount codes (e.g. `GOWN20`, `BRIDAL50`) with clipboard copy feedback, and features a countdown timer tracking a daily flash offer dress.
4. **Support**: Sleek interactive accordion FAQ sheets and a customer contact transmitter form.

### Constellation Wishlist Core
Named wishlist clusters are saved in `localStorage`. The canvas drawer displays stars orbiting a central "Gravitational Core" with repulsion physics to prevent overlaps. 
- High-priority items are drawn as pulsating giants with white highlights.
- Medium-priority items glow in the list's selected color accent theme.
- Low-priority items render as faint star circles.
- Heart button clicks generate star sparkle particle bursts on the coordinate screen.

## How to Run

1. Open `index.html` directly in any web browser.
2. Navigate between Shop, Categories, Deals, and Support.
3. Interact with product cards, customize notes, and watch your constellation stars float!
