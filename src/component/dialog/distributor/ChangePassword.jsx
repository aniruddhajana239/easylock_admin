// components/dialog/distributor/ChangePassword.js
import { useEffect } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { distributorActions } from '../../../redux/reducers/distributor/DistributorSlice';
import { useAlert } from '../../../context/customContext/AlertContext';
import { distributorSelector } from '../../../redux/selector/distributor/DistributorSelector';
import { FaLock, FaTimes } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// Validation schema
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
  });
  
  const dispatch = useDispatch();
  const selector = useSelector(distributorSelector);
  const { showAlert } = useAlert();

  const onSubmit = (data) => {
    dispatch(distributorActions.updatePasswordByAdmin(data));
  };

  // useEffect to handle alert and clear message
  useEffect(() => {
    if (selector?.data?.data?.message) {
      if (selector?.data?.data?.status === false) {
        showAlert("error", selector?.data?.data?.message);
      } else if (selector?.data?.data?.status === true) {
        showAlert("success", selector?.data?.data?.message);
        reset();
        handleClose();
      }
      dispatch(distributorActions.clearMessage());
    }
  }, [selector, dispatch, showAlert, handleClose, reset]);

  const onClose = () => {
    reset();
    handleClose();
  };

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
          width: 400,
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
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Change Password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Update user account password
              </p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                    InputProps={{
                      startAdornment: (
                        <MdEmail className="text-slate-400 text-sm mr-2" />
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
                    }}
                  />
                </div>
              )}
            />

            {/* New Password Field */}
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="New Password"
                    type="password"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    required
                    InputProps={{
                      startAdornment: (
                        <FaLock className="text-slate-400 text-sm mr-2" />
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
                    }}
                  />
                </div>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Confirm New Password"
                    type="password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    required
                    InputProps={{
                      startAdornment: (
                        <FaLock className="text-slate-400 text-sm mr-2" />
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
                    }}
                  />
                </div>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
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