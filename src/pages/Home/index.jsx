import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Ad } from '../../components/Ad';
import { fetchAds } from '../../redux/slices/ads';

import styles from './Home.module.scss';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { ads, categories } = useSelector((state) => state.ads);

  const isLoading = ads.status === 'loading';
  const isError = ads.status === 'error';
  const isCategoriesLoading = categories.status === 'loading';

  useEffect(() => {
    dispatch(fetchAds({ limit: 32 }));
  }, [dispatch]);

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 12 }, (_, index) => (
        <div key={`skeleton-${index}`} className={styles.skeletonItem}>
          <Ad isLoading={true} />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.root}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <CircularProgress size={60} className={styles.loadingSpinner} />
        </div>
      )}

      <div className={styles.filtersContainer}>
      <div className={styles.filtersTitle}>
        Filters & Categories
      </div>
      <div className={styles.filtersContent}>
        <div className={styles.filterSection}>
          <h4>Categories</h4>
          <div className={styles.filterOptions}>
            <button className={styles.filterButton}>All Categories</button>
            {isCategoriesLoading ? (
              <div className={styles.categoriesLoading}>
                <CircularProgress size={16} />
                <span>Loading categories...</span>
              </div>
            ) : (
              categories?.map((category) => (
                <button 
                  key={category._id || category.id} 
                  className={styles.filterButton}
                >
                  {category.name || category.title}
                </button>
              ))
            )}
          </div>
        </div>
        <div className={styles.filterSection}>
          <h4>Price Range</h4>
          <div className={styles.priceInputs}>
            <input type="number" placeholder="Min" className={styles.priceInput} />
            <span>-</span>
            <input type="number" placeholder="Max" className={styles.priceInput} />
          </div>
        </div>
        <div className={styles.filterSection}>
          <h4>Location</h4>
          <input type="text" placeholder="Enter location" className={styles.locationInput} />
        </div>
      </div>
    </div>

      <div className={styles.container}>
        {/* Error state */}
        {isError ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorText}>
              {'Failed to load ads'}
            </div>
          </div>
        ) : (
          /* Empty state */
          !isLoading && ads.length === 0 ? (
            <div className={styles.emptyContainer}>
              <SearchIcon className={styles.searchIcon} />
              <div className={styles.emptyText}>
                No ads found
              </div>
              <div className={styles.emptySubtext}>
                Be the first to post an ad in this category!
              </div>
            </div>
          ) : (
            /* Main content - Grid of ads */
            <div className={styles.mainContent}>
              {isLoading ? (
                renderLoadingSkeleton()
              ) : (
                <div className={styles.adsGrid}>
                  {ads.map((ad) => (
                    <div key={ad._id} className={styles.adItem}>
                      <Ad
                        id={ad._id}
                        title={ad.title}
                        description={ad.description}
                        price={ad.price}
                        location={ad.location}
                        imageUrl={ad.photos?.[0] ? `${process.env.REACT_APP_API_URL}${ad.photos[0]}` : ''}
                        user={ad.user_id}
                        createdAt={ad.createdAt}
                        category={ad.category}
                        isEditable={userData?._id === ad.user_id?._id}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};