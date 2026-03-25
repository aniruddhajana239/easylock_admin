import BackgroundImage from "../../../assets/bg-img/banner-bg.png";
import Simulator from "../../../assets/landing-images/banner-simulator.png";
import Key1Img from "../../../assets/landing-images/key-feature-1.svg";
import Key2Img from "../../../assets/landing-images/key-feature-2.svg";
import Key4Img from "../../../assets/landing-images/key-feature-4.svg";
import ThumbnailImg from "../../../assets/landing-images/choose-thumbnail.webp";
import { FaReact } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { SignIn } from "../auth/SignIn";
import { LandingFooter } from "../../../component/landingFooter/LandingFooter";
import { RegistrationRequestDialog } from "../../../component/dialog/registrationRequest/RegistrationRequestModal";
import { RegisterAsDialog } from "../../../component/dialog/registrationRequest/RegistarAsDialog";
import { useSelector } from "react-redux";
import { authSelector } from "../../../redux/selector/auth/authSelector";
import ForgotPasswordModal from "../auth/ForgotPassword";
import { OffersPopup } from "../../../component/popup/OffersPopup";
import { IoCheckmarkDone } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
export const LandingPage = () => {
  const [isOpenSignIn, setIsOpenSignIn] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState();
  const [isOpenRegisterAsDialog, setIsOpenRegisterAsDialog] = useState(false);
  const [isOpenRegistrationFormDialog, setIsOpenRegistrationFormDialog] =
    useState(false);
  const navigate = useNavigate();
  const authData = useSelector(authSelector);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the popup has been closed in this session

    setShowPopup(true); // Show popup if not closed

  }, []);

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };
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
    <div className="h-full w-full flex flex-col gap-8 items-center bg-white overflow-hidden">
      <div
        className="h-auto min-w-full flex flex-col bg-contain lg:bg-cover"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="h-16 w-full mt-6">
          <div className="flex items-center justify-between gap-4 w-full h-full p-4 lg:px-20">
            <div className="flex items-center gap-2">
              <div className="">
                <div className="h-full flex items-center justify-start gap-2">
                  <FaReact size={40} color="#FFF" />
                  <span className="text-white font-semibold text-2xl">IDL</span>
                </div>
              </div>

            </div>
            <div className="flex justify-end items-center gap-4">

              <button
                onClick={() => {
                  authData?.data?.accessToken
                    ? handleCloseSignIn(true)
                    : handleSignIn();
                }}
                className="relative shadow-md inline-flex items-center px-12 ease-in-out transition-all py-1 overflow-hidden text-lg font-medium text-white bg-amber-300 border-none outline-none rounded-full hover:text-white group hover:bg-gray-50 focus:border-none focus:outline-none"
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
          </div>
        </div>
        <div className="h-auto py-20 lg:py-36  w-full flex gap-8 items-center px-4">
          <div className="w-full md:w-1/2 flex flex-col gap-4 justify-center items-center">
            <h1 className="text-6xl text-white font-semibold w-full lg:w-1/2 leading-16">
              Financial Risk Management Platform
            </h1>
            <span className="text-sm text-slate-200 font-semibold w-full lg:w-1/2">
              Device Financial Risk Management Software helps financial institutions
              mitigate the risks associated with device financing,
              improve loan performance, and increase profitability.
            </span>
            <div className="w-full lg:w-1/2 items-center flex justify-end lg:justify-start">
              <button
                onClick={handleJoinUs}
                className="px-4 py-2 bg-amber-400 text-white text-md rounded-full shadow-md hover:bg-amber-500 border-none outline-none focus:border-none focus:outline-none flex items-center gap-2"
              >
                <span>Join For Free</span>
                <FaArrowRight size={20} color="#FFF" />
              </button>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 justify-center items-center px-8">
            <img src={Simulator} className="h-auto w-full" />
          </div>
        </div>
      </div>
      <div className="p-4 bg-white w-full flex items-center justify-center">
        <div className="w-full md:w-1/2 py-4 flex flex-col justify-center items-center gap-4">
          <span className="text-2xl text-black font-semibold text-center">
            Business start with great features
          </span>
          <div className="text-center text-gray-600 text-xl">
            Build an incredible workplace and grow your business with IDL’s
            all-in-one platform with amazing contents.
          </div>
        </div>
      </div>
      <div className="p-4 bg-white w-full flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 spacing-3 px-12">
          <div className="col-span-1 rounded-lg">
            <div className="flex flex-col gap-4 items-center justify-center p-4">
              <img src={Key4Img} className="w-20 h-20 bg-transparent" />
              <span className="text-center text-lg font-semibold text-back">
                EMI Lock Mobile Application
              </span>
              <span className="text-center text-gray-500 leading-6 text-md w-full md:w-2/3">
                We’re dedicated to safeguarding your devices and ensuring seamless EMI management with ease.
              </span>
            </div>
          </div>
          <div className="col-span-1 rounded-lg">
            <div className="flex flex-col gap-4 items-center justify-center p-4">
              <img src={Key1Img} className="w-20 h-20 bg-transparent" />
              <span className="text-center text-lg font-semibold text-back">
                Micro Finance SaaS solution
              </span>
              <span className="text-center text-gray-500 leading-6 text-md w-full md:w-2/3">
                We’re committed to empowering microfinance institutions with smart, scalable, and efficient digital solutions.
              </span>
            </div>
          </div>
          <div className="col-span-1 rounded-lg">
            <div className="flex flex-col gap-4 items-center justify-center p-4">
              <img src={Key2Img} className="w-20 h-20 bg-transparent" />
              <span className="text-center text-lg font-semibold text-back">
                Company Registration Solution
              </span>
              <span className="text-center text-gray-500 leading-6 text-md w-full md:w-2/3">
                We’re focused on simplifying company registration with expert guidance and seamless, smart solutions.
              </span>
            </div>
          </div>
          {/* <div className="col-span-1 rounded-lg">
            <div className="flex flex-col gap-4 items-center justify-center p-4">
              <img src={Key3Img} className="w-20 h-20 bg-transparent" />
              <span className="text-center text-lg font-semibold text-back">
                Help & Support
              </span>
              <span className="text-center text-gray-500 leading-6 text-md w-full md:w-2/3">
                We’re driven beyond just finishing the projects. We want to find
                smart solutions.
              </span>
            </div>
          </div> */}

        </div>
        <div className="w-full xl:w-4/5 grid grid-cols-1 lg:grid-cols-3 spacing-3 px-0 lg:px-12 py-20">
          <div className="col-span-3 lg:col-span-2 flex justify-center items-center px-0 lg:px-8">
            <img
              src={ThumbnailImg}
              className="w-full lg:w-4/5 h-auto bg-cover"
            />
          </div>
          <div className="col-span-3 lg:col-span-1 flex flex-col justify-center items-center px-2  gap-8">
            <span className="text-xl font-semibold text-black mt-12 lg:mt-0">
              Why You Choose Our App For Your Daily Use?
            </span>
            {/* <span className=" text-lg text-gray-400 text-start">
             IDL custom finance device risk management software provide a
             comprehensive solution for identifying, analyzing, and managing 
             financial risk. By implementing such software, organizations can 
             reduce the likelihood of financial loss and increase the effectiveness of 
             their risk management programs.
            </span>
            <div className="w-full flex gap-4 items-center wrap">
              <span className="text-5xl text-slate-400">01</span>
              <div className="flex flex-col gap-2 ml-2">
                <span className="text-md font-semibold text-black text-start">
                  EMI Lock Mobile Application
                </span>
                <span className="text-sm text-slate-400 text-start">
                  We’re driven beyond just finishing the projects. We want to
                  find solutions.
                </span>
              </div>
            </div>
            <div className="w-full flex gap-4 items-center wrap">
              <span className="text-5xl text-slate-400">02</span>
              <div className="flex flex-col gap-2">
                <span className="text-md font-semibold text-black text-start">
                  Micro Finance SaaS solution
                </span>
                <span className="text-sm text-slate-400 text-start">
                  We’re driven beyond just finishing the projects. We want to
                  find solutions.
                </span>
              </div>
            </div>
            <div className="w-full flex gap-4 items-center wrap">
              <span className="text-5xl text-slate-400">03</span>
              <div className="flex flex-col gap-2">
                <span className="text-md font-semibold text-black text-start">
                Company Registration Solution
                </span>
                <span className="text-sm text-slate-400 text-start">
                  We’re driven beyond just finishing the projects. We want to
                  find solutions.
                </span>
              </div>
            </div> */}
            <div className="w-full flex flex-col gap-2 items-start">
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg font-semibold text-black text-start">
                  EMI Lock Mobile Application
                </span>
                <div className="flex flex-col w-full gap-1 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12">01</span>
                    <span className="text-black text-sm">EMI Lock ensures your mobile stays protected, secure, and functional.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12">02</span>
                    <span className="text-black text-sm">Stay worry-free with intelligent payment tracking and timely reminders.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12">03</span>
                    <span className="text-black text-sm">Experience hassle-free, intuitive controls tailored for all user levels.</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg font-semibold text-black text-start">
                  Micro Finance SaaS solution
                </span>
                <div className="flex flex-col w-full gap-1 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><FaCircle size={20} color="#94a3b8" /></span>
                    <span className="text-black text-sm">Streamline operations with tailored loan management and repayment tracking features.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><FaCircle size={20} color="#94a3b8" /></span>
                    <span className="text-black text-sm">Empower growth with robust data protection and easy scalability options.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><FaCircle size={20} color="#94a3b8" /></span>
                    <span className="text-black text-sm">Make informed decisions with advanced analytics and instant performance reports.</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-lg font-semibold text-black text-start">
                  Company Registration Solution
                </span>
                <div className="flex flex-col w-full gap-1 ml-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><IoCheckmarkDone size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Hassle-free, step-by-step guidance to register your company with ease.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><IoCheckmarkDone size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Cost-effective solutions tailored to fit startups and growing businesses.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-2xl font-semibold w-12"><IoCheckmarkDone size={24} color="#0D7C66" /></span>
                    <span className="text-black text-sm">Dedicated professionals ensure compliance and address queries promptly.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex">
        <LandingFooter />
      </div>
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
      {showPopup && <OffersPopup open={showPopup} onClose={handleClosePopup} />}
    </div>
  );
};
