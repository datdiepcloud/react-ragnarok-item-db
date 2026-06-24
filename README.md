# RO Item Database

A frontend lookup tool for **Ragnarok Online (PC Classic / MuhRO)** — search items, browse crafting recipes, find drop locations, and explore instance rewards.

Built with **React 19 + Vite + TypeScript**.

---

## Features

- **Item search** — search by name or ID with a live dropdown
- **Item detail** — shows type, description, icon, crafting recipe, obtain sources, and which instances drop the item
- **Recipe drill-down** — click any ingredient to navigate to its own detail card; use Back to return
- **Sidebar filters** by item type:
  - Weapon / Armor (with **Episode** tab bar)
  - Shadow Equip (with inline search)
  - Costume
  - Etc. (with sub-filters: Tame / Juice / Potion / Dye Ingredients, plus inline search)
- **Instances tab** — lists all 49 instances with EP filter and name search; click to see droppable items
- **Instance → Item** and **Item → Instance** cross-navigation
- **Light / Dark theme** toggle (persisted in localStorage)
- **Breadcrumb** navigation reflecting current filter path
- Local icon cache (`public/icons/`) with divine-pride CDN fallback

---

## Data

| Source | Count |
|---|---|
| Items in database | 452 |
| Instances | 49 |

Item data scraped from [wiki.muhro.eu](https://wiki.muhro.eu) and [divine-pride.net](https://www.divine-pride.net).  
Shadow Gear scraped from [wiki.muhro.eu/Shadow_Gear](https://wiki.muhro.eu/Shadow_Gear).  
Etc. ingredients scraped from Tame / Juice / Potion / Dye Ingredients pages.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Scripts

### Download item icons

```bash
node scripts/download-icons.mjs --ids 512,909,1010
```

Downloads icons from the divine-pride CDN to `public/icons/`. Use `--force` to re-download existing files.

### Scrape item data from divine-pride

```bash
node scripts/scrape.mjs --ids 512,909 --key YOUR_API_KEY
```

Fetches item data from the [divine-pride API](https://www.divine-pride.net/api/database/Item) and merges it into `src/data/items.json`.

### Update item names from wiki

```bash
node scripts/update-item-names.mjs
```

Applies the collected name mappings to replace placeholder item names in `src/data/items.json`.

### Add Etc. category items

```bash
node scripts/add-etc-items.mjs
```

Adds Tame / Juice / Potion / Dye ingredient items from the wiki and tags them with the appropriate category.

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Left nav: type filters + Etc. sub-filters + Instances
│   ├── SearchBar.tsx        # Live search dropdown
│   ├── ItemList.tsx         # Grid of item cards
│   ├── ItemCard.tsx         # Item detail: recipe, obtain sources, instance drops
│   ├── RecipeTree.tsx       # Craftable ingredient list with click-through
│   ├── ObtainSection.tsx    # Monster drops / NPC shops / quests
│   ├── EpisodeBar.tsx       # EP filter tabs (reused for instances search bar)
│   ├── InstanceList.tsx     # Instance grid with EP + name filter
│   ├── InstanceDetail.tsx   # Instance detail with droppable items list
│   └── Breadcrumb.tsx       # Path navigation
├── data/
│   ├── items.json           # 452 items
│   └── instances.json       # 49 instances
├── types/
│   └── index.ts             # TypeScript interfaces
├── utils.ts                 # Icon URL helpers
└── App.tsx                  # Root state + routing logic

scripts/
├── scrape.mjs               # divine-pride API scraper
├── download-icons.mjs       # Icon downloader
├── update-item-names.mjs    # Name patch from wiki data
└── add-etc-items.mjs        # Etc. ingredient importer

public/
└── icons/                   # Local icon cache (PNG per item ID)
```

---

## Tech Stack

- [React 19](https://react.dev) + [Vite](https://vitejs.dev) + TypeScript
- CSS Modules with CSS custom properties for theming
- No UI library dependencies
