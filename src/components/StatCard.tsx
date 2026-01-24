// src/components/StatCard.tsx
import React, { memo } from 'react';
import styles from '../pages/Home.module.css';

interface StatCardProps {
  value: number;
  label: string;
  type: 'total' | 'applied' | 'interviewed' | 'rejected';
}

/**
 * StatCard Component
 * Displays a statistics card
 * Memoized to prevent unnecessary re-renders
 */
const StatCard: React.FC<StatCardProps> = memo(({ value, label, type }) => {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statIcon} ${styles[type]}`}>
        {value}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
