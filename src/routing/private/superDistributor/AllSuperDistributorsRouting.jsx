import { Route, Routes } from "react-router";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
import AllSuperDistributor from "../../../pages/private/superDistributor/all/AllSuperDistributor";
import AllSuperDistributorDetails from "../../../pages/private/superDistributor/all/details/AllSuperDistributorDetails";
export const AllSuperDistributorRouting= () => {
    return (
        <Routes >
            <Route path="/" element={<AllSuperDistributor/>}/>
            <Route path="/details/:id" element={<AllSuperDistributorDetails />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
      
    );
}