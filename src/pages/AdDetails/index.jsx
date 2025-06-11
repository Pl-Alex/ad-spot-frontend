import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { fetchAd, clearCurrentAd, toggleAd, fetchRemoveAd } from '../../redux/slices/ads';
import { selectIsAuth } from '../../redux/slices/auth';
import { ImageGallery, AdDetailsCard, SellerInfo, OwnerActions } from '../../components';
import styles from './AdDetail.module.scss';

export const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentAd } = useSelector(state => state.ads);
  const isAuth = useSelector(selectIsAuth);
  const currentUser = useSelector(state => state.auth.data);
  
  const ad = currentAd.data;
  const isOwner = isAuth && currentUser && ad?.user_id?._id === currentUser._id;

  useEffect(() => {
    if (id) {
      dispatch(fetchAd(id));
    }
    
    return () => {
      dispatch(clearCurrentAd());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/ads/${id}/edit`);
  };

  const handleToggle = async () => {
    if (window.confirm(`Czy na pewno chcesz ${ad.active ? 'dezaktywować' : 'aktywować'} to ogłoszenie?`)) {
      try {
        await dispatch(toggleAd(id));
      } catch (error) {
        console.error('Error toggling ad:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie? Ta akcja jest nieodwracalna.')) {
      try {
        await dispatch(fetchRemoveAd(id));
        navigate('/');
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleContact = () => {
  };

  const formatPrice = price =>
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);

  const formatDate = date =>
    new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getImageUrl = photoPath =>
    photoPath ? `${process.env.REACT_APP_API_URL}uploads/ads/${photoPath}` : '/placeholder-image.jpg';

  if (currentAd.status === 'loading') {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <div className={styles.loading}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Ładowanie ogłoszenia...
          </Typography>
        </div>
      </Container>
    );
  }

  if (currentAd.status === 'error' || !ad) {
    return (
      <Container maxWidth="lg" className={styles.container}>
        <Alert severity="error" className={styles.errorAlert}>
          Nie udało się załadować ogłoszenia. Może zostało usunięte lub nie istnieje.
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Wróć
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Wróć
        </Button>
        
        {isOwner && (
          <OwnerActions
            ad={ad}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </div>

      {!ad.active && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          To ogłoszenie jest nieaktywne i nie jest widoczne dla innych użytkowników.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ImageGallery
            photos={ad.photos}
            title={ad.title}
            getImageUrl={getImageUrl}
          />

          <Card className={styles.descriptionCard}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Opis
              </Typography>
              <Typography variant="body1" className={styles.description}>
                {ad.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <AdDetailsCard
            ad={ad}
            formatPrice={formatPrice}
            formatDate={formatDate}
          />

          <SellerInfo
            user={ad.user_id}
            isOwner={isOwner}
            formatDate={formatDate}
            onContact={handleContact}
          />
        </Grid>
      </Grid>
    </Container>
  );
};