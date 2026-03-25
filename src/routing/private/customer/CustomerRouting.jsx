import { Route, Routes } from "react-router";
import Customer from "../../../pages/private/customer/Customer";
import CustomerDetails from "../../../pages/private/customer/details/CustomerDetails";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";

export const CustomerRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<Customer />} />
            <Route path="/details/:id" element={<CustomerDetails />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}