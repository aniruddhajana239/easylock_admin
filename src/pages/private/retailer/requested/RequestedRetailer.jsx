// pages/RequestedRetailer.js
import { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaSearch,
  FaUserTag,
} from "react-icons/fa";
import { PiClockCountdownBold } from "react-icons/pi";
import { MdEmail } from "react-icons/md";

import { Paper, Tooltip } from "@mui/material";

import AddTaskIcon from "@mui/icons-material/AddTask";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { useDispatch, useSelector } from "react-redux";
import { pendingAndRejectRetailerActions } from "../../../../redux/reducers/retailer/pendingAndRejected/PendingAndRejectedSlice";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import { pendingAndRejectRetailerSelector } from "../../../../redux/selector/retailer/pendingAndReject/PendingAndRejectRetailerSelector";
import Table from "../../../../component/table/Table";
import { authSelector } from "../../../../redux/selector/auth/authSelector";
import { WarningPopup } from "../../../../component/popup/WarningPopup";
import { RetailerApi } from "../../../../api/retailer/RetailerApi";
import { useAlert } from "../../../../context/customContext/AlertContext";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
import useDebounce from "../../../../config/hook/useDebounce";
import { formatToDDMMYYYY } from "../../../../utils/Utils";
import ApproveRetailerModal from "../../../../component/dialog/retailer/ApproveRetailerModal";

