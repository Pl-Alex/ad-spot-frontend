// src/components/Ad/index.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './Ad.module.scss';
import { useDispatch } from 'react-redux';
import { UserInfo } from '../UserInfo';
import { fetchRemoveAd } from '../../redux/slices/ads';

export const Ad = ({
  id,
  title,
  description,
  price,
  location,
  imageUrl,
  user,
  createdAt,
  category,
  isEditable = false,
}) => {
  
  const dispatch = useDispatch();

  const onClickRemove = () => {
    if (window.confirm('Do you really want to delete this ad?')) {
      dispatch(fetchRemoveAd(id));
    }
  };

  return (
    <div className={styles.root}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/ads/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img className={styles.image} src={imageUrl} alt={title} />
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={createdAt} />
        <h2 className={styles.title}>
          <Link to={`/ads/${id}`}>{title}</Link>
        </h2>
        <div className={styles.meta}>
          <span className={styles.category}>{category?.name}</span>
        </div>
      </div>
    </div>
  );
};
