import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export const GlobalNotFound=()=>{
    const navigate=useNavigate()
    return(
        <>
        <div className="h-screen w-full flex justify-center items-center flex-col gap-4">
            <h1 className="text-5xl text-gray-500 font-semibold">404</h1>
            <p>Page not found</p>
            <Button onClick={()=>{navigate('/')}} variant="contained" color="warning" className="bg-amber-600 text-white px-4 py-2">Go To Home</Button>
        </div>
        </>
    )
}