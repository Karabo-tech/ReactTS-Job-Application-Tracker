// src/components/JobCard.tsx
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import { formatDate, getCardVariantFromStatus } from '../utils/helpers';
import { ROUTES } from '../config/constants';
import type { Job } from '../types';
import styles from '../pages/Home.module.css';

interface JobCardProps {
  job: Job;
  onDelete: (id: string | number) => void;
}

/**
 * JobCard Component
 * Displays a single job card with actions
 * Memoized to prevent unnecessary re-renders
 */
const JobCard: React.FC<JobCardProps> = memo(({ job, onDelete }) => {
  return (
    <Card variant={getCardVariantFromStatus(job.status)} hoverable>
      <h2 className={styles.cardTitle}>{job.company}</h2>
      <h3 className={styles.cardSubtitle}>{job.role}</h3>
      <div className={styles.cardInfo}>
        <span className={styles.cardStatus}>{job.status}</span>
        <span className={styles.cardDate}>{formatDate(job.dateApplied)}</span>
      </div>
      <div className={styles.cardActions}>
        <Link to={ROUTES.JOB_DETAIL(job.id!)}>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </Link>
        <Link to={ROUTES.JOB_EDIT(job.id!)}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Button onClick={() => onDelete(job.id!)} variant="danger" size="sm">
          Delete
        </Button>
      </div>
    </Card>
  );
});

JobCard.displayName = 'JobCard';

export default JobCard;
