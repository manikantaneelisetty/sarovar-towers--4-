# Aparna Sarovar Towers — Luxury Residential Web Application

An interactive web portal for **Aparna Sarovar Towers**, an ultra-luxury residential community located in Nallagandla, Hyderabad. The application features interactive 3D tower exploration, floor plan navigators, apartment unit comparisons, specifications showcase, neighborhood directory maps, gallery visual journeys, and contact enquiry workflows.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Animations & Gestures**: Framer Motion 12
- **Icons**: Lucide React + React Icons (HiArrow)
- **Styling**: Vanilla CSS Variables design system + Glassmorphism (`src/styles/global.css`)
- **Testing**: Vitest + React Testing Library + JSDOM (`@testing-library/jest-dom`)
- **Linting**: Oxlint

---

## 📂 Project Structure

```text
sarovar-towers/
├── public/                 # Static assets served at root
│   ├── fonts/              # Olivera Demo & web fonts
│   ├── images/             # Tower layouts, floor plans, gallery, 3D flat renders
│   └── Ap-logo.png         # Aparna Sarovar Towers branding logos
├── src/
│   ├── assets/             # Bundled visual assets
│   ├── components/
│   │   └── FlatCompareModal.jsx # Multi-unit comparison modal (up to 3 flats)
│   ├── context/
│   │   └── CompareContext.jsx   # Global comparison state & localStorage persistence
│   ├── layouts/
│   │   ├── Navbar.jsx      # Fixed top navigation with dynamic themes & compare badge
│   │   └── Footer.jsx      # Global footer with quick links, contacts & copyright
│   ├── pages/
│   │   ├── Home.jsx        # Interactive 3D campus & tower selection map
│   │   ├── TowerView.jsx   # Tower floor directory & floor-by-floor selector
│   │   ├── FloorView.jsx   # Floor layout viewer with interactive SVG unit hotspots
│   │   ├── FlatDetails.jsx # 3D apartment unit view, specifications drawer & floor plans
│   │   ├── LocationMap.jsx # Google Map embed & neighborhood amenity directory
│   │   ├── Gallery.jsx     # Filterable photography and video walkthrough gallery
│   │   ├── Specifications.jsx # 8 categories of architectural & engineering specs
│   │   └── Contact.jsx     # Lead generation form, WhatsApp/Call buttons & office locations
│   ├── services/
│   │   ├── flatData.js     # Block naming, tower specs, 50-floor metadata & SVG hotspots
│   │   └── towerData.js    # Floor polygon path coordinates for towers 1, 2, and 3
│   ├── styles/
│   │   └── global.css      # Single source of truth: CSS variables, themes & utilities
│   ├── test/
│   │   ├── setup.js        # Vitest setup: DOM matchers & Framer Motion observer mocks
│   │   ├── testUtils.jsx   # Provider wrappers for component tests
│   │   ├── flatData.test.js
│   │   ├── CompareContext.test.jsx
│   │   ├── Navbar.test.jsx
│   │   ├── Footer.test.jsx
│   │   ├── FlatCompareModal.test.jsx
│   │   ├── Specifications.test.jsx
│   │   ├── LocationMap.test.jsx
│   │   ├── Gallery.test.jsx
│   │   └── Contact.test.jsx
│   ├── App.jsx             # Route definitions, conditional Footer & Enquire FAB
│   └── main.jsx            # React root mount
├── package.json            # Scripts, dependencies & project configuration
├── vite.config.js          # Vite & Vitest test runner configuration
└── README.md               # Project documentation
```

---

## 🧹 Codebase Cleanup & Refactoring Details

The codebase underwent a complete audit and cleanup:

### 1. Deleted Unused Files & Assets
- **Redundant backup & template files**: `src/pages/Gallery.jsx.bak`, `src/index.css`.
- **Unused starter assets**: `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`.
- **Duplicate root images**: Cleaned `Tower 1.jpg`, `Tower 3.jpg`, `Tower-2.jpg`, `Tower-22.jpg`, `sarovar-towers-bg.jpg`, `Ap-logo.png` (verified and served directly from `public/`).
- **Temporary archives & scripts**: Cleaned `temp_zip/`, `olivera.zip`, `patch.js`, `script.js`, `restore_and_fix.mjs`, `revert.js`, `revert.mjs`, `shift.mjs`, `update_border.cjs`, `dist_build_temp/`, and `dist_tmp/`.
- **Unused dependencies**: Uninstalled unused `reacticons` package.

### 2. Code Quality & Bug Fixes
- **`src/App.jsx`**:
  - Integrated `Footer` on scrollable content pages (`/gallery`, `/specifications`, `/contact`).
  - Added catch-all route `<Route path="*" element={<Navigate to="/" replace />} />` to gracefully redirect 404s to the home page.
- **`src/layouts/Footer.jsx`**:
  - Updated contact details (`+91 91606 66534`, `info@sarovar.com`) to match Aparna Sarovar Towers.
- **`src/pages/Home.jsx`**:
  - Removed unused imports (`useEffect`, `Compass`).
  - Fixed invalid CSS property `textcolor` in instructions overlay.
  - Removed commented-out layout block in the tooltip.
