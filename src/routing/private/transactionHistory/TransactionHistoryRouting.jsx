import { Route, Routes } from "react-router";
import TransactionHistory from "../../../pages/private/transactionHistory/TransactionHistory";
import PageNotFound from "../../../component/pageNotFound/PageNotFound";
export const TransactionHistoryRouting= () => {
    return (
        <Routes>
            <Route path="/" element={<TransactionHistory />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    );
}