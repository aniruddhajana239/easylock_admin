// pages/AllSuperDistributorDetails.js
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
import { useParams } from "react-router";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaKey,
  FaWallet,
  FaTag
} from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import Breadcrumb from "../../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../../component/loader/Loader";
import DataNotFound from "../../../../../component/dataNotFound/DataNotFound";
import Table from "../../../../../component/table/Table";
import InfoCard from "../../../../../component/cards/InfoCard";
import ChangePassword from "../../../../../component/dialog/distributor/ChangePassword";
import KeyRefund from "../../../../../component/dialog/keys/KeyRefundModal";
import { useAlert } from "../../../../../context/customContext/AlertContext";
import { superDistributorActions } from "../../../../../redux/reducers/superDistributor/SuperDistributorSlice";
import { superDistributorSelector } from "../../../../../redux/selector/superDistributor/SuperDistributorSeletor";
import { authSelector } from "../../../../../redux/selector/auth/authSelector";
import { KeysApi } from "../../../../../api/keys/KeysApi";
import { DistributorApi } from "../../../../../api/distributor/DistributorApi";

const AllSuperDistributorDetails = () => {
  const [superDistributor, setSuperDistributor] = useState({});
  const [keysData, setKeysData] = useState([]);
  const [distributorsData, setDistributorsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const selector = useSelector(superDistributorSelector);
  const authData = useSelector(authSelector);
  const [tabIndex, setTabIndex] = useState(0);
  const params = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const { showAlert } = useAlert();
  const [totalCount, setTotalCount] = useState(0);
  const [distributorTotalCount, setDistributorTotalCount] = useState(0);
  
  const [distributorCount, setDistributorCount] = useState(0);

  const fetchKeysData = async () => {
    try {
      
      const res = await KeysApi.getAllForSuperDistributor({
        page: page + 1,
        limit: rowsPerPage,
        superDistributorId: params?.id
      });
      if (res?.data?.status) {
        setKeysData(res?.data?.data?.rows || []);
        setTotalCount(res?.data?.data?.totalRows || 0);
      } else {
        setKeysData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching keys data:", error);
      showAlert("error", "An error occurred while fetching keys data");
    };
  };

  const fetchDistributorsData = async () => {
    try {
      const res = await DistributorApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        superDistributorId: params?.id
      });
      if (res?.data?.status) {
        setDistributorsData(res?.data?.data?.rows || []);
        setDistributorTotalCount(res?.data?.data?.totalRows || 0);
      } else {
        setDistributorsData([]);
        setDistributorTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching distributors data:", error);
      showAlert("error", "An error occurred while fetching distributors data");
    }
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleRefundOpen = () => setRefundModalOpen(true);
  const handleRefundClose = (isUpdated) => {
    if (isUpdated) {
      dispatch(superDistributorActions.singleGet(params?.id));
      fetchKeysData();
      setRefundModalOpen(false);
    } else {
      setRefundModalOpen(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      dispatch(superDistributorActions.singleGet(params?.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (selector?.data?.data) {
      setSuperDistributor(selector?.data?.data);
      if (selector?.data?.data?.totalDistributors) {
        setDistributorCount(selector?.data?.data?.totalDistributors);
      }
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
    { label: "Super Distributors", path: "/device-lock/super-distributors/all" },
    { label: "Super Distributor Details" },
  ];

  

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setPage(0);
  };

  useEffect(() => {
    if (tabIndex === 0 && params?.id) {
      fetchKeysData();
    }
    if (tabIndex === 1 && params?.id) {
      fetchDistributorsData();
    }
  }, [page, rowsPerPage, tabIndex, params?.id]);


  useEffect(() => {
    if (selector?.data?.data?.message) {
      if (selector?.data?.data?.status === false) {
        showAlert("error", selector?.data?.data?.message);
      } else if (selector?.data?.data?.status === true) {
        showAlert("success", selector?.data?.data?.message);
      }
      dispatch(superDistributorActions.clearMessage());
      dispatch(superDistributorActions.singleGet(params?.id));
    }
  }, [selector, dispatch, showAlert, params?.id]);

  const keysColumns = [
    "Transaction ID",
    "Quantity",
    "Price",
    "Type",
    "Date",
    "Purchase",
    "Sell",
  ];

  const distributorColumns = [
    "Distributor",
    "Contact",
    "Address",
    "Keys",
    "Retailers",
    "Status",
  ];

  const renderKeysTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {keysData?.map((item, index) => (
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

  const renderDistributorsTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {distributorsData?.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          onClick={() => window.location.href = `/device-lock/distributors/all/details/${item.id}`}
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <img
                src={item?.profilePic ?? `https://ui-avatars.com/api/?name=${item?.fullName}&background=random&color=random`}
                alt={item?.fullName}
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.fullName || "—"}
                </span>
                <span className="text-xs text-slate-500 truncate">{item?.email || "—"}</span>
              </div>
            </div>
          </td>
          <td className="py-3 px-4">
            <div className="flex flex-col">
              <span className="text-sm text-slate-600">{item?.contactNo || "—"}</span>
            </div>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-slate-600 truncate max-w-[150px] block">
              {item?.address || "—"}
            </span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm font-medium text-blue-600">{item?.proTokens || 0}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm font-medium text-emerald-600">{item?.totalRetailers || 0}</span>
          </td>
          <td className="py-3 px-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              item?.accountActive 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {item?.accountActive ? "Active" : "Inactive"}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const hasNextPage = (page + 1) * rowsPerPage < totalCount;
  const hasDistributorNextPage = (page + 1) * rowsPerPage < distributorTotalCount;

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
                Super Distributor Details
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
                    disabled={!superDistributor?.proTokens || superDistributor?.proTokens <= 0}
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
                    {superDistributor?.profilePic ? (
                      <img
                        src={superDistributor.profilePic}
                        alt={superDistributor.fullName}
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
                      {superDistributor?.fullName || "N/A"}
                    </h2>
                    <Chip
                      label={superDistributor?.accountActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        backgroundColor: superDistributor?.accountActive ? '#d1fae5' : '#fee2e2',
                        color: superDistributor?.accountActive ? '#065f46' : '#991b1b',
                        fontSize: '0.7rem',
                        height: '24px',
                        border: 'none',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MdEmail className="text-slate-400" />
                    <span className="text-slate-600 truncate">{superDistributor?.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="text-slate-400 rotate-90" />
                    <span className="text-slate-600">{superDistributor?.contactNo || "N/A"}</span>
                  </div>

                  {/* Address */}
                  <div className="mt-3 flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        superDistributor?.address,
                        superDistributor?.city,
                        superDistributor?.state,
                        superDistributor?.pinCode
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
                        <p className="text-xl font-semibold text-slate-900">{superDistributor?.proTokens || "0"}</p>
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
                value={superDistributor?.proTokens || "0"}
              />
              <InfoCard
                icon={FaBuilding}
                label="Total Distributors"
                value={distributorCount || "0"}
              />
              <InfoCard
                icon={MdEmail}
                label="Referral Email"
                value={superDistributor?.refferalEmail??"By Admin"}
              />
              <InfoCard
                icon={BiCalendar}
                label="Joining Date"
                value={formatDate(superDistributor?.createdAt)}
              />
              <div className="bg-white rounded-lg border border-slate-200 p-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${superDistributor?.accountActive ? 'bg-emerald-50' : 'bg-rose-50'} rounded-lg flex-shrink-0`}>
                    {superDistributor?.accountActive ? (
                      <FaCheckCircle className="text-emerald-600 text-sm" />
                    ) : (
                      <FaTimesCircle className="text-rose-600 text-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">Account Status</p>
                    <p className={`text-sm font-medium ${superDistributor?.accountActive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {superDistributor?.accountActive ? "Active" : "Inactive"}
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
                  <Tab
                    label="Distributors"
                    icon={<FaBuilding className="text-sm" />}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {tabIndex === 0 && (
                <>
                  {keysData?.length > 0 ? (
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
                  {distributorsData?.length > 0 ? (
                    <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                      <Table
                        distributorData={distributorsData}
                        columns={distributorColumns}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        hasNextPage={hasDistributorNextPage}
                        count={distributorTotalCount}
                      >
                        {renderDistributorsTableBody()}
                      </Table>
                    </Paper>
                  ) : (
                    <DataNotFound />
                  )}
                </>
              )}
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
        userType='super-distributor'
        availableTokens={superDistributor?.proTokens || 0}
        userId={params?.id}
      />
    </div>
  );
};

export default AllSuperDistributorDetails;