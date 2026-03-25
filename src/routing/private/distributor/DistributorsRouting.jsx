import { Route, Routes } from "react-router";
import { AllDistributorRouting } from "../distributor/all/AllDistributorRouting"
import { RequestedDistributorRouting } from "../distributor/requested/RequestedDistributorRouting"
import { RejectedDistributorRouting } from "../distributor/rejected/RejectedDistributorRouting"
import AllDistributorDetails from "../../../pages/private/distributor/all/details/AllDistributorDetails";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
export const DistributorsRouting= () => {
    return (
        <Routes >
            <Route path="/all/*" element={<AllDistributorRouting />} />
            {/* <Route path="/requested/*" element={<RequestedDistributorRouting />} />
            <Route path="/rejected/*" element={<RejectedDistributorRouting />} /> */}
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}