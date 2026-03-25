// components/dialog/retailer/AddRetailer.js
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress,
  Backdrop
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "../../../context/customContext/AlertContext";
import { retailerSchema } from "../../../validation/private/retailer/RetailerSchema";
import { retailerSelector } from "../../../redux/selector/retailer/RetailerSelector";
import { retailerActions } from "../../../redux/reducers/retailer/RetailerSlice";
import { Country, State, City } from "country-state-city";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaLock, 
  FaMapMarkerAlt, 
  FaCity, 
  FaGlobe, 
  FaMapPin,
  FaImage,
  FaTimes,
  FaStore
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const AddRetailer = ({ open, onClose }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(retailerSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      contactNo: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      password: "",
      confirmPassword: "",
      profilePic: null,
    },
  });

  const [uploadedImage, setUploadedImage] = useState();
  const dispatch = useDispatch();
  const selector = useSelector(retailerSelector);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  
  const onSubmit = (data) => {
    setIsLoading(true);
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (key !== 'profilePic' || (key === 'profilePic' && data[key])) {
        formData.append(key, data[key]);
      }
    });
    
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    dispatch(retailerActions.add(formData));
  };

  useEffect(() => {
    if (selector?.data?.status === true && selector?.data?.message) {
      showAlert("success", selector?.data?.message);
      setIsLoading(false);
      setUploadedImage(null);
      onClose(true);
      dispatch(retailerActions.clearMessage);
      reset();
    } else if (selector?.data?.status === false && selector?.data?.message) {
      setIsLoading(false);
      showAlert("error", selector?.data?.message);
      dispatch(retailerActions.clearMessage);
    }
  }, [selector]);

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryOptions(countries);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry);
      setStateOptions(states);
      setCityOptions([]);
      setValue("state", "");
      setValue("city", "");
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState);
      setCityOptions(cities);
      setValue("city", "");
    } else {
      setCityOptions([]);
    }
  }, [selectedState, selectedCountry, setValue]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Custom Input Field Component
  const InputField = ({ icon: Icon, name, label, type = "text", ...props }) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          type={type}
          fullWidth
          variant="outlined"
          size="small"
          error={!!errors[name]}
          helperText={errors[name]?.message}
          InputProps={{
            startAdornment: Icon && (
              <InputAdornment position="start">
                <Icon className="text-slate-400 text-sm" />
              </InputAdornment>
            ),
            ...(name === "password" || name === "confirmPassword" ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={name === "password" ? handleClickShowPassword : handleClickShowConfirmPassword}
                    edge="end"
                    size="small"
                  >
                    {(name === "password" ? showPassword : showConfirmPassword) ? 
                      <VisibilityOff className="text-slate-400 text-sm" /> : 
                      <Visibility className="text-slate-400 text-sm" />
                    }
                  </IconButton>
                </InputAdornment>
              )
            } : {})
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
      )}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }
      }}
    >
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.modal + 1,
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" size={40} />
      </Backdrop>

      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-md">
              <FaStore className="text-blue-600 text-sm" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Add Retailer
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Create a new retailer account
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DialogContent className="p-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Profile Picture Section */}
            <Grid item xs={12}>
              <Controller
                control={control}
                name="profilePic"
                render={({ field }) => (
                  <div className="w-full">
                    <p className="text-xs font-medium text-slate-500 mb-2">
                      Profile Image
                    </p>
                    {uploadedImage ? (
                      <div className="relative w-fit">
                        <img
                          src={URL.createObjectURL(uploadedImage)}
                          className="rounded-lg h-32 w-32 object-cover border border-slate-200"
                          alt="Profile preview"
                        />
                        <button
                          onClick={() => {
                            setUploadedImage(null);
                            setValue("profilePic", null);
                          }}
                          type="button"
                          className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                        >
                          <FaTimes className="text-rose-500 text-xs" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-28 border border-slate-200 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center py-2">
                          <FaImage className="w-6 h-6 mb-2 text-slate-400" />
                          <p className="mb-1 text-xs text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-[10px] text-slate-400">
                            JPEG, PNG or JPG (max. 2MB)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files[0];
                            field.onChange(file);
                            setUploadedImage(file);
                          }}
                          onBlur={field.onBlur}
                          type="file"
                          className="hidden"
                        />
                      </label>
                    )}
                    {errors?.profilePic && (
                      <p className="text-xs text-rose-600 mt-1">
                        {errors?.profilePic?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </Grid>
            
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaUser}
                name="fullName"
                label="Full Name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField
                icon={MdEmail}
                name="email"
                label="Email"
                type="email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaPhone}
                name="contactNo"
                label="Contact Number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaBuilding}
                name="businessName"
                label="Business Name"
              />
            </Grid>

            {/* Password Fields */}
            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaLock}
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaLock}
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
              />
            </Grid>

            {/* Location Fields */}
            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.country}>
                    <InputLabel sx={{ fontSize: '0.875rem' }}>Country</InputLabel>
                    <Select
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                      label="Country"
                      startAdornment={
                        <FaGlobe className="text-slate-400 text-sm mr-2" />
                      }
                      sx={{
                        backgroundColor: '#f9fafc',
                        fontSize: '0.875rem',
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
                    >
                      {countryOptions.map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode} sx={{ fontSize: '0.875rem' }}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors?.country && (
                      <p className="text-xs text-rose-600 mt-1">{errors?.country?.message}</p>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.state}
                    disabled={!selectedCountry}
                  >
                    <InputLabel sx={{ fontSize: '0.875rem' }}>State</InputLabel>
                    <Select
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                      label="State"
                      sx={{
                        backgroundColor: '#f9fafc',
                        fontSize: '0.875rem',
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
                    >
                      {stateOptions.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode} sx={{ fontSize: '0.875rem' }}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors?.state && (
                      <p className="text-xs text-rose-600 mt-1">{errors?.state?.message}</p>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    error={!!errors.city}
                    disabled={!selectedCountry || !selectedState}
                  >
                    <InputLabel sx={{ fontSize: '0.875rem' }}>City</InputLabel>
                    <Select
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      value={field.value || ""}
                      label="City"
                      sx={{
                        backgroundColor: '#f9fafc',
                        fontSize: '0.875rem',
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
                    >
                      {cityOptions.map((city) => (
                        <MenuItem key={city.name} value={city.name} sx={{ fontSize: '0.875rem' }}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors?.city && (
                      <p className="text-xs text-rose-600 mt-1">{errors?.city?.message}</p>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputField
                icon={FaMapPin}
                name="pinCode"
                label="Pin Code"
              />
            </Grid>

            <Grid item xs={12}>
              <InputField
                icon={FaMapMarkerAlt}
                name="address"
                label="Address"
                multiline
                rows={2}
              />
            </Grid>

            {/* Gender Radio Group */}
            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.gender}>
                <FormLabel 
                  component="legend" 
                  sx={{ 
                    fontSize: '0.875rem',
                    color: '#64748b',
                    mb: 1
                  }}
                >
                  Gender
                </FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel
                        value="male"
                        control={<Radio size="small" sx={{ color: '#94a3b8' }} />}
                        label={<span className="text-sm text-slate-700">Male</span>}
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio size="small" sx={{ color: '#94a3b8' }} />}
                        label={<span className="text-sm text-slate-700">Female</span>}
                      />
                      <FormControlLabel
                        value="other"
                        control={<Radio size="small" sx={{ color: '#94a3b8' }} />}
                        label={<span className="text-sm text-slate-700">Other</span>}
                      />
                    </RadioGroup>
                  )}
                />
                {errors?.gender && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors?.gender?.message}
                  </p>
                )}
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
            <Button
              onClick={() => {
                onClose();
                reset();
              }}
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
              Create Retailer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRetailer;