import styles from './Breadcrumb.module.css';

interface Crumb {
  label: string;
  onClick?: () => void;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className={styles.nav}>
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className={styles.segment}>
            {i > 0 && <span className={styles.sep}>›</span>}
            {isLast || !crumb.onClick ? (
              <span className={styles.current}>{crumb.label}</span>
            ) : (
              <button className={styles.link} onClick={crumb.onClick}>
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
