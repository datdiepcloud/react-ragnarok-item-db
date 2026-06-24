import styles from './EpisodeBar.module.css';

interface Props {
  episodes: number[];
  active: number | null;
  onChange: (ep: number | null) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export default function EpisodeBar({ episodes, active, onChange, searchValue, onSearchChange, searchPlaceholder }: Props) {
  if (episodes.length === 0 && !onSearchChange) return null;

  return (
    <div className={styles.bar}>
      {onSearchChange !== undefined && (
        <input
          className={styles.search}
          type="text"
          placeholder={searchPlaceholder ?? 'Search...'}
          value={searchValue ?? ''}
          onChange={e => onSearchChange(e.target.value)}
        />
      )}
      {episodes.length > 0 && (
        <>
          <button
            className={`${styles.tab} ${active === null ? styles.active : ''}`}
            onClick={() => onChange(null)}
          >
            All EP
          </button>
          {episodes.map(ep => (
            <button
              key={ep}
              className={`${styles.tab} ${active === ep ? styles.active : ''}`}
              onClick={() => onChange(active === ep ? null : ep)}
            >
              EP {ep}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