- **`src/pages/TowerView.jsx`**:
  - Removed unused variables and state (`towerIds`, `isSliderPaused`, `blockName`, `getBlockName`).
  - Fixed duplicate `bottom` CSS property in the Tower Switcher.
  - Removed commented-out CSS styles and fixed `textcolor`.
- **`src/pages/FloorView.jsx`**:
  - Removed unused `isDetailsVisible` state.
  - Updated catch statement to modern optional catch binding (`catch { ... }`).
  - Connected `previewFlatArea` to the floor overview details panel for accurate per-flat square footage.
  - Cleaned up commented-out `boxShadow` lines and removed trailing blank lines.
- **`src/pages/FlatDetails.jsx`**:
  - Removed unused imports (`ChevronLeft`, `ChevronRight`, `MapPin`).
  - Removed unused `isImageHovered` state.
  - Fixed missing `border: 'none'` on the specifications toggle button.
- **`src/pages/LocationMap.jsx`**:
  - Removed unused `Footer` and `Eye` imports.
  - Removed redundant empty `<>...</>` fragment wrapper.
- **`src/pages/Specifications.jsx`**:
  - Removed unused `index` prop from `LayoutD`.
- **`src/pages/Contact.jsx`**:
  - Disentangled conflicting `padding` shorthand and longhand properties (`padding` vs `paddingLeft`/`paddingRight`) on `FloatField` and dial-code dropdown to eliminate React dev warnings.
- **`src/components/FlatCompareModal.jsx`**:
  - Removed unused `AnimatePresence` import.
  - Added accessible `aria-label` and `title` attributes to modal close and remove buttons.
- **`src/styles/global.css`**:
  - Defined the missing `.scrollbar-styled` utility class to ensure sleek, customized scrollbars across directory drawers and specification panels in `FlatDetails`, `FloorView`, `LocationMap`, and `TowerView`.

---

## 🧪 Testing Suite (Vitest + React Testing Library)

Vitest is configured with JSDOM and Testing Library. All 9 test suites pass:

```bash
npm test
```

### Test Coverage Breakdown (59 Tests Across 11 Suites)

| Test File | Tests | Features Tested |
| :--- | :---: | :--- |
| `src/test/flatData.test.js` | **17** | `getBlockName()`, tower 1-3 facing specs, 50-floor metadata, floor plans & layout cycling |
| `src/test/CompareContext.test.jsx` | **6** | Initialization, adding flat, duplicate rejection, 3-flat limit, item removal, clear all |
| `src/test/Footer.test.jsx` | **6** | Brand logo, description, quick links, contact info, dynamic copyright year, navigation links |
| `src/test/Navbar.test.jsx` | **3** | Logo rendering, navigation links (`Home`, `Location Map`, `Gallery`, `Specifications`, `Contact`), conditional compare badge |
| `src/test/FlatCompareModal.test.jsx` | **5** | Closed/open rendering, apartment card details, clear all, close button, individual flat removal |
| `src/test/FloorView.test.jsx` | **3** | Floor canvas rendering, tower/floor header, SVG hotspots, floor details toggle & close, jump-to-floor drawer |
| `src/test/FlatDetails.test.jsx` | **4** | Flat rendering, 3D plan, 2D zoomable floor plan modal, room specifications drawer, pricing quote form |
| `src/test/Specifications.test.jsx` | **3** | Header/subheading, all 8 luxury specification categories, technical content details |
| `src/test/LocationMap.test.jsx` | **4** | Google Map iframe, neighborhood directory, category tab filtering, expand/minimize toggle |
| `src/test/Gallery.test.jsx` | **3** | Header, filter categories (`All`, `Exterior`, `Interiors`, `Progress`, `Amenities`, `Videos`), item cards, category switching |
| `src/test/Contact.test.jsx` | **5** | Header, phone/email/website details, intent chips, 10-digit mobile validation, form submit & confirmation |

---

## 🚀 Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with hot module replacement (HMR). |
| `npm test` | Runs the full Vitest test suite once. |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD. |
| `npm run lint` | Runs Oxlint to check code quality and unused symbols. |
| `npm run build` | Builds the production bundle in `dist/`. |
| `npm run preview` | Previews the production build locally. |

---

## 🛠️ Troubleshooting & Common Questions

### 1. PowerShell: `npm.ps1 cannot be loaded because running scripts is disabled on this system`
* **Cause**: On Windows, PowerShell by default restricts running `.ps1` scripts for security.
* **Fix**:
  - Run with execution policy bypass in PowerShell:
    ```powershell
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    npm run dev
    ```
  - Or explicitly invoke the CMD script:
    ```powershell
    npm.cmd run dev
    # or
    npm.cmd test
    ```
  - Or switch your VS Code default terminal to **Command Prompt** (`cmd.exe`).

### 2. Browser shows blank white screen or `Uncaught SyntaxError: Unexpected token '<'`
* **Cause**: Trying to open the project with VS Code's **Live Server** (port 5500/5501). Live Server does not compile React/JSX or resolve npm packages.
* **Fix**: Always start the dev server via `npm run dev` and navigate to `http://localhost:5173`.

### 3. "Port 5173 is in use, trying another one..."
* **Cause**: A previous Vite or Node process is still running in the background.
* **Fix**: Check the URL printed in the terminal (e.g., `http://localhost:5174/`) or terminate existing node processes:
  ```powershell
  taskkill /F /IM node.exe
  npm run dev
  ```

