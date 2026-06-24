import type { ObtainSource } from '../types';
import styles from './ObtainSection.module.css';

interface Props {
  sources: ObtainSource[];
}

export default function ObtainSection({ sources }: Props) {
  const monsters = sources.filter(s => s.type === 'monster') as Extract<ObtainSource, { type: 'monster' }>[];
  const shops = sources.filter(s => s.type === 'shop') as Extract<ObtainSource, { type: 'shop' }>[];
  const quests = sources.filter(s => s.type === 'quest') as Extract<ObtainSource, { type: 'quest' }>[];

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Obtain From</h3>

      {monsters.length > 0 && (
        <div className={styles.group}>
          <div className={styles.groupLabel}>Monster Drops</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Monster</th>
                <th>Map</th>
                <th>Drop Rate</th>
              </tr>
            </thead>
            <tbody>
              {monsters.map((s, i) => (
                <tr key={i}>
                  <td>
                    <img
                      className={styles.monsterIcon}
                      src={`https://static.divine-pride.net/images/mobs/small/${s.monsterId}.gif`}
                      alt=""
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    {s.monsterName}
                  </td>
                  <td className={styles.mapName}>{s.map}</td>
                  <td className={styles.dropRate}>{s.dropRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shops.length > 0 && (
        <div className={styles.group}>
          <div className={styles.groupLabel}>NPC Shops</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NPC</th>
                <th>Map</th>
                <th>Price (z)</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((s, i) => (
                <tr key={i}>
                  <td>{s.npcName}</td>
                  <td className={styles.mapName}>{s.map}</td>
                  <td className={styles.price}>{s.price.toLocaleString()} z</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {quests.length > 0 && (
        <div className={styles.group}>
          <div className={styles.groupLabel}>Quests</div>
          {quests.map((s, i) => (
            <div key={i} className={styles.questItem}>
              <span className={styles.questName}>{s.questName}</span>
              <span className={styles.questDesc}>{s.description}</span>
            </div>
          ))}
        </div>
      )}

      {sources.length === 0 && (
        <p className={styles.empty}>No obtain information available.</p>
      )}
    </div>
  );
}
