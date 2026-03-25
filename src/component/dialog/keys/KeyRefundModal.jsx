// components/dialog/keys/KeyRefundModal.js
import { useEffect, useState } from 'react';
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress
} from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAlert } from '../../../context/customContext/AlertContext';
import { KeysApi } from '../../../api/keys/KeysApi';
import { FaTimes, FaCoins, FaUser, FaUserTie, FaUsers, FaShieldAlt } from 'react-icons/fa';

const KeyRefund = ({ open, handleClose, userId, userType = 'retailer', availableTokens = 0 }) => {
  // Create validation schema dynamically based on availableTokens
  const createValidationSchema = (maxTokens) => {
    return yup.object().shape({
      quantity: yup
        .number()
        .typeError('Quantity must be a number')
        .integer('Quantity must be an integer')
        .positive('Quantity must be positive')
        .max(maxTokens, `Quantity cannot exceed available tokens (${maxTokens})`)
        .required('Quantity is required'),
      to: yup
        .string()
        .required('Please select a refund type'),
    });
  };

  const [validationSchema, setValidationSchema] = useState(
    createValidationSchema(availableTokens)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset, setValue, trigger } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      quantity: '',
      to: userType === 'super-distributor' ? 'admin' : ''
    },
    mode: 'onChange'
  });

  const [availableOptions, setAvailableOptions] = useState([]);

  // Update validation schema when availableTokens changes
  useEffect(() => {
    const newSchema = createValidationSchema(availableTokens);
    setValidationSchema(newSchema);
  }, [availableTokens]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        quantity: '',
        to: userType === 'super-distributor' ? 'admin' : ''
      });
      setIsSubmitting(false);
    }
  }, [open, reset, userType]);

  // Determine available radio options based on user type
  useEffect(() => {
    const options = [];
    
    switch(userType) {
      case 'retailer':
        options.push(
          { value: 'admin', label: 'Admin', icon: FaShieldAlt },
          { value: 'superdistributor', label: 'Super Distributor', icon: FaUserTie },
          { value: 'distributor', label: 'Distributor', icon: FaUsers }
        );
        break;
      case 'distributor':
        options.push(
          { value: 'admin', label: 'Admin', icon: FaShieldAlt },
          { value: 'superdistributor', label: 'Super Distributor', icon: FaUserTie }
        );
        break;
      case 'super-distributor':
        options.push(
          { value: 'admin', label: 'Admin', icon: FaShieldAlt }
        );
        setValue('to', 'admin');
        break;
      default:
        options.push(
          { value: 'admin', label: 'Admin', icon: FaShieldAlt },
          { value: 'superdistributor', label: 'Super Distributor', icon: FaUserTie },
          { value: 'distributor', label: 'Distributor', icon: FaUsers }
        );
    }
    
    setAvailableOptions(options);
  }, [userType, setValue]);

  // Revalidate quantity when availableTokens changes
  useEffect(() => {
    if (control) {
      trigger('quantity');
    }
  }, [availableTokens, trigger]);

  const { showAlert } = useAlert();

  const onSubmit = async (data) => {
    // Check if quantity exceeds available tokens (double-check)
    if (parseInt(data.quantity) > availableTokens) {
      showAlert("error", `Cannot refund more than available tokens (${availableTokens})`);
      return;
    }

    // Prepare request body
    const body = {
      ...data,
      userId: userId,
      token: data?.quantity
    };

    setIsSubmitting(true);

    try {
      const response = await KeysApi.refundToken(body);
      
      if (response?.data?.status === true) {
        showAlert("success", response?.data?.message || "Tokens refunded successfully!");
        reset();
        handleClose(true);
      } else {
        showAlert("error", response?.data?.message || "Failed to refund tokens");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error refunding tokens:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          "An error occurred while refunding tokens";
      showAlert("error", errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    reset();
    handleClose();
  };

  // Get icon for user type
  const getUserTypeIcon = (userType) => {
    switch(userType) {
      case 'retailer': return FaUser;
      case 'distributor': return FaUsers;
      case 'super-distributor': return FaUserTie;
      default: return FaUser;
    }
  };

  const UserTypeIcon = getUserTypeIcon(userType);

  return (
    <Modal 
      open={open} 
      onClose={handleCloseModal}
      aria-labelledby="refund-key-modal"
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
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <FaCoins className="text-blue-600 text-sm" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Refund Key
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Refund tokens to higher authorities
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Available Tokens Info */}
        <div className="px-4 pt-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <UserTypeIcon className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Available Tokens</p>
                <p className="text-lg font-semibold text-slate-900">{availableTokens}</p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
              {userType}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Quantity Field */}
            <Controller
              name="quantity"
              control={control}
              render={({ field }) => (
                <div>
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label={`Quantity (Max: ${availableTokens})`}
                    type="number"
                    inputProps={{ 
                      min: 1,
                      max: availableTokens,
                      step: 1
                    }}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message || `Enter quantity between 1 and ${availableTokens}`}
                    required
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <FaCoins className="text-slate-400 text-sm mr-2" />
                      ),
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        const numValue = parseInt(value);
                        if (value === '' || (numValue > 0 && numValue <= availableTokens)) {
                          field.onChange(value);
                        } else if (numValue > availableTokens) {
                          field.onChange(value);
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value && parseInt(e.target.value) > availableTokens) {
                        field.onChange(availableTokens.toString());
                      }
                      field.onBlur();
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

            {/* Refund Type Radio Group */}
            <Controller
              name="to"
              control={control}
              render={({ field }) => (
                <FormControl 
                  component="fieldset" 
                  error={!!errors.to}
                  fullWidth
                >
                  <FormLabel 
                    component="legend" 
                    required
                    sx={{ 
                      fontSize: '0.875rem',
                      color: '#64748b',
                      mb: 1
                    }}
                  >
                    Refund To
                  </FormLabel>
                  <RadioGroup
                    {...field}
                    sx={{ mt: 0 }}
                    disabled={isSubmitting}
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {availableOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio size="small" sx={{ color: '#94a3b8' }} />}
                            label={
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-slate-100 rounded-md">
                                  <Icon className="text-slate-600 text-xs" />
                                </div>
                                <span className="text-sm text-slate-700">{option.label}</span>
                              </div>
                            }
                            disabled={isSubmitting || (userType === 'super-distributor' && option.value === 'admin')}
                            className="border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50 transition-colors"
                          />
                        );
                      })}
                    </div>
                  </RadioGroup>
                  {errors.to && (
                    <p className="text-xs text-rose-600 mt-1">
                      {errors.to.message}
                    </p>
                  )}
                </FormControl>
              )}
            />

            {/* Info text */}
            <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
              You can refund up to <span className="font-semibold text-slate-700">{availableTokens}</span> {availableTokens > 1 ? "tokens" : "token"} maximum.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                size="small"
                disabled={isSubmitting}
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
                disabled={availableTokens === 0 || isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={14} sx={{ color: '#FFF' }} />}
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
                  '&.Mui-disabled': {
                    backgroundColor: '#94a3b8',
                  },
                }}
              >
                {isSubmitting ? 'Refunding...' : 'Refund Tokens'}
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default KeyRefund;