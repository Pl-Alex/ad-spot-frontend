import React from 'react';
import { CircularProgress, Alert } from '@mui/material';
import styles from './LoadingErrorStates.module.scss';

export const LoadingState = () => (
  <div className={styles.loadingContainer}>
    <CircularProgress />
  </div>
);

export const ErrorState = () => (
  <Alert severity="error" className={styles.errorAlert}>
    Nie udało się załadować ogłoszeń. Spróbuj ponownie.
  </Alert>
);

export const NoResultsState = () => (
  <Alert severity="info">
    Nie znaleziono ogłoszeń pasujących do kryteriów.
  </Alert>
);