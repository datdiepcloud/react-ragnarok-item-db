import type { Item, ItemDB, Instance } from '../types';
import { itemIconUrl, itemIconFallback } from '../utils';
import RecipeTree from './RecipeTree';
import ObtainSection from './ObtainSection';
import styles from './ItemCard.module.css';

const TYPE_COLORS: Record<string, string> = {
  Weapon: '#e07070',
  Armor: '#70a0e0',
  Consumable: '#70c870',
  Etc: '#a0a0c8',
  Card: '#e0a030',
  Headgear: '#c070e0',
};

interface Props {
  item: Item;
  allItems: ItemDB;
  allInstances: Instance[];
  onIngredientClick: (id: number) => void;
  onInstanceClick: (id: number) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export default function ItemCard({ item, allItems, allInstances, onIngredientClick, onInstanceClick, onBack, canGoBack }: Props) {
  const typeColor = TYPE_COLORS[item.type] ?? '#8888aa';
  const droppedBy = allInstances.filter(inst => inst.dropItemIds.includes(item.id));

  return (
    <div className={styles.card}>
      {canGoBack && (
        <button className={styles.back} onClick={onBack}>
          ← Back
        </button>
      )}

      <div className={styles.header}>
        <img
          className={styles.image}
          src={itemIconUrl(item.id, item.imageUrl)}
          alt={item.name}
          onError={e => {
            const img = e.target as HTMLImageElement;
            const fallback = itemIconFallback(item.id);
            if (img.src !== fallback) img.src = fallback;
            else img.style.visibility = 'hidden';
          }}
        />
        <div className={styles.meta}>
          <div className={styles.idRow}>
            <span className={styles.id}>#{item.id}</span>
            <span className={styles.type} style={{ color: typeColor }}>{item.type}</span>
          </div>
          <h2 className={styles.name}>{item.name}</h2>
          <p className={styles.desc}>{item.description}</p>
        </div>
      </div>

      {item.recipe && (
        <RecipeTree
          recipe={item.recipe}
          allItems={allItems}
          onItemClick={onIngredientClick}
        />
      )}

      <ObtainSection sources={item.obtainFrom} />

      {droppedBy.length > 0 && (
        <div className={styles.instanceSection}>
          <h3 className={styles.instanceTitle}>🏰 Instance Drops</h3>
          <div className={styles.instanceList}>
            {droppedBy.map(inst => (
              <button
                key={inst.id}
                className={styles.instanceRow}
                onClick={() => onInstanceClick(inst.id)}
              >
                <span className={styles.instanceName}>{inst.name}</span>
                {inst.episode > 0 && (
                  <span className={styles.instanceEp}>EP {inst.episode}</span>
                )}
                <span className={styles.instanceArrow}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
