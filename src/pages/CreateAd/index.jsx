import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Typography, Paper, Button } from '@mui/material';
import { selectIsAuth } from '../../redux/slices/auth';
import { fetchCategories } from '../../redux/slices/ads';
import { TextFormField, SelectFormField, PhotoUpload } from '../../components';
import { useAdForm } from '../../hooks/useAdForm';
import { createAdValidationRules, createAdDefaultValues } from '../../utils/validationRules';
import styles from './CreateAd.module.scss';

export const CreateAd = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { categories } = useSelector(state => state.ads);
  const { selectedFiles, isSubmitting, handleFileChange, submitAd } = useAdForm();
  
  const { register, handleSubmit, formState: { errors, isValid }, control } = useForm({
    createAdDefaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (!isAuth) return <Navigate to="/login" />;

  const categoryOptions = categories.items?.map(category => ({
    value: category._id,
    label: category.name
  })) || [];

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Dodaj nowe ogłoszenie
      </Typography>
      
      <form onSubmit={handleSubmit(submitAd)}>
        <TextFormField
          register={register}
          error={errors.title}
          name="title"
          label="Tytuł ogłoszenia"
          validation={createAdValidationRules.title}
        />

        <TextFormField
          register={register}
          error={errors.description}
          name="description"
          label="Opis"
          multiline
          rows={4}
          validation={createAdValidationRules.description}
        />

        <TextFormField
          register={register}
          error={errors.price}
          name="price"
          label="Cena (PLN)"
          type="number"
          validation={createAdValidationRules.price}
        />

        <TextFormField
          register={register}
          error={errors.location}
          name="location"
          label="Lokalizacja"
          validation={createAdValidationRules.location}
        />

        <SelectFormField
          control={control}
          error={errors.category}
          name="category"
          label="Kategoria"
          options={categoryOptions}
          validation={createAdValidationRules.category}
        />

        <PhotoUpload
          selectedFiles={selectedFiles}
          onFileChange={handleFileChange}
        />

        <Button 
          disabled={!isValid || isSubmitting} 
          type="submit" 
          size="large" 
          variant="contained" 
          fullWidth
          className={styles.submitButton}
        >
          {isSubmitting ? 'Tworzenie...' : 'Dodaj ogłoszenie'}
        </Button>
      </form>
    </Paper>
  );
};