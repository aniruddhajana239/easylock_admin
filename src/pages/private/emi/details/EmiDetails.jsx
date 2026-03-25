// pages/EmiDetails.js
import { useEffect, useState } from "react";

import { Phone } from "@mui/icons-material";
import {
  FaCoins,
  FaUser,
  FaMapMarkerAlt,
  FaHashtag,
  FaTag,
  FaServer,
  FaLock,
  FaUnlock,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaWallet
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { emiSelector } from "../../../../redux/selector/emi/EmiSelector";
import { emiActions } from "../../../../redux/reducers/emi/EmiSlice";
import Breadcrumb from "../../../../component/breadcrumb/Breadcrumb";
import Loader from "../../../../component/loader/Loader";
import DataNotFound from "../../../../component/dataNotFound/DataNotFound";
import InfoCard from "../../../../component/cards/InfoCard";

const EmiDetails = () => {
  const [emiData, setEmiData] = useState({});
  const dispatch = useDispatch();
  const selector = useSelector(emiSelector);
  const params = useParams();
    useEffect(() => {
    if (params?.id) {
      dispatch(emiActions.singleGet(params?.id));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    if (selector?.data) {
      setEmiData(selector?.data);
    }
  }, [selector]);

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "EMI", path: "/device-lock/emi" },
    { label: "EMI Details" },
  ];

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
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
        day: '2-digit',
        month: 'short',
        year: 'numeric'
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
              EMI Details
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete installment information and payment history
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : emiData ? (
          <>
            {/* Profile Header Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                    {emiData?.emiDetails?.[0]?.customerDetails?.profilePic ? (
                      <img
                        src={emiData.emiDetails[0].customerDetails.profilePic}
                        alt={emiData.emiDetails[0].customerDetails.fullName}
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
                    {emiData?.emiDetails?.[0]?.customerDetails?.fullName || "N/A"}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MdEmail className="text-slate-400" />
                      <span className="text-slate-600 truncate">
                        {emiData?.emiDetails?.[0]?.customerDetails?.email || "N/A"}
                      </span>
                    </div>
                  </div>
                   <div className="flex items-center gap-2 text-sm">
                      <Phone fontSize="small" className="text-slate-400" />
                      <span className="text-slate-600">
                        {emiData?.emiDetails?.[0]?.customerDetails?.contactNo || "N/A"}
                      </span>
                    </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">
                      {[
                        emiData?.emiDetails?.[0]?.customerDetails?.address,
                        emiData?.emiDetails?.[0]?.customerDetails?.city,
                        emiData?.emiDetails?.[0]?.customerDetails?.state,
                        emiData?.emiDetails?.[0]?.customerDetails?.pinCode
                      ].filter(Boolean).join(', ') || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total EMI Amount</p>
                    <p className="text-xl font-semibold text-slate-900">₹{emiData?.totalEmiAmount || "0.00"}</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FaMoneyBillWave className="text-emerald-600 text-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total EMI Months</p>
                    <p className="text-xl font-semibold text-slate-900">{emiData?.totalEmiMonths || "0"} months</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BiCalendar className="text-blue-600 text-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Paid Amount</p>
                    <p className="text-xl font-semibold text-slate-900">₹{emiData?.totalPaidEmiAmount || "0.00"}</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FaWallet className="text-purple-600 text-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
              <SectionHeader title="Device Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <InfoCard
                  icon={FaHashtag}
                  label="IMEI No"
                  value={emiData?.emiDetails?.[0]?.deviceDetails?.imei}
                />
                <InfoCard
                  icon={FaBuilding}
                  label="Brand"
                  value={emiData?.emiDetails?.[0]?.deviceDetails?.brandName}
                />
                <InfoCard
                  icon={FaTag}
                  label="Model"
                  value={emiData?.emiDetails?.[0]?.deviceDetails?.modelName}
                />
                <InfoCard
                  icon={FaServer}
                  label="OS Version"
                  value={emiData?.emiDetails?.[0]?.deviceDetails?.osVersion}
                />
                <InfoCard
                  icon={BiCalendar}
                  label="Enrollment Date"
                  value={formatDate(emiData?.emiDetails?.[0]?.deviceDetails?.enrollmentDate)}
                />
                <div className="bg-white rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${emiData?.emiDetails?.[0]?.deviceDetails?.deviceStatus === 'locked' ? 'bg-rose-50' : 'bg-emerald-50'} rounded-lg flex-shrink-0`}>
                      {emiData?.emiDetails?.[0]?.deviceDetails?.deviceStatus === 'locked' ? (
                        <FaLock className="text-rose-600 text-sm" />
                      ) : (
                        <FaUnlock className="text-emerald-600 text-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">Device Status</p>
                      <StatusBadge status={emiData?.emiDetails?.[0]?.deviceDetails?.deviceStatus} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All EMI Installments Table */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <SectionHeader title="EMI Installments" />
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">EMI ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Extended Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emiData?.emiDetails?.map((emi, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-900">{emi?.id}</span>
                            <span className="text-[10px] text-slate-400">Month {index + 1}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <FaCoins className="text-amber-500 text-xs" />
                            <span className="text-xs font-semibold text-slate-900">₹{emi?.emiAmount || "0.00"}</span>
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
          </>
        ) : (
          <div className="py-12">
            <DataNotFound />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmiDetails;