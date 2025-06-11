import React from 'react';
import {
  Grid,
  Card,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import styles from './FiltersCard.module.scss';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Najnowsze' },
  { value: 'oldest', label: 'Najstarsze' },
  { value: 'price-low', label: 'Cena: od najniższej' },
  { value: 'price-high', label: 'Cena: od najwyższej' },
  { value: 'title', label: 'Tytuł A-Z' }
];

export const FiltersCard = ({ filters, categories, onFilterChange, onClearFilters }) => (
  <Card className={styles.filtersCard}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Szukaj ogłoszeń..."
          value={filters.search}
          onChange={e => onFilterChange('search', e.target.value)}
          size="small"
        />
      </Grid>

      <Grid className={styles.categorySelect} item xs={12} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={filters.category}
            label="Kategoria"
            onChange={e => onFilterChange('category', e.target.value)}
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
          onChange={e => onFilterChange('minPrice', e.target.value)}
          size="small"
        />
      </Grid>

      <Grid item xs={6} md={1.5}>
        <TextField
          fullWidth
          label="Cena maks."
          type="number"
          value={filters.maxPrice}
          onChange={e => onFilterChange('maxPrice', e.target.value)}
          size="small"
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Lokalizacja"
          value={filters.location}
          onChange={e => onFilterChange('location', e.target.value)}
          size="small"
        />
      </Grid>

      <Grid item xs={12} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Sortuj według</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sortuj według"
            onChange={e => onFilterChange('sortBy', e.target.value)}
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
        <Button variant="outlined" onClick={onClearFilters} size="small" fullWidth>
          Wyczyść
        </Button>
      </Grid>
    </Grid>
  </Card>
);