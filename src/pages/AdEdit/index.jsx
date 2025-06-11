import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Typography, Paper, Button, CircularProgress, Alert, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { fetchAd, updateAd, fetchCategories, uploadPhotos } from '../../redux/slices/ads';
import { selectIsAuth } from '../../redux/slices/auth';
import { TextFormField, SelectFormField, PhotoUpload } from '../../components';
import { createAdValidationRules } from '../../utils/validationRules';
import styles from './AdEdit.module.scss';

export const AdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { currentAd, categories } = useSelector(state => state.ads);
  const currentUser = useSelector(state => state.auth.data);
  
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, control, reset } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchAd(id));
    }
    dispatch(fetchCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentAd.data) {
      reset({
        title: currentAd.data.title || '',
        description: currentAd.data.description || '',
        price: currentAd.data.price || '',
        location: currentAd.data.location || '',
        category: currentAd.data.category || '',
      });
    }
  }, [currentAd.data, reset]);

  const ad = currentAd.data;
  const isOwner = isAuth && currentUser && ad?.user_id?._id === currentUser._id;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const processPhotos = async () => {
    if (selectedFiles.length === 0) return ad?.photos || [];

    const uploadResult = await dispatch(uploadPhotos(selectedFiles));
    if (uploadResult.payload) {
      const fullUrls = uploadResult.payload.photos || [];
      return fullUrls.map((url) => url.replace("/uploads/ads/", ""));
    }
    return ad?.photos || [];
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const imageUrls = await processPhotos();

      const adData = {
        id,
        title: values.title,
        description: values.description,
        price: parseFloat(values.price),
        location: values.location,
        category: values.category,
        photos: imageUrls,
      };

      const result = await dispatch(updateAd(adData));

      if (result.payload) {
        navigate(`/ads/${id}`);
      } else {
        alert("Nie udało się zaktualizować ogłoszenia!");
      }
    } catch (error) {
      console.error("Error updating ad:", error);
      alert("Wystąpił błąd podczas aktualizacji ogłoszenia!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/ads/${id}`);
  };

  if (!isAuth) {
    return (
      <Container maxWidth="sm" className={styles.container}>
        <Alert severity="error">
          Musisz być zalogowany, aby edytować ogłoszenie.
        </Alert>
      </Container>
    );
  }

  if (currentAd.status === 'loading') {
    return (
      <Container maxWidth="sm" className={styles.container}>
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
      <Container maxWidth="sm" className={styles.container}>
        <Alert severity="error" className={styles.errorAlert}>
          Nie udało się załadować ogłoszenia.
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Wróć do strony głównej
        </Button>
      </Container>
    );
  }

  if (!isOwner) {
    return (
      <Container maxWidth="sm" className={styles.container}>
        <Alert severity="error">
          Nie masz uprawnień do edycji tego ogłoszenia.
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Wróć do ogłoszenia
        </Button>
      </Container>
    );
  }

  const categoryOptions = categories.items?.map(category => ({
    value: category._id,
    label: category.name
  })) || [];

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={handleBack}
        className={styles.backButton}
      >
        Wróć do ogłoszenia
      </Button>

      <Paper className={styles.root}>
        <Typography className={styles.title} variant="h5">
          Edytuj ogłoszenie
        </Typography>
        
        <form onSubmit={handleSubmit(onSubmit)}>
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
            existingPhotos={ad.photos}
          />

          <div className={styles.buttonGroup}>
            <Button 
              variant="outlined"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button 
              disabled={!isValid || isSubmitting} 
              type="submit" 
              size="large" 
              variant="contained"
              className={styles.submitButton}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};