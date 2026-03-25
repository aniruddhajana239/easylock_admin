// components/dialog/auth/RegistrationRequestDialog.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaImage, FaUser, FaEnvelope, FaPhone, FaBuilding, FaGlobe, FaMapMarkerAlt, FaCity, FaMapPin, FaTag, FaTimes } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useAlert } from "../../../context/customContext/AlertContext";
import {
    Button,
    CircularProgress,
    Dialog,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@mui/material";
import { RequestSchema } from "../../../validation/public/registrationRequest/RegistrationRequestSchema";
import { FaAngleLeft } from "react-icons/fa6";
import { DistributorApi } from "../../../api/distributor/DistributorApi";
import { RetailerApi } from "../../../api/retailer/RetailerApi";
import Logo from "../../../assets/img/new-logo.png"
import { Country, State, City } from "country-state-city";
import { MdEmail } from "react-icons/md";

export const RegistrationRequestDialog = ({ open, onClose, registerAs, onBack }) => {
    const [profilePic, setProfilePic] = useState(null);
    const { showAlert } = useAlert()
    const [isLoading, setIsLoading] = useState(false)
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        getValues,
        watch,
        reset,
    } = useForm({
        resolver: yupResolver(RequestSchema),
        defaultValues: {
            fullName: "",
            email: "",
            refferalEmail: "",
            contactNo: "",
            gender: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
            profilePic: null,
        },
    });
    const [uploadedImage, setUploadedImage] = React.useState();

    const handleClearProfilePic = () => {
        setValue("profilePic", null)
        setUploadedImage()
    }

    useEffect(() => {
    }, [uploadedImage])
    
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
  
    const selectedCountry = watch("country");
    const selectedState = watch("state");
  
    useEffect(() => {
      const countries = Country.getAllCountries();
      setCountryOptions(countries);
    }, []);
  
    // When country is selected, fetch the states
    useEffect(() => {
      if (selectedCountry) {
        const states = State.getStatesOfCountry(selectedCountry);
        setStateOptions(states);
        setCityOptions([]);
      } else {
        setStateOptions([]);
        setCityOptions([]);
      }
    }, [selectedCountry]);
  
    useEffect(() => {
      if (selectedState) {
        const cities = City.getCitiesOfState(
          selectedCountry,
          selectedState
        );
        setCityOptions(cities);
      } else {
        setCityOptions([]);
      }
    }, [selectedState, selectedCountry]);
  
    const OnSubmitRequest = async (data) => {
        try {
            const formData = new FormData();
            for (const key in data) {
                formData.append(key, data[key]);
            }
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }
            setIsLoading(true)
            if (registerAs === "distributor") {
                await DistributorApi.registrationRequest(data).then(res => {
                    setIsLoading(false)
                    if (res?.status === 200 && res?.data?.status) {
                        showAlert("success", res?.data?.message)
                        onClose()
                    }
                }).catch(error => {
                    setIsLoading(false)
                    showAlert("error", error?.response?.data?.message ?? "Something went wrong")
                })
            }
            else{
                await RetailerApi.registrationRequest(data).then(res => {
                    setIsLoading(false)
                    if(res?.status===200&&res?.data?.status){
                         showAlert("success",res?.data?.message)
                         onClose()
                    }
                }).catch(error => {
                    setIsLoading(false)
                    showAlert("error", error?.response?.data?.message ?? "Something went wrong")
                })
            }
        }
        catch (error) {
            setIsLoading(false)
            showAlert("error", error ?? "Something went wrong")
        }
    }

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
            onClose={() => onClose(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    overflow: 'visible',
                    position: 'relative',
                }
            }}
        >
            {/* Back Button */}
            <button 
                onClick={onBack} 
                className="absolute -left-3 top-5 z-10 flex items-center gap-1 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
            >
                <FaAngleLeft size={16} className="text-slate-600" />
                <span className="text-xs font-medium text-slate-600 pr-1">Back</span>
            </button>

            {/* Close Button */}
            <button 
                onClick={() => { onClose(); reset(); }} 
                className="absolute -right-3 top-5 z-10 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="Close"
            >
                <FaTimes className="w-3 h-3 text-slate-500" />
            </button>

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-3">
                        <img
                            className="w-14 h-14"
                            src={Logo}
                            alt="IDL Logo"
                        />
                    </div>
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Registration Request
                    </span>
                    <h4 className="text-sm text-slate-500 font-medium mt-1">
                        {registerAs === "distributor" ? "Distributor" : "Retailer"}
                    </h4>
                    <h2 className="text-lg font-semibold text-slate-800 mt-2 tracking-widest">
                        SIGN UP
                    </h2>
                </div>

                {/* Profile Picture Upload */}
                <div className="mb-4">
                    <Controller
                        control={control}
                        name="profilePic"
                        render={({ field }) => (
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="dropzone-file"
                                    className="cursor-pointer"
                                >
                                    <div className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white text-xs font-medium flex items-center gap-2 transition-colors">
                                        <FaImage size={14} />
                                        <span>Upload Photo</span>
                                    </div>
                                </label>
                                <input
                                    id="dropzone-file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            field.onChange(file);
                                            setUploadedImage(file);
                                            event.target.value = null;
                                        }
                                    }}
                                    onBlur={field.onBlur}
                                    type="file"
                                    className="hidden"
                                />
                                {uploadedImage?.name && (
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                        <span className="text-xs text-slate-600 max-w-[150px] truncate">
                                            {uploadedImage?.name}
                                        </span>
                                        <button 
                                            onClick={handleClearProfilePic} 
                                            className="p-0.5 rounded-full hover:bg-rose-100 transition-colors"
                                        >
                                            <IoCloseSharp size={14} className="text-rose-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    />
                    {errors?.profilePic && (
                        <p className="text-xs text-rose-600 mt-1">
                            {errors?.profilePic?.message}
                        </p>
                    )}
                </div>

                {/* Form */}
                <Grid container spacing={2}>
                    {/* Full Name */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={FaUser}
                            name="fullName"
                            label="Full Name"
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={MdEmail}
                            name="email"
                            label="Email"
                        />
                    </Grid>

                    {/* Contact Number */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={FaPhone}
                            name="contactNo"
                            label="Contact No"
                        />
                    </Grid>

                    {/* Business Name */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={FaBuilding}
                            name="businessName"
                            label="Business Name"
                        />
                    </Grid>

                    {/* Country */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!errors.country}>
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>Country</InputLabel>
                                    <Select
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            setValue("state", "");
                                            setValue("city", "");
                                        }}
                                        value={field.value || ""}
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

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            control={control}
                            name="state"
                            render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!errors.state} disabled={!selectedCountry}>
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>State</InputLabel>
                                    <Select
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            setValue("city", "");
                                        }}
                                        value={field.value || ""}
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

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            control={control}
                            name="city"
                            render={({ field }) => (
                                <FormControl fullWidth size="small" error={!!errors.city} disabled={!selectedCountry || !selectedState}>
                                    <InputLabel sx={{ fontSize: '0.875rem' }}>City</InputLabel>
                                    <Select
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        value={field.value || ""}
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

                    {/* Address */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={FaMapMarkerAlt}
                            name="address"
                            label="Address"
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

                    {/* Referral Email */}
                    <Grid item xs={12} sm={6}>
                        <InputField
                            icon={FaTag}
                            name="refferalEmail"
                            label="Referral Email"
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
                            {errors.gender && (
                                <p className="text-xs text-rose-600 mt-1">{errors.gender.message}</p>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button
                        onClick={() => { onClose(); reset() }}
                        className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSubmit(OnSubmitRequest)}
                        disabled={isLoading}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white flex items-center gap-2 transition-colors focus:outline-none ${
                            isLoading 
                                ? 'bg-slate-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {isLoading && <CircularProgress size={14} sx={{ color: '#FFF' }} />}
                        {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
                    </button>
                </div>
            </div>
        </Dialog>
    );
};