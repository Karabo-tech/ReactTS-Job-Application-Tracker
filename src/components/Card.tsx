// src/components/Card.tsx
import { ReactNode, HTMLAttributes } from 'react';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'applied' | 'interviewed' | 'rejected';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  children: ReactNode;
}

const Card = ({
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) => {
  const classes = [
    styles.card,
    styles[variant],
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
