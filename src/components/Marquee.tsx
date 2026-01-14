import React from 'react';
import styles from './Marquee.module.css';

export default function Marquee() {
  // Repeat the text enough times to ensure it covers wide screens + scrolling buffer
  // "Building in progress" is short.
  const text = "Building in progress";
  const repetitions = 20; 

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeContent}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} className={styles.marqueeText}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
