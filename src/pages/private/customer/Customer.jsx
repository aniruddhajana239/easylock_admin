// pages/Customer.js
import { useCallback, useEffect, useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import Loader from "../../../component/loader/Loader";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaHashtag, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { PiDeviceMobile } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { customerSelector } from "../../../redux/selector/customer/CustomerSelector";
import { customerActions } from "../../../redux/reducers/customer/CustomerSlice";
import DataNotFound from "../../../component/dataNotFound/DataNotFound";
import { Paper } from "@mui/material";
import useDebounce from "../../../config/hook/useDebounce";
import { formatToDDMMYYYY, convertUTCToLocalWithObject } from "../../../utils/Utils";
import { Link } from "react-router-dom";

const Customer = () => {
  const customerSelect = useSelector(customerSelector);
  const dispatch = useDispatch();
  const [customerData, setCustomerData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const columns = ["Customer", "Address", "Device", "Enrolled On", "EMI Details"];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Customers", path: "/device-lock/customer" },
  ];

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {customerData.map((item, index) => (
        <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
          <td className="py-3 px-4">
            <Link to={`/device-lock/customer/details/${item.id}`} className="flex items-center gap-3">
              <img
                src={item?.profilePic ?? `https://ui-avatars.com/api/?name=${item?.fullName}&background=random&color=random`}
                alt={item.fullName}
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.fullName || ""}
                </span>
                <div className="flex-col items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaPhone className="text-[10px] rotate-90" />
                    {item?.contactNo || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaEnvelope className="text-[10px]" />
                    {item?.email || "—"}
                  </span>
                </div>
              </div>
            </Link>
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
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <PiDeviceMobile className="text-slate-400 text-sm" />
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.deviceDetails?.brandName || ""} {item?.deviceDetails?.modelName || ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <FaHashtag className="text-slate-400 text-[10px]" />
                <span className="text-xs text-slate-500 font-mono truncate">
                  {item?.deviceDetails?.imei || ""}
                </span>
              </div>
              <Link 
                to={`/device-lock/devices/details/${item?.deviceDetails?.agentId}`} 
                className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
              >
                View Device
                <span className="text-blue-400">→</span>
              </Link>
            </div>
          </td>
          
          {/* Enrolled On Column */}
          <td className="py-3 px-4">
            {(() => {
              const enrollmentDate = item?.deviceDetails?.enrollmentDate;
              if (!enrollmentDate) return <span className="text-sm text-slate-400">—</span>;
              const dateObj = convertUTCToLocalWithObject(enrollmentDate);
              if (!dateObj.date) return <span className="text-sm text-slate-500">{enrollmentDate}</span>;
              return (
                <div className="flex flex-col">
                  <span className="text-sm text-slate-600">
                    {dateObj.date}
                  </span>
                  <span className="text-xs text-slate-400">
                    {dateObj.time}
                  </span>
                </div>
              );
            })()}
          </td>
          
          <td className="py-3 px-4">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <FaMoneyBillWave className="text-emerald-500 text-sm" />
                <span className="text-sm font-semibold text-slate-900">
                  ₹{item?.emiDetails?.emiAmount || "0"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <BiCalendar className="text-slate-400 text-xs" />
                <span className="text-xs text-slate-600">
                  {item?.emiDetails?.emiMonths || "0"} months
                </span>
              </div>
              {item.emiDetails?.emiId && (
                <Link 
                  to={`/device-lock/emi/details/${item.emiDetails?.emiId}`} 
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center gap-1"
                >
                  View EMI
                  <span className="text-blue-400">→</span>
                </Link>
              )}
            </div>
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
 
  const fetchData = useCallback(() => {
    const formattedFromDate = formatToDDMMYYYY(fromDate);
    const formattedToDate = formatToDDMMYYYY(toDate);
  
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      text: debouncedSearchText || '',
      from: formattedFromDate,
      to: formattedToDate,
    };
  
    if (isSearching || formattedFromDate || formattedToDate) {
      dispatch(customerActions.search(params));
    } else {
      dispatch(customerActions.getAll(params));
    }
  }, [page, rowsPerPage, debouncedSearchText, isSearching, fromDate, toDate, dispatch]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
      
  useEffect(() => {
    if (customerSelect && customerSelect?.data && customerSelect?.data?.rows) {
      setCustomerData(customerSelect?.data?.rows);
      setTotalCount(customerSelect?.data?.totalRows);
    } else {
      setCustomerData([]);
    }
  }, [customerSelect]);

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
              Customers
              <span className="text-base font-normal text-slate-400 ml-3">
                {totalCount > 0 && `(${totalCount} total)`}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage and view all customer information
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
          {(searchText || customerData?.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:w-96">
                  <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    Search Customers
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="search"
                      value={searchText}
                      onChange={handleSearchChange}
                      type="text"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      placeholder="Search by name, email, or phone..."
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label htmlFor="fromDate" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
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
                    <label htmlFor="toDate" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
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
                  <span className="text-xs text-slate-400">Active filters:</span>
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
          {customerSelect?.isFetching ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : customerData.length > 0 ? (
            <Table
              customerData={customerData}
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
              <DataNotFound />
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Customer;