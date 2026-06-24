import type { Instance, ItemDB } from '../types';
import { itemIconUrl, itemIconFallback } from '../utils';
import styles from './InstanceDetail.module.css';

interface Props {
  instance: Instance;
  allItems: ItemDB;
  onItemClick: (id: number) => void;
  onBack: () => void;
}

export default function InstanceDetail({ instance, allItems, onItemClick, onBack }: Props) {
  return (
    <div className={styles.card}>
      <button className={styles.back} onClick={onBack}>← Back</button>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.name}>{instance.name}</h2>
          <span className={styles.ep}>EP {instance.episode}</span>
        </div>
        <p className={styles.desc}>{instance.description}</p>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⚔️</span>
            Min Level: <strong>{instance.minLevel}+</strong>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>👥</span>
            Party: <strong>{instance.maxParty} players</strong>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>⏱</span>
            Cooldown: <strong>{instance.cooldown}</strong>
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Droppable Items</h3>
        {instance.dropItemIds.length === 0 ? (
          <p className={styles.empty}>No drop data available yet.</p>
        ) : (
          <div className={styles.drops}>
            {instance.dropItemIds.map(id => {
              const item = allItems[String(id)];
              return (
                <button
                  key={id}
                  className={styles.dropCard}
                  onClick={() => onItemClick(id)}
                >
                  <img
                    className={styles.icon}
                    src={itemIconUrl(id, item?.imageUrl)}
                    alt=""
                    onError={e => {
                      const img = e.target as HTMLImageElement;
                      const fallback = itemIconFallback(id);
                      if (img.src !== fallback) img.src = fallback;
                      else img.style.visibility = 'hidden';
                    }}
                  />
                  <div className={styles.dropInfo}>
                    {item ? (
                      <>
                        <span className={styles.dropName}>{item.name}</span>
                        <span className={styles.dropMeta}>
                          <span className={styles.dropType}>{item.type}</span>
                          <span className={styles.dropId}>#{id}</span>
                        </span>
                      </>
                    ) : (
                      <span className={styles.unknown}>Item #{id}</span>
                    )}
                  </div>
                  <span className={styles.arrow}>›</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