const RequestedRetailer = () => {
  const selector = useSelector(pendingAndRejectRetailerSelector);
  const dispatch = useDispatch();
  const authSelect = useSelector(authSelector);

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [retailerData, setRetailerData] = useState([]);
  const [status] = useState("pending");
  const [isOpenWarning, setIsOpenWarning] = useState(false);
  const [actionType, setActionType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedRetailerId, setSelectedRetailerId] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (selector && selector?.data && selector?.data?.rows) {
      setRetailerData(selector?.data?.rows ?? []);
      setTotalCount(selector?.data?.totalRows ?? 0);
    } else {
      setRetailerData([]);
      setTotalCount(0);
    }
  }, [selector]);

  // Make API call to fetch distributor data
  useEffect(() => {
    dispatch(pendingAndRejectRetailerActions?.reset());
    dispatch(
      pendingAndRejectRetailerActions.getAll({
        page: page + 1,
        limit: rowsPerPage,
        status: status,
      }),
    );
  }, [dispatch, page, rowsPerPage, status]);

  const columns = [
    "Retailer",
    "Status",
    "Contact",
    "Address",
    "Referral Email",
    "Created At",
    "Action",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Requested Retailers", path: "/device-lock/retailer/requested" },
  ];

  useEffect(() => {
    if (authSelect?.data?.userType === "admin") {
      columns.push("Actions");
    }
  }, [authSelect]);

  function convertUTCToLocal(dateString) {
    if (!dateString) return { date: "", time: "" };

    try {
      // Handles format like: 2026/03/20T16:36:37
      const normalized = dateString.replace(/\//g, "-");
      const utcDate = new Date(`${normalized}Z`);

      if (isNaN(utcDate.getTime())) {
        return { date: "", time: "" };
      }

      const date = utcDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });

      const time = utcDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      return { date, time };
    } catch {
      return { date: "", time: "" };
    }
  }

  const handleApprove = (retailerId) => {
    setSelectedRetailerId(retailerId);
    setApproveModalOpen(true);
  };

  const handleReject = (retailerId) => {
    setActionType({ type: "reject", id: retailerId });
    setIsOpenWarning(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FaCheckCircle className="mr-1 text-[10px]" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <PiClockCountdownBold className="mr-1 text-[10px]" />
            Pending
          </span>
        );
      case "reject":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <FaTimesCircle className="mr-1 text-[10px]" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {retailerData.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150"
        >
          {/* Retailer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  item.profilePic ||
                  `https://ui-avatars.com/api/?name=${item.fullName}&background=fbbf24&color=000`
                }
                alt={item.fullName}
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.fullName ?? ""}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[150px]">{item.email}</span>
                </div>
              </div>
            </div>
          </td>

          {/* Status Column */}
          <td className="py-3 px-4">{getStatusIcon(item.status)}</td>

          {/* Contact Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaPhone className="text-slate-400 text-xs rotate-90" />
              <span className="text-sm text-slate-600">
                {item.contactNo || "—"}
              </span>
            </div>
          </td>

          {/* Address Column */}
          <td className="py-3 px-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-slate-400 text-xs flex-shrink-0" />
                <span className="text-sm text-slate-600 truncate max-w-[150px]">
                  {item.address || "—"}
                </span>
              </div>
              {(item.city || item.state) && (
                <span className="text-xs text-slate-400 ml-5">
                  {[item.city, item.state, item.pinCode]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>
          </td>

          {/* Referral Email Column */}
          <td className="py-3 px-4">
            {item.refferalUserEmail ? (
              <div className="flex items-center gap-1.5">
                <FaUserTag className="text-slate-400 text-xs" />
                <span className="text-sm text-slate-600 truncate max-w-[150px]">
                  {item.refferalUserEmail}
                </span>
              </div>
            ) : (
              <span className="text-sm text-slate-400">—</span>
            )}
          </td>

          {/* Created At Column */}
          <td className="py-3 px-4">
            <div className="flex flex-col">
              {(() => {
                const { date, time } = convertUTCToLocal(item.createdAt);
                return (
                  <>
                    <span className="text-sm text-slate-700">
                      {date || "—"}
                    </span>
                    <span className="text-xs text-slate-400">{time || ""}</span>
                  </>
                );
              })()}
            </div>
          </td>

          {/* Actions Column */}
          {authSelect?.data?.userType === "admin" && (
            <td className="py-3 px-4">
              <div className="flex items-center gap-1">
                <Tooltip title="Approve" arrow>
                  <button
                    onClick={() => {
                      handleApprove(item?.id);
                      setSelectedRetailer(item);
                    }}
                    className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors duration-150"
                  >
                    <AddTaskIcon fontSize="small" />
                  </button>
                </Tooltip>
                <Tooltip title="Reject" arrow>
                  <button
                    onClick={() => handleReject(item?.id)}
                    className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors duration-150"
                  >
                    <DisabledByDefaultIcon fontSize="small" />
                  </button>
                </Tooltip>
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );

  const onYes = () => {
    try {
      if (actionType?.type) {
        setIsLoading(true);
        const statusToSend =
          actionType?.type === "reject" ? "reject" : actionType?.type;

        RetailerApi?.updateAccountStatus({
          retailerId: actionType?.id,
          status: statusToSend,
        })
          .then((res) => {
            setIsLoading(false);
            if (res?.status === 200) {
              setIsOpenWarning(false);
              if (res?.data?.status) {
                showAlert(
                  "success",
                  res?.data?.message || "Retailer rejected successfully",
                );
                dispatch(
                  pendingAndRejectRetailerActions.getAll({
                    page: page + 1,
                    limit: rowsPerPage,
                    status: status,
                  }),
                );
                // Refresh notification count in header
                window.dispatchEvent(new Event('refresh-notifications'));
              } else {
                showAlert(
                  "error",
                  res?.data?.message || "Failed to reject retailer",
                );
              }
            } else {
              showAlert("error", "Something went wrong");
            }
          })
          .catch((err) => {
            setIsLoading(false);
            showAlert(
              "error",
              err?.response?.data?.message ?? "Something went wrong",
            );
          });
      }
    } catch (error) {
      setIsLoading(false);
      showAlert("error", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hasNextPage = (page + 1) * rowsPerPage < totalCount;
  const debouncedSearchText = useDebounce(searchText, 500);

  const fetchData = () => {
    const formattedFromDate = formatToDDMMYYYY(fromDate);
    const formattedToDate = formatToDDMMYYYY(toDate);

    const params = {
      page: page + 1,
      status: "pending",
      limit: rowsPerPage,
      text: debouncedSearchText || "",
      from: formattedFromDate,
      to: formattedToDate,
    };

    if (isSearching || formattedFromDate || formattedToDate) {
      dispatch(pendingAndRejectRetailerActions.Search(params));
    } else {
      dispatch(pendingAndRejectRetailerActions.getAll(params));
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    rowsPerPage,
    debouncedSearchText,
    isSearching,
    status,
    fromDate,
    toDate,
  ]);

  useEffect(() => {
    if (selector && selector?.data && selector?.data?.rows) {
      setRetailerData(selector?.data?.rows);
    } else {
      setRetailerData([]);
    }
  }, [selector]);

  const handleSearchChange = (event) => {
    let searchData = event.target.value;
    setSearchText(event.target.value);
    setPage(0);
    setIsSearching(true);
    if (searchData == "" || searchData == undefined || searchData == null)
      setIsSearching(false);
  };

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-2xl font-light text-slate-900">
              Requested Retailers
              <span className="text-base font-normal text-slate-400 ml-3">
                {totalCount > 0 && `(${totalCount} pending)`}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review and manage pending retailer applications
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            padding: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.08)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
        >
          {/* Search and Filter Section */}
          {(searchText || retailerData?.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:w-96">
                  <label
                    htmlFor="search"
                    className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider"
                  >
                    Search Pending Retailers
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="search"
                      value={searchText}
                      onChange={handleSearchChange}
                      type="text"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      placeholder="Search by name, email, or contact..."
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider"
                    >
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="toDate"
                      className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider"
                    >
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchText || fromDate || toDate) && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    Active filters:
                  </span>
                  {searchText && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                      Search: "{searchText}"
                    </span>
                  )}
                  {fromDate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                      From: {new Date(fromDate).toLocaleDateString()}
                    </span>
                  )}
                  {toDate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                      To: {new Date(toDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Table Section */}
          {selector?.isFetching ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : retailerData.length > 0 ? (
            <Table
              retailerData={retailerData}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              hasNextPage={hasNextPage}
              count={totalCount}
            >
              {renderTableBody()}
            </Table>
          ) : (
            <div className="py-12">
              <DataNotFound message="No pending retailer requests found" />
            </div>
          )}
        </Paper>

        {/* Warning Popup for Reject */}
        <WarningPopup
          isLoading={isLoading}
          open={isOpenWarning}
          onYes={onYes}
          onClose={() => {
            setIsOpenWarning(false);
            setActionType();
          }}
          message="Are you sure you want to reject this retailer application?"
        />

        {/* Approve Modal */}
        <ApproveRetailerModal
          open={approveModalOpen}
          onClose={() => {
            setApproveModalOpen(false);
            // setSelectedRetailer()
          }}
          retailerId={selectedRetailerId}
          onSuccess={() => {
            fetchData();
          }}
          retailerData={selectedRetailer}
        />
      </div>
    </div>
  );
};

export default RequestedRetailer;
