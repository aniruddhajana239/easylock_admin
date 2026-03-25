import React from "react";
import { MdErrorOutline } from "react-icons/md";

const DataNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex items-center justify-center w-20 h-20 bg-red-100 text-red-500 rounded-full mb-4 shadow-inner">
        <MdErrorOutline className="text-5xl" />
      </div>
      <p className="text-xl font-bold text-gray-800 ">
        No Data Found
      </p>
      <p className="text-sm text-gray-600  mt-2">
        Please check back later or try adjusting your filters.
      </p>
      <button
        className="mt-6 px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  );
};

export default DataNotFound;
