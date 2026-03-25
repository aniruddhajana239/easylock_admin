import { Route, Routes } from "react-router";
import Emi from "../../../pages/private/Emi/Emi";
import EmiDetails from "../../../pages/private/emi/details/EmiDetails";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
export const EmiRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<Emi/>} />
            <Route path="/details/:id" element={<EmiDetails/>} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}