'use client';

import { forwardRef, useId, useEffect, useState } from 'react';
import styles from './Input.module.css';
import { clsx } from 'clsx';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'medium',
  fullWidth = true,
  disabled = false,
  required = false,
  placeholder,
  type = 'text',
  className,
  ...props 
}, ref) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const generatedId = useId();
  const inputId = props.id || (isHydrated ? generatedId : 'input-ssr');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && iconPosition === 'left' && (
          <div className={styles.iconLeft}>{icon}</div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            styles.input,
            styles[variant],
            styles[size],
            {
              [styles.withIconLeft]: icon && iconPosition === 'left',
              [styles.withIconRight]: icon && iconPosition === 'right'
            }
          )}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className={styles.iconRight}>{icon}</div>
        )}
      </div>
      
      {error && <span className={styles.error}>{error}</span>}
      {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
