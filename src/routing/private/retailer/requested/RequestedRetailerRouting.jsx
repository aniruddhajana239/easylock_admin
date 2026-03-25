import { Route, Routes } from "react-router";
import RequestedRetailer from "../../../../pages/private/retailer/requested/RequestedRetailer";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
export const RequestedRetailerRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<RequestedRetailer />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}