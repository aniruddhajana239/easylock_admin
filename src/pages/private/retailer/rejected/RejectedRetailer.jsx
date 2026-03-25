// pages/RejectedRetailer.js
import React, { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Table from "../../../../component/table/Table";
import { useNavigate } from "react-router";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaCity, 
  FaFlag, 
  FaHashtag, 
  FaSearch,
  FaUserTag,
  FaCalendarAlt
} from "react-icons/fa";
import { PiClockCountdownBold } from "react-icons/pi";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { BiCalendar, BiUser } from "react-icons/bi";
import Loader from "../../../../component/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { pendingAndRejectRetailerActions } from "../../../../redux/reducers/retailer/pendingAndRejected/PendingAndRejectedSlice";
import { pendingAndRejectRetailerSelector } from "../../../../redux/selector/retailer/pendingAndReject/PendingAndRejectRetailerSelector";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
import { Paper } from "@mui/material";
import useDebounce from "../../../../config/hook/useDebounce";

const RejectedRetailer = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const selector = useSelector(pendingAndRejectRetailerSelector);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [retailerData, setRetailerData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState("reject");

  useEffect(() => {
    if (selector && selector?.data && selector?.data && selector?.data?.rows) {
      setRetailerData(selector?.data?.rows);
      setTotalCount(selector?.data?.totalRows ?? 0);
      setLoading(false);
    } else {
      setLoading(false);
      setRetailerData([]);
      setTotalCount(0);
    }
  }, [selector]);

  const columns = [
    "Retailer",
    "Status",
    "Contact",
    "Address",
    "Referral Email",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Rejected Retailers", path: "/device-lock/retailer/rejected" },
  ];

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
      {retailerData?.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150"
        >
          {/* Retailer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <img
                src={item.profilePic || `https://ui-avatars.com/api/?name=${item.fullName}&background=f43f5e&color=fff`}
                alt={item.fullName ?? ""}
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.fullName ?? ""}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[150px]">{item.email ?? ""}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* Status Column */}
          <td className="py-3 px-4">
            {getStatusIcon(item.status)}
          </td>
          
          {/* Contact Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaPhone className="text-slate-400 text-xs rotate-90" />
              <span className="text-sm text-slate-600">{item.contactNo || "—"}</span>
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
                  {[item.city, item.state, item.pinCode].filter(Boolean).join(', ')}
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
        </tr>
      ))}
    </tbody>
  );

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
    if (isSearching) {
      dispatch(
        pendingAndRejectRetailerActions.Search({
          text: debouncedSearchText,
          page: page + 1,
          limit: rowsPerPage,
          status: status
        })
      );
    } else {
      dispatch(pendingAndRejectRetailerActions.getAll({ 
        page: page + 1, 
        limit: rowsPerPage, 
        status: status 
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearchText, isSearching, status]);

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
              Rejected Retailers
              <span className="text-base font-normal text-slate-400 ml-3">
                {totalCount > 0 && `(${totalCount} total)`}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View all rejected retailer applications
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          {/* Search and Filter Section */}
          {(searchText || retailerData?.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:w-96">
                  <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    Search Rejected Retailers
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

                {/* Date Filter */}
                <div className="w-full lg:w-auto">
                  <label htmlFor="date" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="block w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filters */}
              {(searchText || selectedDate) && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">Active filters:</span>
                  {searchText && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                      Search: "{searchText}"
                    </span>
                  )}
                  {selectedDate && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                      Date: {new Date(selectedDate).toLocaleDateString()}
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
              <DataNotFound message="No rejected retailers found" />
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default RejectedRetailer;