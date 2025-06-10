import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Alert
} from '@mui/material';
import { fetchAds, fetchCategories } from '../../redux/slices/ads';
import styles from './Home.module.scss';

const INITIAL_FILTERS = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  location: '',
  sortBy: 'newest',
  page: 1,
  limit: 12
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Najnowsze' },
  { value: 'oldest', label: 'Najstarsze' },
  { value: 'price-low', label: 'Cena: od najniższej' },
  { value: 'price-high', label: 'Cena: od najwyższej' },
  { value: 'title', label: 'Tytuł A-Z' }
];

export const Home = () => {
  const dispatch = useDispatch();
  const { ads, categories } = useSelector(state => state.ads);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAds(filters));
  }, [dispatch]);

  const updateFilters = (field, value) => {
    const newFilters = { ...filters, [field]: value, page: 1 };
    setFilters(newFilters);
    dispatch(fetchAds(newFilters));
  };

  const handlePageChange = (_, page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    dispatch(fetchAds(newFilters));
  };

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS);
    dispatch(fetchAds(INITIAL_FILTERS));
  };

  const formatPrice = price =>
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(price);

  const getImageUrl = photoPath =>
    photoPath ? `${process.env.REACT_APP_API_URL}uploads/ads/${photoPath}` : '/placeholder-image.jpg';

  const navigateToAd = adId => {
    window.location.href = `/ads/${adId}`;
  };

  const renderFilters = () => (
    <Card className={styles.filtersCard}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Szukaj ogłoszeń..."
            value={filters.search}
            onChange={e => updateFilters('search', e.target.value)}
            size="small"
          />
        </Grid>

        <Grid className={styles.categorySelect} item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Kategoria</InputLabel>
            <Select
              value={filters.category}
              label="Kategoria"
              onChange={e => updateFilters('category', e.target.value)}
            >
              <MenuItem value="">Wszystkie kategorie</MenuItem>
              {categories.items?.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            label="Cena min."
            type="number"
            value={filters.minPrice}
            onChange={e => updateFilters('minPrice', e.target.value)}
            size="small"
          />
        </Grid>

        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            label="Cena maks."
            type="number"
            value={filters.maxPrice}
            onChange={e => updateFilters('maxPrice', e.target.value)}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Lokalizacja"
            value={filters.location}
            onChange={e => updateFilters('location', e.target.value)}
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Sortuj według</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sortuj według"
              onChange={e => updateFilters('sortBy', e.target.value)}
            >
              {SORT_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={1}>
          <Button variant="outlined" onClick={clearFilters} size="small" fullWidth>
            Wyczyść
          </Button>
        </Grid>
      </Grid>
    </Card>
  );

  const renderAdCard = ad => (
    <Grid item xs={12} sm={6} md={4} key={ad._id}>
      <Card className={styles.adCard} onClick={() => navigateToAd(ad._id)}>
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

            <Typography variant="caption" color="text.secondary">
              Przez {ad.user_id?.fullName} • {new Date(ad.createdAt).toLocaleDateString()}
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderContent = () => {
    if (ads.status === 'loading') {
      return (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      );
    }

    if (ads.status === 'error') {
      return (
        <Alert severity="error" className={styles.errorAlert}>
          Nie udało się załadować ogłoszeń. Spróbuj ponownie.
        </Alert>
      );
    }

    if (ads.status === 'loaded') {
      if (ads.items?.length === 0) {
        return (
          <Alert severity="info">
            Nie znaleziono ogłoszeń pasujących do kryteriów.
          </Alert>
        );
      }

      return (
        <>
          <div className={styles.resultsInfo}>
            <Typography variant="body1" color="text.secondary">
              Wyświetlono {ads.items?.length || 0} z {ads.pagination?.total || 0} ogłoszeń
            </Typography>
          </div>

          <Grid container spacing={3}>
            {ads.items?.map(renderAdCard)}
          </Grid>

          {ads.pagination?.pages > 1 && (
            <div className={styles.paginationContainer}>
              <Pagination
                count={ads.pagination.pages}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </div>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      {renderFilters()}
      {renderContent()}
    </Container>
  );
};

export default Home;