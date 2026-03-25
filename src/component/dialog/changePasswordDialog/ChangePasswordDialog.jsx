// components/dialog/changePasswordDialog/ChangePasswordDialog.js
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import * as Yup from "yup";
import Dialog from "@mui/material/Dialog";
import { useAlert } from '../../../context/customContext/AlertContext';
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { authPasswordSelector } from "../../../redux/selector/auth/authPasswordSelector";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { authPasswordActions } from "../../../redux/reducers/auth/authPasswordSlice";
import { useNavigate } from "react-router";

const changePasswordSchema = object().shape({
  oldPassword: string().required("Please enter old password"),
  newPassword: string().required("Please please enter new password"),
  confirmPassword: string()
    .required("Please enter confirm password")
    .oneOf([Yup.ref("newPassword")], "Confirm Password not matched"),
});

export const ChangePasswordDialog = ({ open, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });
  const dispatch = useDispatch();
  const authData = useSelector(authSelector);
  const authPasswordData = useSelector(authPasswordSelector);
  const [showPassword, setShowPassword] = React.useState(null);
  const {showAlert} = useAlert();

  useNavigate();

  const onSubmit = (data) => {
    const body = { ...data };
    body.id = authData?.data?.userData?.id;
    dispatch(authPasswordActions.updatePassword(body));
  };

  useEffect(() => {
    if(authPasswordData?.data?.message){
      if(authPasswordData?.data?.status === false){
        showAlert("error", authPasswordData?.data?.message);
      } else if(authPasswordData?.data?.status === true){
        showAlert("success", authPasswordData?.data?.message);
        reset();
        onClose(false);
      }
      dispatch(authPasswordActions.clearMessage());
    }
  }, [authPasswordData, dispatch, onClose, showAlert, reset]);

  const handleClose = () => {
    reset();
    onClose(false);
  };

  // Password field component
  const PasswordField = ({ control, name, label, index }) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel htmlFor={`password-${name}`} sx={{ fontSize: '0.875rem' }}>
            {label}
          </InputLabel>
          <OutlinedInput
            id={`password-${name}`}
            type={showPassword === index ? "text" : "password"}
            value={field.value || ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            startAdornment={
              <InputAdornment position="start">
                <FaLock className="text-slate-400 text-sm" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword(showPassword !== null ? null : index);
                  }}
                  edge="end"
                  size="small"
                >
                  {showPassword === index ? (
                    <MdVisibilityOff className="text-slate-400 text-sm" />
                  ) : (
                    <MdVisibility className="text-slate-400 text-sm" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label={label}
            sx={{
              backgroundColor: '#f9fafc',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#94a3b8',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#16AFF6',
              },
            }}
          />
        </FormControl>
      )}
    />
  );

  return (
    <Dialog 
      open={open ? true : false} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Change Password
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Update your account password
            </p>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Form */}
        <div className="py-4">
          <div className="space-y-4">
            {/* Old Password */}
            <div>
              <PasswordField
                control={control}
                name="oldPassword"
                label="Current Password"
                index={0}
              />
              {errors?.oldPassword && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors?.oldPassword?.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <PasswordField
                control={control}
                name="newPassword"
                label="New Password"
                index={1}
              />
              {errors?.newPassword && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors?.newPassword?.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <PasswordField
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                index={2}
              />
              {errors?.confirmPassword && (
                <p className="text-xs text-rose-600 mt-1">
                  {errors?.confirmPassword?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button
            onClick={handleClose}
            variant="outlined"
            size="small"
            sx={{
              color: '#64748b',
              borderColor: '#e2e8f0',
              fontSize: '0.75rem',
              padding: '4px 12px',
              textTransform: 'none',
              minWidth: '70px',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            disabled={authData?.isFetching}
            onClick={handleSubmit(onSubmit)}
            sx={{
              backgroundColor: '#16AFF6',
              color: '#FFF',
              fontSize: '0.75rem',
              padding: '4px 12px',
              textTransform: 'none',
              boxShadow: 'none',
              minWidth: '70px',
              '&:hover': {
                backgroundColor: '#0F8FC9',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                backgroundColor: '#94a3b8',
              },
            }}
          >
            {authData.isFetching ? (
              <CircularProgress size={14} sx={{ color: '#FFF' }} />
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};