import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

import styles from './CreateAd.module.scss';
import { selectIsAuth } from '../../redux/slices/auth';
import { createAd, fetchCategories, uploadPhotos } from '../../redux/slices/ads';

export const CreateAd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const { categories } = useSelector((state) => state.ads);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      category: '',
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSubmit = async (values) => {
    if (!isAuth) return;

    setIsSubmitting(true);
    
    try {
      let imageUrls = [];
      
      if (selectedFiles.length > 0) {
        const uploadResult = await dispatch(uploadPhotos(selectedFiles));
        console.log('Upload result:', uploadResult);
        if (uploadResult.payload) {
            const fullUrls = uploadResult.payload.photos || [];
            imageUrls = fullUrls.map(url => {
                return url.replace('/uploads/ads/', '');
            });
        }
      }

      const adData = {
        ...values,
        price: parseFloat(values.price),
        photos: imageUrls,
      };

      const result = await dispatch(createAd(adData));
      
      if (result.payload) {
        navigate(`/ads/${result.payload._id}`);
      } else {
        alert('Nie udało się utworzyć ogłoszenia!');
      }
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Wystąpił błąd podczas tworzenia ogłoszenia!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Dodaj nowe ogłoszenie
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Tytuł ogłoszenia"
          error={Boolean(errors.title?.message)}
          helperText={errors.title?.message}
          {...register('title', { 
            required: 'Podaj tytuł ogłoszenia',
            minLength: {
              value: 5,
              message: 'Tytuł musi mieć co najmniej 5 znaków'
            }
          })}
          fullWidth
        />

        <TextField
          className={styles.field}
          label="Opis"
          multiline
          rows={4}
          error={Boolean(errors.description?.message)}
          helperText={errors.description?.message}
          {...register('description', { 
            required: 'Podaj opis ogłoszenia',
            minLength: {
              value: 20,
              message: 'Opis musi mieć co najmniej 20 znaków'
            }
          })}
          fullWidth
        />

        <TextField
          className={styles.field}
          label="Cena (PLN)"
          type="number"
          error={Boolean(errors.price?.message)}
          helperText={errors.price?.message}
          {...register('price', { 
            required: 'Podaj cenę',
            min: {
              value: 0,
              message: 'Cena nie może być ujemna'
            }
          })}
          fullWidth
        />

        <TextField
          className={styles.field}
          label="Lokalizacja"
          error={Boolean(errors.location?.message)}
          helperText={errors.location?.message}
          {...register('location', { required: 'Podaj lokalizację' })}
          fullWidth
        />

        <Controller
          name="category"
          control={control}
          rules={{ required: 'Wybierz kategorię' }}
          render={({ field }) => (
            <FormControl className={styles.field} fullWidth error={Boolean(errors.category)}>
              <InputLabel>Kategoria</InputLabel>
              <Select
                {...field}
                label="Kategoria"
              >
                {categories.items.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Box className={styles.uploadSection}>
          <Typography variant="body2" className={styles.uploadLabel}>
            Zdjęcia (opcjonalne)
          </Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {selectedFiles.length > 0 && (
            <Typography variant="body2" className={styles.fileCount}>
              Wybrano plików: {selectedFiles.length}
            </Typography>
          )}
        </Box>

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