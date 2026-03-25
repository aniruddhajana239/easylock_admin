// pages/Emi.js
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import { useNavigate } from "react-router";
import Loader from "../../../component/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import DataNotFound from "../../../component/dataNotFound/DataNotFound";
import useDebounce from "../../../config/hook/useDebounce";
import { Paper } from "@mui/material";
import { emiSelector } from "../../../redux/selector/emi/EmiSelector";
import { emiActions } from "../../../redux/reducers/emi/EmiSlice";
import { 
  FaSearch, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaStore,
  FaCheckCircle,
  FaTimesCircle,
  FaCoins
} from "react-icons/fa";
import { BiCalendar, BiUser } from "react-icons/bi";
import { MdEmail } from "react-icons/md";

const Emi = () => {
  const [emiData, setEmiData] = useState([]);
  const emiSelect = useSelector(emiSelector);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (emiSelect && emiSelect?.data && emiSelect?.data?.rows) {
      setEmiData(emiSelect?.data?.rows);
      setTotalCount(emiSelect?.data?.totalRows);
      setLoading(false);
    }
  }, [emiSelect]);
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(emiActions.getAll({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const columns = [
    "Customer",
    "Retailer",
    "Amount",
    "Due Date",
    "Extended Date",
    "Status",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "EMI", path: "/device-lock/emi" },
  ];

  const getStatusBadge = (isPaid) => {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          isPaid
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-rose-50 text-rose-700 border border-rose-200"
        }`}
      >
        {isPaid ? (
          <>
            <FaCheckCircle className="mr-1 text-[10px]" />
            Paid
          </>
        ) : (
          <>
            <FaTimesCircle className="mr-1 text-[10px]" />
            Unpaid
          </>
        )}
      </span>
    );
  };

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {emiData.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          onClick={() => navigate(`/device-lock/emi/details/${item.emiId}`)}
        >
          {/* Customer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-blue-600 text-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.customerDetails?.fullName || "N/A"}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaPhone className="text-[10px] rotate-90" />
                    {item?.customerDetails?.contactNumber || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[120px]">{item?.customerDetails?.email || "—"}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* Retailer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaStore className="text-purple-600 text-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.retailerDetails?.fullName || "N/A"}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaPhone className="text-[10px] rotate-90" />
                    {item?.retailerDetails?.contactNumber || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[120px]">{item?.retailerDetails?.email || "—"}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* Amount Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaCoins className="text-amber-500 text-sm" />
              <span className="text-sm font-semibold text-slate-900">
                ₹{item?.emiAmount || "0"}
              </span>
            </div>
          </td>
          
          {/* Due Date Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <span className="text-sm text-slate-600">
                {item?.dueDate || "—"}
              </span>
            </div>
          </td>
          
          {/* Extended Date Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <span className={`text-sm ${item?.extendedDate ? "text-slate-600" : "text-slate-400"}`}>
                {item?.extendedDate || "No extension"}
              </span>
            </div>
          </td>
          
          {/* Status Column */}
          <td className="py-3 px-4">
            {getStatusBadge(item.isPaid)}
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
        emiActions.Search({
          text: debouncedSearchText,
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } else {
      dispatch(emiActions.getAll({ page: page + 1, limit: rowsPerPage }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearchText, isSearching]);

  useEffect(() => {
    if (emiSelect && emiSelect?.data && emiSelect?.data?.rows) {
      setEmiData(emiSelect?.data?.rows);
    } else {
      setEmiData([]);
    }
  }, [emiSelect]);
  
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
              EMI Management
              <span className="text-base font-normal text-slate-400 ml-3">
                {totalCount > 0 && `(${totalCount} installments)`}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage all EMI installments
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
          {(searchText || emiData?.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:w-96">
                  <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    Search EMI
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="search"
                      value={searchText}
                      onChange={handleSearchChange}
                      type="text"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      placeholder="Search by customer, retailer..."
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
          {emiSelect?.isFetching ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : emiData.length > 0 ? (
            <Table
              emiData={emiData}
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

export default Emi;