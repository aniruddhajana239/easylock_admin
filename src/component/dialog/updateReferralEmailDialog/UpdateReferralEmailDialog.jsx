// components/dialog/updateReferralEmailDialog/UpdateReferralEmailDialog.js
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    FormControl,
    Autocomplete,
    Avatar,
    CircularProgress,
    Chip,
    MenuItem
} from '@mui/material';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../context/customContext/AlertContext';
import { AuthApi } from '../../../api/auth/AuthApi';
import { distributorSelector } from '../../../redux/selector/distributor/DistributorSelector';
import { distributorActions } from '../../../redux/reducers/distributor/DistributorSlice';
import { superDistributorSelector } from '../../../redux/selector/superDistributor/SuperDistributorSeletor';
import { superDistributorActions } from '../../../redux/reducers/superDistributor/SuperDistributorSlice';
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaTimes, FaCheckCircle, FaTag, FaCoins } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const UpdateReferralEmailDialog = ({
    open,
    handleClose,
    from = 'retailer',
    currentRefferalEmail = '',
    userId,
    email,
    name
}) => {
    // Validation schema
    const validationSchema = yup.object().shape({
        referralEmail: yup
            .string()
            .email('Please enter a valid email')
            .required('Referral email is required')
            .notOneOf([email], 'Referral email cannot be your own email'),
    });

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            referralEmail: '',
        }
    });

    const [loading, setLoading] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();
    const { showAlert } = useAlert();

    // Selectors based on 'from' prop
    const distributorData = useSelector(distributorSelector);
    const superDistributorData = useSelector(superDistributorSelector);

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            reset({
                referralEmail: '',
            });
            setSelectedUser(null);
            setSearchQuery('');
            
            if (from === 'retailer') {
                dispatch(distributorActions.getAll({ page: 1, limit: 1000 }));
            } else if (from === 'distributor') {
                dispatch(superDistributorActions.getAll({ page: 1, limit: 1000 }));
            }
        }
    }, [open, from, dispatch, reset]);

    // Process and set users list based on response
    useEffect(() => {
        let users = [];

        if (from === 'retailer' && distributorData?.data?.data?.rows) {
            users = distributorData.data.data.rows;
        } else if (from === 'distributor' && superDistributorData?.data?.data?.rows) {
            users = superDistributorData.data.data.rows;
        } else if (distributorData?.data?.data && from === 'retailer') {
            users = Array.isArray(distributorData.data.data) ? distributorData.data.data : [];
        } else if (superDistributorData?.data?.data && from === 'distributor') {
            users = Array.isArray(superDistributorData.data.data) ? superDistributorData.data.data : [];
        }

        // Filter out the current user if they exist in the list
        users = users.filter(user => user.email !== email);

        setUsersList(users);
        setFilteredUsers(users);

        // Only set current referral user if modal was just opened and user exists
        if (open && currentRefferalEmail && users.length > 0) {
            const currentRefUser = users.find(user => user.email === currentRefferalEmail);
            if (currentRefUser) {
                setSelectedUser(currentRefUser);
                setValue('referralEmail', currentRefUser.email);
            }
        }
    }, [distributorData, superDistributorData, from, currentRefferalEmail, email, setValue, open]);

    // Filter users based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(usersList);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = usersList.filter(user =>
            (user.fullName && user.fullName.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query)) ||
            (user.contactNo && user.contactNo.includes(query)) ||
            (user.businessName && user.businessName.toLowerCase().includes(query))
        );

        setFilteredUsers(filtered);
    }, [searchQuery, usersList]);

    const handleSearchChange = (event, value) => {
        setSearchQuery(value);
    };

    const handleUserSelect = (event, user) => {
        setSelectedUser(user);
        if (user) {
            setValue('referralEmail', user.email, { shouldValidate: true });
        } else {
            setValue('referralEmail', '', { shouldValidate: true });
        }
    };

    const onSubmit = async (data) => {
        if (!selectedUser) {
            showAlert('error', 'Please select a user from the dropdown');
            return;
        }

        setLoading(true);
        try {
            const body = {
                userId: userId,
                referralEmail: data.referralEmail
            };

            const response = await AuthApi.updateRefferalEmail(body);

            if (response?.data?.status === true) {
                showAlert('success', response?.data?.message || 'Referral email updated successfully');
                handleClose(true);
            } else {
                showAlert('error', response?.data?.message || 'Failed to update referral email');
            }
        } catch (error) {
            console.error('Error updating referral email:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'An error occurred while updating referral email';
            showAlert('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        reset();
        setSelectedUser(null);
        setSearchQuery('');
        setFilteredUsers(usersList);
        handleClose();
    };

    // Render user option in dropdown
    const renderUserOption = (props, user) => (
        <MenuItem {...props} key={user.id} className="!p-2">
            <div className="flex items-center gap-3 w-full">
                <Avatar
                    src={user.profilePic}
                    alt={user.fullName}
                    sx={{ width: 36, height: 36 }}
                />
                <div className='flex flex-col items-start flex-1 min-w-0'>
                    <span className='text-sm font-medium text-slate-900 truncate'>
                        {user?.fullName || ""}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MdEmail className="text-xs" />
                        <span className="truncate">{user?.email || ""}</span>
                    </div>
                    {user?.contactNo && (
                        <span className='text-xs text-slate-400'>
                            {user?.contactNo}
                        </span>
                    )}
                </div>
            </div>
        </MenuItem>
    );

    // Get display value for the input field - show only email
    const getDisplayValue = (user) => {
        if (!user) return '';
        return user.email || '';
    };

    // Handle input change separately to keep dropdown empty until selection
    const handleInputChange = (event, value) => {
        setSearchQuery(value);
    };

    return (
        <Modal 
            open={open} 
            onClose={handleCloseModal}
            aria-labelledby="update-referral-modal"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 520 },
                    maxHeight: '90vh',
                    overflow: 'auto',
                    bgcolor: 'white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    p: 0,
                    borderRadius: 2,
                    outline: 'none',
                    border: '1px solid #e2e8f0',
                }}
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-md">
                                <FaTag className="text-blue-600 text-sm" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                    Update Referral Email
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    {from === 'retailer' 
                                        ? 'Select a distributor to refer this retailer' 
                                        : 'Select a super distributor to refer this distributor'}
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

                {/* Content */}
                <div className="p-5">
                    {/* User Info */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-2">Updating referral for</p>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <FaUser className="text-blue-600 text-sm" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900">
                                    {name || ""}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {email || ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Current Referral Email */}
                    {currentRefferalEmail && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-700 flex items-center gap-1.5">
                                <FaCheckCircle className="text-blue-600 text-sm" />
                                <span className="font-medium">Current Referral:</span> {currentRefferalEmail}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Controller
                            name="referralEmail"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.referralEmail}>
                                    <Autocomplete
                                        {...field}
                                        options={filteredUsers}
                                        value={selectedUser}
                                        onChange={handleUserSelect}
                                        onInputChange={handleInputChange}
                                        getOptionLabel={getDisplayValue}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={`Select ${from === 'retailer' ? 'Distributor' : 'Super Distributor'}`}
                                                placeholder="Search by name, email, or phone"
                                                error={!!errors.referralEmail}
                                                helperText={errors.referralEmail?.message}
                                                required
                                                size='small'
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <div className="mr-2">
                                                            <MdEmail className="text-slate-400 text-sm" />
                                                        </div>
                                                    ),
                                                    ...params.InputProps,
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
                                        renderOption={renderUserOption}
                                        filterOptions={(options) => options}
                                        loading={distributorData?.isFetching || superDistributorData?.isFetching}
                                        noOptionsText={
                                            searchQuery
                                                ? `No ${from === 'retailer' ? 'distributors' : 'super distributors'} found matching "${searchQuery}"`
                                                : `Start typing to search ${from === 'retailer' ? 'distributors' : 'super distributors'}`
                                        }
                                        inputValue={searchQuery}
                                        clearOnBlur={false}
                                        freeSolo={false}
                                        autoComplete={false}
                                        autoHighlight={true}
                                        loadingText="Loading users..."
                                        className="w-full"
                                    />
                                </FormControl>
                            )}
                        />

                        {/* Selected User Details */}
                        {selectedUser && (
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="text-xs font-medium text-slate-500 mb-3">Selected User Details</p>
                                <div className="flex items-start gap-3">
                                    <Avatar
                                        src={selectedUser.profilePic}
                                        alt={selectedUser.fullName}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-semibold text-slate-900 truncate">
                                                {selectedUser?.fullName || ""}
                                            </span>
                                            <Chip
                                                label={selectedUser.userType === 'superdistributor' ? 'Super Distributor' : 'Distributor'}
                                                size="small"
                                                sx={{ 
                                                    fontSize: '0.65rem',
                                                    height: '20px',
                                                    backgroundColor: selectedUser.userType === 'superdistributor' ? '#e0f2fe' : '#f3e8ff',
                                                    color: selectedUser.userType === 'superdistributor' ? '#0369a1' : '#6b21a8',
                                                    border: 'none',
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                                            <MdEmail className="text-xs" />
                                            <span className="truncate">{selectedUser?.email || ""}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            {selectedUser?.contactNo && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <FaPhone className="text-[10px] rotate-90" />
                                                    <span>{selectedUser.contactNo}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <FaCoins className="text-[10px]" />
                                                <span>Tokens: {selectedUser.proTokens || 0}</span>
                                            </div>
                                            {selectedUser.businessName && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <FaBuilding className="text-[10px]" />
                                                    <span className="truncate max-w-[100px]">{selectedUser.businessName}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
                            <Button
                                onClick={handleCloseModal}
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
                                disabled={loading || !selectedUser}
                                startIcon={loading && <CircularProgress size={14} sx={{ color: '#FFF' }} />}
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
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
};

export default UpdateReferralEmailDialog;