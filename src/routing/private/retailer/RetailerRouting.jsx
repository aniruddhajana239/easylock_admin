import { Route, Routes } from "react-router";
import { AllRetailerRouting } from "./all/AllRetailerRouting";
import { RequestedRetailerRouting } from "./requested/RequestedRetailerRouting";
import { RejectedRetailerRouting } from "./rejected/RejectedRetailerRouting";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
export const RetailerRouting = () => {
    return (
        <Routes>
            <Route path="/all/*" element={<AllRetailerRouting />} />
            <Route path="/requested/*" element={<RequestedRetailerRouting />} />
            <Route path="/rejected/*" element={<RejectedRetailerRouting />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}