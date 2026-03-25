 
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { retailerSelector } from "../../../redux/selector/retailer/RetailerSelector";
import { distributorActions } from "../../../redux/reducers/distributor/DistributorSlice";
import { retailerActions } from "../../../redux/reducers/retailer/RetailerSlice";
import { distributorSelector } from "../../../redux/selector/distributor/DistributorSelector";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useAlert } from "../../../context/customContext/AlertContext";
import { keysSelector } from "../../../redux/selector/keys/KeysSelector";
import { keysActions } from "../../../redux/reducers/keys/KeysSlice";
import { superDistributorActions } from "../../../redux/reducers/superDistributor/SuperDistributorSlice";
import { superDistributorSelector } from "../../../redux/selector/superDistributor/SuperDistributorSeletor";
import { 
  FaCoins, 
  FaRupeeSign,
  FaUserTie,
  FaStore,
  FaUsers
} from "react-icons/fa";

// Define schemas for different assignment types
const superDistributorAssignTokenSchema = yup.object().shape({
  superDistributorId: yup.string().required("Super Distributor is required"),
  tokens: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
});

const distributorAssignTokenSchema = yup.object().shape({
  superDistributorId: yup.string().when('userType', {
    is: 'admin',
    then: schema => schema.required("Super Distributor is required for admin"),
    otherwise: schema => schema.notRequired()
  }),
  distributorId: yup.string().required("Distributor is required"),
  tokens: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
});

const retailerAssignTokenSchema = yup.object().shape({
  superDistributorId: yup.string().when('userType', {
    is: 'admin',
    then: schema => schema.required("Super Distributor is required for admin"),
    otherwise: schema => schema.notRequired()
  }),
  distributorId: yup.string().required("Distributor is required"),
  retailerId: yup.string().required("Retailer is required"),
  tokens: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
});

