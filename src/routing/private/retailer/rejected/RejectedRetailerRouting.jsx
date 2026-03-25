import { Route, Routes } from "react-router";
import RejectedRetailer from "../../../../pages/private/retailer/rejected/RejectedRetailer";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
export const RejectedRetailerRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<RejectedRetailer />} />
            <Route path="/*" element={<PageNotFound/>} />
        </Routes>
    );
}