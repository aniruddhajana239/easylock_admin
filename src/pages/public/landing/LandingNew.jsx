import BannerBackImage from "../../../assets/landing-images/banner-back.webp"
import FeatureBack from "../../../assets/landing-images/feature-back.jpg"
import FeatureCurve from "../../../assets/landing-images/feature-curve.png"
import BannerSimulator from "../../../assets/landing-images/banner-simulator.png"
import CardImage1 from "../../../assets/landing-images/card-img1.png"
import CardImage2 from "../../../assets/landing-images/card-img2.png"
import CardImage3 from "../../../assets/landing-images/card-img3.png"
import CardImage4 from "../../../assets/landing-images/card-img4.png"
import FeatureAbsolute from "../../../assets/landing-images/feature-absolute.webp"
import HandSimulator from "../../../assets/landing-images/hand-simulator.webp"
import Simulator2 from "../../../assets/landing-images/simulator2.png"
import Logo from "../../../assets/img/new-logo.png"
import ContactUs from "../../../assets/landing-images/contact-us.png"
import CardFeatureBg from "../../../assets/landing-images/card-feature-bg.png"
import ThumbnailImg from "../../../assets/landing-images/choose-thumbnail.webp";
import PlansBack from "../../../assets/landing-images/plans-back.jpg";
import { MdAppBlocking } from "react-icons/md";
import { TbSend2 } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdDevices } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { LandingFooter } from "../../../component/landingFooter/LandingFooter"
import { useState } from "react"
import SidebarModal from "../../../component/sidebar/LandingSidebar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { RegisterAsDialog } from "../../../component/dialog/registrationRequest/RegistarAsDialog"
import ForgotPasswordModal from "../auth/ForgotPassword"
import { RegistrationRequestDialog } from "../../../component/dialog/registrationRequest/RegistrationRequestModal"
import { SignIn } from "../auth/SignIn"
import { authSelector } from "../../../redux/selector/auth/authSelector"
export const LandingNew = () => {
    const [isOpenSignIn, setIsOpenSignIn] = useState(false);
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
    const [selectedUserType, setSelectedUserType] = useState();
    const [isOpenRegisterAsDialog, setIsOpenRegisterAsDialog] = useState(false);
    const [isOpenRegistrationFormDialog, setIsOpenRegistrationFormDialog] = useState(false);
    const navigate = useNavigate();
    const authData = useSelector(authSelector);

    const handleNavigation = (screen) => {
        setIsOpenSidebar(false)
        if (screen === "login") {
            handleSignIn()
            setIsOpenSidebar(false)
        }
        else if (screen === "dashboard") {
            handleCloseSignIn(true)
            setIsOpenSidebar(false)
        }
        else {
            const targetDiv = document.getElementById(screen);
            targetDiv.scrollIntoView({ behavior: 'smooth' });
            setIsOpenSidebar(false)
        }
    }

    const handleSignIn = () => {
        setIsOpenSignIn(!isOpenSignIn);
    };
    const handleCloseSignIn = (val) => {
        val === true ? navigate("/device-lock/home") : setIsOpenSignIn(false);
    };
    const handleBackFromRegistrationForm = () => {
        setIsOpenRegistrationFormDialog(false);
        setIsOpenRegisterAsDialog(true);
    };
    const handleCloseRegistrationForm = () => {
        setIsOpenRegistrationFormDialog(false);
        setIsOpenRegisterAsDialog(false);
    };
    const handleJoinUs = () => {
        setIsOpenRegisterAsDialog(true);
    };
    const handleCloseJoinUs = () => {
        setIsOpenRegisterAsDialog(false);
    };
    const onChooseUserType = (type) => {
        setSelectedUserType(type);
        setIsOpenRegisterAsDialog(false);
        setIsOpenRegistrationFormDialog(true);
    };
    const [isOpenForgotPassword, setIsOpenForgotPassword] = useState(false);
    const openForgotPassword = () => {
        setIsOpenSignIn(false); // Close the SignIn modal if open
        setIsOpenForgotPassword(true);
    };

    const closeForgotPassword = () => setIsOpenForgotPassword(false);
    return (
        <>
            <div className="h-screen w-full overflow-y-scroll">
                <div className="h-auto w-full flex flex-col gap-10 bg-cover relative py-40 pb-20 lg:pb-40 px-6 overflow-hidden bg-no-repeat lg:px-24" style={{ background: `url('${BannerBackImage}')` }}>
                    <div id="navbar" className="fixed lg:absolute top-0 left-0 w-full bg-[#0c0c50] lg:bg-transparent flex justify-between items-center p-2 lg:p-6 lg:px-24 z-20 transition-all duration-300">
                        <div className="flex items-center gap-4 cursor-pointer">
                            {/* <FaReact size={40} color="#FFF" /> */}
                            <img
                                className="w-12 h-12 lg:w-24 lg:h-24"
                                src={Logo}
                                alt="logo"
                            />
                            {/* <span className="text-white font-semibold text-2xl">IDL</span> */}
                        </div>
                        <div className="hidden lg:flex  items-center gap-4 cursor-pointer">

                            <span onClick={() => { handleNavigation("home") }} className="text-white text-lg hover:text-amber-400">Home</span>
                            <span onClick={() => { handleNavigation("pro") }} className="text-white text-lg hover:text-amber-400">IDL Pro</span>
                            <span onClick={() => { handleNavigation("running") }} className="text-white text-lg hover:text-amber-400">IDL Running</span>
                            <span onClick={() => { handleNavigation("contact") }} className="text-white text-lg hover:text-amber-400">Contact Us</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 cursor-pointer ">
                            <button
                                onClick={() => {
                                    authData?.data?.accessToken
                                        ? handleCloseSignIn(true)
                                        : handleNavigation("login");

                                }}
                                className="relative shadow-md inline-flex items-center px-12 ease-in-out transition-all py-1 overflow-hidden text-lg font-medium text-white bg-transparent border-1 border-white hover:border-white outline-none rounded-full hover:text-white group hover:bg-gray-50 focus:border-none focus:outline-none"
                            >
                                <span className="absolute left-0 block w-full h-0 transition-all bg-amber-400 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        ></path>
                                    </svg>
                                </span>
                                <span className="relative">
                                    {authData?.data?.accessToken ? "Dashboard" : "Login"}
                                </span>
                            </button>
                        </div>
                        <button onClick={() => { setIsOpenSidebar(true) }} className="flex items-center justify-center lg:hidden p-0 bg-transparent focus:border-none focus:outline-none">
                            <GiHamburgerMenu size={30} color="#FFF" />
                        </button>
                    </div>
                    <div id="home" className="flex flex-col lg:flex-row w-full items-center h-full gap-6 lg:gap-0">
                        <div className=" w-full lg:w-1/2 items-start justify-start lg:justify-center gap-2 flex flex-col ">
                            <span className="text-7xl font-semibold text-white">IDL Pro</span>
                            <span className="text-3xl font-semibold text-white">Finance Device Locker</span>
                            <span className="text-xl font-semibold text-white">Your Trusted Partner in Secure EMI Lockers – Safeguarding What Matters Most!</span>
                            <div className="flex items-center gap-4 py-4">
                                <button onClick={handleJoinUs} className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-white">
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                    <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                    <span className="relative text-white">GET STARTED</span>
                                </button>
                                <a 
  href="http://idlpro.cloud/idlpro-emi-locker.apk" 
  download="idlpro-emi-locker.apk"
  target="_blank" 
  rel="noopener noreferrer"
  className="relative inline-flex items-center justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-orange-500 rounded-full hover:bg-white group hover:ring-1 hover:ring-orange-500"
>
  <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
  <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-orange-500">
    DOWNLOAD
  </span>
</a>
                            </div>
                        </div>
                        <div className=" w-full lg:w-1/2 justify-center items-center h-full">
                            <img className="w-full h-full" src={BannerSimulator} alt="simulator" />
                        </div>

                    </div>
                </div>
                <div className="bg-[#f0f5fc] w-full px-6 lg:px-24 py-12 flex justify-center items-center">
                    <span className="text-3xl text-black font-semibold">IDL Pro Used by over 100 financer worldwide</span>
                </div>
                <div className="w-full flex flex-col gap-6 bg-cover bg-no-repeat pt-4" style={{ backgroundImage: `url('${FeatureBack}')` }}>
                    <div className="h-auto w-full py-24 bg-cover bg-no-repeat flex items-center mt-[-20px]" style={{ backgroundImage: `url('${FeatureCurve}')` }}>
                        <div className="flex flex-col lg:flex-row gap-4 px-6 lg:px-24">
                            <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center items-start pb-24">
                                <span className=" text-xl md:text-3xl text-orange-500 mb-4 font-semibold">Explore Amazing Features</span>
                                <span className="text-5xl md:text-7xl text-purple-500">Secure EMI Software for Mobile</span>
                                <span className="text-black text-sm md:text-lg">At IDL, we redefine security with innovative EMI Lockers designed to protect your assets with unmatched reliability, cutting-edge technology, and seamless functionality – because your peace of mind is our top priority.</span>
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-start ">

                            </div>
                        </div>

                    </div>
                    <div className="h-auto w-full px-6 lg:px-24  flex flex-col lg:flex-row gap-12 lg:gap-0 items-center pb-24">
                        <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center items-start ">
                            <span className=" text-xl md:text-2xl text-orange-500 mb-4 font-semibold">A Collection of Prominent Features</span>
                            <span className="text-3xl md:text-5xl text-white">How To Secure Your EMI Payments</span>
                            <span className="text-white text-sm md:text-lg">IDL Pro helps to secure EMI Payment for devices to Finance, Resellers & Telecom Carriers companies.</span>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center items-center ">
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <div className="shadow-lg shadow-sky-200 h-60 w-full rounded-lg bg-white flex flex-col gap-3 items-center justify-center p-2">
                                    <img src={CardImage1} className="h-32 w-32" alt="img1" />
                                    <span className="text-2xl text-purple-600 font-semibold text-center">Enroll Device</span>
                                </div>
                                <div className="shadow-lg shadow-sky-200 h-60 w-full rounded-lg bg-white flex flex-col gap-3 items-center justify-center p-2">
                                    <img src={CardImage2} className="h-32 w-32" alt="img1" />
                                    <span className="text-2xl text-purple-600 font-semibold text-center">Lock/Unlock</span>
                                </div>
                                <div className="shadow-lg shadow-sky-200 h-60 w-full rounded-lg bg-white flex flex-col gap-3 items-center justify-center p-2">
                                    <img src={CardImage3} className="h-32 w-32" alt="img1" />
                                    <span className="text-2xl text-purple-600 font-semibold text-center">Quick Access</span>
                                </div>
                                <div className="shadow-lg shadow-sky-200 h-60 w-full rounded-lg bg-white flex flex-col gap-3 items-center justify-center p-2">
                                    <img src={CardImage4} className="h-32 w-32" alt="img1" />
                                    <span className="text-2xl text-purple-600 font-semibold text-center">24h Support</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex bg-[#f0f5fc] relative flex-col gap-4">
                    <div className="absolute top-0 right-0">
                        <img src={FeatureAbsolute} alt="img" />
                    </div>
                    <div className="z-10 w-full py-10 flex flex-col items-center">
                        <div className="w-full lg:w-1/2 flex flex-col gap-4 items-center">
                            <span className="text-xl text-orange-500 font-semibold text-center">IDL Pro Features that will</span>
                            <span className="text-7xl text-purple-500 font-semibold text-center">Advanced Finance Device Lock Controller</span>
                        </div>

                    </div>
                    <div className="z-10 w-full py-10 flex flex-col gap-4 lg:gap-0 lg:flex-row  items-center">
                        <div className="w-full h-auto lg:w-1/2 flex justify-center items-center">
                            <img src={HandSimulator} className="w-full h-auto" alt="img" />
                        </div>
                        <div className="w-full h-auto lg:w-1/2 flex flex-col justify-center items-center px-6 lg:pl-0 lg:pr-8 gap-4">
                            <div className="w-full rounded-3xl shadow-md bg-cover p-4 flex flex-col lg:flex-row items-center gap-4 text-white" style={{ backgroundImage: `url('${CardFeatureBg}')` }}>
                                <div className="p-4 rounded-full bg-purple-700 flex justify-center items-center">
                                    <MdAppBlocking size={60} color="#FFF" />
                                </div>
                                <div className="flex flex-col gap:2">
                                    <span className="text-xl font-semibold ">EMI Lock Mobile Application</span>
                                    <span className="text-md">EMI Lock Mobile Application ensures secure, seamless, and real-time management of lockers, offering advanced encryption, user-friendly design, and instant alerts for ultimate convenience.</span>
                                </div>
                            </div>

                            <div className="w-full rounded-3xl shadow-md bg-cover  flex items-center" style={{ backgroundImage: `url('${CardFeatureBg}')` }}>
                                <div className="w-full flex flex-col lg:flex-row rounded-3xl items-center gap-4 bg-[#f0f5fc] hover:bg-transparent p-4 border-2 border-purple-700 text-purple-700 hover:text-white">
                                    <div className="p-4 rounded-full bg-purple-700 flex justify-center items-center">
                                        <HiOutlineClipboardDocumentList size={60} color="#FFF" />
                                    </div>
                                    <div className="flex flex-col gap:2">
                                        <span className="text-xl font-semibold ">Micro Finance SaaS solution</span>
                                        <span className="text-md">Our Microfinance SaaS solution empowers institutions with advanced tools for seamless loan management, real-time analytics, customer tracking, and secure operations, driving efficiency, scalability, and financial inclusion with cutting-edge technology.</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full rounded-3xl shadow-md bg-cover  flex items-center" style={{ backgroundImage: `url('${CardFeatureBg}')` }}>
                                <div className="w-full rounded-3xl flex flex-col lg:flex-row rounded-md items-center gap-4 bg-[#f0f5fc] hover:bg-transparent p-4 rounded-3xl border-2 border-purple-700 text-purple-700 hover:text-white">
                                    <div className="p-4 rounded-full bg-purple-700 flex justify-center items-center">
                                        <MdDevices size={60} color="#FFF" />
                                    </div>
                                    <div className="flex flex-col gap:2">
                                        <span className="text-xl font-semibold ">Company Registration Solution</span>
                                        <span className="text-md">Our company registration solution streamlines the process with expert guidance, user-friendly tools, and compliance assurance, making it simple, efficient, and hassle-free to establish your business.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-full xl:w-4/5 grid grid-cols-1 lg:grid-cols-3 spacing-3 px-6 lg:px-12 pt-20 lg:py-20 ">
                        <div className="col-span-3 lg:col-span-2 flex justify-center items-center px-0 lg:px-8">
                            <img
                                src={ThumbnailImg}
                                className="w-full lg:w-4/5 h-auto bg-cover"
                            />
                        </div>
                        <div className="col-span-3 lg:col-span-1 flex flex-col justify-center items-center  gap-8">
                            <span className="text-3xl font-semibold text-black mt-12 lg:mt-0 ">
                                Why Choose Our EMI Lock Application?
                            </span>

                            <div className="w-full flex flex-col gap-2 items-start">

                                <div className="flex flex-col items-start gap-2">

                                    <div className="flex flex-col w-full gap-1 pr-8">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Unbreakable Security, Anytime, Anywhere.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Seamless Access, Hassle-Free Control.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Real-Time Alerts, Always Stay Informed.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">User-Friendly Design, Effortless Navigation</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Advanced Encryption, Your Data is Safe.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Custom Solutions, Tailored for You.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Trusted Reliability, Peace of Mind Guaranteed.</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                            <span className="text-black text-lg">Future-Ready Features, Ahead of the Curve.</span>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="flex flex-col items-start gap-2">
                <span className="text-lg font-semibold text-black text-start">
                  Company Registration Solution
                </span>
                <div className="flex flex-col w-full gap-1 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Hassle-free, step-by-step guidance to register your company with ease.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Cost-effective solutions tailored to fit startups and growing businesses.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Dedicated professionals ensure compliance and address queries promptly.</span>
                  </div>
                </div>
              </div> */}

                            </div>
                        </div>
                    </div>
                </div>
                <div id="pro" className="h-auto w-full flex flex-col gap-10 bg-cover relative py-20 pb-20 lg:pb-40 px-6 overflow-hidden bg-no-repeat lg:px-24 bg-[#f0f5fc]" >

                    <div className="flex flex-col lg:flex-row w-full items-center h-full gap-6 lg:gap-0">
                        <div className=" w-full lg:w-1/2 items-start justify-start lg:justify-center gap-2 flex flex-col ">
                            <span className="text-7xl font-semibold text-blue-400">IDL Pro</span>
                            <span className="text-xl font-semibold text-black">IDL Pro is an innovative solution designed to secure EMI payments for financed devices, enabling retailers to lock overdue EMI devices in real-time. With a focus on reducing collection costs and ensuring timely payments, IDL Pro enhances retailer satisfaction by streamlining payment processes and providing a reliable, secure method for managing outstanding dues.</span>
                            <div className="w-full h-auto  flex flex-col justify-center items-center pr-8 gap-4">

                                <div className="flex flex-col w-full gap-1 ml-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Real-Time Device Locking: Secure overdue EMI devices instantly.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Reduced Collection Costs: Streamlined payment processes for cost efficiency.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Timely Payments: Ensures regular, on-time EMI collections.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Enhanced Retailer Satisfaction: Reliable and secure method for managing outstanding dues.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Innovative Technology: Simplifies the management of financed devices and payments.</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className=" w-full lg:w-1/2 justify-center items-center h-full">
                            <img className="w-full h-full" src={BannerSimulator} alt="simulator" />
                        </div>

                    </div>
                </div>
                <div id="running" className="h-auto w-full flex flex-col gap-10 bg-cover relative  pb-20 lg:py-20 px-6 overflow-hidden bg-no-repeat lg:px-24 bg-[#f0f5fc]" >

                    <div className="flex flex-col-reverse lg:flex-row w-full items-center h-full gap-6 lg:gap-0">
                        <div className=" w-full lg:w-1/2 justify-center items-center h-full">
                            <img className="w-full h-full" src={Simulator2} alt="simulator" />
                        </div>
                        <div className=" w-full lg:w-1/2 items-start justify-start lg:justify-center gap-2 flex flex-col ">
                            <span className="text-7xl font-semibold text-blue-400">IDL Running</span>
                            <span className="text-xl font-semibold text-black">IDL Running offers robust protection for finance devices like phones, safeguarding them against theft, fraud, and late payments. By providing real-time tracking and secure payment solutions, it ensures that both retailers and customers are protected, reducing risk and ensuring timely EMI payments.</span>
                            <div className="w-full h-auto  flex flex-col justify-center items-center pr-8 gap-4">

                                <div className="flex flex-col w-full gap-1 ml-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Robust Protection: Safeguards finance devices against theft, fraud, and late payments.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Real-Time Tracking: Monitors devices and payments instantly.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Secure Payment Solutions: Ensures safe and reliable EMI collections.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Risk Reduction: Protects both retailers and customers.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-2xl font-semibold w-12"><TbSend2 size={30} color="#94a3b8" /></span>
                                        <span className="text-black text-lg">Timely Payments: Promotes on-time EMI payments, ensuring financial security</span>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                <div className="w-full pt-20  flex flex-col  gap-4 bg-cover" style={{ backgroundImage: `url('${PlansBack}')` }}>
                    <div className="w-full px-6 lg:px-24 flex flex-col lg:flex-row gap-4 bg-cover">
                        <div className="w-full lg:w-1/3 border-2 border-white rounded-xl px-4 py-10  flex flex-col items-center gap-6 hover:bg-gradient-to-r hover:from-amber-300">
                            <span className="text-2xl text-white font-semibold">STARTER</span>
                            <span className="text-md text-white font-semibold">50 Licence Key</span>
                            <span className="text-md text-white font-semibold">$10 Per Licence Key</span>
                            <span className="text-md text-white font-semibold">Full Featured Software</span>
                            <span className="text-md text-white font-semibold">Lifetime Licence Validity</span>
                            <span className="text-md text-white font-semibold">Limited Support</span>
                            <span className="text-3xl text-white font-semibold py-6 text-orange-500">$500</span>
                            <button className="relative inline-flex items-center justify-center p-4 px-12 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-white">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                <span className="relative text-white">BUY NOW</span>
                            </button>
                        </div>
                        <div className="w-full lg:w-1/3 border-2 border-white rounded-xl px-4 py-10  flex flex-col items-center gap-6 hover:bg-gradient-to-r hover:from-amber-300">
                            <span className="text-2xl text-white font-semibold">STARTER</span>
                            <span className="text-md text-white font-semibold">50 Licence Key</span>
                            <span className="text-md text-white font-semibold">$10 Per Licence Key</span>
                            <span className="text-md text-white font-semibold">Full Featured Software</span>
                            <span className="text-md text-white font-semibold">Lifetime Licence Validity</span>
                            <span className="text-md text-white font-semibold">Limited Support</span>
                            <span className="text-3xl text-white font-semibold py-6 text-orange-500">$500</span>
                            <button className="relative inline-flex items-center justify-center p-4 px-12 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-white">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                <span className="relative text-white">BUY NOW</span>
                            </button>
                        </div>
                        <div className="w-full lg:w-1/3 border-2 border-white rounded-xl px-4 py-10  flex flex-col items-center gap-6 hover:bg-gradient-to-r hover:from-amber-300">
                            <span className="text-2xl text-white font-semibold">STARTER</span>
                            <span className="text-md text-white font-semibold">50 Licence Key</span>
                            <span className="text-md text-white font-semibold">$10 Per Licence Key</span>
                            <span className="text-md text-white font-semibold">Full Featured Software</span>
                            <span className="text-md text-white font-semibold">Lifetime Licence Validity</span>
                            <span className="text-md text-white font-semibold">Limited Support</span>
                            <span className="text-3xl text-white font-semibold py-6 text-orange-500">$500</span>
                            <button className="relative inline-flex items-center justify-center p-4 px-12 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-white">
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                                <span className="relative text-white">BUY NOW</span>
                            </button>
                        </div>
                    </div>
                    <div id="contact" className="w-full flex flex-col gap-12 items-center px-6 lg:px-24 pb-20">
                        {/* <span className="text-2xl font-semibold text-white">Contact With Us</span> */}
                        <div className="flex flex-col-reverse lg:flex-row w-full items-center h-full gap-6 lg:gap-0">

                            <div className=" w-full bg-transparent lg:w-1/2 items-start justify-start lg:justify-center gap-2 flex flex-col ">
                                <div className="p-4 mx-auto max-w-xl bg-transparent font-[sans-serif]">
                                    <h1 className="text-3xl text-white font-extrabold text-center">Contact us</h1>
                                    <form className="mt-8 space-y-4">
                                        <input type='text' placeholder='Name'
                                            className="w-full rounded-md py-3 px-4 text-white bg-gray-100 focus:bg-transparent text-sm outline-blue-500" />
                                        <input type='email' placeholder='Email'
                                            className="w-full rounded-md py-3 px-4 text-white bg-gray-100 focus:bg-transparent text-sm outline-blue-500" />
                                        <input type='text' placeholder='Subject'
                                            className="w-full rounded-md py-3 px-4 text-white bg-gray-100 focus:bg-transparent text-sm outline-blue-500" />
                                        <textarea placeholder='Message' rows="6"
                                            className="w-full rounded-md px-4 text-white bg-gray-100 focus:bg-transparent text-sm pt-3 outline-blue-500"></textarea>
                                        <button type='button'
                                            className="text-white bg-blue-500 hover:bg-blue-600 tracking-wide rounded-md text-sm px-4 py-3 w-full">Send</button>
                                    </form>
                                </div>
                            </div>
                            <div className=" w-full lg:w-1/2 justify-center items-center h-full">
                                <img className="h-96 w-96" src={ContactUs} alt="contact-us" />
                            </div>


                        </div>
                    </div>
                    <div className="w-full h-auto flex">
                        <LandingFooter onClick={handleNavigation} />
                    </div>
                </div>
                {isOpenSidebar && <SidebarModal isOpen={isOpenSidebar} onClose={() => { setIsOpenSidebar(false) }} onClick={handleNavigation} />}
                {isOpenSignIn && (
                    <SignIn
                        open={isOpenSignIn}
                        onClose={handleCloseSignIn}
                        onForgotPassword={openForgotPassword}
                    />
                )}
                {isOpenRegistrationFormDialog && (
                    <RegistrationRequestDialog
                        onBack={handleBackFromRegistrationForm}
                        open={isOpenRegistrationFormDialog}
                        onClose={handleCloseRegistrationForm}
                        registerAs={selectedUserType}
                    />
                )}
                {isOpenRegisterAsDialog && (
                    <RegisterAsDialog
                        open={isOpenRegisterAsDialog}
                        onClose={handleCloseJoinUs}
                        onChoose={onChooseUserType}
                    />
                )}
                {isOpenForgotPassword && <ForgotPasswordModal
                    open={isOpenForgotPassword}
                    onClose={closeForgotPassword}
                />}
                {/* {showPopup && <OffersPopup open={showPopup} onClose={handleClosePopup} />} */}
            </div>
        </>
    )
}