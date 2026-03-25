import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { DeviceRouting } from "./device/DeviceRouting";
import { CustomerRouting } from "../private/customer/CustomerRouting";
import { RetailerRouting } from "../private/retailer/RetailerRouting";
import Dashboard from "../../pages/private/dashboard/Dashboard";
import Profile from "../../pages/private/profile/Profile";
import Keys from "../../pages/private/keys/Keys";
import { TransactionHistoryRouting } from "./transactionHistory/TransactionHistoryRouting";
import {DistributorsRouting} from "../private/distributor/DistributorsRouting"
import { EmiRouting } from "./emi/EmiRouting";
import PageNotFound from "../../component/pageNotFound/PageNotFound";
import { SuperDistributorsRouting } from "./superDistributor/SuperDistributor";
import Offers from "../../pages/private/offer/Offer";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/selector/auth/authSelector";
export const PrivateRouting = () => {
  const location = useLocation();
  const selector = useSelector(authSelector);
      const userType = selector?.data?.userType;

  return (
    <div className="min-h-screen  bg-gray-100">
      <Routes >
        <Route path="/home" element={<Dashboard />} />
        <Route path="/customer/*" element={<CustomerRouting />} />
        <Route path="/devices/*" element={<DeviceRouting />} />
        <Route path="/distributors/*" element={<DistributorsRouting />} />
        <Route path="/super-distributors/*" element={<SuperDistributorsRouting />} />
        <Route path="/retailer/*" element={<RetailerRouting />} />
        <Route path="/keys" element={<Keys />} />
        <Route path="/profile" element={<Profile />} />
         <Route path="/offers" element={<Offers />} />
        <Route path="/transaction_history" element={<TransactionHistoryRouting />} />
        <Route path="/emi/*" element={<EmiRouting />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};
