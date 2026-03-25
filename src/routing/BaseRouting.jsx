import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../redux/selector/auth/authSelector";
import { useAlert } from "../context/customContext/AlertContext";
import { authActions } from "../redux/reducers/auth/authSlice";
import axiosClient from "../api/axiosClient";
import Loader from "../component/loader/Loader";
import PrivateWrap from "../pages/private/PrivateWrap";
import { PublicWrap } from "../pages/public/PublicWrap";
import PageNotFound from "../component/pageNotFound/PageNotFound";
import { PrivateRouting } from "./private/PrivateRouting";

export const BaseRouting = () => {
  const location = useLocation();
  const [isRendered, setIsRendered] = useState(false)
  const [isAccessToken, setIsAccessToken] = useState(false);
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const navigate = useNavigate()

  const authSelect = useSelector(authSelector);
  useEffect(() => {
    if (
      localStorage.getItem("refreshToken") &&
      localStorage.getItem("accessToken")
    ) {
      setIsAccessToken(true);
      dispatch(
        authActions.refreshLogin({
          token: localStorage.getItem("refreshToken"),
        })
      );
      localStorage.clear()
    }
    else {
      setIsAccessToken(false)
      //  navigate('/home')
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (authSelect?.data && authSelect?.data?.status && authSelect?.data?.accessToken) {
      axiosClient.defaults.headers.common = {
        'Authorization': 'Bearer ' + authSelect?.data?.accessToken
      };
      setIsAccessToken(true)
      localStorage.clear()
      localStorage.setItem('refreshToken', authSelect?.data?.refreshToken);
      localStorage.setItem('accessToken', authSelect?.data?.accessToken);
      location.pathname?.includes("device-lock") && navigate(location.pathname)
    }
    else if (authSelect?.data?.status === false && authSelect?.data?.message) {
      showAlert("error", authSelect?.data?.message);
      dispatch(authActions.clearMessage());
    }
  }, [authSelect])
  useEffect(() => {
    if (isRendered === false) {
      setIsRendered(true)
    }
  }, []) 
  return (
    <div className="bg-gray-100 h-screen">
      {authSelect?.isFetching && isRendered === false && (
        <div className="absolute w-full flex justify-center items-center">
          <div>
            <Loader />
          </div>
        </div>)}
      {/* {authSelect?.isFetching === false && */}

      <Routes >
        {isAccessToken && authSelect?.data?.accessToken ?
          <Route path="/device-lock" element={<PrivateWrap />} >
            <Route path="*" element={<PrivateRouting />} />
          </Route> :
          <>
          <Route path="/" element={<PublicWrap />} />
          <Route path="/*" element={<PageNotFound />} />
          </>}
      </Routes>
      {/* } */}

    </div>
  );
};
