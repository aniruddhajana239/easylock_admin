import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { loginSchema } from "../../../validation/public/login/LoginSchema";
import { authActions } from "../../../redux/reducers/auth/authSlice";
import "./backgroundAnimation.css";
import { useAlert } from "../../../context/customContext/AlertContext";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axiosClient from "../../../api/axiosClient";
import logo from '../../../assets/img/logo-trans.png'
const CirclesAnimation = () => (
  <ul className="circles">
    {Array(10)
      .fill()
      .map((_, index) => (
        <li key={index}></li>
      ))}
  </ul>
);

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authSelect = useSelector(authSelector);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "all",
    shouldUnregister: false,
  });
  const [pswToggle, setPswToggle] = useState(false);
  const { showAlert } = useAlert();

  const onSubmit = (data) => {
    dispatch(authActions.login(data));
  };

  useEffect(() => {
    if (
      authSelect?.data &&
      authSelect?.data?.status &&
      authSelect?.data?.accessToken
    ) {
      localStorage.clear();
      localStorage.setItem("refreshToken", authSelect?.data?.refreshToken);
      localStorage.setItem("accessToken", authSelect?.data?.accessToken);
      axiosClient.defaults.headers.common = {
        Authorization: "Bearer " + authSelect?.data?.accessToken,
      };
      showAlert("success", authSelect.data.message);
      if (authSelect?.data?.status) {
        navigate("/device-lock/home");
      }
    } else if (
      authSelect?.data?.status === false &&
      authSelect?.data?.message
    ) {
      showAlert("error", authSelect?.data?.message);
      dispatch(authActions.clearMessage());
    }
  }, [authSelect]);

  return (
    <div className="area">
      <div className=" min-h-screen  flex justify-center w-full">
        <CirclesAnimation />

        <div className=" bg-transparent lg:w-1/3 w-4/5  flex flex-col justify-center z-9999 relative ">
          <div className="w-full backdrop-blur-sm bg-white bg-opacity-50 bg-transparent p-3 md:p-7 rounded-lg shadow-xl  absolute z-9999 ">
            <a
              href="#"
              className="flex justify-center items-center py-3 px-6  bg-transparent"
            >
              <img
                className="w-auto h-12 bg-transparent"
                src={logo}
                alt="IDL logo"
              />
              <span className="text-purple-800 px-2 text-3xl font-bold">
                IDL
              </span>
            </a>
            <h2 className="text-2xl font-bold mb-5 text-gray-800  text-center">
              Welcome
            </h2>
            <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-600  mb-5 text-center">
              sign in
            </h2>
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <TextField
                {...register("email")}
                size="small"
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                {...register("password")}
                size="small"
                label="Password"
                type={pswToggle ? "text" : "password"}
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setPswToggle(!pswToggle)}
                        edge="end"
                      >
                        {pswToggle ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <p className="my-3  p-0 flex justify-end text-amber-600" onClick={()=>{
                navigate("/home/forgot-password")
              }}>
                Forgot Password?
              </p>
              {/* Buttons */}
              <div className="flex justify-center">
                <button
                  className="bg-[#006BFF]  text-white py-2 px-6 rounded w-full md:w-1/2 hover:bg-blue-700  hover:outline-none border-none flex justify-center items-center gap-2"
                  onClick={handleSubmit(onSubmit)}
                  disabled={authSelect.isFetching ?? false}
                  type="submit"
                >
                  {authSelect?.isFetching && (
                    <CircularProgress color="#FFF" size={20} />
                  )}
                  Sign In
                </button>
              </div>
              {/* <p className="my-3  p-0 flex justify-center text-gray-800">
                Don't have an account?
                <Link
                  className="text-gray-700 mx-2 font-semibold hover:text-gray-600 hover:underline"
                  to="/registration"
                >
                  Sign Up
                </Link>
              </p> */}
            </form>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SignIn;