const KeysAssignModal = ({ closeModal }) => {
  const selector = useSelector(authSelector);
  const userType = selector?.data?.userType;
  const distributorId = selector?.data?.id;
  const retailerData = useSelector(retailerSelector);
  const distributorData = useSelector(distributorSelector);
  const superDistributorData = useSelector(superDistributorSelector);
  const keysData = useSelector(keysSelector);
  const dispatch = useDispatch();

  // Set default section based on user type
  const [currentSection, setCurrentSection] = useState(
    userType === "distributor" ? "retailer" :
      userType === "superdistributor" ? "distributor" : "superdistributor"
  );

  // Get the appropriate schema based on current section and user type
  const getSchema = () => {
    if (currentSection === "superdistributor") {
      return superDistributorAssignTokenSchema;
    } else if (currentSection === "distributor") {
      return distributorAssignTokenSchema;
    } else if (currentSection === "retailer") {
      return retailerAssignTokenSchema;
    }
  };

  const {
    handleSubmit,
    control,
    setValue,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(getSchema()),
    defaultValues: {
      superDistributorId: "",
      distributorId: userType === "distributor" ? distributorId : "",
      retailerId: "",
      tokens: "",
      price: "",
      userType: userType
    }
  });

  const { showAlert } = useAlert();

  // Watch fields for dependent selects
  const watchSuperDistributorId = watch("superDistributorId");
  const watchDistributorId = watch("distributorId");

  useEffect(() => {
    // Load initial data based on user type and current section
    if (userType === "admin") {
      if (currentSection === "superdistributor") {
        dispatch(superDistributorActions.getAll());
      }
    } else if (userType === "superdistributor") {
      if (currentSection === "distributor" || currentSection === "retailer") {
        dispatch(distributorActions.getAll());
      }
    } else if (userType === "distributor") {
      if (currentSection === "retailer") {
        dispatch(retailerActions.getAll());
      }
    }
  }, [dispatch, userType, currentSection]);

  const getDistributorBySuperDistributorId = (superDistributorId) => {
    if (superDistributorId) {
      dispatch(
        distributorActions.getAll({
          superDistributorId: superDistributorId,
        })
      );
    } else {
      setValue("distributorId", "");
      setValue("retailerId", "");
    }
  };

  const getRetailerByDistributor = (distributorId) => {
    if (distributorId) {
      dispatch(
        retailerActions.getByDistributorId({
          distributorId: distributorId,
        })
      );
    } else {
      setValue("retailerId", "");
    }
  };

  const onSubmit = (data) => {
    // Prepare data based on section
    let submitData = { ...data };

    // Remove unnecessary fields based on current section
    if (currentSection === "superdistributor") {
      delete submitData.distributorId;
      delete submitData.retailerId;
    } else if (currentSection === "distributor") {
      delete submitData.retailerId;
    }

    // Remove userType from submit data
    delete submitData.userType;

    // Dispatch based on current section
    if (currentSection === "superdistributor") {
      dispatch(keysActions.addSuperDistributorToken(submitData));
    } else if (currentSection === "distributor"){
      dispatch(keysActions.addDistributorToken(submitData));
    } else {
      dispatch(keysActions.addRetailerToken(submitData));
    }
  };

  useEffect(() => {
    if (keysData?.data?.status === true && keysData?.data?.message) {
      showAlert("success", keysData?.data?.message);
      closeModal(true);
      setTimeout(() => {
        dispatch(keysActions.clearMessage);
      }, 3000);
    } else if (keysData?.data?.status === false && keysData?.data?.message) {
      showAlert("error", keysData?.data?.message);
      setTimeout(() => {
        dispatch(keysActions.clearMessage);
      }, 3000);
    }
  }, [keysData]);

  const handleToggle = (event, newValue) => {
    if (newValue) {
      setCurrentSection(newValue);
      // Clear all form values when switching tabs
      reset({
        superDistributorId: "",
        distributorId: userType === "distributor" ? distributorId : "",
        retailerId: "",
        tokens: "",
        price: "",
        userType: userType
      });
      
      // Load data for the new section
      if (userType === "admin") {
        if (newValue === "superdistributor") {
          dispatch(superDistributorActions.getAll());
        } else if (newValue === "distributor") {
          dispatch(distributorActions.clearDistributorData());
        } else if (newValue === "retailer") {
          dispatch(retailerActions.clearRetailerData());
        }
      }
    }
  };

  // Watch for super distributor changes (admin only)
  useEffect(() => {
    if (watchSuperDistributorId && userType === "admin" && currentSection !== "superdistributor") {
      getDistributorBySuperDistributorId(watchSuperDistributorId);
    }
  }, [watchSuperDistributorId, userType, currentSection]);

  // Watch for distributor changes
  useEffect(() => {
    if (watchDistributorId && (userType === "admin" || userType === "superdistributor")) {
      getRetailerByDistributor(watchDistributorId);
    }
  }, [watchDistributorId, userType]);

  // Auto-populate fields based on user type
  useEffect(() => {
    if (userType === "distributor" && distributorId) {
      setValue("distributorId", distributorId);
      if (currentSection === "retailer") {
        getRetailerByDistributor(distributorId);
      }
    } else if (userType === "superdistributor" && selector?.data?.id) {
      setValue("superDistributorId", selector?.data?.id);
    }
  }, [userType, distributorId, selector?.data?.id, setValue, currentSection]);

  // Get toggle buttons based on user type
  const getToggleButtons = () => {
    if (userType === "admin") {
      return ["superdistributor", "distributor", "retailer"];
    } else if (userType === "superdistributor") {
      return ["distributor"];
    } else if (userType === "distributor") {
      return ["retailer"];
    }
    return [];
  };

  const toggleButtons = getToggleButtons();

  // Custom Autocomplete Component
  const CustomAutocomplete = ({ 
    control, 
    name, 
    label, 
    options, 
    disabled = false, 
    placeholder = "Type to search...",
    noOptionsText = "No options found",
    icon: Icon,
    onChange
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Autocomplete
          options={options || []}
          getOptionLabel={(option) => 
            `${option?.fullName || ''} ${option?.email ? `- ${option.email}` : ''}`
          }
          value={
            options?.length>0?options?.find((item) => item.id === field.value) || null:null
          }
          onChange={(event, newValue) => {
            field.onChange(newValue?.id || "");
            if (onChange) onChange(newValue?.id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              size="small"
              fullWidth
              error={!!errors[name]}
              helperText={errors[name]?.message}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: Icon && (
                  <InputAdornment position="start">
                    <Icon className="text-slate-400 text-sm ml-1" />
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
          renderOption={(props, option) => (
            <MenuItem {...props}>
              <div className="flex flex-col items-start py-1">
                <span className="text-sm font-medium text-slate-900">
                  {option?.fullName}
                </span>
                <span className="text-xs text-slate-500">
                  {option?.email}
                </span>
              </div>
            </MenuItem>
          )}
          filterOptions={(options, { inputValue }) => {
            return options.filter((option) => {
              const searchTerm = inputValue.toLowerCase();
              return (
                option?.fullName?.toLowerCase().includes(searchTerm) ||
                option?.email?.toLowerCase().includes(searchTerm)
              );
            });
          }}
          disabled={disabled}
          noOptionsText={noOptionsText}
          disablePortal
          blurOnSelect
          sx={{
            '& .MuiAutocomplete-inputRoot': {
              paddingLeft: Icon ? '32px !important' : '14px',
            },
          }}
        />
      )}
    />
  );

  // User Info Card Component
  const UserInfoCard = ({ title, user, icon: Icon }) => (
    <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-3 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-md">
            <Icon className="text-blue-600 text-sm" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-sm font-semibold text-slate-900">
              {user?.fullName || "N/A"}
            </p>
            <p className="text-xs text-slate-600">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          You
        </span>
      </div>
      <input
        type="hidden"
        {...register(title === "Super Distributor" ? "superDistributorId" : "distributorId")}
        value={user?.id || ""}
      />
    </div>
  );

  return (
    <Box className="p-5">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Send Token
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Assign tokens to users in the hierarchy
        </p>
      </div>

      {/* Toggle Button Group */}
      {toggleButtons.length > 1 && (
        <Box className="mb-5">
          <ToggleButtonGroup
            value={currentSection}
            exclusive
            onChange={handleToggle}
            aria-label="key assign type"
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {toggleButtons.map((button) => (
              <ToggleButton
                key={button}
                value={button}
                aria-label={button}
                sx={{
                  borderRadius: "20px",
                  color: "#16aff6",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  // border: "1px solid",
                  // borderColor: "#e2e8f0",
                  outline: "none",
                  textTransform: "capitalize",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  "&.Mui-selected": {
                    backgroundColor: "#e5f6fe",
                    color: "#16aff6",
                    // borderColor: "#16aff6",
                  },
                  "&:not(.Mui-selected)": {
                    backgroundColor: "white",
                  },
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                {button === "superdistributor" ? "Super Distributor" : button}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      )}

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Super Distributor Tab */}
        {currentSection === "superdistributor" && (
          <>
            {userType === "admin" ? (
              <CustomAutocomplete
                control={control}
                name="superDistributorId"
                label="Select Super Distributor"
                options={superDistributorData?.data?.data}
                icon={FaUserTie}
                noOptionsText="No super distributors found"
              />
            ) : (
              <UserInfoCard
                title="Super Distributor"
                user={selector?.data}
                icon={FaUserTie}
              />
            )}
          </>
        )}

        {/* Distributor Tab */}
        {currentSection === "distributor" && (
          <>
            {userType === "admin" && (
              <CustomAutocomplete
                control={control}
                name="superDistributorId"
                label="Select Super Distributor"
                options={superDistributorData?.data?.data}
                icon={FaUserTie}
                noOptionsText="No super distributors found"
                onChange={(id) => getDistributorBySuperDistributorId(id)}
              />
            )}

            {userType === "superdistributor" && (
              <UserInfoCard
                title="Super Distributor"
                user={selector?.data}
                icon={FaUserTie}
              />
            )}

            <CustomAutocomplete
              control={control}
              name="distributorId"
              label="Select Distributor"
              options={distributorData?.data?.data}
              icon={FaUsers}
              disabled={
                (userType === "admin" && !watchSuperDistributorId) ||
                (userType === "superdistributor" && false)
              }
              placeholder={
                userType === "admin" && !watchSuperDistributorId
                  ? "Select super distributor first"
                  : "Type to search..."
              }
              noOptionsText={
                userType === "admin" && !watchSuperDistributorId
                  ? "Select super distributor first"
                  : "No distributors found"
              }
            />
          </>
        )}

        {/* Retailer Tab */}
        {currentSection === "retailer" && (
          <>
            {userType === "admin" && (
              <CustomAutocomplete
                control={control}
                name="superDistributorId"
                label="Select Super Distributor"
                options={superDistributorData?.data?.data}
                icon={FaUserTie}
                noOptionsText="No super distributors found"
                onChange={(id) => {
                  if (id) {
                    getDistributorBySuperDistributorId(id);
                    setValue("distributorId", "");
                    setValue("retailerId", "");
                  }
                }}
              />
            )}

            {userType === "superdistributor" && (
              <UserInfoCard
                title="Super Distributor"
                user={selector?.data}
                icon={FaUserTie}
              />
            )}

            {(userType === "admin" || userType === "superdistributor") && (
              <CustomAutocomplete
                control={control}
                name="distributorId"
                label="Select Distributor"
                options={distributorData?.data?.data}
                icon={FaUsers}
                disabled={
                  (userType === "admin" && !watchSuperDistributorId) ||
                  (userType === "superdistributor" && false)
                }
                placeholder={
                  userType === "admin" && !watchSuperDistributorId
                    ? "Select super distributor first"
                    : "Type to search..."
                }
                noOptionsText={
                  userType === "admin" && !watchSuperDistributorId
                    ? "Select super distributor first"
                    : "No distributors found"
                }
              />
            )}

            {userType === "distributor" && (
              <UserInfoCard
                title="Distributor"
                user={selector?.data}
                icon={FaUsers}
              />
            )}

            <CustomAutocomplete
              control={control}
              name="retailerId"
              label="Select Retailer"
              options={retailerData?.data?.data}
              icon={FaStore}
              disabled={
                (userType === "admin" && !watchDistributorId) ||
                (userType === "superdistributor" && !watchDistributorId) ||
                false
              }
              placeholder={
                (userType === "admin" || userType === "superdistributor") && !watchDistributorId
                  ? "Select distributor first"
                  : "Type to search..."
              }
              noOptionsText={
                (userType === "admin" || userType === "superdistributor") && !watchDistributorId
                  ? "Select distributor first"
                  : "No retailers found"
              }
            />
          </>
        )}

        {/* Quantity Field */}
        <div>
          <Controller
            control={control}
            name="tokens"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Quantity"
                type="number"
                variant="outlined"
                size="small"
                placeholder="Enter quantity"
                error={!!errors.tokens}
                helperText={errors.tokens?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaCoins className="text-slate-400 text-sm" />
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
        </div>

        {/* Price Field */}
        <div>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Price"
                type="number"
                variant="outlined"
                size="small"
                placeholder="Enter price"
                error={!!errors.price}
                helperText={errors.price?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaRupeeSign className="text-slate-400 text-sm" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="text-xs text-slate-500">per token</span>
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
        </div>
      </Box>

      {/* Dialog Actions */}
      <DialogActions className="mt-5 pt-3 border-t border-slate-100">
        <Button
          onClick={() => closeModal(false)}
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
          variant="contained"
          size="small"
          onClick={handleSubmit(onSubmit)}
          disabled={keysData?.isFetching}
          sx={{
            backgroundColor: '#16AFF6',
            color: '#FFF',
            fontSize: '0.75rem',
            padding: '4px 12px',
            textTransform: 'none',
            boxShadow: 'none',
            minWidth: '80px',
            '&:hover': {
              backgroundColor: '#0F8FC9',
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: '#94a3b8',
            },
          }}
        >
          {keysData?.isFetching ? (
            <CircularProgress size={14} sx={{ color: '#FFF' }} />
          ) : (
            'Submit'
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default KeysAssignModal;