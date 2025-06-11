import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';
import styles from './FormField.module.scss';

export const TextFormField = ({ register, error, name, label, type = 'text', multiline = false, rows = 1, validation }) => (
  <TextField
    className={styles.field}
    label={label}
    type={type}
    multiline={multiline}
    rows={rows}
    error={Boolean(error)}
    helperText={error?.message}
    {...register(name, validation)}
    fullWidth
  />
);

export const SelectFormField = ({ control, error, name, label, options, validation }) => (
  <Controller
    name={name}
    control={control}
    rules={validation}
    render={({ field }) => (
      <FormControl className={styles.field} fullWidth error={Boolean(error)}>
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);