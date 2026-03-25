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
  Paper,
} from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineSwapHoriz } from "react-icons/md";
import { distributorSelector } from "../../../../redux/selector/distributor/DistributorSelector";
import { distributorActions } from "../../../../redux/reducers/distributor/DistributorSlice";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
// import AddDistributor from "../../../../component/dialog/distributor/DiatributorAddModal";
import { WarningPopup } from "../../../../component/popup/WarningPopup";
import { pendingAndRejectDistributorActions } from "../../../../redux/reducers/distributor/pendingAndRejected/PendingAndRejectedslice";
import { PendingAndRejectedDistributorSelector } from "../../../../redux/selector/distributor/pendingAndRejected/PendingAndRejectedDistributorSelector";
import Table from "../../../../component/table/Table";
import { PiClockCountdownBold } from "react-icons/pi";
import useDebounce from "../../../../config/hook/useDebounce";

const RejectedDistributor = () => {
 
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const navigate = useNavigate();
  const selector = useSelector(PendingAndRejectedDistributorSelector);
  const dispatch = useDispatch();

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [distributorData, setDistributorData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [status, setStatus] = useState("reject");
  useEffect(() => {
    if (selector && selector?.data && selector?.data && selector?.data?.rows) {
      setDistributorData(selector?.data?.rows ?? []);
      setTotalCount(selector?.data?.totalRows ?? 0);
      setLoading(false);
    } else {
      setDistributorData([]);
      setTotalCount(0);
      setLoading(false);
    }

  }, [selector]);

  // useEffect(() => {
  //   dispatch(pendingAndRejectDistributorActions.reset());
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
      {distributorData?.map((item, index) => (
        <tr
          key={index}
          className="border-b"
         // onClick={() =>  navigate(`/device-lock/distributor/details/${item.id}`)  }
        >
          <td className="py-4 pr-4 md:px-6">
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
          <td className="py-4 px-4 md:px-6">{getStatusIcon(item.status)}</td>
          <td className="py-4 pr-4 md:px-6 text-xs md:text-sm">
            {item.contactNo}
          </td>
          <td className="py-4 pr-4 md:px-6 text-xs md:text-sm">
            {item.address}
          </td>
          <td className="py-4 pr-4 md:px-6 text-center text-xs md:text-sm">
            {item.refferalEmail}
          </td>
          <td>
            <FaEdit
              className="text-green-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChangeClick(item);
              }}
            />
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
        pendingAndRejectDistributorActions.search({
          text: debouncedSearchText,
          page: page + 1,
          limit: rowsPerPage,
          status:status
        })
      );
    } else {
      dispatch(pendingAndRejectDistributorActions.getAll({ page: page + 1, limit: rowsPerPage,status:status }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, debouncedSearchText, isSearching,status]);

  useEffect(() => {

    if (selector && selector?.data && selector?.data?.rows) {
      setDistributorData(selector?.data?.rows);
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
          Rejected Distributor List
        </h2>
       
      </div>
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
        {(searchText||distributorData?.length > 0)  &&
          <div className="flex flex-col justify-between space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4 pb-4">
            <div className="lg:mt-4 mt-2 flex lg:flex-row flex-col lg:gap-4 gap-2 lg:justify-between justify-start lg:items-center items-start">
                <div className="relative  w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 "
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
            <div className="w-full lg:mt-4 mt-2 sm:w-auto">
              <input
                type="date"
                className="border bg-white text-gray-900 border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
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

      <WarningPopup
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={handleConfirmStatusChange}
        message={`Are you sure you want to change the status of ${selectedDistributor?.fullName}?`}
      />
    </div>
  );
};

export default RejectedDistributor;
