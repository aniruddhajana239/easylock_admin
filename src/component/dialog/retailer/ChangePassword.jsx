// components/dialog/retailer/ChangePassword.js
import React, { useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { retailerActions } from '../../../redux/reducers/retailer/RetailerSlice';
import { retailerSelector } from '../../../redux/selector/retailer/RetailerSelector';
import { useAlert } from '../../../context/customContext/AlertContext';
import { FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm new password is required'),
});

const ChangePassword = ({ open, handleClose }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const dispatch = useDispatch();
  const selector = useSelector(retailerSelector);
  const { showAlert } = useAlert();

  const onSubmit = (data) => {
    dispatch(retailerActions.updatePasswordByAdmin(data));
  };

  useEffect(() => {
    if (selector?.data?.message) {
      if (selector?.data?.status === false) {
        showAlert("error", selector?.data?.message);
      } else if (selector?.data?.status === true) {
        showAlert("success", selector?.data?.message);
        reset();
        handleClose();
      }
      dispatch(retailerActions?.clearMessage());
    }
  }, [selector, dispatch, showAlert, reset, handleClose]);

  const onClose = () => {
    reset();
    handleClose();
  };

  // Custom Input Field Component
  const InputField = ({ icon: Icon, name, label, type = "text" }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          size="small"
          margin="normal"
          label={label}
          type={type}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          required
          InputProps={{
            startAdornment: (
              <div className="mr-2">
                <Icon className="text-slate-400 text-sm" />
              </div>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f9fafc',
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#94a3b8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#16AFF6',
              },
            },
            '& .MuiInputLabel-root': {
              fontSize: '0.875rem',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '0.75rem',
              marginLeft: 0,
            },
          }}
        />
      )}
    />
  );

  return (
    <Modal 
      open={open} 
      onClose={onClose}
      aria-labelledby="change-password-modal"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: 0,
          borderRadius: 2,
          outline: 'none',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <FaLock className="text-blue-600 text-sm" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Change Password
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Update retailer account password
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Email Field */}
            <InputField
              icon={MdEmail}
              name="email"
              label="Email"
              type="email"
            />

            {/* New Password Field */}
            <InputField
              icon={FaLock}
              name="newPassword"
              label="New Password"
              type="password"
            />

            {/* Confirm Password Field */}
            <InputField
              icon={FaLock}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 mt-2 border-t border-slate-100">
              <Button
                onClick={onClose}
                variant="outlined"
                size="small"
                sx={{
                  color: '#64748b',
                  borderColor: '#e2e8f0',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#16AFF6',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#0F8FC9',
                    boxShadow: 'none',
                  },
                }}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangePassword;