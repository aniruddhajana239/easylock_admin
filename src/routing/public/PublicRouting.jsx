import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ForgotPassword from "../../pages/private/auth/ForgotPassword";
import SignUp from "../../pages/private/auth/SignUp";
import SignIn from "../../pages/private/auth/SignIn";
import { LandingPage } from "../../pages/public/landing/LandingPage";
import { LandingNew } from "../../pages/public/landing/LandingNew";
import PageNotFound from "../../component/pageNotFound/PageNotFound";

export const PublicRouting = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(location.pathname);

    // useEffect(() => {
    //     // Update currentPage on location change
    //     setCurrentPage(location.pathname);
    // }, [location]);

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            {/* <div className={`relative transition-transform duration-1000 ${currentPage === '/' ? 'animate-slideIn' : 'animate-slideOut'}`}> */}
                <Routes >
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    {/* <Route path="/" element={<LandingPage />} /> */}
                     <Route path="/" element={<LandingNew />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/*" element={<PageNotFound />} />
                </Routes>
            {/* </div> */}
        </div>
    );
};
