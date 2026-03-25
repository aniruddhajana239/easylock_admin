// components/dialog/retailer/ApproveRetailerModal.js
import { Fragment, useEffect, useState } from "react";
import {
    Dialog,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { RetailerApi } from "../../../api/retailer/RetailerApi";
import { useAlert } from "../../../context/customContext/AlertContext";
import { FaCheckCircle, FaTag, FaUsers, FaTimes } from "react-icons/fa";
import { MdApproval } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {groupSelector} from '../../../redux/selector/groups/groupSelector'
import {groupsActions} from '../../../redux/reducers/groups/groupSlice'

const ApproveRetailerModal = ({ open, onClose, retailerId, onSuccess,retailerData={} }) => {
    const dispatch = useDispatch();
    const groupSelectorData = useSelector(groupSelector)
    const [formData, setFormData] = useState({
        nodeId: "",
        groupName: "",
    });
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    useEffect(()=>{
        if(retailerData && retailerData?.contactNo && open){
            dispatch(groupsActions.getGroups({'displayName':retailerData?.contactNo}))
        }
        return ()=> {
            dispatch(groupsActions.reset());
            dispatch(groupsActions.clearMessage())
        }
    },[dispatch, retailerData,open])
    useEffect(()=>{
        if(groupSelectorData){
            if(groupSelectorData?.data instanceof Array && groupSelectorData?.data?.length===1){
            setFormData({
                'groupName':groupSelectorData?.data[0]?.displayName,
                'nodeId':groupSelectorData?.data[0]?.nodeId
            })
        }else if(groupSelectorData?.data?.length===0){
            showAlert("error", "NodeId and GroupName is not found.");
        }
        } 
    },[groupSelectorData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nodeId || !formData.groupName) {
            showAlert("error", "Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                nodeId: formData.nodeId,
                groupName: formData.groupName,
                retailerId: retailerId,
                status: "approved",
            };

            const res = await RetailerApi.updateAccountStatus(payload);

            if (res?.status === 200) {
                if (res?.data?.status) {
                    showAlert("success", res?.data?.message || "Retailer approved successfully");
                    onSuccess();
                    onClose();
                    // Refresh notification count in header
                    window.dispatchEvent(new Event('refresh-notifications'));
                } else {
                    showAlert("error", res?.data?.message || "Failed to approve retailer");
                }
            } else {
                showAlert("error", "Something went wrong");
            }
        } catch (error) {
            console.error("Error approving retailer:", error);
            showAlert(
                "error",
                error?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (open) {
            setFormData({
                nodeId: "",
                groupName: "",
            });
        }
    }, [open]);

    return (
        <Dialog 
            open={open} 
            onClose={loading ? null : onClose} 
            maxWidth="sm" 
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
            {groupSelectorData?.isFetching?
            <div className="h-48 flex items-center justify-center">
                <CircularProgress size={28} />
            </div>
            :
            <Fragment>
            {/* Header */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-md">
                            <FaCheckCircle className="text-emerald-600 text-sm" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Approve Retailer
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter details to approve retailer application
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Node ID Field */}
                    <div>
                        <TextField
                            label="Node ID"
                            name="nodeId"
                            value={formData.nodeId}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <div className="mr-2">
                                        <FaTag className="text-slate-400 text-sm" />
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
                            }}
                        />
                    </div>

                    {/* Group Name Field */}
                    <div>
                        <TextField
                            label="Group Name"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            size="small"
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <div className="mr-2">
                                        <FaUsers className="text-slate-400 text-sm" />
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
                            }}
                        />
                    </div>

                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                        <p className="text-xs text-blue-700 flex items-center gap-1.5">
                            <MdApproval className="text-blue-600 text-sm" />
                            This action will approve the retailer and grant them access to the platform.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-4">
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={loading}
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
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={14} sx={{ color: '#FFF' }} /> : <FaCheckCircle className="text-sm" />}
                            sx={{
                                backgroundColor: '#10b981',
                                color: '#FFF',
                                fontSize: '0.75rem',
                                padding: '4px 12px',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#059669',
                                    boxShadow: 'none',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#94a3b8',
                                },
                            }}
                        >
                            {loading ? 'Approving...' : 'Approve Retailer'}
                        </Button>
                    </div>
                </form>
            </div>
            </Fragment>
}
        </Dialog>
    );
};

export default ApproveRetailerModal;