import { Route, Routes } from "react-router";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
import { AllSuperDistributorRouting } from "./AllSuperDistributorsRouting";
export const SuperDistributorsRouting= () => {
    return (
        <Routes >
            <Route path="/all/*" element={<AllSuperDistributorRouting />} />
            {/* <Route path="/requested/*" element={<RequestedDistributorRouting />} />
            <Route path="/rejected/*" element={<RejectedDistributorRouting />} /> */}
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}