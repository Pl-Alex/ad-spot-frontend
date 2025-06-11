import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Pagination } from '@mui/material';
import { fetchAds, fetchCategories } from '../../redux/slices/ads';
import { LoadingState, ErrorState, NoResultsState, AdCard, FiltersCard } from '../../components/';
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

  const navigateToAd = adId => {
    window.location.href = `/ads/${adId}`;
  };

  const renderContent = () => {
    if (ads.status === 'loading') return <LoadingState />;
    if (ads.status === 'error') return <ErrorState />;
    if (ads.status === 'loaded') {
      if (ads.items?.length === 0) return <NoResultsState />;

      return (
        <>
          <div className={styles.resultsInfo}>
            <Typography variant="body1" color="text.secondary">
              Wyświetlono {ads.items?.length || 0} z {ads.pagination?.total || 0} ogłoszeń
            </Typography>
          </div>

          <div className={styles.adsGrid}>
            {ads.items?.map(ad => (
              <AdCard key={ad._id} ad={ad} onCardClick={navigateToAd} />
            ))}
          </div>

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
      <FiltersCard
        filters={filters}
        categories={categories}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
      />
      {renderContent()}
    </Container>
  );
};

export default Home;