import React from 'react';
import { Button, IconButton } from '@mui/material';
import {
  Edit,
  ToggleOff,
  ToggleOn,
  Delete
} from '@mui/icons-material';
import styles from './OwnerActions.module.scss';

export const OwnerActions = ({ 
  ad, 
  onEdit, 
  onToggle, 
  onDelete 
}) => {
  return (
    <div className={styles.ownerActions}>
      <Button
        variant="outlined"
        startIcon={<Edit />}
        onClick={onEdit}
        size="small"
      >
        Edytuj
      </Button>
      <IconButton
        onClick={onToggle}
        color={ad.active ? 'success' : 'default'}
        title={ad.active ? 'Dezaktywuj ogłoszenie' : 'Aktywuj ogłoszenie'}
      >
        {ad.active ? <ToggleOn /> : <ToggleOff />}
      </IconButton>
      <IconButton
        onClick={onDelete}
        color="error"
        title="Usuń ogłoszenie"
      >
        <Delete />
      </IconButton>
    </div>
  );
};