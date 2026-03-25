// pages/Profile.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { profileSelector } from "../../../redux/selector/profile/ProfileSelector";
import { profileActions } from "../../../redux/reducers/profile/ProfileSlice";
import Loader from "../../../component/loader/Loader";
import UpdateProfileModal from "../../../component/dialog/profile/UpdateProfileModal";
import InfoCard from "../../../component/cards/InfoCard";
import { Phone } from "@mui/icons-material";
import { 
  FaEdit, 
  FaUser, 
  FaMapMarkerAlt, 
  FaFlag, 
  FaTransgender,
  FaCheckCircle,
  FaBuilding,
  FaUserTag,
  FaStore,
  FaCoins
} from "react-icons/fa";

import { MdOutlineEmail, MdEmail } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";

import { distributorSelector } from "../../../redux/selector/distributor/DistributorSelector";
import { distributorActions } from "../../../redux/reducers/distributor/DistributorSlice";
import { superDistributorActions } from "../../../redux/reducers/superDistributor/SuperDistributorSlice";
import { superDistributorSelector } from "../../../redux/selector/superDistributor/SuperDistributorSeletor";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [distributorData, setDistributorData] = useState(null);
  const [superDistributorData, setSuperDistributorData] = useState(null);
  const authSelect = useSelector(authSelector);
  const profileSelect = useSelector(profileSelector);
  const distSelect = useSelector(distributorSelector);
  const superDistributor = useSelector(superDistributorSelector);
  const dispatch = useDispatch();

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  useEffect(() => {
    if (authSelect?.data?.accessToken) {
      if (authSelect?.data?.userType === "admin") {
        dispatch(profileActions.getUserData(authSelect?.data?.accessToken));
      } else if (authSelect?.data?.userType === "superdistributor") {
        dispatch(superDistributorActions.getSuperDistributorProfile());
      } else if (authSelect?.data?.userType === "distributor") {
        dispatch(distributorActions.getDistributorProfile());
      }
    }
  }, [authSelect, dispatch]);

  useEffect(() => {
    if (profileSelect?.data) {
      setUserData(profileSelect?.data?.[0] || {});
    }
  }, [profileSelect]);

  useEffect(() => {
    if (distSelect?.data) {
      setDistributorData(distSelect?.data?.data?.[0] || {});
    }
  }, [distSelect]);

  useEffect(() => {
    if (superDistributor?.data) {
      const data = superDistributor?.data?.data;
      if (Array.isArray(data)) {
        setSuperDistributorData(data[0] || {});
      } else {
        setSuperDistributorData(data || {});
      }
    }
  }, [superDistributor]);



  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString.replace(/\//g, "-"));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  // Determine which data to display based on user type
  const getCurrentData = () => {
    const userType = authSelect?.data?.userType;
    
    switch(userType) {
      case "admin":
        return userData;
      case "superdistributor":
        return superDistributorData;
      case "distributor":
        return distributorData;
      default:
        return {};
    }
  };

  // Determine loading state based on user type
  const getLoadingState = () => {
    const userType = authSelect?.data?.userType;
    
    switch(userType) {
      case "admin":
        return profileSelect?.isFetching;
      case "superdistributor":
        return superDistributor?.isFetching;
      case "distributor":
        return distSelect?.isFetching;
      default:
        return true;
    }
  };

  const currentData = getCurrentData();
  const userType = authSelect?.data?.userType;
  const isLoading = getLoadingState();

  // Get user type display name
  const getUserTypeDisplay = () => {
    switch(userType) {
      case "admin": return "Administrator";
      case "superdistributor": return "Super Distributor";
      case "distributor": return "Distributor";
      default: return "User";
    }
  };

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light text-slate-900">
                User Profile
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                View and manage your profile information
              </p>
            </div>
            
            {/* Update Button */}
            <button
              onClick={handleModalOpen}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-150 self-start"
            >
              <FaEdit className="text-slate-400" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    {currentData?.profilePic ? (
                      <img
                        src={currentData.profilePic}
                        alt={currentData.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-slate-400 text-3xl" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {currentData?.fullName || "N/A"}
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                      {getUserTypeDisplay()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MdEmail className="text-slate-400" />
                      <span className="text-slate-600 truncate">{currentData?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone fontSize="small" className="text-slate-400" />
                      <span className="text-slate-600">{currentData?.contactNo || "N/A"}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        currentData?.address,
                        currentData?.city,
                        currentData?.state,
                        currentData?.pinCode
                      ].filter(Boolean).join(', ') || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Profile Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Business Name */}
                {currentData?.businessName && (
                  <InfoCard
                    icon={FaBuilding}
                    label="Business Name"
                    value={currentData?.businessName}
                  />
                )}

                {/* Gender */}
                {currentData?.gender && (
                  <InfoCard
                    icon={FaTransgender}
                    label="Gender"
                    value={currentData?.gender?.charAt(0).toUpperCase() + currentData?.gender?.slice(1)}
                  />
                )}

                {/* Country */}
                {currentData?.country && (
                  <InfoCard
                    icon={FaFlag}
                    label="Country"
                    value={currentData?.country}
                  />
                )}

                {/* Token Info for Distributor and Super Distributor */}
                {(userType === "distributor" || userType === "superdistributor") && (
                  <InfoCard
                    icon={FaCoins}
                    label="Available Tokens"
                    value={currentData?.proTokens || "0"}
                  />
                )}

                {/* Referral Email */}
                {(userType === "distributor" || userType === "superdistributor") && currentData?.refferalUserEmail && (
                  <InfoCard
                    icon={MdOutlineEmail}
                    label="Referral Email"
                    value={currentData?.refferalUserEmail}
                  />
                )}

                {/* Referral User Name */}
                {(userType === "distributor" || userType === "superdistributor") && currentData?.refferalUserFullName && (
                  <InfoCard
                    icon={FaUserTag}
                    label="Referred By"
                    value={currentData?.refferalUserFullName}
                  />
                )}

                {/* Total Devices */}
                {(userType === "distributor" || userType === "retailer") && currentData?.totalDevices !== undefined && (
                  <InfoCard
                    icon={FaStore}
                    label="Total Devices"
                    value={currentData?.totalDevices || "0"}
                  />
                )}

                {/* Account Status */}
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-emerald-50 rounded-lg flex-shrink-0`}>
                      <FaCheckCircle className="text-emerald-600 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">Account Status</p>
                      <p className={`text-sm font-medium text-emerald-600`}>
                        {"Active"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Join Date */}
                <InfoCard
                  icon={BiCalendar}
                  label="Joined On"
                  value={formatDate(currentData?.createdAt)}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Update Profile Modal */}
      {openModal && (
        <UpdateProfileModal
          open={openModal}
          onClose={handleModalClose}
          userData={currentData}
        />
      )}
    </div>
  );
};

export default Profile;