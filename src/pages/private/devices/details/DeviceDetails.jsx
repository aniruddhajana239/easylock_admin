// pages/DeviceDetails.js
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import InfoCard from "../../../../component/cards/InfoCard";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { convertUTCToLocalWithObject as convertUTCToLocal } from "../../../../utils/Utils";
import { deviceSelector } from "../../../../redux/selector/device/DeviceSelector";
import { deviceActions } from "../../../../redux/reducers/device/DeviceSlice";
import {
  FaPhone,
  FaMobileAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaInfoCircle,
  FaUser,
  FaEnvelope,
  FaCreditCard,
  FaSimCard,
  FaMapMarkerAlt,
  FaUserTie,
  FaAppStoreIos,
  FaAndroid,
  FaGamepad,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCode,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdBrandingWatermark, MdModelTraining } from "react-icons/md";
import { BsPhone } from "react-icons/bs";
import { Switch } from "@mui/material";
import { WarningPopup } from "../../../../component/popup/WarningPopup";
import { useAlert } from "../../../../context/customContext/AlertContext";
import { commandSelector } from "../../../../redux/selector/command/commandSelector";
import { commandActions } from "../../../../redux/reducers/command/commandSlice";
import { packageSelector } from "../../../../redux/selector/package/packageSelector";
import { packageActions } from "../../../../redux/reducers/package/packageSlice";
import { restrictionSelector } from "../../../../redux/selector/restriction/restrictionSelector";
import { restrictionActions } from "../../../../redux/reducers/restriction/restrictionSlice";
import { restrictionUpdateSelector } from "../../../../redux/selector/restriction/restrictionUpdateSelector";
import { restrictionUpdateActions } from "../../../../redux/reducers/restriction/restrictionUpdateSlice";
import { activityActions } from "../../../../redux/reducers/activity/activitySlice";
import { activitySelector } from "../../../../redux/selector/activity/activitySelector";

