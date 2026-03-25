import { Route, Routes } from "react-router";
import RejectedDistributor from "../../../../pages/private/distributor/rejected/RejectedDistributor";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
export const RejectedDistributorRouting= () => {
    
    return (
        <Routes>
            <Route path="/" element={<RejectedDistributor />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}