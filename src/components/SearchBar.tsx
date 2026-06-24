import { useState, useRef, useEffect } from 'react';
import type { Item } from '../types';
import { itemIconUrl, itemIconFallback } from '../utils';
import styles from './SearchBar.module.css';

interface Props {
  items: Item[];
  onSelect: (id: number) => void;
}

export default function SearchBar({ items, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.trim().length === 0 ? [] : items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    String(item.id).includes(query)
  ).slice(0, 10);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(id: number) {
    setQuery('');
    setOpen(false);
    onSelect(id);
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search item name or ID..."
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul className={styles.dropdown}>
          {filtered.map(item => (
            <li key={item.id} className={styles.option} onMouseDown={() => handleSelect(item.id)}>
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
              <span className={styles.optionName}>{item.name}</span>
              <span className={styles.optionId}>#{item.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
