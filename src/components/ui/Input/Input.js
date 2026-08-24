'use client';

import { forwardRef } from 'react';
import styles from './Input.module.css';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  variant = 'default',
  size = 'medium',
  fullWidth = true,
  className,
  ...props 
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx(
      styles.inputGroup,
      {
        [styles.fullWidth]: fullWidth,
        [styles.hasError]: error,
        [styles.hasIcon]: icon
      },
      className
    )}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && <div className={styles.icon}>{icon}</div>}
        
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            styles.input,
            styles[variant],
            styles[size],
            {
              [styles.withIcon]: icon
            }
          )}
          {...props}
        />
      </div>
      
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
