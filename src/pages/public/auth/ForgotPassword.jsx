import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { ForgotPasswordActions } from "../../../redux/reducers/forgotPassword/ForgotPasswordSlice";
import { forgotPasswordSelector } from "../../../redux/selector/forgotPassword/ForgotPasswordSelector";
import { useAlert } from "../../../context/customContext/AlertContext";
import { useNavigate } from "react-router";
import { IoIosArrowDropleft } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ForgotPasswordModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(120);
  const [showPassword, setShowPassword] = useState(false);  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  
  const forgotPasswordData = useSelector(forgotPasswordSelector);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const validationSchemas = [
    Yup.object().shape({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    Yup.object().shape({
      otp: Yup.string().required("OTP is required").length(4, "OTP must be 4 digits"),
    }),
    Yup.object().shape({
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    }),
  ];

  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchemas[step - 1]),
    defaultValues: { email: "", otp: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOTP = async (data) => {
    const { email } = data;
    await dispatch(ForgotPasswordActions.sendEmail({ email }));
    setStep(2);
    setTimer(120);
  };

  const handleVerifyOTP = async (data) => {
    const { otp } = data;
    await dispatch(ForgotPasswordActions.VerifyOtp({ email: data.email, otp }));
    setStep(3);
  };

  const handleSavePassword = async (data) => {
    const { newPassword, confirmPassword } = data;
    await dispatch(
      ForgotPasswordActions.forgotPassword({
        email: data.email,
        newPassword,
        confirmPassword,
      })
    );

    const { status, message } = forgotPasswordData?.data || {};

    if (status === false) {
      showAlert("error", message || "Failed to update password.");
      return;
    }

    showAlert("success", message || "Password updated successfully.");
    reset();
    onClose();
  };

  const handleResendOTP = () => {
    const email = forgotPasswordData?.data?.email;
    if (!email) {
      showAlert("error", "Email is missing. Please try again.");
      return;
    }
    setTimer(120);
    reset({ otp: "" });
    dispatch(ForgotPasswordActions.sendEmail({ email }));
    showAlert("success", "OTP has been resent successfully.");
  };

  const onSubmit = (data) => {
    clearErrors();
    if (step === 1) handleSendOTP(data);
    if (step === 2) handleVerifyOTP(data);
    if (step === 3) handleSavePassword(data);
  };

  useEffect(() => {
    if (forgotPasswordData && forgotPasswordData?.data?.status) {
      if (forgotPasswordData.data.message) {
        showAlert("success", forgotPasswordData?.data?.message);
        dispatch(ForgotPasswordActions.reset());
        dispatch(ForgotPasswordActions.clearMessage());
      }
      if (forgotPasswordData?.data?.data?.user_id) {
        navigate("/", { replace: true });
      }
    } else if (forgotPasswordData?.data?.status === false) {
      onClose();
      showAlert("error", forgotPasswordData.data.message);
      dispatch(ForgotPasswordActions.reset());
      dispatch(ForgotPasswordActions.clearMessage());
    }
  }, [forgotPasswordData, dispatch, navigate, showAlert]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {step === 2 && (
          <IconButton
            onClick={() => setStep((prev) => prev - 1)}
            style={{
              position: "absolute",
              left: 8,
            }}
          >
            <IoIosArrowDropleft size={24} />
          </IconButton>
        )}
        <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
          Forgot Password
        </span>
        <IconButton
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Button variant="contained" color="primary" fullWidth type="submit">
                Send OTP
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter OTP"
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                  />
                )}
              />
              <div style={{ marginBottom: 16, textAlign: "start" }}>
                {timer > 0 ? (
                  <span>
                    Resend OTP in {Math.floor(timer / 60)}:
                    {timer % 60 < 10 ? "0" : ""}
                    {timer % 60}
                  </span>
                ) : (
                  <p
                    onClick={() => {
                      handleResendOTP();
                      clearErrors("otp");
                    }}
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                      margin: 0,
                    }}
                  >
                    Resend OTP
                  </p>
                )}
              </div>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Verify OTP
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type={showPassword ? "text" : "password"}  // Toggle password visibility
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}  // Toggle password visibility
                    fullWidth
                    margin="normal"
                    size="small"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Button variant="contained" color="primary" fullWidth type="submit">
                Save
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
