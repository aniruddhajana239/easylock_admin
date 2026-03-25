// components/dialog/auth/RegisterAsDialog.js
import { Dialog } from "@mui/material"
import { FaUsersCog, FaUsers, FaTimes } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Logo from "../../../assets/img/new-logo.png"

export const RegisterAsDialog = ({ open, onClose, onChoose }) => {
    const handleClick = (selectedVal) => {
        onChoose(selectedVal);
    }

    return (
        <Dialog
            open={open}
            onClose={() => onClose(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    overflow: 'visible',
                    position: 'relative',
                }
            }}
        >
            {/* Close Button */}
            <button 
                onClick={() => onClose(false)} 
                className="absolute -top-3 -right-3 z-10 p-2 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none"
                aria-label="Close"
            >
                <FaTimes className="w-3 h-3 text-slate-500" />
            </button>

            {/* Header */}
            <div className="w-full pt-8 pb-2 flex flex-col gap-2 justify-center items-center">
                <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full mb-2">
                    <img
                        className="w-14 h-14"
                        src={Logo}
                        alt="IDL Logo"
                    />
                </div>
                <div className="text-center">
                    <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                        Welcome to IDL
                    </span>
                    <h2 className="text-lg font-semibold text-slate-900 mt-1">
                        Join as
                    </h2>
                </div>
            </div>

            {/* Options */}
            <div className="p-6 pt-2 w-full">
                <div className="grid grid-cols-2 gap-3">
                    {/* Distributor Option */}
                    <button
                        onClick={() => handleClick("distributor")}
                        className="group flex flex-col items-center p-4 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-200 focus:outline-none"
                    >
                        <div className="p-3 bg-purple-50 rounded-full group-hover:bg-purple-100 transition-colors mb-2">
                            <FaUsersCog className="text-purple-600 text-3xl" />
                        </div>
                        <span className="text-sm font-semibold text-purple-700">
                            Distributor
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                            Manage retailers
                        </span>
                    </button>

                    {/* Retailer Option */}
                    <button
                        onClick={() => handleClick("retailer")}
                        className="group flex flex-col items-center p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200 focus:outline-none"
                    >
                        <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors mb-2">
                            <FaUsers className="text-indigo-600 text-3xl" />
                        </div>
                        <span className="text-sm font-semibold text-indigo-700">
                            Retailer
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                            Sell to customers
                        </span>
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-center text-[10px] text-slate-400 mt-4">
                    Select your role to continue with registration
                </p>
            </div>
        </Dialog>
    )
}