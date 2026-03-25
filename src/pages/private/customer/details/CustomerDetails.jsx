// pages/CustomerDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import { customerSelector } from "../../../../redux/selector/customer/CustomerSelector";
import { useDispatch, useSelector } from "react-redux";
import { customerActions } from "../../../../redux/reducers/customer/CustomerSlice";
import { Phone } from "@mui/icons-material";
import { 
  FaLock, 
  FaUnlock, 
  FaMapMarkerAlt, 
  FaMobileAlt, 
  FaMoneyBillWave, 
  FaUser, 
  FaBuilding, 
  FaTag, 
  FaServer, 
  FaSimCard, 
  FaCoins,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";

import { BiCalendar } from "react-icons/bi";
import { MdPriceChange, MdEmail } from "react-icons/md";


import InfoCard from "../../../../component/cards/InfoCard";

const CustomerDetails = () => {
  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Customers", path: "/device-lock/customer" },
    { label: "Customer Details" },
  ];

  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const selector = useSelector(customerSelector);
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      dispatch(customerActions.singleGet(params?.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (selector?.data) {
      setCustomer(selector?.data?.[0]);
    }
  }, [selector]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);



  const StatusBadge = ({ status }) => {
    const isLocked = status === "locked";
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        isLocked 
          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}>
        {isLocked ? (
          <>
            <FaLock className="mr-1 text-[10px]" />
            Locked
          </>
        ) : (
          <>
            <FaUnlock className="mr-1 text-[10px]" />
            Unlocked
          </>
        )}
      </span>
    );
  };

  const PaymentStatusBadge = ({ isPaid }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      isPaid 
        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
        : 'bg-amber-50 text-amber-700 border border-amber-200'
    }`}>
      {isPaid ? (
        <>
          <FaCheckCircle className="mr-1 text-[10px]" />
          Paid
        </>
      ) : (
        <>
          <FaTimesCircle className="mr-1 text-[10px]" />
          Unpaid
        </>
      )}
    </span>
  );

  const SectionHeader = ({ title }) => (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString.replace(/\//g, "-"));
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-IN", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-2xl font-light text-slate-900">
              Customer Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete customer profile and device information
            </p>
          </div>
        </div>

        {loading ? (
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
                    {customer?.profilePic ? (
                      <img
                        src={customer.profilePic}
                        alt={customer.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-slate-400 text-3xl" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {customer?.fullName || "N/A"}
                  </h2>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm">
                      <MdEmail className="text-slate-400" />
                      <span className="text-slate-600 truncate">{customer?.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone fontSize="small" className="text-slate-400" />
                      <span className="text-slate-600">{customer?.contactNo || "N/A"}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        customer?.address,
                        customer?.city,
                        customer?.state,
                        customer?.pinCode
                      ].filter(Boolean).join(', ') || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Device Information */}
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <SectionHeader title="Device Information" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoCard
                    icon={FaMobileAlt}
                    label="IMEI Number"
                    value={customer?.deviceDetails?.imei}
                  />
                  <InfoCard
                    icon={FaBuilding}
                    label="Brand"
                    value={customer?.deviceDetails?.brandName}
                  />
                  <InfoCard
                    icon={FaTag}
                    label="Model"
                    value={customer?.deviceDetails?.modelName}
                  />
                  <InfoCard
                    icon={FaServer}
                    label="OS Version"
                    value={customer?.deviceDetails?.osVersion}
                  />
                  <InfoCard
                    icon={FaSimCard}
                    label="Phone Number"
                    value={customer?.deviceDetails?.phoneNumber}
                  />
                  <InfoCard
                    icon={BiCalendar}
                    label="Enrollment Date"
                    value={formatDate(customer?.deviceDetails?.enrollmentDate)}
                  />
                  <div className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${customer?.deviceDetails?.deviceStatus === 'locked' ? 'bg-rose-50' : 'bg-emerald-50'} rounded-lg flex-shrink-0`}>
                        {customer?.deviceDetails?.deviceStatus === 'locked' ? (
                          <FaLock className="text-rose-600 text-sm" />
                        ) : (
                          <FaUnlock className="text-emerald-600 text-sm" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 mb-0.5">Device Status</p>
                        <StatusBadge status={customer?.deviceDetails?.deviceStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* EMI Details */}
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <SectionHeader title="EMI Details" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoCard
                    icon={MdPriceChange}
                    label="Device Price"
                    value={customer?.deviceDetails?.devicePrice ? `₹${customer.deviceDetails.devicePrice}` : "—"}
                  />
                  <InfoCard
                    icon={FaMoneyBillWave}
                    label="Down Payment"
                    value={customer?.deviceDetails?.downPaymentAmount ? `₹${customer.deviceDetails.downPaymentAmount}` : "—"}
                  />
                  <InfoCard
                    icon={BiCalendar}
                    label="EMI Duration"
                    value={customer?.emiDetails?.emiMonths ? `${customer.emiDetails.emiMonths} months` : "—"}
                  />
                  <InfoCard
                    icon={FaCoins}
                    label="EMI Amount"
                    value={customer?.emiDetails?.emiAmount ? `₹${customer.emiDetails.emiAmount}` : "—"}
                  />
                </div>
                
                {/* Payment Summary */}
                {(customer?.deviceDetails?.devicePrice || customer?.deviceDetails?.downPaymentAmount) && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-600">Device Price</span>
                        <span className="font-medium text-slate-900">₹{customer?.deviceDetails?.devicePrice || "0"}</span>
                      </div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-600">Down Payment</span>
                        <span className="font-medium text-emerald-600">-₹{customer?.deviceDetails?.downPaymentAmount || "0"}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-900">Remaining</span>
                          <span className="font-semibold text-slate-900">
                            ₹{(parseFloat(customer?.deviceDetails?.devicePrice || 0) - parseFloat(customer?.deviceDetails?.downPaymentAmount || 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* EMI Installments Table */}
            {customer?.allEmiDetails?.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-5">
                <SectionHeader title="EMI Installments" />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          EMI ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Extended Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customer?.allEmiDetails?.map((emi, index) => (
                        <tr key={emi?.id || index} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-slate-900">{emi?.emiId}</span>
                              <span className="text-[10px] text-slate-400">ID: {emi?.id}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <FaCoins className="text-amber-500 text-xs" />
                              <span className="text-xs font-semibold text-slate-900">
                                ₹{emi?.emiAmount || "0.00"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <BiCalendar className="text-slate-400 text-xs" />
                              <span className="text-xs text-slate-600">{emi?.dueDate || "—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <BiCalendar className="text-slate-400 text-xs" />
                              <span className="text-xs text-slate-600">{emi?.extendedDate || "—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <PaymentStatusBadge isPaid={emi?.isPaid} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;