import { Route, Routes } from "react-router";
import Devices from "../../../pages/private/devices/Devices";
import DeviceDetails from "../../../pages/private/devices/details/DeviceDetails";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
import { useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import DeviceDetailsByIMEI from "../../../pages/private/devices/details/DeviceDetailsByIMEI";
import { useEffect } from "react";

export const DeviceRouting= () => {
    const selector = useSelector(authSelector);
    const userType = selector?.data?.userType;

    return (
        <Routes>
            <Route path="/" element={userType!=="admin"?<DeviceDetailsByIMEI />:<Devices />} />
            <Route path="/details/:id" element={<DeviceDetails />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}