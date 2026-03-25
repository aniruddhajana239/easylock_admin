import { Route, Routes } from "react-router";
import RequestedDistributor from "../../../../pages/private/distributor/requested/RequestedDistributor";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
export const RequestedDistributorRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<RequestedDistributor />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}