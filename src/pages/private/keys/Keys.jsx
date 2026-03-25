// pages/Keys.js
import { useEffect, useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import { Button, Dialog, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import KeysAssignModal from "../../../component/dialog/keys/KeysAssignModal";
import { convertUTCToLocal } from "../../../utils/Utils";
import Loader from "../../../component/loader/Loader";
import { FaSearch, FaTag, FaUser, FaPhone, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { keysSelector } from "../../../redux/selector/keys/KeysSelector";
import { keysActions } from "../../../redux/reducers/keys/KeysSlice";
import DataNotFound from "../../../component/dataNotFound/DataNotFound";
import useDebounce from "../../../config/hook/useDebounce";
import { formatToDDMMYYYY } from "../../../utils/Utils";

const Keys = () => {
  const selector = useSelector(keysSelector);
  const dispatch = useDispatch();
  const authData = useSelector(authSelector);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keysData, setKeysData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (selector && selector?.data && selector?.data?.rows) {
      setKeysData(selector?.data?.rows);
      setTotalCount(selector?.data?.totalRows);
    } else {
      setKeysData([]);
    }
  }, [selector]);

  const debouncedSearchText = useDebounce(searchText, 500);
  
  const fetchData = () => {
    const formattedFromDate = formatToDDMMYYYY(fromDate);
    const formattedToDate = formatToDDMMYYYY(toDate);
    
    if (isSearching || formattedFromDate || formattedToDate) {
      dispatch(
        keysActions.getallHistory({
          text: debouncedSearchText,
          page: page + 1,
          limit: rowsPerPage,
        })
      );
    } else {
      if (authData?.data?.userType === "superdistributor") {
        dispatch(
          keysActions.getAllForSuperDistributor({ page: page + 1, limit: rowsPerPage })
        );
      } else {
        dispatch(
          keysActions.getallHistory({ page: page + 1, limit: rowsPerPage })
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearchText, isSearching, fromDate, toDate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Keys", path: "/device-lock/keys" },
  ];

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = (isSuccess) => {
    setIsModalOpen(false);
    dispatch(keysActions?.clearMessage);
    if (isSuccess) {
      if (authData?.data?.userType === "superdistributor") {
        dispatch(
          keysActions.getAllForSuperDistributor({ page: page + 1, limit: rowsPerPage })
        );
      } else {
        dispatch(
          keysActions.getallHistory({ page: page + 1, limit: rowsPerPage })
        );
      }
    }
  };

  const getStatusIcon = (transactionStatus) => {
    if (transactionStatus === "credit") {
      return <FaArrowUp className="text-emerald-500 text-xs" />;
    } else if (transactionStatus === "debit") {
      return <FaArrowDown className="text-rose-500 text-xs" />;
    }
    return null;
  };

  const columns = [
    "Transaction ID",
    "Quantity",
    "Price",
    "Type",
    "Date",
    "Purchase",
    "Sell",
  ];

  const renderTableBody = () => (
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
            <span className="text-sm font-medium text-slate-900">{item?.tokens}</span>
          </td>
          
          <td className="py-3 px-4">
            <span className="text-sm text-slate-600">₹{item?.price ?? 0}</span>
          </td>
          
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              {getStatusIcon(item?.transactionStatus)}
              <span className={`text-xs font-medium ${
                item?.transactionStatus === "credit" ? "text-emerald-600" : "text-rose-600"
              }`}>
                {item?.transactionStatus}
              </span>
            </div>
          </td>
          
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <span className="text-xs text-slate-600">{convertUTCToLocal(item?.createdAt)}</span>
            </div>
          </td>

          <td className="py-3 px-4">
            {(item?.transactionStatus === "credit"||item?.transactionStatus === "refunded") && item?.otherUser ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-emerald-600 text-xs" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {item?.otherUser?.fullName || ""}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <FaPhone className="text-[8px] rotate-90" />
                    <span className="truncate">{item?.otherUser?.contactNo || ""}</span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400">—</span>
            )}
          </td>
          
          <td className="py-3 px-4">
            {item?.transactionStatus === "debit" && item?.otherUser ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-rose-600 text-xs" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-slate-900 truncate">
                    {item?.otherUser?.fullName || ""}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <FaPhone className="text-[8px] rotate-90" />
                    <span className="truncate">{item?.otherUser?.contactNo || ""}</span>
                  </div>
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hasNextPage = (page + 1) * rowsPerPage < totalCount;
  
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
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-slate-900">
                Keys Management
                <span className="text-base font-normal text-slate-400 ml-3">
                  {totalCount > 0 && `(${totalCount} transactions)`}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track and manage all key transactions
              </p>
            </div>
            
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={openModal}
              sx={{
                backgroundColor: '#16AFF6',
                color: '#FFF',
                fontWeight: 500,
                fontSize: '0.875rem',
                padding: '6px 16px',
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#0F8FC9',
                  boxShadow: 'none',
                },
              }}
            >
              Assign Keys
            </Button>
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
          {(searchText || keysData?.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                {/* Search Input */}
                <div className="w-full lg:w-96">
                  <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    Search Transactions
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      id="search"
                      value={searchText}
                      onChange={handleSearchChange}
                      type="text"
                      className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all"
                      placeholder="Search by ID or user..."
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
                      {`Search: "${searchText}"`}
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
          ) : Array.isArray(keysData) && keysData?.length > 0 ? (
            <Table
              keysData={keysData}
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

        {/* Assign Keys Modal */}
        <Dialog 
          open={isModalOpen} 
          onClose={closeModal} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }
          }}
        >
          <KeysAssignModal closeModal={closeModal} />
        </Dialog>
      </div>
    </div>
  );
};

export default Keys;