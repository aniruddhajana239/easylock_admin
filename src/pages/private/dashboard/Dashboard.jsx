// pages/Dashboard.js
import { useEffect, useState } from "react";
import AreaChart from "../../../component/charts/AreaChart";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../component/loader/Loader";
import { DashboardApi } from "../../../api/dashboard/DashboardApi";
import { useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { TokenSummary } from "../../../component/summary/TokenSummary";
import { 
  FaRupeeSign, 
  FaMobile, 
  FaLock, 
  FaUnlock, 
  FaTrash, 
  FaUsers, 
  FaUserTie, 
  FaStore,
  FaCalendarDay,
  FaCalendarAlt
} from "react-icons/fa";
import { MdDevices} from "react-icons/md";
import { BiTrendingUp, BiTrendingDown } from "react-icons/bi";

const Dashboard = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Dashboard", path: "" },
  ];

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    salesSummary: null,
    deviceSummary: null,
    distributorRetailerSummary: null,
    salesGraph: null
  });
  const selector = useSelector(authSelector);
  const userType = selector?.data?.userType || "retailer";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        salesSummaryRes,
        deviceSummaryRes,
        distributorRetailerRes,
        salesGraphRes
      ] = await Promise.all([
        DashboardApi.getSalesSummary(),
        DashboardApi.getDeviceSummary(),
        DashboardApi.getDistributorRetailerSummary(),
        DashboardApi.getKeySalesGraph()
      ]);

      setDashboardData({
        salesSummary: salesSummaryRes.data?.data || null,
        deviceSummary: deviceSummaryRes.data?.data || null,
        distributorRetailerSummary: distributorRetailerRes.data?.data || null,
        salesGraph: salesGraphRes.data?.data || null
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate percentage
  const calculatePercentageChange = (current, previous) => {
    if (!current || current === 0) return 0;
    if (!previous || previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Stat Card Component for consistent styling
  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => (
    <div className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-semibold text-slate-900 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <BiTrendingUp className="text-emerald-500 text-sm" />
              ) : (
                <BiTrendingDown className="text-rose-500 text-sm" />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(trend)}% from last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg ml-3 flex-shrink-0`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-2xl font-light text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="space-y-6">
            {/* First Row - Sales and Device Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Today's Sales"
                value={formatCurrency(dashboardData.salesSummary?.todaySalesAmount)}
                icon={FaRupeeSign}
                color="emerald"
                subtitle="Sales made today"
                trend={calculatePercentageChange(dashboardData.salesSummary?.todaySalesAmount, 0)}
              />
              
              <StatCard
                title="Monthly Sales"
                value={formatCurrency(dashboardData.salesSummary?.monthlySalesAmount)}
                icon={FaCalendarDay}
                color="blue"
                subtitle="Sales this month"
                trend={calculatePercentageChange(dashboardData.salesSummary?.monthlySalesAmount, 0)}
              />
              
              <StatCard
                title="Today's Devices"
                value={dashboardData.deviceSummary?.dailyDeviceSales?.toString() || "0"}
                icon={FaMobile}
                color="purple"
                subtitle="Devices sold today"
                trend={calculatePercentageChange(dashboardData.deviceSummary?.dailyDeviceSales, 0)}
              />
              
              <StatCard
                title="Monthly Devices"
                value={dashboardData.deviceSummary?.monthlyDeviceSales?.toString() || "0"}
                icon={FaCalendarAlt}
                color="amber"
                subtitle="Devices sold this month"
                trend={calculatePercentageChange(dashboardData.deviceSummary?.monthlyDeviceSales, 0)}
              />
            </div>

            {/* Second Row - Device Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Devices"
                value={dashboardData.deviceSummary?.totalDevices?.toString() || "0"}
                icon={MdDevices}
                color="indigo"
                subtitle="All time devices"
              />
              
              <StatCard
                title="Locked Devices"
                value={dashboardData.deviceSummary?.lockedDevices?.toString() || "0"}
                icon={FaLock}
                color="rose"
                subtitle="Secured devices"
              />
              
              <StatCard
                title="Unlocked Devices"
                value={dashboardData.deviceSummary?.unlockedDevices?.toString() || "0"}
                icon={FaUnlock}
                color="emerald"
                subtitle="Active devices"
              />
              
              <StatCard
                title="Removed Devices"
                value={dashboardData.deviceSummary?.removedDevices?.toString() || "0"}
                icon={FaTrash}
                color="slate"
                subtitle="Deactivated devices"
              />
            </div>

            {/* Third Row - User Distribution Cards (Conditional) */}
            {(userType === "admin" || userType === "superdistributor" || userType === "distributor") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userType === "admin" && (
                  <StatCard
                    title="Super Distributors"
                    value={dashboardData.distributorRetailerSummary?.superDistributorCount?.toString() || "0"}
                    icon={FaUserTie}
                    color="rose"
                    subtitle="Total Super Distributors"
                  />
                )}
                
                {(userType === "admin" || userType === "superdistributor") && (
                  <StatCard
                    title="Distributors"
                    value={dashboardData.distributorRetailerSummary?.distributorCount?.toString() || "0"}
                    icon={FaUsers}
                    color="blue"
                    subtitle="Total Distributors"
                  />
                )}
                
                <StatCard
                  title="Retailers"
                  value={dashboardData.distributorRetailerSummary?.retailerCount?.toString() || "0"}
                  icon={FaStore}
                  color="emerald"
                  subtitle="Total Retailers"
                />
              </div>
            )}

            {/* Token Summary Component */}
            <TokenSummary />

            {/* Chart Section */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Token Sales
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Last 30 days performance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-slate-500">Sales</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <AreaChart salesData={dashboardData?.salesGraph ?? []} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;