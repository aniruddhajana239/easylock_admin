// components/Header.js
import { useState, useEffect, useRef } from "react";
import { MdLockReset, MdMenu, MdNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BiUser, BiLogOut} from "react-icons/bi";
import { useNavigate } from "react-router";
import { WarningPopup } from "../popup/WarningPopup";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/reducers/auth/authSlice";
import { ChangePasswordDialog } from "../dialog/changePasswordDialog/ChangePasswordDialog";
import { RetailerApi } from "../../api/retailer/RetailerApi";

const Header = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenWarningPopup, setIsOpenWarningPopup] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending retailer count on mount and when notified
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await RetailerApi.getPendingCount();
        if (response?.data?.data?.totalRows) {
          setPendingCount(response.data.data.totalRows);
        }
      } catch (error) {
        console.error("Error fetching pending count:", error);
      }
    };

    fetchPendingCount();

    // Listen for notification refresh events
    const handleRefreshNotifications = () => {
      fetchPendingCount();
    };

    window.addEventListener('refresh-notifications', handleRefreshNotifications);
    return () => {
      window.removeEventListener('refresh-notifications', handleRefreshNotifications);
    };
  }, []);

  const handleNotificationClick = () => {
    navigate("/device-lock/retailer/requested");
  };

  const handleCloseChangePasswordDialog = () => {
    setIsChangePassword(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onYesLogout = () => {
    window.localStorage.clear();
    navigate('/');
    dispatch(authActions?.reset());
    setIsOpenWarningPopup(false);
  };

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center py-2 md:py-0 md:h-[74px] px-4 sm:px-6 bg-white border-b border-slate-200">
      {/* Left Side: Hamburger Menu */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
          aria-label="Toggle sidebar"
        >
          <MdMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150"
          aria-label="Notifications"
        >
          <MdNotifications className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors duration-150"
            aria-label="Profile menu"
            aria-expanded={isDropdownOpen}
            aria-controls="profile-dropdown"
          >
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <FaUserCircle className="h-5 w-5 text-blue-600" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              Profile
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id="profile-dropdown"
              className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 transform transition-all duration-150 origin-top-right"
            >
              {/* User Info (optional) */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500">Signed in as</p>
                <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/device-lock/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                  <BiUser className="h-4 w-4 text-slate-400" />
                  <span>My Account</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsChangePassword(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                  <MdLockReset className="h-4 w-4 text-slate-400" />
                  <span>Change Password</span>
                </button>

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsOpenWarningPopup(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors duration-150"
                >
                  <BiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <WarningPopup 
        open={isOpenWarningPopup} 
        onClose={() => setIsOpenWarningPopup(false)} 
        onYes={onYesLogout}
        message="Are you sure you want to logout?"
      />
      
      <ChangePasswordDialog 
        open={isChangePassword} 
        onClose={handleCloseChangePasswordDialog}
      />
    </header>
  );
};

export default Header;