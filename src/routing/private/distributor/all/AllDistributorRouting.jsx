import { Route, Routes } from "react-router";
import AllDistributor from "../../../../pages/private/distributor/all/AllDistributor";
import PageNotFound from "../../../../component/pageNotFound/PageNotFound";
import AllDistributorDetails from "../../../../pages/private/distributor/all/details/AllDistributorDetails";
export const AllDistributorRouting= () => {
    return (
        <Routes >
            <Route path="/" element={<AllDistributor/>}/>
            <Route path="/details/:id" element={<AllDistributorDetails />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
      
    );
}