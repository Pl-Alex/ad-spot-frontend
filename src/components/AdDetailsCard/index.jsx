import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip
} from '@mui/material';
import {
  LocationOn,
  Category,
  CalendarToday
} from '@mui/icons-material';
import styles from './AdDetailsCard.module.scss';

export const AdDetailsCard = ({ ad, formatPrice, formatDate }) => {
  return (
    <Card className={styles.detailsCard}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom>
          {ad.title}
        </Typography>
        
        <Typography variant="h3" color="primary" className={styles.price}>
          {formatPrice(ad.price)}
        </Typography>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <Category className={styles.detailIcon} />
            <div>
              <Typography variant="caption" color="text.secondary">
                Kategoria
              </Typography>
              <Typography variant="body2">
                {ad.category?.name || 'Brak kategorii'}
              </Typography>
            </div>
          </div>

          <div className={styles.detailItem}>
            <LocationOn className={styles.detailIcon} />
            <div>
              <Typography variant="caption" color="text.secondary">
                Lokalizacja
              </Typography>
              <Typography variant="body2">
                {ad.location}
              </Typography>
            </div>
          </div>

          <div className={styles.detailItem}>
            <CalendarToday className={styles.detailIcon} />
            <div>
              <Typography variant="caption" color="text.secondary">
                Data dodania
              </Typography>
              <Typography variant="body2">
                {formatDate(ad.createdAt)}
              </Typography>
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          <Chip
            label={ad.category?.name || 'Bez kategorii'}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={ad.location}
            size="small"
            variant="outlined"
          />
          <Chip
            label={ad.active ? 'Aktywne' : 'Nieaktywne'}
            size="small"
            color={ad.active ? 'success' : 'default'}
          />
        </div>
      </CardContent>
    </Card>
  );
};