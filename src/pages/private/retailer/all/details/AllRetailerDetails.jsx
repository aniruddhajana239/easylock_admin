// pages/AllRetailerDetails.js
import { useEffect, useState } from "react";
import { convertUTCToLocalWithObject as convertUTCToLocal } from "../../../../../utils/Utils";
import {
  Avatar,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import {
  Update,
  Replay,
} from "@mui/icons-material";
import Breadcrumb from "../../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../../component/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { retailerSelector } from "../../../../../redux/selector/retailer/RetailerSelector";
import { retailerActions } from "../../../../../redux/reducers/retailer/RetailerSlice";
import { useParams, useNavigate } from "react-router";
import { 
  FaCheckCircle, 
  FaCoins, 
  FaTimesCircle, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaKey, 
  FaStore,
  FaMobileAlt,
  FaTag,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaUserTag
} from "react-icons/fa";
import { MdOutlineEmail, MdEmail} from "react-icons/md";
import { BiCalendar} from "react-icons/bi";
import { emiSelector } from "../../../../../redux/selector/emi/EmiSelector";
import DataNotFound from "../../../../../component/dataNotFound/DataNotFound";
import InfoCard from "../../../../../component/cards/InfoCard";
import Table from "../../../../../component/table/Table";
import { keysActions } from "../../../../../redux/reducers/keys/KeysSlice";
import { keysSelector } from "../../../../../redux/selector/keys/KeysSelector";
import { deviceActions } from "../../../../../redux/reducers/device/DeviceSlice";
import { deviceSelector } from "../../../../../redux/selector/device/DeviceSelector";
import ChangePassword from "../../../../../component/dialog/retailer/ChangePassword";
import { authSelector } from "../../../../../redux/selector/auth/authSelector";
import { useAlert } from "../../../../../context/customContext/AlertContext";
import KeyRefund from "../../../../../component/dialog/keys/KeyRefundModal";
import UpdateReferralEmailDialog from "../../../../../component/dialog/updateReferralEmailDialog/UpdateReferralEmailDialog";

const AllRetailerDetails = () => {
  const [retailerDetails, setRetailerDetails] = useState({});
  const [, setEmiData] = useState([]);
  const [keysData, setKeysData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deviceTotalCount, setDeviceTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const selector = useSelector(retailerSelector);
  const [devices, setDevices] = useState([]);
  const deviceSelect = useSelector(deviceSelector);
  const params = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const authSelect = useSelector(authSelector);

  // Modal handlers
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleRefundOpen = () => setRefundModalOpen(true);

  const handleReferralOpen = () => setReferralModalOpen(true);
  const handleReferralClose = (isUpdated) => {
    if (isUpdated) {
      dispatch(retailerActions.singleGet(params?.id));
      setReferralModalOpen(false);
    } else {
      setReferralModalOpen(false);
    }
  };

  const handleRefundClose = (isUpdated) => {
    if (isUpdated) {
      dispatch(retailerActions.singleGet(params?.id));
      dispatch(
        keysActions.getAllForDistributorAndRetailer({
          page: page + 1,
          limit: rowsPerPage,
          retailerId: params?.id,
        })
      );
      setRefundModalOpen(false);
    }
    else {
      setRefundModalOpen(false);
    }
  }

  useEffect(() => {
    if (params?.id) {
      // Clear all cached data when retailer changes
      setDevices([]);
      setKeysData([]);
      setTotalCount(0);
      setDeviceTotalCount(0);
      dispatch(deviceActions.reset());
      dispatch(keysActions.reset());
      dispatch(retailerActions.singleGet(params?.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (selector?.data) {
      setRetailerDetails(selector?.data?.data?.[0]);
    }
  }, [selector]);

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Retailers", path: "/device-lock/retailer/all" },
    { label: "Retailer Details" },
  ];

  const emiSelect = useSelector(emiSelector);
  const keySelect = useSelector(keysSelector);
  const [, setLoading] = useState(true);

  // Initial API call for Keys and Devices on load
  useEffect(() => {
    // Clear devices when switching to Devices tab and fetch with proper limit
    if (tabIndex === 1) {
      setDevices([]);
      dispatch(deviceActions.reset());
      dispatch(
        deviceActions.getAll({
          page: page + 1,
          limit: rowsPerPage,
          retailerId: params?.id,
        })
      );
    } else if (tabIndex === 0) {
      setKeysData([]);
      dispatch(keysActions.reset());
    }
    
    // Fetch keys data
    if (tabIndex === 0) {
      dispatch(
        keysActions.getAllForDistributorAndRetailer({
          page: page + 1,
          limit: rowsPerPage,
          retailerId: params?.id,
        })
      );
    }
    
    // Fetch devices data on initial load (for device count only)
    if (params?.id && tabIndex === 0) {
      dispatch(
        deviceActions.getAll({
          page: 1,
          limit: 1,
          retailerId: params?.id,
        })
      );
    }
  }, [page, rowsPerPage, tabIndex, dispatch, params?.id]);

  useEffect(() => {
    if (emiSelect && emiSelect?.data && emiSelect?.data?.rows) {
      setEmiData(emiSelect?.data?.rows);
      setTotalCount(emiSelect?.data?.totalRows);
      setLoading(false);
    }
  }, [emiSelect]);

  useEffect(() => {
    if (keySelect && keySelect?.data && keySelect?.data?.rows) {
      setKeysData(keySelect?.data?.rows);
      setTotalCount(keySelect?.data?.totalRows);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [keySelect]);

  useEffect(() => {
    if (deviceSelect && deviceSelect?.data) {
      setDevices(deviceSelect?.data?.rows || []);
      setDeviceTotalCount(deviceSelect?.data?.totalRows || 0);
      setLoading(false);
    }
  }, [deviceSelect]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  const keysColumns = [
    "Transaction ID",
    "Quantity",
    "Price",
    "Type",
    "Date",
    "Purchase",
    "Sell",
  ];
  const deviceColumns = ["Device", "Status", "Enroll Date", "Price", "Down Payment", "Customer", "EMI Status", "EMI Details"];

  const hasNextPage = (page + 1) * rowsPerPage < totalCount;
  const hasNextPageDevice = (page + 1) * rowsPerPage < deviceTotalCount;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusTag = (status) => {
    if (status === true || status === "unlocked" || status === "Paid") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FaCheckCircle className="mr-1 text-[10px]" />
          {status === "Paid" ? "Paid" : "Unlocked"}
        </span>
      );
    } else if (status === false || status === "locked" || status === "Running") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          {status === "Running" ? "Running" : "Locked"}
        </span>
      );
    } else if (status === "reject" || status === "failed") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <FaTimesCircle className="mr-1 text-[10px]" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
        Unknown
      </span>
    );
  };

  const getAccountStatusTag = (accountActive) => {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        accountActive 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}>
        {accountActive ? (
          <>
            <FaCheckCircle className="mr-1 text-[10px]" />
            Active
          </>
        ) : (
          <>
            <FaTimesCircle className="mr-1 text-[10px]" />
            Inactive
          </>
        )}
      </span>
    );
  };



  // Section Header Component
  const SectionHeader = ({ title }) => (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  const renderKeysTableBody = () => {
    const userType = authSelect?.data?.userType;

    const filteredData = keysData?.filter((item) => {
      if (userType === "admin") return true;
      if (
        userType === "distributor" &&
        item?.transactionStatus === "credit" &&
        item?.otherUser?.userType === "admin"
      ) {
        return false;
      }
      return true;
    });

    return (
      <tbody className="divide-y divide-slate-200">
        {filteredData?.map((item, index) => (
          <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
            <td className="py-3 px-4">
              <div className="flex items-center gap-2">
                <FaTag className="text-slate-400 text-xs" />
                <span className="text-xs font-mono text-slate-600">{item?.id || "—"}</span>
              </div>
            </td>
            <td className="py-3 px-4">
              <span className="text-sm font-medium text-slate-900">{item?.tokens || 0}</span>
            </td>
            <td className="py-3 px-4">
              <span className="text-sm text-slate-600">₹{item?.price || "0"}</span>
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-1.5">
                {item?.transactionStatus === "credit" ? (
                  <FaArrowUp className="text-emerald-500 text-xs" />
                ) : (
                  <FaArrowDown className="text-rose-500 text-xs" />
                )}
                <span className={`text-xs font-medium ${
                  item?.transactionStatus === "credit" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {item?.transactionStatus || "—"}
                </span>
              </div>
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center gap-1.5">
                <BiCalendar className="text-slate-400 text-sm" />
                <span className="text-xs text-slate-600">{item?.date || "—"}</span>
              </div>
            </td>
            <td className="py-3 px-4">
              {(item?.transactionStatus === "credit" || item?.transactionStatus === "refunded") && item?.otherUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-emerald-600 text-xs" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-900 truncate">
                      {item?.otherUser?.fullName || ""}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item?.otherUser?.contactNo || "—"}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </td>
            <td className="py-3 px-4">
              {item?.transactionStatus === "debit" && item?.otherUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-rose-600 text-xs" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-900 truncate">
                      {item?.otherUser?.fullName || "N/A"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {item?.otherUser?.contactNo || "—"}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  const renderDeviceTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {devices.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          onClick={() => navigate(`/device-lock/devices/details/${item.agentId}`)}
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <FaStore className="text-slate-400 text-xs" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900">
                  {item.brandName}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {item.modelName}
                </span>
              </div>
            </div>
          </td>
          <td className="py-3 px-4">
            {getStatusTag(item.deviceStatus)}
          </td>
          <td className="py-3 px-4">
            <div className="flex flex-col gap-0.5">
              {(() => {
                const { date, time } = convertUTCToLocal(item?.enrollmentDate);
                return (
                  <>
                    <div className="flex items-center gap-1.5">
                      <BiCalendar className="text-slate-400 text-sm" />
                      <span className="text-xs text-slate-600">{date}</span>
                    </div>
                    {time && (
                      <span className="text-[10px] text-slate-500 pl-5">{time}</span>
                    )}
                  </>
                );
              })()}
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaMoneyBillWave className="text-amber-500 text-xs" />
              <span className="text-xs font-medium text-slate-900">₹{item.devicePrice}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaMoneyBillWave className="text-emerald-500 text-xs" />
              <span className="text-xs text-slate-600">₹{item.downPaymentAmount || "0"}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 text-xs" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-slate-900 truncate">
                  {item.customerDetails?.fullName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {item?.customerDetails?.contactNo || "—"}
                </span>
              </div>
            </div>
          </td>
          <td className="py-3 px-4">
            {getStatusTag(item?.emiPaymentStatus)}
          </td>
          <td className="py-3 px-4">
            {item.emiDetails?.emiId ? (
              <div
                className="flex flex-col cursor-pointer hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/device-lock/emi/details/${item.emiDetails?.emiId}`);
                }}
              >
                <div className="flex items-center gap-1.5">
                  <FaCoins className="text-amber-500 text-xs" />
                  <span className="text-xs font-medium text-slate-900">
                    ₹{item.emiDetails?.emiAmount || "0"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {item.emiDetails?.emiMonths ? `${item.emiDetails.emiMonths} months` : "—"}
                </span>
                <span className="text-[10px] text-blue-600 font-medium mt-0.5 hover:underline">
                  View Details →
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400">—</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );

  const { showAlert } = useAlert();

  useEffect(() => {
    if (selector?.data?.data?.message) {
      if (selector?.data?.data?.status === false) {
        showAlert("error", selector?.data?.data?.message);
      } else if (selector?.data?.data?.status === true) {
        showAlert("success", selector?.data?.data?.message);
      }
      dispatch(retailerActions.singleGet(params?.id));
      dispatch(retailerActions.clearMessage());
    }
  }, [selector, dispatch, showAlert, params?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString.replace(/\//g, "-"));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-slate-900">
                Retailer Details
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complete profile and transaction information
              </p>
            </div>
            
            {/* Action Buttons - Only for Admin */}
            {authSelect?.data?.userType === 'admin' && (
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Replay />}
                  onClick={handleRefundOpen}
                  disabled={!retailerDetails?.proTokens || retailerDetails?.proTokens <= 0}
                  sx={{
                    backgroundColor: '#f59e0b',
                    color: '#FFF',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#d97706',
                      boxShadow: 'none',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#fcd34d',
                      color: '#FFF',
                    }
                  }}
                >
                  Refund Key
                </Button>
                
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Update />}
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: '#1584b7',
                    color: '#FFF',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#0f6b94',
                      boxShadow: 'none',
                    }
                  }}
                >
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </div>

        {selector?.isFetching ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar
                    src={retailerDetails?.profilePic}
                    alt={retailerDetails?.fullName}
                    sx={{ width: 80, height: 80 }}
                    className="border-2 border-slate-200"
                  >
                    {!retailerDetails?.profilePic && <FaUser className="text-slate-400 text-3xl" />}
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {retailerDetails?.fullName}
                    </h2>
                    {retailerDetails?.accountActive !== undefined && (
                      getAccountStatusTag(retailerDetails?.accountActive)
                    )}
                  </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MdEmail className="text-slate-400" />
                      <span className="text-slate-600 truncate">{retailerDetails?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-slate-400 text-xs rotate-90" />
                      <span className="text-slate-600">{retailerDetails?.contactNo || "N/A"}</span>
                    </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm mb-3">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        retailerDetails?.address,
                        retailerDetails?.city,
                        retailerDetails?.state,
                        retailerDetails?.pinCode
                      ].filter(Boolean).join(', ') || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <InfoCard
                icon={FaKey}
                label="Available Tokens"
                value={retailerDetails?.proTokens || "0"}
              />
              
              <div className="relative">
                {authSelect?.data?.userType === "admin" && (
                  <button
                    onClick={handleReferralOpen}
                    className="absolute -top-2 -right-2 z-10 text-[10px] font-medium text-blue-600 bg-white border border-blue-200 rounded-full px-2 py-0.5 hover:bg-blue-50 shadow-sm"
                  >
                    Update
                  </button>
                )}
                <InfoCard
                  icon={MdOutlineEmail}
                  label="Referral Email"
                  value={retailerDetails?.refferalUserEmail}
                />
              </div>

              <InfoCard
                icon={BiCalendar}
                label="Joining Date"
                value={formatDate(retailerDetails?.createdAt)}
              />
              <InfoCard
                icon={FaMobileAlt}
                label="Total Devices"
                value={deviceTotalCount || "0"}
              />
              
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${retailerDetails?.accountActive ? 'bg-emerald-50' : 'bg-rose-50'} rounded-lg flex-shrink-0`}>
                    {retailerDetails?.accountActive ? (
                      <FaCheckCircle className="text-emerald-600 text-sm" />
                    ) : (
                      <FaTimesCircle className="text-rose-600 text-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">Account Status</p>
                    <p className={`text-sm font-medium ${retailerDetails?.accountActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {retailerDetails?.accountActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referred By Section (if exists) */}
            {retailerDetails?.refferalUserEmail && (
              <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
                <SectionHeader title="Referred By" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
                    onClick={() => navigate(`/device-lock/retailer/all/details/${retailerDetails?.refferalUserId}`)}
                  >
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FaUserTag className="text-purple-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Name</p>
                      <p className="text-sm font-medium text-slate-900">
                        {retailerDetails?.refferalUserFullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <MdEmail className="text-teal-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Email</p>
                      <p className="text-sm font-medium text-slate-900">
                        {retailerDetails?.refferalUserEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: '0.8rem',
                      minHeight: '40px',
                      padding: '6px 12px',
                      textTransform: 'none',
                      fontWeight: 500,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#16AFF6',
                    }
                  }}
                >
                  <Tab label="Key Transactions" icon={<FaKey className="text-sm" />} iconPosition="start" />
                  {authSelect?.data?.userType === "admin" && (
                    <Tab 
                      label={
                        <span className="flex items-center gap-2">
                          Devices
                          {deviceTotalCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                              {deviceTotalCount}
                            </span>
                          )}
                        </span>
                      } 
                      icon={<FaMobileAlt className="text-sm" />} 
                      iconPosition="start" 
                    />
                  )}
                </Tabs>
              </Box>

              <div className="mt-4">
                {tabIndex === 0 && (
                  <>
                    {keysData.length > 0 ? (
                      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                        <Table
                          keysData={keysData}
                          columns={keysColumns}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          hasNextPage={hasNextPage}
                          count={totalCount}
                        >
                          {renderKeysTableBody()}
                        </Table>
                      </Paper>
                    ) : (
                      <DataNotFound />
                    )}
                  </>
                )}

                {tabIndex === 1 && (
                  <>
                    {devices?.length > 0 ? (
                      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                        <Table
                          devices={devices}
                          columns={deviceColumns}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          hasNextPage={hasNextPageDevice}
                          count={deviceTotalCount}
                        >
                          {renderDeviceTableBody()}
                        </Table>
                      </Paper>
                    ) : (
                      <DataNotFound />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ChangePassword open={modalOpen} handleClose={handleClose} />

      <KeyRefund
        open={refundModalOpen}
        handleClose={handleRefundClose}
        userType={retailerDetails?.userType || 'retailer'}
        availableTokens={retailerDetails?.proTokens || 0}
        userId={params?.id}
      />

      <UpdateReferralEmailDialog
        open={referralModalOpen}
        handleClose={handleReferralClose}
        from="retailer"
        currentRefferalEmail={retailerDetails?.refferalUserEmail}
        userId={params?.id}
        email={retailerDetails?.email}
        name={retailerDetails?.fullName}
      />
    </div>
  );
};

export default AllRetailerDetails;