import { useState, useEffect, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import ItemCard from './components/ItemCard';
import Sidebar, { ITEM_TYPES, ETC_CATEGORIES } from './components/Sidebar';
import type { ItemTypeFilter, SidebarMode, EtcCategory } from './components/Sidebar';
import ItemList from './components/ItemList';
import InstanceList from './components/InstanceList';
import InstanceDetail from './components/InstanceDetail';
import EpisodeBar from './components/EpisodeBar';
import Breadcrumb from './components/Breadcrumb';
import type { ItemDB, Instance } from './types';
import rawData from './data/items.json';
import rawInstances from './data/instances.json';
import styles from './App.module.css';

const itemDB = rawData as unknown as ItemDB;
const allItems = Object.values(itemDB);
const allInstances = rawInstances as Instance[];

const EP_FILTER_TYPES: ItemTypeFilter[] = ['Weapon', 'Armor'];

function getInitialTheme(): 'dark' | 'light' {
  const saved = localStorage.getItem('ro-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function matchesFilter(itemType: string, filter: ItemTypeFilter): boolean {
  if (!filter) return true;
  if (filter === 'Etc') return itemType === 'Etc' || itemType === 'Consumable';
  return itemType.toLowerCase().includes(filter.toLowerCase());
}

function deriveFilters(item: { type: string; episode?: number }): { type: ItemTypeFilter; ep: number | null } {
  const matched = ITEM_TYPES.find(t => {
    if (t.key === 'Etc') return item.type === 'Etc' || item.type === 'Consumable';
    return item.type.toLowerCase().includes(t.key.toLowerCase());
  });
  const type = matched ? matched.key : null;
  const ep = (type && EP_FILTER_TYPES.includes(type) && item.episode != null) ? item.episode : null;
  return { type, ep };
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);
  const [mode, setMode] = useState<SidebarMode>('items');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [typeFilter, setTypeFilter] = useState<ItemTypeFilter>(null);
  const [epFilter, setEpFilter] = useState<number | null>(null);
  const [etcCategory, setEtcCategory] = useState<EtcCategory | null>(null);
  const [instanceSearch, setInstanceSearch] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
    localStorage.setItem('ro-theme', theme);
  }, [theme]);

  const showEpisodeBar = mode === 'items' && (typeFilter === null || EP_FILTER_TYPES.includes(typeFilter));

  const instanceEpisodes = useMemo(() => {
    if (mode !== 'instances') return [];
    const eps = new Set(allInstances.map(i => i.episode));
    return Array.from(eps).sort((a, b) => a - b);
  }, [mode]);

  const typeFilteredItems = useMemo(
    () => allItems.filter(item => matchesFilter(item.type, typeFilter)),
    [typeFilter]
  );

  const availableEpisodes = useMemo(() => {
    if (!showEpisodeBar) return [];
    const eps = new Set<number>();
    typeFilteredItems.forEach(item => { if (item.episode != null) eps.add(item.episode); });
    return Array.from(eps).sort((a, b) => a - b);
  }, [typeFilteredItems, showEpisodeBar]);

  const filteredItems = useMemo(() => {
    let items = typeFilteredItems;
    if (showEpisodeBar && epFilter !== null) {
      items = items.filter(item => item.episode === epFilter);
    }
    if (typeFilter === 'Etc' && etcCategory !== null) {
      items = items.filter(item => item.categories?.includes(etcCategory));
    }
    return items;
  }, [typeFilteredItems, showEpisodeBar, epFilter, typeFilter, etcCategory]);

  function handleSelect(id: number) {
    const item = itemDB[String(id)];
    if (item) {
      const { type, ep } = deriveFilters(item);
      setTypeFilter(type);
      setEpFilter(ep);
    }
    setEtcCategory(null);
    setMode('items');
    setSelectedId(id);
    setHistory([]);
  }

  function handleIngredientClick(id: number) {
    if (selectedId != null) setHistory(prev => [...prev, selectedId]);
    const item = itemDB[String(id)];
    if (item) {
      const { type, ep } = deriveFilters(item);
      setTypeFilter(type);
      setEpFilter(ep);
    }
    setSelectedId(id);
  }

  function handleBack() {
    const prevId = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setSelectedId(prevId ?? null);
    if (prevId != null) {
      const prevItem = itemDB[String(prevId)];
      if (prevItem) {
        const { type, ep } = deriveFilters(prevItem);
        setTypeFilter(type);
        setEpFilter(ep);
      }
    }
  }

  function handleFilterChange(type: ItemTypeFilter) {
    setTypeFilter(type);
    setEpFilter(null);
    setEtcCategory(null);
    setSelectedId(null);
    setHistory([]);
  }

  function handleModeChange(newMode: SidebarMode) {
    setMode(newMode);
    setSelectedId(null);
    setSelectedInstanceId(null);
    setHistory([]);
    if (newMode === 'instances') setEpFilter(null);
    setInstanceSearch('');
  }

  function handleInstanceSelect(id: number) {
    setSelectedInstanceId(id);
  }

  function handleInstanceBack() {
    setSelectedInstanceId(null);
  }

  function handleInstanceItemClick(itemId: number) {
    const item = itemDB[String(itemId)];
    if (item) {
      const { type, ep } = deriveFilters(item);
      setTypeFilter(type);
      setEpFilter(ep);
    }
    setMode('items');
    setSelectedInstanceId(null);
    setSelectedId(itemId);
    setHistory([]);
  }

  function handleEpChange(ep: number | null) {
    setEpFilter(ep);
    setSelectedId(null);
    setHistory([]);
  }

  const selectedItem = selectedId != null ? itemDB[String(selectedId)] : null;
  const filterLabel = typeFilter
    ? (ITEM_TYPES.find(t => t.key === typeFilter)?.label ?? typeFilter)
    : 'All Items';

  const selectedInstance = selectedInstanceId !== null
    ? allInstances.find(i => i.id === selectedInstanceId) ?? null
    : null;

  const etcCategoryLabel = etcCategory
    ? (ETC_CATEGORIES.find(c => c.key === etcCategory)?.label ?? etcCategory)
    : null;

  const breadcrumbs = useMemo(() => {
    if (mode === 'instances') {
      const crumbs: { label: string; onClick?: () => void }[] = [
        { label: 'Instances', onClick: (epFilter !== null || selectedInstance) ? () => { setEpFilter(null); setSelectedInstanceId(null); } : undefined },
      ];
      if (epFilter !== null && !selectedInstance) crumbs.push({ label: `EP ${epFilter}` });
      if (selectedInstance) {
        if (epFilter !== null) crumbs.push({ label: `EP ${epFilter}`, onClick: () => setSelectedInstanceId(null) });
        crumbs.push({ label: selectedInstance.name });
      }
      return crumbs;
    }
    const crumbs: { label: string; onClick?: () => void }[] = [
      { label: 'All Items', onClick: () => handleFilterChange(null) },
    ];
    if (typeFilter) {
      const hasNext = epFilter !== null || etcCategoryLabel || selectedItem;
      crumbs.push({ label: filterLabel, onClick: hasNext ? () => { setEpFilter(null); setEtcCategory(null); setSelectedId(null); setHistory([]); } : undefined });
    }
    if (epFilter !== null && showEpisodeBar) {
      crumbs.push({ label: `EP ${epFilter}`, onClick: selectedItem ? () => { setSelectedId(null); setHistory([]); } : undefined });
    }
    if (etcCategoryLabel && typeFilter === 'Etc') {
      crumbs.push({ label: etcCategoryLabel, onClick: selectedItem ? () => { setSelectedId(null); setHistory([]); } : undefined });
    }
    if (selectedItem) {
      crumbs.push({ label: selectedItem.name });
    }
    return crumbs;
  }, [mode, typeFilter, filterLabel, epFilter, showEpisodeBar, selectedItem, etcCategoryLabel]);

  const showBreadcrumb = mode === 'instances' || typeFilter != null || selectedItem != null || selectedInstance != null;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoRo}>RO</span>
          <span className={styles.logoText}>Item Database</span>
        </div>
        {mode === 'items' && (
          <SearchBar items={filteredItems} onSelect={handleSelect} />
        )}
        <div className={styles.spacer} />
        <button
          className={styles.themeToggle}
          onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <div className={styles.body}>
        <Sidebar
          mode={mode}
          active={typeFilter}
          etcCategory={etcCategory}
          onTypeChange={handleFilterChange}
          onEtcCategoryChange={cat => { setEtcCategory(cat); setSelectedId(null); setHistory([]); }}
          onModeChange={handleModeChange}
        />

        <main className={styles.main}>
          {showBreadcrumb && <Breadcrumb crumbs={breadcrumbs} />}

          {mode === 'instances' ? (
            <>
              {!selectedInstance && (
                <EpisodeBar
                  episodes={instanceEpisodes}
                  active={epFilter}
                  onChange={handleEpChange}
                  searchValue={instanceSearch}
                  onSearchChange={setInstanceSearch}
                  searchPlaceholder="Search instances..."
                />
              )}
              {selectedInstance ? (
                <InstanceDetail
                  instance={selectedInstance}
                  allItems={itemDB}
                  onItemClick={handleInstanceItemClick}
                  onBack={handleInstanceBack}
                />
              ) : (
                <InstanceList
                  instances={allInstances}
                  epFilter={epFilter}
                  search={instanceSearch}
                  onSelect={handleInstanceSelect}
                />
              )}
            </>
          ) : (
            <>
              {showEpisodeBar && !selectedItem && (
                <EpisodeBar
                  episodes={availableEpisodes}
                  active={epFilter}
                  onChange={handleEpChange}
                />
              )}
              {selectedItem ? (
                <ItemCard
                  item={selectedItem}
                  allItems={itemDB}
                  allInstances={allInstances}
                  onIngredientClick={handleIngredientClick}
                  onInstanceClick={id => {
                    setMode('instances');
                    setSelectedId(null);
                    setHistory([]);
                    setSelectedInstanceId(id);
                  }}
                  onBack={handleBack}
                  canGoBack={history.length > 0}
                />
              ) : (
                <ItemList
                  items={filteredItems}
                  onSelect={handleSelect}
                  filterLabel={etcCategoryLabel ?? filterLabel}
                  showSearch={typeFilter === 'Shadow' || typeFilter === 'Etc'}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
