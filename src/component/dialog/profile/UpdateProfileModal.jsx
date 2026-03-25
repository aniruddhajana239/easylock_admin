// components/dialog/profile/UpdateProfileModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { profileActions } from "../../../redux/reducers/profile/ProfileSlice";
import { useAlert } from "../../../context/customContext/AlertContext";
import { profileSelector } from "../../../redux/selector/profile/ProfileSelector";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { distributorActions } from "../../../redux/reducers/distributor/DistributorSlice";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCity, 
  FaGlobe, 
  FaMapPin,
  FaTimes,
  FaSave
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const validationSchema = yup.object({
  fullName: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Full Name must only contain letters")
    .required("Full Name is required"),
  contactNo: yup
    .string()
    .matches(/^[0-9]{10}$/, "Contact Number must be 10 digits")
    .required("Contact Number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pinCode: yup
    .string()
    .matches(/^[0-9]{6}$/, "PIN Code must be 6 digits")
    .required("PIN Code is required"),
});

const UpdateProfileModal = ({ open, onClose, userData, onProfileUpdate }) => {
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: userData,
    resolver: yupResolver(validationSchema),
  });
  const authSelect = useSelector(authSelector);
  const profileSelect = useSelector(profileSelector);
  const [loading, setLoading] = useState(false);

  // Reset form when userData changes
  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(profileActions.update_profile(data, authSelect?.data?.accessToken));
      showAlert(
        "success",
        profileSelect?.data?.message || "Profile updated successfully!"
      );
      reset(data);
      onClose(true);
      if (authSelect?.data?.userType === "admin") {
        dispatch(profileActions.getUserData(authSelect?.data?.accessToken));
      } else if (authSelect?.data?.userType === "distributor") {
        dispatch(distributorActions.getDistributorProfile());
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      showAlert("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset(userData);
    onClose(false);
  };

  // Custom Input Field Component
  const InputField = ({ icon: Icon, name, label, disabled = false, multiline = false, rows = 1 }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          size="small"
          fullWidth
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          InputProps={{
            startAdornment: Icon && (
              <div className="mr-2">
                <Icon className="text-slate-400 text-sm" />
              </div>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: disabled ? '#f1f5f9' : '#f9fafc',
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
      onClose={handleClose}
      aria-labelledby="update-profile-modal"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 outline-none max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 rounded-md">
                <FaUser className="text-blue-600 text-sm" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  Update Profile
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Edit your personal information
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={FaUser}
                  name="fullName"
                  label="Full Name"
                />
              </Grid>

              {/* Email (Disabled) */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={MdEmail}
                  name="email"
                  label="Email"
                  disabled
                />
              </Grid>

              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={FaPhone}
                  name="contactNo"
                  label="Contact Number"
                />
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={FaCity}
                  name="city"
                  label="City"
                />
              </Grid>

              {/* State */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={FaGlobe}
                  name="state"
                  label="State"
                />
              </Grid>

              {/* PIN Code */}
              <Grid item xs={12} sm={6}>
                <InputField
                  icon={FaMapPin}
                  name="pinCode"
                  label="PIN Code"
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <InputField
                  icon={FaMapMarkerAlt}
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <Button
                onClick={handleClose}
                variant="outlined"
                size="small"
                disabled={loading}
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
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} sx={{ color: '#FFF' }} /> : <FaSave className="text-sm" />}
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateProfileModal;