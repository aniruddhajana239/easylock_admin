// pages/AllDistributorDetails.js
import { useEffect, useState } from "react";
import {
  Chip,
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { Update, Replay } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaUserAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaKey,
  FaWallet,
  FaTag,
  FaStore
} from "react-icons/fa";
import { MdOutlineEmail, MdEmail } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";
import { distributorSelector } from "../../../../../redux/selector/distributor/DistributorSelector";
import { distributorActions } from "../../../../../redux/reducers/distributor/DistributorSlice";
import Breadcrumb from "../../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../../component/loader/Loader";
import DataNotFound from "../../../../../component/dataNotFound/DataNotFound";
import Table from "../../../../../component/table/Table";
import InfoCard from "../../../../../component/cards/InfoCard";
import ChangePassword from "../../../../../component/dialog/distributor/ChangePassword";
import KeyRefund from "../../../../../component/dialog/keys/KeyRefundModal";
import { useAlert } from "../../../../../context/customContext/AlertContext";
import { authSelector } from "../../../../../redux/selector/auth/authSelector";
import { retailerActions } from "../../../../../redux/reducers/retailer/RetailerSlice";
import { retailerSelector } from "../../../../../redux/selector/retailer/RetailerSelector";
import { KeysApi } from "../../../../../api/keys/KeysApi";
import UpdateReferralEmailDialog from "../../../../../component/dialog/updateReferralEmailDialog/UpdateReferralEmailDialog";

const AllDistributorDetails = () => {
  const [distributor, setDistributor] = useState({});
  const [filteredKeysData, setFilteredKeysData] = useState([]);
  const [retailerListData, setRetailerListData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const selector = useSelector(distributorSelector);
  const [tabIndex, setTabIndex] = useState(0);
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const authData = useSelector(authSelector);
  const retailerData = useSelector(retailerSelector);
  const [totalCount, setTotalCount] = useState(0);

  const filterKeysData = (keys) => {
    if (!keys || !Array.isArray(keys)) return [];

    const userType = authData?.data?.userType;

    if (userType === "superdistributor") {
      return keys.filter(item => {
        if (item?.transactionStatus === "debit") {
          return false;
        }
        return item?.transactionStatus === "credit" &&
          item?.otherUser?.userType === "superdistributor";
      });
    }
    return keys;
  };

  const fetchKeysData = async () => {
    if (!params?.id) return;
    try {
      const res = await KeysApi.getAllForDistributorAndRetailer({
        page: page + 1,
        limit: rowsPerPage,
        distributorId: params?.id,
      });
      if (res?.data?.status) {
        const allKeysData = res?.data?.data?.rows || [];
        const filteredData = filterKeysData(allKeysData);
        setFilteredKeysData(filteredData);
        setTotalCount(res?.data?.data?.totalRows || 0);
      } else {
        setFilteredKeysData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching keys data:", error);
      showAlert("error", "An error occurred while fetching keys data");
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleRefundOpen = () => setRefundModalOpen(true);
  const handleRefundClose = (isUpdated) => {
    if (isUpdated) {
      dispatch(distributorActions.singleGet(params?.id));
      fetchKeysData();
      setRefundModalOpen(false);
    } else {
      setRefundModalOpen(false);
    }
  };

  const handleReferralOpen = () => setReferralModalOpen(true);
  const handleReferralClose = (isUpdated) => {
    if (isUpdated) {
      dispatch(distributorActions.singleGet(params?.id));
      fetchKeysData();
      showAlert("success", "Referral email updated successfully");
      setReferralModalOpen(false);
    } else {
      setReferralModalOpen(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      // Clear and reset data when distributor changes
      setTotalCount(0);
      setRetailerCount(0);
      setRetailerTotalCount(0);
      dispatch(distributorActions.singleGet(params?.id));
      // Fetch retailers on initial load for count
      dispatch(
        retailerActions.getAll({
          page: 1,
          limit: 1,
          distributorId: params?.id,
        })
      );
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (selector?.data?.data) {
      setDistributor(selector?.data?.data?.[0]);
    }
  }, [selector]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Distributors", path: "/device-lock/distributors/all" },
    { label: "Distributor Details" },
  ];

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  useEffect(() => {
    if (tabIndex === 0 && params?.id) {
      fetchKeysData();
    }
    // Retailers are fetched on initial load for count
    // Only clear and refetch when switching to Retailers tab
    if (tabIndex === 1 && params?.id) {
      setRetailerListData([]);
      dispatch(
        retailerActions.getAll({
          page: page + 1,
          limit: rowsPerPage,
          distributorId: params?.id,
        })
      );
    }
  }, [page, rowsPerPage, tabIndex, params?.id]);

  const [retailerTotalCount, setRetailerTotalCount] = useState(0);
  const [retailerCount, setRetailerCount] = useState(0);


  useEffect(() => {
    if (retailerData && retailerData?.data) {
      setRetailerListData(retailerData?.data?.data?.rows || retailerData?.data?.data || []);
      setRetailerTotalCount(retailerData?.data?.data?.totalRows || 0);
      setRetailerCount(retailerData?.data?.data?.totalRows || 0);
    } 
  }, [retailerData]);

  useEffect(() => {
    if (selector?.data?.data?.message) {
      if (selector?.data?.data?.status === false) {
        showAlert("error", selector?.data?.data?.message);
      } else if (selector?.data?.data?.status === true) {
        showAlert("success", selector?.data?.data?.message);
      }
      dispatch(distributorActions.clearMessage());
      dispatch(distributorActions.singleGet(params?.id));
    }
  }, [selector, dispatch, showAlert, params?.id]);

  // Keys Table Columns and Render Function
  const keysColumns = [
    "Transaction ID",
    "Quantity",
    "Price",
    "Type",
    "Date",
    "Purchase",
    "Sell",
  ];

  const renderKeysTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {filteredKeysData?.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150"
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <FaTag className="text-slate-400 text-xs" />
              <span className="text-xs font-mono text-slate-600">{item?.id}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm font-medium text-slate-900">{item?.tokens || "0"}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-600">₹{item?.price || "0"}</span>
          </td>
          <td className="py-3 px-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item?.transactionStatus === "credit"
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
              {item?.transactionStatus || "N/A"}
            </span>
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <span className="text-xs text-slate-600">{item?.date || "N/A"}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            {(item?.transactionStatus === "credit" || item?.transactionStatus === "refunded") && item?.otherUser ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-emerald-600 text-xs" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-900">
                    {item?.otherUser?.fullName || ""}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item?.otherUser?.contactNo || ""}
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
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-900">
                    {item?.otherUser?.fullName || "N/A"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item?.otherUser?.contactNo || ""}
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

  // Retailer Table Columns and Render Function
  const retailerColumns = [
    "Retailer",
    "Address",
    "Available Keys",
  ];

  const renderRetailerTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {retailerListData?.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          onClick={() => {
            authData?.data?.userType === "admin" ? navigate(`/device-lock/retailer/all/details/${item.id}`) : null;
          }}
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              {item?.profilePic ? (
                <img
                  src={item.profilePic}
                  alt={item.fullName}
                  className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-blue-500 text-sm" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.fullName || "N/A"}
                </span>
                <div className="flex flex-col items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaEnvelope className="text-[10px]" />
                    {item?.email || "—"}
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1">
                    <FaPhone className="text-[10px] rotate-90" />
                    {item?.contactNo || "—"}
                  </span>
            </div>
          </td>

          <td className="py-3 px-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-slate-400 text-xs flex-shrink-0" />
                <span className="text-sm text-slate-600 truncate max-w-[150px]">
                  {item?.address || "—"}
                </span>
              </div>
              {(item?.city || item?.state) && (
                <span className="text-xs text-slate-400 ml-5">
                  {[item?.city, item?.state, item?.pinCode].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </td>

          <td className="py-3 px-4">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <FaKey className="text-emerald-600 text-xs mr-1" />
              <span className="text-xs font-medium text-emerald-700">
                {item?.proTokens || 0}
              </span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const hasNextPage = (page + 1) * rowsPerPage < totalCount;
  const hasNextPageRetailer = (page + 1) * rowsPerPage < retailerTotalCount;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString.replace(/\//g, "-"));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
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
                Distributor Details
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complete profile and transaction information
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {authData?.data?.userType === "admin" && (
                <>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Replay />}
                    onClick={handleRefundOpen}
                    disabled={!distributor?.proTokens || distributor?.proTokens <= 0}
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
                </>
              )}
            </div>
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
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    {distributor?.profilePic ? (
                      <img
                        src={distributor.profilePic}
                        alt={distributor.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-slate-400 text-3xl" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {distributor?.fullName || "N/A"}
                    </h2>
                    <Chip
                      label={distributor?.accountActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        backgroundColor: distributor?.accountActive ? '#d1fae5' : '#fee2e2',
                        color: distributor?.accountActive ? '#065f46' : '#991b1b',
                        fontSize: '0.7rem',
                        height: '24px',
                        border: 'none',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MdEmail className="text-slate-400" />
                      <span className="text-slate-600 truncate">{distributor?.email || "N/A"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                      <FaPhone className="text-slate-400 rotate-90" />
                      <span className="text-slate-600">{distributor?.contactNo || "N/A"}</span>
                    </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        distributor?.address,
                        distributor?.city,
                        distributor?.state,
                        distributor?.pinCode
                      ].filter(Boolean).join(', ') || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="flex-shrink-0">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FaWallet className="text-slate-400 text-lg" />
                      <div>
                        <p className="text-xs text-slate-500">Available Keys</p>
                        <p className="text-xl font-semibold text-slate-900">{distributor?.proTokens || "0"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <InfoCard
                icon={FaKey}
                label="Total Keys"
                value={distributor?.proTokens || "0"}
              />

              <InfoCard
                icon={FaUserAlt}
                label="Total Retailers"
                value={retailerCount || "0"}
              />

              <div className="relative">
                {authData?.data?.userType === "admin" && (
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
                  value={distributor?.refferalEmail}
                />
              </div>

              <InfoCard
                icon={BiCalendar}
                label="Joining Date"
                value={formatDate(distributor?.createdAt)}
              />

              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${distributor?.accountActive ? 'bg-emerald-50' : 'bg-rose-50'} rounded-lg flex-shrink-0`}>
                    {distributor?.accountActive ? (
                      <FaCheckCircle className="text-emerald-600 text-sm" />
                    ) : (
                      <FaTimesCircle className="text-rose-600 text-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">Account Status</p>
                    <p className={`text-sm font-medium ${distributor?.accountActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {distributor?.accountActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  aria-label="distributor tabs"
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
                  <Tab
                    label="Key Transactions"
                    icon={<FaKey className="text-sm" />}
                    iconPosition="start"
                  />
                  {authData?.data?.userType === "admin" && (
                    <Tab
                      label="Retailers"
                      icon={<FaStore className="text-sm" />}
                      iconPosition="start"
                    />
                  )}
                </Tabs>
              </Box>

              <div className="mt-4">
                {tabIndex === 0 && (
                  <>
                    {filteredKeysData?.length > 0 ? (
                      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                        <Table
                          keysData={filteredKeysData}
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
                      <DataNotFound
                        message={
                          authData?.data?.userType === "superdistributor"
                            ? "No tokens assigned by superdistributors found"
                            : "No key transactions found"
                        }
                      />
                    )}
                  </>
                )}

                {tabIndex === 1 && (
                  <>
                    {retailerListData?.length > 0 ? (
                      <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                        <Table
                          keysData={retailerListData}
                          columns={retailerColumns}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          hasNextPage={hasNextPageRetailer}
                          count={retailerTotalCount}
                        >
                          {renderRetailerTableBody()}
                        </Table>
                      </Paper>
                    ) : (
                      <DataNotFound message="No retailers found for this distributor" />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ChangePassword
        open={modalOpen}
        handleClose={handleClose}
      />

      <KeyRefund
        open={refundModalOpen}
        handleClose={handleRefundClose}
        userType={distributor?.userType || 'distributor'}
        availableTokens={distributor?.proTokens || 0}
        userId={params?.id}
      />

      <UpdateReferralEmailDialog
        open={referralModalOpen}
        handleClose={handleReferralClose}
        from="distributor"
        currentRefferalEmail={distributor?.refferalEmail}
        userId={params?.id}
        email={distributor?.email}
        name={distributor?.fullName}
      />
    </div>
  );
};

export default AllDistributorDetails;