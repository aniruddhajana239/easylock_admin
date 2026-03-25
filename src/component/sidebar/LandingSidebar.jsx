import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../../redux/selector/auth/authSelector';

const SidebarModal = ({ isOpen, onClose, onClick }) => {
     const authData=useSelector(authSelector)
    return (
        <div>


            {/* Modal */}
            {isOpen && (
                <div  className="fixed h-screen inset-0 bg-black bg-opacity-50 flex justify-end z-30">
                    {/* Sidebar */}
                    <div onClick={onClose} className="w-1/2 h-full  bg-transparent ">
                    </div>
                    <div className="w-1/2 h-full  bg-white flex flex-col justify-between pt-6">
                        {/* Menu Items */}
                        <ul className="flex flex-col space-y-4 p-4">
                            <li onClick={()=>{onClick('home')}} className="text-gray-800 font-medium hover:text-blue-500 cursor-pointer">Home</li>
                            <li onClick={()=>{onClick('pro')}} className="text-gray-800 font-medium hover:text-blue-500 cursor-pointer">IDL Pro</li>
                            <li onClick={()=>{onClick('running')}} className="text-gray-800 font-medium hover:text-blue-500 cursor-pointer">IDL Running</li>
                            <li onClick={()=>{onClick('contact')}} className="text-gray-800 font-medium hover:text-blue-500 cursor-pointer">Contact Us</li>
                        </ul>

                        {/* Login Button */}
                        <div className="p-4 flex justify-center items-center">
                            <button onClick={()=>{
                                authData?.data?.accessToken
                                ? onClick('dashboard')
                                : onClick('login');
                                
                                }} className="relative inline-flex items-center justify-center p-4 px-12 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-white">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                <span className="relative text-white"> {authData?.data?.accessToken ? "Dashboard" : "Login"}</span>
                            </button>
                        </div>
                    </div>

                    
                </div>
            )}
        </div>
    );
};

export default SidebarModal;