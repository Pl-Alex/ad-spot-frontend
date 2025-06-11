import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar
} from '@mui/material';
import { Person } from '@mui/icons-material';
import styles from './SellerInfo.module.scss';

export const SellerInfo = ({ user, isOwner, formatDate, onContact }) => (
    <Card className={styles.sellerCard}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sprzedający
        </Typography>
        
        <div className={styles.sellerInfo}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.fullName}
            className={styles.sellerAvatar}
          >
            <Person />
          </Avatar>
          <div>
            <Typography variant="body1" fontWeight="medium">
              {user?.fullName || 'Użytkownik'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Członek od {formatDate(user?.createdAt)}
            </Typography>
          </div>
        </div>

        {!isOwner && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            className={styles.contactButton}
            onClick={onContact}
            disabled={!onContact}
          >
            Skontaktuj się
          </Button>
        )}
      </CardContent>
    </Card>
  );
