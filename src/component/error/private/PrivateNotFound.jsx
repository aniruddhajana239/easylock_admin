import React from "react";
import NotFound from "../../../assets/404-computer.svg";
const PrivateNotFound = () => {
  return (
    <div className=" px-4 mx-auto max-w-screen-xl  lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <img
          src={NotFound}
          alt="pageNotFound"
          className="mx-auto max-w-screen-sm h-64 text-center"
        />
        <h1 className="mb-2 text-5xl tracking-tight font-extrabold lg:text-7xl text-primary-600 ">
          404
        </h1>
        <p className="mb-2 text-xl tracking-tight font-bold text-gray-900 md:text-2xl ">
          Something's missing.
        </p>
        <p className="mb-2 text-lg font-light text-gray-500 ">
          Sorry, we can't find that page. You'll find lots to explore on the
          home page.
        </p>
       
      </div>
    </div>
  );
};

export default PrivateNotFound;
