import React from 'react';
import { Typography, Box } from '@mui/material';
import styles from './PhotoUpload.module.scss';

export const PhotoUpload = ({ selectedFiles, onFileChange }) => (
  <Box className={styles.uploadSection}>
    <Typography variant="body2" className={styles.uploadLabel}>
      Zdjęcia (opcjonalne)
    </Typography>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={onFileChange}
      className={styles.fileInput}
    />
    {selectedFiles.length > 0 && (
      <Typography variant="body2" className={styles.fileCount}>
        Wybrano plików: {selectedFiles.length}
      </Typography>
    )}
  </Box>
);