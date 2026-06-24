import type { Recipe, ItemDB } from '../types';
import { itemIconUrl, itemIconFallback } from '../utils';
import styles from './RecipeTree.module.css';

interface Props {
  recipe: Recipe;
  allItems: ItemDB;
  onItemClick: (id: number) => void;
}

export default function RecipeTree({ recipe, allItems, onItemClick }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Craft Recipe</h3>
      <div className={styles.npcInfo}>
        <span className={styles.npcLabel}>NPC:</span>
        <span className={styles.npcName}>{recipe.npcName}</span>
        <span className={styles.npcSep}>@</span>
        <span className={styles.mapName}>{recipe.map}</span>
        {recipe.zeny != null && (
          <>
            <span className={styles.npcSep}>·</span>
            <span className={styles.zeny}>{recipe.zeny.toLocaleString()} z</span>
          </>
        )}
      </div>

      <div className={styles.ingredients}>
        {recipe.ingredients.map((ing, i) => {
          const item = allItems[String(ing.itemId)];
          return (
            <div key={i} className={styles.ingredient}>
              <img
                className={styles.icon}
                src={itemIconUrl(ing.itemId, item?.imageUrl)}
                alt=""
                onError={e => {
                  const img = e.target as HTMLImageElement;
                  const fallback = itemIconFallback(ing.itemId);
                  if (img.src !== fallback) img.src = fallback;
                  else img.style.visibility = 'hidden';
                }}
              />
              <div className={styles.info}>
                {item ? (
                  <button className={styles.link} onClick={() => onItemClick(ing.itemId)}>
                    {item.name}
                  </button>
                ) : (
                  <span className={styles.unknown}>Item #{ing.itemId} (not in database)</span>
                )}
                {item && <span className={styles.itemType}>{item.type}</span>}
              </div>
              <div className={styles.qty}>× {ing.quantity}</div>
              {item?.recipe && (
                <span className={styles.craftable} title="This item can be crafted">⚒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
