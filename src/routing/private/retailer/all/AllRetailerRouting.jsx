import { Route, Routes } from "react-router";
import AllRetailer from "../../../../pages/private/retailer/all/AllRetailer";
import AllRetailerDetails from "../../../../pages/private/retailer/all/details/AllRetailerDetails";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
export const AllRetailerRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<AllRetailer />} />
            <Route path="/details/:id" element={<AllRetailerDetails />} />
            <Route path="/*" element={<PageNotFound/>} />
        </Routes>
    );
}