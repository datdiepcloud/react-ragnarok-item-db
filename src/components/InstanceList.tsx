import type { Instance } from '../types';
import styles from './InstanceList.module.css';

interface Props {
  instances: Instance[];
  epFilter: number | null;
  search: string;
  onSelect: (id: number) => void;
}

export default function InstanceList({ instances, epFilter, search, onSelect }: Props) {
  const q = search.trim().toLowerCase();
  const filtered = instances.filter(i => {
    if (epFilter !== null && i.episode !== epFilter) return false;
    if (q && !i.name.toLowerCase().includes(q)) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No instances found{epFilter ? ` for EP ${epFilter}` : ''}{q ? ` matching "${search}"` : ''}.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {filtered.map(inst => (
        <div key={inst.id} className={styles.card} onClick={() => onSelect(inst.id)} style={{ cursor: 'pointer' }}>
          <div className={styles.cardHeader}>
            <span className={styles.name}>{inst.name}</span>
            <span className={styles.ep}>EP {inst.episode}</span>
          </div>
          <p className={styles.desc}>{inst.description}</p>
          <div className={styles.meta}>
            <span className={styles.metaItem} title="Minimum level">
              <span className={styles.metaIcon}>⚔️</span> Lv. {inst.minLevel}+
            </span>
            <span className={styles.metaItem} title="Max party size">
              <span className={styles.metaIcon}>👥</span> {inst.maxParty} players
            </span>
            <span className={styles.metaItem} title="Cooldown">
              <span className={styles.metaIcon}>⏱</span> {inst.cooldown}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
