// pages/AllSuperDistributor.js
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
import AddDistributor from "../../../../component/dialog/distributor/DiatributorAddModal";
import Table from "../../../../component/table/Table";
import { WarningPopup } from "../../../../component/popup/WarningPopup";
import useDebounce from "../../../../config/hook/useDebounce";
import { useAlert } from "../../../../context/customContext/AlertContext";
import { superDistributorSelector } from "../../../../redux/selector/superDistributor/SuperDistributorSeletor";
import { superDistributorActions } from "../../../../redux/reducers/superDistributor/SuperDistributorSlice";
import { SuperDistributorAPI } from "../../../../api/superDistributor/SuperDistributor";
import { FaSearch, FaEnvelope, FaPhone, FaMapMarkerAlt, FaKey, FaUsers } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const AllSuperDistributor = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const navigate = useNavigate();
  const selector = useSelector(superDistributorSelector);
  const dispatch = useDispatch();
  const [accountActive, setAccountActive] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [superDistributorData, setSuperDistributorData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const onCloseAddModal = () => {
    setModalOpen(false);
    dispatch(
        superDistributorActions.getAll({ page: page + 1, limit: rowsPerPage })
      );
  };
  
  const debouncedSearchText = useDebounce(searchText, 500);
  
  const fetchData = useCallback(() => {
    if (isSearching) {
      dispatch(
        superDistributorActions.Search({
          text: debouncedSearchText,
          page: page + 1,
          limit: rowsPerPage,
          accountActive: accountActive,
        })
      );
    } else {
      dispatch(
        superDistributorActions.getAll({
          page: page + 1,
          limit: rowsPerPage,
          accountActive,
        })
      );
    }
  }, [
    debouncedSearchText,
    isSearching,
    page,
    rowsPerPage,
    accountActive,
    dispatch,
  ]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    if (
      selector &&
      selector?.data &&
      selector?.data?.data &&
      selector?.data?.data?.rows
    ) {
      setSuperDistributorData(selector?.data?.data?.rows);
      setTotalCount(selector?.data?.data?.totalRows);
    } else {
      setSuperDistributorData([]);
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

  const columns = [
    "Distributor",
    "Address",
    "Available Keys",
    "Distributors",
    "Referral Email",
    "Status",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/" },
    { label: "Super Distributor", path: "/device-lock/super-distributors/all/" },
  ];

  const handleStatusToggle = (distributor) => {
    setSelectedDistributor(distributor);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedDistributor) {
      setIsUpdatingStatus(true);
      try {
        const response = await SuperDistributorAPI.updateAccountStatus({
          superDistributorId : selectedDistributor.id,
          accountActive: !selectedDistributor.accountActive,
        });
        
        if (response?.data?.status === true) {
          showAlert("success", response?.data?.message || "Status updated successfully");
          setConfirmationDialogOpen(false);
          setSelectedDistributor(null);
          dispatch(
            superDistributorActions.getAll({ page: page + 1, limit: rowsPerPage })
          );
        } else {
          showAlert("error", response?.data?.message || "Failed to update status");
          setConfirmationDialogOpen(false);
          setSelectedDistributor(null);
        }
        
      } catch (error) {
        console.error("Error updating status:", error);
        showAlert("error", "An error occurred while updating status");
        setConfirmationDialogOpen(false);
        setSelectedDistributor(null);
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };
  
  const { showAlert } = useAlert();
  
  useEffect(() => {
    dispatch(
      superDistributorActions.getAll({ page: page + 1, limit: rowsPerPage })
    );
  }, [dispatch, page, rowsPerPage]);

  useEffect(() => {
    if (selector?.data?.message) {
      if (selector?.data?.status == false) {
        showAlert("error", selector?.data?.message);
      }
      dispatch(superDistributorActions?.clearMessage())
    }
  }, [selector, showAlert, dispatch]);

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {superDistributorData.map((item, index) => (
        <tr 
          key={index} 
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
          onClick={() => {
            navigate(`/device-lock/super-distributors/all/details/${item.id}`);
          }}
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <img
                src={item?.profilePic ?? `https://ui-avatars.com/api/?name=${item?.fullName}&background=random&color=random`}
                alt={item?.fullName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item?.fullName}
                </span>
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
          </td>
          
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-slate-400 text-xs flex-shrink-0" />
              <span className="text-sm text-slate-600 truncate max-w-[150px]">
                {item?.address || "—"}
              </span>
            </div>
          </td>
          
          <td className="py-3 px-4">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 border border-blue-100">
              <FaKey className="text-blue-600 text-xs mr-1" />
              <span className="text-xs font-medium text-blue-700">
                {item?.proTokens ?? 0}
              </span>
            </div>
          </td>
          
          <td className="py-3 px-4">
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100">
              <FaUsers className="text-emerald-600 text-xs mr-1" />
              <span className="text-xs font-medium text-emerald-700">
                {item?.totalDistributors ?? 0}
              </span>
            </div>
          </td>
          
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <MdEmail className="text-slate-400 text-sm" />
              <span className="text-sm text-slate-600 truncate max-w-[150px]">
                {item?.refferalEmail || "—"}
              </span>
            </div>
          </td>
          
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={item.accountActive}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  handleStatusToggle(item);
                }}
                size="small"
                disabled={isUpdatingStatus && selectedDistributor?.id === item?.id}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#10b981',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10b981',
                  },
                }}
              />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.accountActive 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {item.accountActive ? "Active" : "Inactive"}
              </span>
              {isUpdatingStatus && selectedDistributor?.id === item?.id && (
                <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
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
  
  const handleFilterChange = (event) => {
    setAccountActive(
      event.target.value === "" ? null : event.target.value === "active"
    );
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
                Super Distributors
                <span className="text-base font-normal text-slate-400 ml-3">
                  {totalCount > 0 && `(${totalCount} total)`}
                </span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage and oversee all super distributor accounts
              </p>
            </div>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
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
              Add Super Distributor
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
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              {/* Search */}
              <div className="w-full sm:max-w-md">
                <label htmlFor="search" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                  Search Super Distributors
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

              {/* Filter */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="filter-label" sx={{ fontSize: '0.875rem' }}>Status Filter</InputLabel>
                <Select
                  labelId="filter-label"
                  id="filter"
                  value={
                    accountActive === null
                      ? ""
                      : accountActive
                        ? "active"
                        : "inactive"
                  }
                  label="Status Filter"
                  onChange={handleFilterChange}
                  sx={{
                    fontSize: '0.875rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0',
                    },
                  }}
                >
                  <MenuItem value={""} sx={{ fontSize: '0.875rem' }}>All</MenuItem>
                  <MenuItem value={"active"} sx={{ fontSize: '0.875rem' }}>Active</MenuItem>
                  <MenuItem value={"inactive"} sx={{ fontSize: '0.875rem' }}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Active Filters */}
            {(searchText || accountActive !== null) && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">Active filters:</span>
                {searchText && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    Search: "{searchText}"
                  </span>
                )}
                {accountActive !== null && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    Status: {accountActive ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Table Section */}
          {selector?.isFetching ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : Array.isArray(superDistributorData) && superDistributorData?.length > 0 ? (
            <Table
              distributorData={superDistributorData}
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

        {/* Add Modal */}
        {modalOpen && (
          <AddDistributor
            open={modalOpen}
            type="Super Distributor"
            onClose={onCloseAddModal}
            onSubmit={() => {
              setModalOpen(false);
            }}
          />
        )}

        {/* Confirmation Dialog */}
        <WarningPopup
          open={confirmationDialogOpen}
          onYes={handleConfirmStatusChange}
          onClose={() => {
            setConfirmationDialogOpen(false);
            setSelectedDistributor(null);
          }}
          message={`Are you sure you want to ${selectedDistributor?.accountActive ? 'deactivate' : 'activate'} ${selectedDistributor?.fullName}'s account?`}
        />
      </div>
    </div>
  );
};

export default AllSuperDistributor;