import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlert } from "../../../context/customContext/AlertContext";
import {
    CircularProgress,
    Dialog,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import { authActions } from "../../../redux/reducers/auth/authSlice";
import axiosClient from "../../../api/axiosClient";
import { loginSchema } from "../../../validation/public/login/LoginSchema";
import { IoClose } from "react-icons/io5";
import logo from '../../../assets/img/new-logo.png'

export const SignIn = ({ open, onClose ,onForgotPassword }) => {
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
                // navigate("/device-lock/home");
                onClose(true)
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
      
              <Dialog
        open={open}
        onClose={()=>{onClose(false)}}
        maxWidth="xs"
        fullWidth
      >
            
                <div className="relative p-4 w-full">
                    <a
                        href="#"
                        className="flex justify-center items-center py-3 px-6  bg-transparent"
                    >
                        <img
                            className="w-16 h-16 bg-transparent"
                            src={logo}
                            alt="IDL logo"
                        />
                        {/* <span className="text-purple-800 px-2 text-3xl font-bold">
                            IDL
                        </span> */}
                    </a>
                    <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
                        Welcome
                    </h2>
                    <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-600 mb-5 text-center">
                        sign in
                    </h2>
                    {/* Form */}
                    
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
                        <p className="my-3  p-0 flex justify-end text-amber-600 cursor-pointer" onClick={onForgotPassword}>
                            Forgot Password?
                        </p>
                        {/* Buttons */}
                        <div className="flex justify-center">
                            <button
                                className="bg-[#006BFF] text-white py-2 px-6 rounded w-full md:w-1/2 hover:bg-blue-700 hover:outline-none border-none flex justify-center items-center gap-2"
                                onClick={handleSubmit(onSubmit)}
                                disabled={authSelect.isFetching ?? false}
                                type="button"
                            >
                                {authSelect?.isFetching && (
                                    <CircularProgress color="#FFF" size={20} />
                                )}
                                Sign In
                            </button>
                        </div>
                    <button onClick={()=>{onClose(false)}} className="absolute top-4 right-4 bg-white p-0 border-none outline-none focus:border-none focus:outline-none"><IoClose size={20} color="#000"/></button>
                </div>
         
        </Dialog>
    );
};

