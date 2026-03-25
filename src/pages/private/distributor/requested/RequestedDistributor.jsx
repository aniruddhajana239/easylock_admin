import React, { useCallback, useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";
import {
  Button,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { distributorSelector } from "../../../../redux/selector/distributor/DistributorSelector";
import { distributorActions } from "../../../../redux/reducers/distributor/DistributorSlice";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
import AddDistributor from "../../../../component/dialog/distributor/DiatributorAddModal";
import { WarningPopup } from "../../../../component/popup/WarningPopup";
import { pendingAndRejectDistributorActions } from "../../../../redux/reducers/distributor/pendingAndRejected/PendingAndRejectedslice";
import { pendingAndRejectRetailerSelector } from "../../../../redux/selector/retailer/pendingAndReject/PendingAndRejectRetailerSelector";
import { PendingAndRejectedDistributorSelector } from "../../../../redux/selector/distributor/pendingAndRejected/PendingAndRejectedDistributorSelector";
import Table from "../../../../component/table/Table";
import { PiClockCountdownBold } from "react-icons/pi";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { authSelector } from "../../../../redux/selector/auth/authSelector";
import { DistributorApi } from "../../../../api/distributor/DistributorApi";
import { useAlert } from "../../../../context/customContext/AlertContext";
import useDebounce from "../../../../config/hook/useDebounce";
import { formatToDDMMYYYY } from "../../../../utils/Utils";

const RequestedDistributor = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const authSelect = useSelector(authSelector);
  const navigate = useNavigate();
  const selector = useSelector(PendingAndRejectedDistributorSelector);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useAlert();
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [distributorData, setDistributorData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpenWarning, setIsOpenWarning] = useState(false);
  const [actionType, setActionType] = useState();
  const [status, setStatus] = useState("pending");
  
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
   const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
  useEffect(() => {
    if (selector && selector?.data  && selector?.data?.rows) {
        setDistributorData(selector?.data?.rows??[]);
      setTotalCount(selector?.data?.totalRows??0);
      setLoading(false);
    }

  }, [selector]);
  // useEffect(() => {
  //   dispatch(
  //     pendingAndRejectDistributorActions.getAll({
  //       page: page + 1,
  //       limit: rowsPerPage,
  //       status: status,
  //     })
  //   );
  // }, [dispatch, page, rowsPerPage, status]);

  const columns = [
    "Distributor",
    "Status",
    "Contact",
    "Address",
    "Referral Email",
    "Action",
  ];

  const categories = ["All", "Active", "Inactive"];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Distributor", path: "/device-lock/distributor" },
  ];
  useEffect(() => {
    if (authSelect?.data?.userType === "admin") {
      columns.push("Actions");
    }
  }, [authSelect]);
  const handleApprove = (distributorId) => {
    setActionType({ type: "approved", id: distributorId });
    setIsOpenWarning(true);
  };
  const handleReject = (distributorId) => {
    setActionType({ type: "reject", id: distributorId });
    setIsOpenWarning(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 w-5 h-5" />;
      case "pending":
        return <PiClockCountdownBold className="text-yellow-500 w-5 h-5" />;
      case "reject":
        return <FaTimesCircle className="text-red-500 w-5 h-5" />;
      default:
        return null;
    }
  };

  const onYes = () => {
    try {
      if (actionType?.type) {
        setIsLoading(true);
        DistributorApi?.updateStatus({
          distributorId: actionType?.id,
          status: actionType?.type,
        })
          .then((res) => {

            setIsLoading(false);
            if (res?.status === 200) {
              setIsOpenWarning(false);
              if (res?.data?.status && res?.data?.message) {
                showAlert("success", res?.data?.message);
                dispatch(
                  pendingAndRejectDistributorActions.getAll({
                    page: page + 1,
                    limit: rowsPerPage,
                    status: status,
                  })
                );
              } else {
                showAlert("error", res?.data?.message);
              }
            } else {
              showAlert("success", res?.data?.message);
            }
          })
          .catch((err) => {
            showAlert(
              "error",
              err?.response?.data?.message ?? "Something went wrong"
            );
          });
      }
    } catch (error) {
      setIsLoading(false);
      showAlert("error", error);
    }
  };
  const handleStatusChangeClick = (distributor) => {
    setSelectedDistributor(distributor);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedDistributor) {
      dispatch(
        distributorActions.updateStatus({
          id: selectedDistributor.id,
          accountActive: !selectedDistributor.accountActive,
        })
      );
      setConfirmationDialogOpen(false);
      setSelectedDistributor(null);
    }
  };

  const renderTableBody = () => (
    <tbody>
      {distributorData.map((item, index) => (
        <tr
          key={index}
          className="border-b"
        
        >
          <td className="py-4 pr-4 md:px-6"   
        //  onClick={() => navigate(`/device-lock/distributors/details/${item.id}`)}
          >
            <div className="flex items-center space-x-2">
              <img
                src={item.profilePic}
                alt={item.fullName}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="text-xs md:text-sm font-semibold text-nowrap text-gray-700">
                  {item.fullName}
                </span>
                <span className="text-xs md:text-sm">{item?.email ?? ""}</span>
              </div>
            </div>
          </td>
          <td className="py-4 px-4 md:px-6">
            {getStatusIcon(item.status)}
          </td>
          <td className="py-4 pr-4 md:px-6 text-xs md:text-sm" >
            {item.contactNo}
          </td>
          <td className="py-4 pr-4 md:px-6 text-xs md:text-sm">
            {item.address}
          </td>
          <td className="py-4 pr-4 md:px-6 text-center text-xs md:text-sm">
            {item.refferalEmail}
          </td>
          {authSelect?.data?.userType === "admin" && (
            <td className="py-4 pr-4 md:px-6 text-center text-xs lg:text-sm">
              <div className="flex items-center gap-2">
                <Tooltip title="Reject" arrow>
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleReject(item?.id);
                    }}
                  >
                    <DisabledByDefaultIcon color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Approve" arrow>
                  <IconButton
                    color="success"
                    onClick={() => {
                      handleApprove(item?.id);
                    }}
                  >
                    <AddTaskIcon color="success" />
                  </IconButton>
                </Tooltip>
              </div>
            </td>
          )}
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
     const formattedFromDate = formatToDDMMYYYY(fromDate);
        const formattedToDate = formatToDDMMYYYY(toDate);
    
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          text: debouncedSearchText || '',
          from: formattedFromDate,
          to: formattedToDate,
        };
    if (isSearching||formattedFromDate||formattedToDate) {
      dispatch(
        pendingAndRejectDistributorActions.Search(params)
      );
    } else {
      dispatch(pendingAndRejectDistributorActions.getAll({ page: page + 1, limit: rowsPerPage,status:status }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearchText, isSearching,status,fromDate,toDate]);

  useEffect(() => {

    if (selector && selector?.data && selector?.data?.rows) {
      setDistributorData(selector?.data?.rows);
      setTotalCount(selector?.data?.totalRows);
    }
    else{
    setDistributorData([])}
  
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
    <div className="py-2  md:p-8 bg-gray-100 min-h-screen">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl text-gray-800 font-semibold">
        Requested  Distributor List
        </h2>
     
      </div>
      
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
      {(searchText||distributorData?.length > 0)  &&
        <div className="flex flex-col justify-between space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4 pb-4">
          <div className="lg:mt-4 mt-2 flex lg:flex-row flex-col lg:gap-4 gap-2 lg:justify-between justify-start lg:items-center items-start">
            <div className="relative  w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                value={searchText}
                onChange={handleSearchChange}
                type="text"
                id="default-search"
                className="outline-none block w-full p-2.5 ps-10 text-sm text-gray-900 rounded bg-[#f9fafc] border border-gray-300 focus:border-gray-400"
                placeholder="Search Distributor..."
                required
              />
            </div>
          </div>
          {/* Date Picker */}
          <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0 lg:space-x-4 mt-2">
              <div className="w-full sm:w-auto lg:w-1/2">
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="fromDate"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  className="border bg-white text-gray-900 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-auto lg:w-1/2">
                <label
                  className="block text-gray-700 mb-1"
                  htmlFor="toDate"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  className="border bg-white text-gray-900 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
        </div>
      }
        {selector?.isFetching ? (
          <div className="flex justify-center items-center h-80">
            <Loader />
          </div>
        ) : distributorData.length > 0 ? (
          <Table
            distributorData={distributorData}
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
          <DataNotFound />
        )}
      </Paper>
      {modalOpen&&<AddDistributor
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {
          setModalOpen(false);
        }}
      />}

{isOpenWarning && (
        <WarningPopup
          isLoading={isLoading}
          open={isOpenWarning}
          onYes={() => {
            onYes();
          }}
          onClose={() => {
            setIsOpenWarning(false);
            setActionType();
          }}
        />
      )}
      </div>
  );
  
};

export default RequestedDistributor;