const DeviceDetails = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Devices", path: "/device-lock/devices" },
    { label: "Device Details" },
  ];

  const [device, setDevice] = useState({});
  const [loading, setLoading] = useState(true);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isUpdating] = useState(false);
  const [appPackages, setAppPackages] = useState([]);
  const [searchApp] = useState("");
  const [selectedApps, setSelectedApps] = useState("");

  // Activity log pagination state
  const [activityPage, setActivityPage] = useState(1);
  const [activityLimit, setActivityLimit] = useState(10);
  const [expandedCommand, setExpandedCommand] = useState(null);

  const dispatch = useDispatch();
  const selector = useSelector(deviceSelector);
  const commandSelectorData = useSelector(commandSelector);
  const packageSelectorData = useSelector(packageSelector);
  const restrictionData = useSelector(restrictionSelector);
  const restrictionUpdateData = useSelector(restrictionUpdateSelector);
  const activityData = useSelector(activitySelector);
  const params = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Navigate to retailer details page
  const handleRetailerClick = (retailerId) => {
    if (retailerId) {
      navigate(`/device-lock/retailer/all/details/${retailerId}`);
    }
  };

  // Fetch device details and app restrictions
  useEffect(() => {
    if (params?.id) {
      dispatch(deviceActions?.singleGet?.(params?.id));
      dispatch(packageActions.getAll(params?.id));
      dispatch(
        restrictionActions.getAll({
          id: params?.id,
          category: "App Management",
          name: "appSuspendList",
        }),
      );
      fetchActivityLogs();
    }

    return () => {
      dispatch(packageActions.reset());
      dispatch(restrictionActions.reset());
      dispatch(restrictionUpdateActions.reset());
      dispatch(activityActions.reset());
    };
  }, [dispatch, params?.id]);

  // Fetch activity logs with pagination
  const fetchActivityLogs = (page = activityPage, limit = activityLimit) => {
    dispatch(activityActions.getAll(params?.id, { page, limit }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setActivityPage(newPage);
    fetchActivityLogs(newPage, activityLimit);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setActivityLimit(newLimit);
    setActivityPage(1);
    fetchActivityLogs(1, newLimit);
  };

  // Toggle command details expansion
  const toggleCommandDetails = (commandId) => {
    setExpandedCommand(expandedCommand === commandId ? null : commandId);
  };

  // Set app packages data
  useEffect(() => {
    if (packageSelectorData?.data) {
      if (packageSelectorData?.data?.length > 0) {
        setAppPackages(packageSelectorData?.data);
      } else {
        setAppPackages([]);
      }
    }
  }, [packageSelectorData]);

  // Set selected apps from restriction data
  useEffect(() => {
    if (
      restrictionData &&
      restrictionData?.data &&
      restrictionData?.data?.length > 0
    ) {
      setSelectedApps(restrictionData?.data[0]?.Value || "");
    }
  }, [restrictionData]);

  // Handle restriction update response
  useEffect(() => {
    if (restrictionUpdateData && restrictionUpdateData?.data) {
      if (restrictionUpdateData?.data?.status) {
        showAlert(
          "success",
          restrictionUpdateData?.data?.message ||
            "App settings updated successfully",
        );
        // Refresh the restriction data
        dispatch(
          restrictionActions.getAll({
            id: params?.id,
            category: "App Management",
            name: "appSuspendList",
          }),
        );
      } else if (restrictionUpdateData?.data?.message) {
        showAlert("error", restrictionUpdateData?.data?.message);
      }
    }
  }, [restrictionUpdateData]);

  useEffect(() => {
    if (
      commandSelectorData &&
      commandSelectorData?.data &&
      commandSelectorData?.data?.status
    ) {
      dispatch(deviceActions?.singleGet?.(params?.id));
    }
  }, [commandSelectorData]);

  useEffect(() => {
    if (selector?.data?.[0]) {
      const deviceData = selector?.data?.[0];
      setDevice(deviceData);
    }
  }, [selector]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to parse selected apps string into array of objects
  const parseSelectedApps = () => {
    if (!selectedApps || selectedApps.trim() === "") return [];

    return selectedApps
      .split("|")
      .filter((item) => item && item.includes(";"))
      .map((item) => {
        const [appName, packageName] = item.split(";");
        return { appName: appName.trim(), packageName: packageName.trim() };
      });
  };

  // Helper function to check if an app is selected
  const isAppSelected = (packageName) => {
    const parsedApps = parseSelectedApps();
    return parsedApps.some((app) => app.packageName === packageName);
  };

  // Helper function to get the full app identifier
  const getAppIdentifier = (appName, packageName) => {
    return `${appName};${packageName}`;
  };

  const handleAppLockToggle = (appName, packageName) => {
    const parsedApps = parseSelectedApps();

    let updatedApps;
    const isSelected = isAppSelected(packageName);

    if (isSelected) {
      // Remove the app
      updatedApps = parsedApps.filter((app) => app.packageName !== packageName);
    } else {
      // Add the app
      updatedApps = [...parsedApps, { appName, packageName }];
    }

    // Convert back to string format
    const newSelectedAppsString = updatedApps
      .map((app) => getAppIdentifier(app.appName, app.packageName))
      .join("|");

    setSelectedApps(newSelectedAppsString);
  };

  const updateAppLockSettings = async () => {
    if (!restrictionData?.data?.[0]?.NodeId) {
      showAlert("error", "No restriction data found");
      return;
    }

    dispatch(
      restrictionUpdateActions.update({
        id: restrictionData?.data[0]?.NodeId,
        nodeId: restrictionData?.data[0]?.NodeId,
        agentId: params?.id,
        category: "App Management",
        name: "appSuspendList",
        value: selectedApps,
      }),
    );
  };

  const handleBulkAction = (action) => {
    const shouldLock = action === "lock";

    if (shouldLock) {
      // Lock all apps
      const allAppsString = appPackages
        .filter((app) => app?.serverData?.[0]?.PackageName)
        .map((app) =>
          getAppIdentifier(
            app?.serverData[0]?.AppName || "Unknown",
            app?.serverData[0]?.PackageName,
          ),
        )
        .join("|");
      setSelectedApps(allAppsString);
    } else {
      // Unlock all apps
      setSelectedApps("");
    }
  };

  const handleStatusToggle = (event) => {
    const newStatus = event.target.checked ? "unlocked" : "locked";
    setPendingStatus(newStatus);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (device?.deviceUniqueID && pendingStatus) {
      if (pendingStatus === "unlocked") {
        dispatch(
          commandActions.send({
            id: device?.deviceUniqueID,
            command_name: "Unlock Device",
            command: "clearpasscode",
            param2: "",
            notes: "",
          }),
        );
      } else {
        dispatch(
          commandActions.send({
            id: device?.deviceUniqueID,
            command_name: "Lock Device",
            command: "changepasscode",
            param2: "",
            notes: "",
          }),
        );
      }
    }
    setConfirmationDialogOpen(false);
  };

  const handleCancelStatusChange = () => {
    setConfirmationDialogOpen(false);
    setPendingStatus(null);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "executed":
      case "success":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-700";
      case "failed":
      case "error":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Filter apps based on search
  const filteredApps =
    appPackages && appPackages?.length > 0
      ? appPackages?.filter(
          (app) =>
            app?.serverData?.[0]?.AppName?.toLowerCase().includes(
              searchApp.toLowerCase(),
            ) ||
            app?.serverData?.[0]?.PackageName?.toLowerCase().includes(
              searchApp.toLowerCase(),
            ),
        )
      : [];

  const StatusBadge = () => {
    const isUnlocked = !device?.isLock;

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${isUnlocked ? "text-emerald-600" : "text-rose-600"}`}
          >
            {isUnlocked ? "Unlocked" : "Locked"}
          </span>
          <Switch
            checked={isUnlocked}
            onChange={handleStatusToggle}
            size="small"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#10b981",
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#10b981",
              },
            }}
            disabled={isUpdating || loading}
          />
        </div>
        {isUpdating && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500">Updating...</span>
          </div>
        )}
      </div>
    );
  };



  const SectionHeader = ({ title, action }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
      {action}
    </div>
  );

  const StatBadge = ({ label, value }) => (
    <div className="bg-white rounded-lg border border-slate-200 px-3 py-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 capitalize">
                {device?.brandName} {device?.modelName}
              </h1>
              {(() => {
                const { date, time } = convertUTCToLocal(device?.provisionedOn);

                return (
                  <p className="text-xs text-slate-500 mt-0.5">
                    IMEI: {device?.imei || "—"} • {date} {time}
                  </p>
                );
              })()}
            </div>
            <StatusBadge />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBadge
                label="Device Price"
                value={`₹${device?.devicePrice || "0"}`}
              />
              <StatBadge
                label="Down Payment"
                value={`₹${device?.downPaymentAmount || "0"}`}
              />
              <StatBadge
                label="Unlock Code"
                value={device?.unlockCode || "—"}
              />
              <StatBadge
                label="EMI"
                value={`${device?.emiDetails?.emiMonths || "0"}mo`}
              />
            </div>

            {/* Main Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column - Device Info */}
              <div className="lg:col-span-2 space-y-5">
                {/* Device Information */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <SectionHeader title="Device Information" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <InfoCard
                      icon={MdBrandingWatermark}
                      label="Brand"
                      value={device?.brandName}
                    />
                    <InfoCard
                      icon={MdModelTraining}
                      label="Model"
                      value={device?.modelName}
                    />
                    <InfoCard
                      icon={FaInfoCircle}
                      label="OS Version"
                      value={device?.osVersion}
                    />
                    <InfoCard
                      icon={BsPhone}
                      label="IMEI"
                      value={device?.imei}
                    />
                    <InfoCard
                      icon={FaSimCard}
                      label="Phone Number"
                      value={device?.phoneNumber}
                    />
                    <InfoCard
                      icon={FaSimCard}
                      label="Display Name"
                      value={device?.displayName}
                    />
                  </div>
                </div>

                {/* Financial Details */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <SectionHeader title="Financial Details" />

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <InfoCard
                      icon={FaRupeeSign}
                      label="Device Price"
                      value={`₹${device?.devicePrice || "0"}`}
                    />
                    <InfoCard
                      icon={FaCreditCard}
                      label="Down Payment"
                      value={`₹${device?.downPaymentAmount || "0"}`}
                    />
                    <InfoCard
                      icon={FaMobileAlt}
                      label="EMI Amount"
                      value={`₹${device?.emiDetails?.emiAmount || "0"}`}
                    />
                    <InfoCard
                      icon={FaCalendarAlt}
                      label="Duration"
                      value={`${device?.emiDetails?.emiMonths || "0"} months`}
                    />
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-600">Device Price</span>
                      <span className="font-medium text-slate-900">
                        ₹{device?.devicePrice || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-600">Down Payment</span>
                      <span className="font-medium text-emerald-600">
                        -₹{device?.downPaymentAmount || "0"}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-900">
                          Remaining
                        </span>
                        <span className="font-semibold text-slate-900">
                          ₹
                          {(
                            parseFloat(device?.devicePrice || 0) -
                            parseFloat(device?.downPaymentAmount || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Customer & Retailer */}
              <div className="space-y-5">
                {/* Customer Details */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <SectionHeader title="Customer" />
                  <div className="space-y-3">
                    <InfoCard
                      icon={FaUser}
                      label="Name"
                      value={device?.customerDetails?.fullName}
                    />
                    <InfoCard
                      icon={FaEnvelope}
                      label="Email"
                      value={device?.customerDetails?.email}
                    />
                    <InfoCard
                      icon={FaPhone}
                      label="Contact"
                      value={device?.customerDetails?.contactNo}
                    />
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      label="Address"
                      value={device?.customerDetails?.address}
                    />
                  </div>
                </div>

                {/* Retailer Details */}
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <SectionHeader title="Retailer" />
                  <div className="space-y-3">
                    <div
                      className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer"
                      onClick={() => handleRetailerClick(device?.retailerDetails?.retailerId)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg flex-shrink-0">
                          <FaUserTie className="text-sm text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Name</p>
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {device?.retailerDetails?.fullName || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <InfoCard
                      icon={FaPhone}
                      label="Contact"
                      value={device?.retailerDetails?.contactNo}
                    />
                    <InfoCard
                      icon={FaEnvelope}
                      label="Email"
                      value={device?.retailerDetails?.email}
                    />
                    <InfoCard
                      icon={FaMapMarkerAlt}
                      label="Address"
                      value={`${device?.retailerDetails?.address || ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* App Management Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    App Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {filteredApps.length} apps installed •{" "}
                    {parseSelectedApps().length} apps locked
                  </p>
                </div>
                {filteredApps.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("unlock")}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded hover:bg-emerald-100 transition-colors"
                    >
                      Unlock All
                    </button>
                    <button
                      onClick={() => handleBulkAction("lock")}
                      className="px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 rounded hover:bg-rose-100 transition-colors"
                    >
                      Lock All
                    </button>
                    <button
                      onClick={updateAppLockSettings}
                      disabled={restrictionUpdateData?.isFetching}
                      className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {restrictionUpdateData?.isFetching
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {/* Info Text */}
              <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600">
                  Select apps to lock. Unauthorized individuals will be
                  restricted from accessing the selected applications.
                </p>
              </div>

              {/* Apps Grid */}
              {packageSelectorData?.isFetching ||
              restrictionData?.isFetching ? (
                <div className="flex justify-center items-center py-8">
                  <Loader />
                </div>
              ) : filteredApps.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredApps.map((app, index) => {
                    if (!app?.serverData?.[0]?.PackageName) return null;

                    const isLocked = isAppSelected(
                      app?.serverData[0]?.PackageName,
                    );

                    return (
                      <div
                        key={index}
                        className={`relative border rounded p-3 ${
                          isLocked
                            ? "bg-rose-50/30 border-rose-200"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <div
                              className={`p-1.5 rounded ${isLocked ? "bg-rose-100" : "bg-slate-100"}`}
                            >
                              {app?.serverData[0]?.PackageName?.includes(
                                "youtube",
                              ) ||
                              app?.serverData[0]?.PackageName?.includes(
                                "video",
                              ) ? (
                                <FaAppStoreIos
                                  className={`text-xs ${isLocked ? "text-rose-600" : "text-slate-600"}`}
                                />
                              ) : app?.serverData[0]?.PackageName?.includes(
                                  "game",
                                ) ? (
                                <FaGamepad
                                  className={`text-xs ${isLocked ? "text-rose-600" : "text-slate-600"}`}
                                />
                              ) : (
                                <FaAndroid
                                  className={`text-xs ${isLocked ? "text-rose-600" : "text-slate-600"}`}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {app?.serverData[0]?.AppName || "Unknown App"}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                {app?.serverData[0]?.PackageName}
                              </p>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                                  isLocked
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {isLocked ? "Locked" : "Unlocked"}
                              </span>
                            </div>
                          </div>

                          <div className="ml-1">
                            <Switch
                              checked={!isLocked}
                              onChange={() =>
                                handleAppLockToggle(
                                  app?.serverData[0]?.AppName || "Unknown",
                                  app?.serverData[0]?.PackageName,
                                )
                              }
                              size="small"
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#10b981",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#10b981",
                                  },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full mb-2">
                    <FaAppStoreIos className="text-slate-400 text-sm" />
                  </div>
                  <p className="text-xs text-slate-500">No apps configured</p>
                </div>
              )}

              {filteredApps?.length === 0 && appPackages.length > 0 && (
                <p className="text-center text-xs text-slate-500 py-4">
                  No apps match your search
                </p>
              )}
            </div>

            {/* Activity Logs Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <SectionHeader
                title="Activity Logs"
                action={
                  <div className="flex items-center gap-2">
                    <FaHistory className="text-slate-400 text-sm" />
                    <span className="text-xs text-slate-500">
                      Total: {activityData?.data?.totalCount || 0} commands
                    </span>
                  </div>
                }
              />

              {activityData?.isFetching ? (
                <div className="flex justify-center items-center py-8">
                  <Loader />
                </div>
              ) : activityData?.data?.data &&
                activityData?.data?.data?.length > 0 ? (
                <>
                  {/* Table View */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Command
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Result
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Created On
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {activityData?.data?.data?.map((activity) => (
                          <React.Fragment key={activity?.commandid}>
                            <tr className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <FaCode className="text-slate-400 text-xs" />
                                  <div>
                                    <p className="text-sm font-medium text-slate-900">
                                      {activity?.command_name ||
                                        "Unknown Command"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {activity?.command}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(activity?.status)}`}
                                >
                                  {activity?.status === "Executed" ? (
                                    <FaCheckCircle className="mr-1 text-xs" />
                                  ) : activity?.status === "Failed" ? (
                                    <FaTimesCircle className="mr-1 text-xs" />
                                  ) : (
                                    <FaClock className="mr-1 text-xs" />
                                  )}
                                  {activity?.status || "Unknown"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-slate-900 truncate max-w-xs">
                                  {activity?.result || "—"}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-sm text-slate-600">
                                  {(() => {
                                    const dateObj = convertUTCToLocal(activity?.created_on);
                                    return dateObj.date ? `${dateObj.date} ${dateObj.time}` : activity?.created_on || 'N/A';
                                  })()}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() =>
                                    toggleCommandDetails(activity?.commandid)
                                  }
                                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                                >
                                  {expandedCommand === activity?.commandid
                                    ? "Hide Details"
                                    : "View Details"}
                                </button>
                              </td>
                            </tr>
                            {expandedCommand === activity?.commandid && (
                              <tr className="bg-slate-50">
                                <td colSpan="5" className="px-4 py-3">
                                  <div className="text-xs space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-slate-500 mb-1">
                                          Command ID
                                        </p>
                                        <p className="text-slate-900 font-mono">
                                          {activity?.commandid}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-500 mb-1">
                                          Parameters
                                        </p>
                                        <p className="text-slate-900">
                                          {activity?.param1
                                            ? `Param1: ${activity?.param1}`
                                            : "—"}
                                          <br />
                                          {activity?.param2
                                            ? `Param2: ${activity?.param2}`
                                            : ""}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-500 mb-1">
                                          Created By
                                        </p>
                                        <p className="text-slate-900">
                                          {activity?.created_user_id ||
                                            "System"}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-slate-500 mb-1">
                                          Updated On
                                        </p>
                                        <p className="text-slate-900">
                                          {(() => {
                                            const dateObj = convertUTCToLocal(activity?.updated_on);
                                            return dateObj.date ? `${dateObj.date} ${dateObj.time}` : activity?.updated_on || 'N/A';
                                          })()}
                                        </p>
                                      </div>
                                      {activity?.notes && (
                                        <div className="col-span-2">
                                          <p className="text-slate-500 mb-1">
                                            Notes
                                          </p>
                                          <p className="text-slate-900">
                                            {activity?.notes}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Rows per page:
                      </span>
                      <select
                        value={activityLimit}
                        onChange={handleLimitChange}
                        className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-slate-300"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-xs text-slate-500 ml-2">
                        Showing {(activityPage - 1) * activityLimit + 1} to{" "}
                        {Math.min(
                          activityPage * activityLimit,
                          activityData?.data?.totalCount || 0,
                        )}{" "}
                        of {activityData?.data?.totalCount || 0} entries
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(activityPage - 1)}
                        disabled={
                          activityPage === 1 || activityData?.isFetching
                        }
                        className="p-1 rounded border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        <FaArrowLeft className="text-xs text-slate-600" />
                      </button>
                      <span className="text-xs text-slate-600 px-2">
                        Page {activityPage} of {activityData?.totalPages || 1}
                      </span>
                      <button
                        onClick={() => handlePageChange(activityPage + 1)}
                        disabled={
                          activityPage === activityData?.data?.totalPages ||
                          activityData?.isFetching
                        }
                        className="p-1 rounded border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        <FaArrowRight className="text-xs text-slate-600" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-full mb-2">
                    <FaHistory className="text-slate-400 text-sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    No activity logs found
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <WarningPopup
          open={confirmationDialogOpen}
          onYes={handleConfirmStatusChange}
          onClose={handleCancelStatusChange}
          message={`Are you sure you want to ${pendingStatus === "unlocked" ? "unlock" : "lock"} this device?`}
        />
      </div>
    </div>
  );
};

export default DeviceDetails;
