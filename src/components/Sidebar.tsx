import styles from './Sidebar.module.css';

export const ITEM_TYPES = [
  { key: 'Weapon',  label: 'Weapon',       icon: '⚔️' },
  { key: 'Armor',   label: 'Armor',        icon: '🛡️' },
  { key: 'Shadow',  label: 'Shadow Equip', icon: '🌑' },
  { key: 'Costume', label: 'Costume',      icon: '👒' },
  { key: 'Etc',     label: 'Etc.',         icon: '🧪' },
] as const;

export const ETC_CATEGORIES = [
  { key: 'Tame',   label: 'Tame Ingredients'   },
  { key: 'Juice',  label: 'Juice Ingredients'  },
  { key: 'Potion', label: 'Potion Ingredients' },
  { key: 'Dye',    label: 'Dye Ingredients'    },
] as const;

export type EtcCategory = typeof ETC_CATEGORIES[number]['key'];
export type ItemTypeFilter = typeof ITEM_TYPES[number]['key'] | null;
export type SidebarMode = 'items' | 'instances';

interface Props {
  mode: SidebarMode;
  active: ItemTypeFilter;
  etcCategory: EtcCategory | null;
  onTypeChange: (type: ItemTypeFilter) => void;
  onEtcCategoryChange: (cat: EtcCategory | null) => void;
  onModeChange: (mode: SidebarMode) => void;
}

export default function Sidebar({ mode, active, etcCategory, onTypeChange, onEtcCategoryChange, onModeChange }: Props) {
  const nonEtc = ITEM_TYPES.filter(t => t.key !== 'Etc');
  const etcType = ITEM_TYPES.find(t => t.key === 'Etc')!;
  const etcActive = mode === 'items' && active === 'Etc';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.label}>Items</div>
      <button
        className={`${styles.item} ${mode === 'items' && active === null ? styles.active : ''}`}
        onClick={() => { onModeChange('items'); onTypeChange(null); onEtcCategoryChange(null); }}
      >
        <span className={styles.icon}>📦</span>
        <span>All Items</span>
      </button>

      {nonEtc.map(t => (
        <button
          key={t.key}
          className={`${styles.item} ${mode === 'items' && active === t.key ? styles.active : ''}`}
          onClick={() => { onModeChange('items'); onTypeChange(active === t.key ? null : t.key); onEtcCategoryChange(null); }}
        >
          <span className={styles.icon}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}

      {/* Etc. at bottom with sub-filters */}
      <button
        className={`${styles.item} ${etcActive ? styles.active : ''}`}
        onClick={() => { onModeChange('items'); onTypeChange(active === 'Etc' ? null : 'Etc'); onEtcCategoryChange(null); }}
      >
        <span className={styles.icon}>{etcType.icon}</span>
        <span>{etcType.label}</span>
      </button>

      {etcActive && (
        <div className={styles.subFilters}>
          {ETC_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`${styles.subItem} ${etcCategory === cat.key ? styles.subActive : ''}`}
              onClick={() => onEtcCategoryChange(etcCategory === cat.key ? null : cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.spacer} />
      <div className={styles.divider} />
      <div className={styles.label}>Content</div>
      <button
        className={`${styles.item} ${mode === 'instances' ? styles.active : ''}`}
        onClick={() => onModeChange('instances')}
      >
        <span className={styles.icon}>🏰</span>
        <span>Instances</span>
      </button>
    </aside>
  );
}
