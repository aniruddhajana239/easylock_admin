// pages/Devices.js
import { useEffect, useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";
import Loader from "../../../component/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { deviceSelector } from "../../../redux/selector/device/DeviceSelector";
import { deviceActions } from "../../../redux/reducers/device/DeviceSlice";
import { convertUTCToLocalWithObject as convertUTCToLocal } from "../../../utils/Utils";
import DataNotFound from "../../../component/dataNotFound/DataNotFound";
import useDebounce from "../../../config/hook/useDebounce";
import { Paper } from "@mui/material";
import { formatToDDMMYYYY } from "../../../utils/Utils";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const deviceSelect = useSelector(deviceSelector);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [deviceStatus, setDeviceStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (deviceSelect && deviceSelect?.data && deviceSelect?.data?.rows) {
      setDevices(deviceSelect?.data?.rows);
      setTotalCount(deviceSelect?.data?.totalRows);
    }
  }, [deviceSelect]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(deviceActions.getAll({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const columns = [
    "Device",
    "Status",
    "EMI Amount",
    "Customer",
    "Phone Number",
    "Retailer",
    "Enrolled Date",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Devices", path: "/device-lock/devices" },
  ];

  const getStatusTag = (status) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status) {
      case "unlocked":
        return (
          <span
            className={`${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`}
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
            Unlocked
          </span>
        );
      case "locked":
        return (
          <span
            className={`${baseClasses} bg-rose-50 text-rose-700 border border-rose-200`}
          >
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-1.5"></span>
            Locked
          </span>
        );
      case "removed":
        return (
          <span
            className={`${baseClasses} bg-slate-100 text-slate-700 border border-slate-200`}
          >
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-1.5"></span>
            Removed
          </span>
        );
      default:
        return null;
    }
  };

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {devices.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
          onClick={() =>
            navigate(`/device-lock/devices/details/${item.deviceUniqueID}`)
          }
        >
          {/* Device */}
          <td className="py-4 px-4 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 capitalize">
                {item?.brandName} {item?.modelName}
              </span>
              <span className="text-xs text-slate-500">{item?.imei || ""}</span>
            </div>
          </td>

          {/* Status */}
          <td className="py-4 px-4">{getStatusTag(item.deviceStatus)}</td>

          {/* EMI Amount */}
          <td className="py-4 px-4">
            <span className="font-medium text-slate-900">
              ₹
              {!isNaN(Number(item?.devicePrice)?.toFixed(2))
                ? Number(item?.devicePrice)?.toFixed(2)
                : "0.00"}
            </span>
          </td>

          {/* Customer */}
          <td className="py-4 px-4">
            {item?.customerDetails?.fullName ? (
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">
                  {item?.customerDetails?.fullName}
                </span>
                <span className="text-xs text-slate-500">
                  {item?.customerDetails?.contactNo || ""}
                </span>
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {item?.customerDetails?.email || ""}
                </span>
              </div>
            ) : (
              <span className="text-slate-400">N/A</span>
            )}
          </td>

          {/* Phone Number */}
          <td className="py-4 px-4">
            <span className="font-mono text-sm text-slate-600">
              {item?.sim1No || ""}
            </span>
          </td>

          {/* ✅ Retailer Column */}
          <td className="py-4 px-4">
            {item?.retailerDetails?.fullName ? (
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">
                  {item?.retailerDetails?.fullName}
                </span>
                <span className="text-xs text-slate-500">
                  {item?.retailerDetails?.contactNo || ""}
                </span>
                <span className="text-xs text-slate-500">
                  {item?.retailerDetails?.address || ""}
                </span>
              </div>
            ) : (
              <span className="text-slate-400">N/A</span>
            )}
          </td>

          {/* Enrolled Date */}
          <td className="py-4 px-4">
            {(() => {
              const { date, time } = convertUTCToLocal(item?.enrollmentDate);

              return (
                <div className="flex flex-col whitespace-nowrap">
                  <span className="text-slate-900 font-medium">{date}</span>
                  <span className="text-xs text-slate-500">{time}</span>
                </div>
              );
            })()}
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
    const formattedFromDate = formatToDDMMYYYY(appliedFromDate);
    const formattedToDate = formatToDDMMYYYY(appliedToDate);

    const params = {
      page: page + 1,
      limit: rowsPerPage,
      text: debouncedSearchText || "",
      from: formattedFromDate,
      to: formattedToDate,
      deviceStatus: deviceStatus || undefined,
    };
    if (isSearching || formattedFromDate || formattedToDate) {
      dispatch(deviceActions.Search(params));
    } else {
      dispatch(deviceActions.getAll(params));
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    page,
    rowsPerPage,
    debouncedSearchText,
    isSearching,
    appliedFromDate,
    appliedToDate,
    deviceStatus,
  ]);

  useEffect(() => {
    if (deviceSelect && deviceSelect?.data && deviceSelect?.data?.rows) {
      setDevices(deviceSelect?.data?.rows);
    } else {
      setDevices([]);
    }
  }, [deviceSelect]);

  const handleSearchChange = (event) => {
    let searchData = event.target.value;
    setSearchText(event.target.value);
    setPage(0);
    setIsSearching(true);
    if (searchData == "" || searchData == undefined || searchData == null)
      setIsSearching(false);
  };
  const handleApplyDateFilter = () => {
    setPage(0);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-light text-slate-900 mt-4">
            Devices
            <span className="text-lg font-normal text-slate-400 ml-3">
              {totalCount > 0 && `(${totalCount} total)`}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and oversee all device details
          </p>
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
          <div className="mb-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              {/* Search Input */}
              <div className="w-full lg:w-96">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-slate-600 mb-1.5"
                >
                  Search Devices
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="search"
                    value={searchText}
                    onChange={handleSearchChange}
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-150"
                    placeholder="Search by device name, IMEI, or customer..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Date Range */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-sm font-medium text-slate-600 mb-1.5"
                    >
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      className="block w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-150"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="toDate"
                      className="block text-sm font-medium text-slate-600 mb-1.5"
                    >
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      className="block w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-150"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleApplyDateFilter}
                      disabled={!fromDate && !toDate}
                      className="px-4 py-3 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Device Status Filter */}
                <div className="w-full lg:w-48">
                  <label
                    htmlFor="deviceStatus"
                    className="block text-sm font-medium text-slate-600 mb-1.5"
                  >
                    Device Status
                  </label>
                  <select
                    id="deviceStatus"
                    value={deviceStatus}
                    onChange={(e) => {
                      setDeviceStatus(e.target.value);
                      setPage(0);
                    }}
                    className="block w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-150"
                  >
                    <option value="">All</option>
                    <option value="locked">Locked</option>
                    <option value="unlocked">Unlocked</option>
                    <option value="removed">Removed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {(searchText || fromDate || toDate || deviceStatus) && (
              <div className="flex items-center gap-2 text-sm text-slate-500 border-t border-slate-100 pt-4">
                <span className="font-medium">Active filters:</span>
                {searchText && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    {`Search: "${searchText}"`}
                  </span>
                )}
                {deviceStatus && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    Status:{" "}
                    {deviceStatus.charAt(0).toUpperCase() +
                      deviceStatus.slice(1)}
                  </span>
                )}
                {fromDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    From: {new Date(fromDate).toLocaleDateString()}
                  </span>
                )}
                {toDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                    To: {new Date(toDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Table Section */}
          {deviceSelect?.isFetching ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : devices.length > 0 ? (
            <Table
              devices={devices}
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
      </div>
    </div>
  );
};

export default Devices;
