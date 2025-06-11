import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';
import styles from './AdCard.module.scss';

export const AdCard = ({ ad, onCardClick }) => {
  const formatPrice = price =>
    new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(price);

  const getImageUrl = photoPath =>
    photoPath ? `${process.env.REACT_APP_API_URL}uploads/ads/${photoPath}` : '/placeholder-image.jpg';

  return (
    <div className={styles.adGridItem}>
      <Card className={styles.adCard} onClick={() => onCardClick(ad._id)}>
        <CardMedia
          component="img"
          image={getImageUrl(ad.photos?.[0])}
          alt={ad.title}
          className={styles.cardMedia}
        />
        <CardContent className={styles.cardContent}>
          <Typography variant="h6" component="h3" className={styles.cardTitle}>
            {ad.title}
          </Typography>
          <Typography variant="h5" color="primary" className={styles.cardPrice}>
            {formatPrice(ad.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary" className={styles.cardDescription}>
            {ad.description}
          </Typography>
          <div className={styles.cardFooter}>
            <div className={styles.chipContainer}>
              <Chip
                label={ad.category?.name || 'Brak kategorii'}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip label={ad.location} size="small" variant="outlined" />
            </div>
            <Typography variant="caption" color="text.secondary" className={styles.userInfo}>
              Przez {ad.user_id?.fullName} • {new Date(ad.createdAt).toLocaleDateString()}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};