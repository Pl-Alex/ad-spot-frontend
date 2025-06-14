import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Tabs,
  Tab,
  Grid,
  Chip,
  Button
} from '@mui/material';
import { Add, Person } from '@mui/icons-material';

import { selectIsAuth } from '../../redux/slices/auth';
import { fetchMyAds } from '../../redux/slices/ads';
import { AdCard, LoadingState, ErrorState } from '../../components';
import styles from './Profile.module.scss';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    aria-labelledby={`profile-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const NoAdsMessage = ({ message, showCreateButton, onCreateClick }) => (
  <Box sx={{ textAlign: 'center', py: 4 }}>
    <Typography variant="h6" color="text.secondary" gutterBottom>
      {message}
    </Typography>
    {showCreateButton && (
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreateClick}
        sx={{ mt: 2 }}
      >
        Dodaj pierwsze ogłoszenie
      </Button>
    )}
  </Box>
);

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const currentUser = useSelector(state => state.auth.data);
  const { myAds } = useSelector(state => state.ads);
  
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchMyAds({ page: 1, limit: 12 }));
    }
  }, [dispatch, isAuth]);

  if (!isAuth || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const navigateToAd = (adId) => {
    navigate(`/ads/${adId}`);
  };

  const navigateToCreateAd = () => {
    navigate('/create');
  };

  const getFilteredAds = () => {
    const ads = myAds.items || [];
    switch (activeTab) {
      case 1: return ads.filter(ad => ad.active);
      case 2: return ads.filter(ad => !ad.active);
      default: return ads;
    }
  };

  const getStats = () => {
    const ads = myAds.items || [];
    return {
      total: ads.length,
      active: ads.filter(ad => ad.active).length,
      inactive: ads.filter(ad => !ad.active).length
    };
  };

  const stats = getStats();
  const filteredAds = getFilteredAds();

  const getNoAdsMessage = () => {
    switch (activeTab) {
      case 1: return "Nie masz aktywnych ogłoszeń";
      case 2: return "Nie masz nieaktywnych ogłoszeń";
      default: return "Nie masz jeszcze żadnych ogłoszeń";
    }
  };

  const renderAds = () => {
    if (myAds.status === 'loading') {
      return <LoadingState />;
    }

    if (myAds.status === 'error') {
      return <ErrorState />;
    }

    if (filteredAds.length === 0) {
      return (
        <NoAdsMessage
          message={getNoAdsMessage()}
          showCreateButton={activeTab === 0}
          onCreateClick={navigateToCreateAd}
        />
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredAds.map(ad => (
          <Grid item xs={12} sm={6} md={4} key={ad._id}>
            <AdCard 
              ad={ad} 
              onCardClick={navigateToAd}
              showStatus={true}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <Paper className={styles.profileHeader}>
        <Box className={styles.userInfo}>
          <Avatar 
            className={styles.avatar}
            sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" className={styles.userName}>
              {currentUser.fullName || 'Użytkownik'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentUser.email}
            </Typography>
            <Box className={styles.statsContainer}>
              <Chip 
                label={`Ogłoszeń: ${stats.total}`} 
                variant="outlined" 
                size="small"
                className={styles.statChip}
              />
              <Chip 
                label={`Aktywnych: ${stats.active}`} 
                color="success" 
                variant="outlined" 
                size="small"
                className={styles.statChip}
              />
              <Chip 
                label={`Nieaktywnych: ${stats.inactive}`} 
                color="default" 
                variant="outlined" 
                size="small"
                className={styles.statChip}
              />
            </Box>
          </Box>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={navigateToCreateAd}
          className={styles.createButton}
        >
          Dodaj ogłoszenie
        </Button>
      </Paper>

      <Paper className={styles.adsSection}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label={`Wszystkie (${stats.total})`} />
            <Tab label={`Aktywne (${stats.active})`} />
            <Tab label={`Nieaktywne (${stats.inactive})`} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          {renderAds()}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {renderAds()}
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          {renderAds()}
        </TabPanel>
      </Paper>
    </Container>
  );
};