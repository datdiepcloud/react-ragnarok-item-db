import { useState } from 'react';
import type { Item } from '../types';
import { itemIconUrl, itemIconFallback } from '../utils';
import styles from './ItemList.module.css';

interface Props {
  items: Item[];
  onSelect: (id: number) => void;
  filterLabel: string;
  showSearch?: boolean;
}

export default function ItemList({ items, onSelect, filterLabel, showSearch }: Props) {
  const [query, setQuery] = useState('');

  const displayed = showSearch && query.trim()
    ? items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : items;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No {filterLabel} items in the database yet.</p>
        <p className={styles.hint}>Add entries to <code>src/data/items.json</code> or run the scraper.</p>
      </div>
    );
  }

  return (
    <div>
      {showSearch && (
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={`Search ${filterLabel}…`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className={styles.count}>{displayed.length} / {items.length}</span>
        </div>
      )}
      {!showSearch && <p className={styles.count}>{items.length} item{items.length !== 1 ? 's' : ''} found</p>}
      <div className={styles.grid}>
        {displayed.map(item => (
          <button key={item.id} className={styles.card} onClick={() => onSelect(item.id)}>
            <img
              className={styles.icon}
              src={itemIconUrl(item.id, item.imageUrl)}
              alt=""
              onError={e => {
                const img = e.target as HTMLImageElement;
                const fallback = itemIconFallback(item.id);
                if (img.src !== fallback) img.src = fallback;
                else img.style.visibility = 'hidden';
              }}
            />
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.id}>#{item.id}</span>
            </div>
            {item.recipe && <span className={styles.craftBadge} title="Craftable">⚒</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
