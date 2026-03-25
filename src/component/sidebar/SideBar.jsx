// components/Sidebar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaCalendar,
  FaCogs,
  FaWallet,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaGift,
  FaSignInAlt
} from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { HiDeviceMobile } from "react-icons/hi";
import { FaCircleUser } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/selector/auth/authSelector";
import { BiSolidOffer } from "react-icons/bi";
import logo from '../../assets/img/new-logo.png'
// Updated Sidebar component with fixed active state for dropdowns

const Sidebar = ({ closeSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const selector = useSelector(authSelector);
  const userType = selector?.data?.userType;

  const toggleSubmenu = (menu) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu));
  };

  const closeAllSubmenus = () => {
    setOpenSubmenu(null);
  };

  const isActive = (link) => location.pathname.includes(link);
  
  // Helper function to check if any subitem is active
  const isDropdownActive = (subItems) => {
    return subItems?.some(subItem => isActive(subItem.link)) || false;
  };

  // Base menu items that everyone can see
  const baseMenuItems = [
    {
      icon: <FaHome className="w-4 h-4" />,
      label: "Dashboard",
      link: "/device-lock/home",
    },
  ];

  // Menu items for Admin only
  const adminMenuItems = [
    {
      icon: <HiDeviceMobile className="w-4 h-4" />,
      label: "Devices",
      link: "/device-lock/devices",
    },
    {
      icon: <FaCalendar className="w-4 h-4" />,
      label: "Retailers",
      isDropdown: true,
      submenuKey: "retailer",
      subItems: [
        {
          label: "All",
          link: "/device-lock/retailer/all",
        },
        {
          label: "Requested",
          link: "/device-lock/retailer/requested",
        },
        {
          label: "Rejected",
          link: "/device-lock/retailer/rejected",
        },
      ],
    },
    {
      icon: <FaCogs className="w-4 h-4" />,
      label: "Super Distributors",
      link: "/device-lock/super-distributors/all",
    },
    {
      icon: <FaUsersGear className="w-4 h-4" />,
      label: "Distributors",
      link: "/device-lock/distributors/all",
    },
    {
      icon: <FaCircleUser className="w-4 h-4" />,
      label: "Customers",
      link: "/device-lock/customer",
    },
    {
      icon: <FaUser className="w-4 h-4" />,
      label: "Keys",
      link: "/device-lock/keys",
    },
    {
      icon: <FaWallet className="w-4 h-4" />,
      label: "EMI",
      link: "/device-lock/emi",
    },
    {
      icon: <FaGift className="w-4 h-4" />,
      label: "Offers",
      link: "/device-lock/offers",
    },
    {
      icon: <FaSignInAlt className="w-4 h-4" />,
      label: "Create Retailer",
      link: "https://console.codeproof.com/Account/Login",
    },
  ];

  // Menu items for Super Distributor only
  const superDistributorMenuItems = [
    {
      icon: <FaUsersGear className="w-4 h-4" />,
      label: "Distributors",
      link: "/device-lock/distributors/all",
    },
    {
      icon: <FaUser className="w-4 h-4" />,
      label: "Keys",
      link: "/device-lock/keys",
    },
  ];

  // Menu items for Distributor only
  const distributorMenuItems = [
    {
      icon: <HiDeviceMobile className="w-4 h-4" />,
      label: "Devices",
      link: "/device-lock/devices",
    },
    {
      icon: <FaCalendar className="w-4 h-4" />,
      label: "Retailers",
      isDropdown: true,
      submenuKey: "retailer",
      subItems: [
        {
          label: "All",
          link: "/device-lock/retailer/all",
        },
        {
          label: "Requested",
          link: "/device-lock/retailer/requested",
        },
        {
          label: "Rejected",
          link: "/device-lock/retailer/rejected",
        },
      ],
    },
    {
      icon: <FaUser className="w-4 h-4" />,
      label: "Keys",
      link: "/device-lock/keys",
    },
  ];

  // Combine menu items based on user type
  let sidebarItems = [...baseMenuItems];

  if (userType === "admin") {
    sidebarItems = [...sidebarItems, ...adminMenuItems];
  } else if (userType === "superdistributor") {
    sidebarItems = [...sidebarItems, ...superDistributorMenuItems];
  } else if (userType === "distributor") {
    sidebarItems = [...sidebarItems, ...distributorMenuItems];
  }

  useEffect(() => {
    if (location?.pathname?.includes("retailer")) {
      setOpenSubmenu("retailer");
    } else if (location?.pathname?.includes("distributors")) {
      setOpenSubmenu("distributors");
    } else {
      closeAllSubmenus();
    }
  }, [location.pathname]);

  return (
    <aside className="fixed left-0 z-40 lg:static flex flex-col w-64 h-screen bg-white border-r border-slate-200">
      {/* Logo Section */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Link to={"/device-lock/home"} className="flex items-center">
          <img
            className="w-10 h-10"
            src={logo}
            alt="IDL logo"
          />
          <span className="ml-2 text-sm font-semibold text-slate-900">IDL</span>
        </Link>
        <button 
          onClick={closeSidebar}
          className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.isDropdown ? (
                <div>
                  {/* Dropdown Button - Fixed active state check */}
                  <button
                    onClick={() => toggleSubmenu(item?.submenuKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      isDropdownActive(item.subItems)
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isDropdownActive(item.subItems) ? "text-blue-600" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span className="text-slate-400">
                      {openSubmenu === item?.submenuKey ? (
                        <FaChevronUp className="w-3 h-3" />
                      ) : (
                        <FaChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  </button>

                  {/* Submenu Items */}
                  {openSubmenu === item?.submenuKey && (
                    <ul className="mt-1 ml-8 space-y-1">
                      {item?.subItems?.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            to={subItem?.link}
                            onClick={closeAllSubmenus}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                              isActive(subItem?.link)
                                ? "text-blue-600 font-medium"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className="mr-2 text-slate-300">•</span>
                            <span>{subItem?.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular Menu Item
                <Link
                  to={item.link}
                  target={item?.link === "https://console.codeproof.com/Account/Login" ? "_blank" : undefined}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive(item?.link)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className={isActive(item?.link) ? "text-blue-600" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
            <FaUser className="w-3 h-3 text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">
              {selector?.data?.fullName || "User"}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {userType || "Guest"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;