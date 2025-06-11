import React, { useState } from 'react';
import { Card, CardMedia, Typography } from '@mui/material';
import styles from './ImageGallery.module.scss';

export const ImageGallery = ({ photos, title, getImageUrl }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <Card className={styles.imagesCard}>
        <div className={styles.noImage}>
          <Typography variant="h6" color="text.secondary">
            Brak zdjęć
          </Typography>
        </div>
      </Card>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <Card className={styles.imagesCard}>
      <div className={styles.imageGallery}>
        <CardMedia
          component="img"
          image={getImageUrl(photos[selectedImageIndex])}
          alt={`${title} - zdjęcie ${selectedImageIndex + 1}`}
          className={styles.mainImage}
        />
        {photos.length > 1 && (
          <div className={styles.thumbnails}>
            {photos.map((photo, index) => (
              <img
                key={index}
                src={getImageUrl(photo)}
                alt={`${title} - miniatura ${index + 1}`}
                className={`${styles.thumbnail} ${
                  index === selectedImageIndex ? styles.activeThumbnail : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        )}
        {photos.length > 1 && (
          <div className={styles.imageCounter}>
            {selectedImageIndex + 1} / {photos.length}
          </div>
        )}
      </div>
    </Card>
  );
};