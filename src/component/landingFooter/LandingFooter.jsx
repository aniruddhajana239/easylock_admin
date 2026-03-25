import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { MdCopyright } from "react-icons/md";
import { Link } from "@mui/material";
export const LandingFooter = ({onClick}) => {
    return (
        <div className="w-full flex flex-col justify-end items-center  bg-gradient-to-r from-purple-700 to-blue-700 rounded-t-full">
            <div className="w-full  bg-transparent flex flex-col items-center gap-10 justify-end">
                <div className="flex items-center gap-4 cursor-pointer py-12">
                    <span className="text-white text-5xl font-semibold">IDL</span>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                    <Link href="https://www.facebook.com/share/1BtLq5KEYN/" className="cursor-pointer"><FaFacebook size={30} color='#fff' /></Link>
                    <Link href="https://wa.me/8822678716" target="_blank" className="cursor-pointer"><FaWhatsapp size={30} color='#fff' /></Link>
                    <Link href="https://youtube.com/@idlproemilocker?si=HcKesaf5HQd0A2Cw" className="cursor-pointer"><FaYoutube size={30} color='#fff' /></Link>
                </div>
                <div className="flex items-center gap-2 justify-center">
                    <div className="flex items-center gap-2">
                        <MdEmail size={16} color='#fff' />
                        <Link href="mailto:idlpro.in@gmail.com" className="text-sm !text-white">idlpro.in@gmail.com</Link>
                    </div>
                    <div className="w-[1px] h-full bg-white"></div>
                    <div className="flex items-center gap-2">
                        <MdCall size={16} color='#fff' />
                        <Link href="tel:8822678716" className="text-sm !text-white">+91 8822678716</Link><span className="text-sm !text-white">/</span>
                        <Link href="tel:7635990831" className="text-sm !text-white">+91 7635990831</Link><span className="text-sm !text-white">/</span>
                        <Link href="tel:6026997138" className="text-sm !text-white">+91 6026997138</Link>
                    </div>
                </div>
                <div className="flex  items-center gap-4 cursor-pointer">

                    <span onClick={()=>{onClick('home')}} className="text-white text-sm lg:text-lg hover:text-amber-400">Home</span>
                    <span onClick={()=>{onClick('pro')}} className="text-white text-sm lg:text-lg hover:text-amber-400">IDL Pro</span>
                    <span onClick={()=>{onClick('running')}} className="text-white text-sm lg:text-lg hover:text-amber-400">IDL Running</span>
                    <span onClick={()=>{onClick('contact')}} className="text-white text-sm lg:text-lg hover:text-amber-400">Contact Us</span>
                </div>
                <div className="w-full flex items-center justify-center gap-4 border-t-2 border-white p-4">
                    <div className="flex items-center gap-[3px]">
                        <MdCopyright size={14} color='#fff' />
                        <span className="text-xs text-white">Copyright 2025 IDL Finance. All Right Reserved</span>
                    </div>

                </div>

            </div>
        </div>

    )
}