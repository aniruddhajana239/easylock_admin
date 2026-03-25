import React from "react";
import { useNavigate } from "react-router";
// import login from "../../assets/Mobile login-pana.svg";
import { Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const handleSignIn = () => {
    // Perform authentication logic (e.g., form validation)
    // After successful login, navigate to a different page
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white ">
      {/* Left Section */}
      <div className="hidden md:flex lg:w-1/2 bg-gradient-to-b from-[#41b06e] to-[#6356c8] p-10 text-white flex-col justify-center">
        <div className="text-center">
          <img src="logo.png" alt="IDL Logo" className="mx-auto mb-5" />
          <h1 className="text-3xl font-bold mb-5">Welcome to IDL</h1>
          <p className="text-lg">
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups.
          </p>
          {/* <img src={login} alt="IDL Logo" className="mx-auto mb-5 h-96" /> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 bg-white  p-10 flex flex-col justify-center">
        <div className="max-w-md mx-auto bg-white ">
          <h2 className="text-3xl font-bold mb-5 text-center text-gray-900 ">
            Create your account
          </h2>
          <form>
            {/* Name */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full p-3 border text-gray-700  bg-gray-50  rounded-lg"
                type="text"
                id="name"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700  text-sm font-bold mb-2"
                htmlFor="email"
              >
                E-mail Address
              </label>
              <input
                className="w-full p-3 border text-gray-700  bg-gray-50  rounded-lg"
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full p-3 text-gray-700 bg-gray-50 border rounded-lg"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>

            {/* Terms */}
            <div className="mb-6 flex items-center">
              <input type="checkbox" id="terms" className="mr-2" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-500">
                  Terms & Conditions
                </a>
              </label>
            </div>

            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
                type="submit"
              >
                Sign Up
              </button>
            </div>

            <p className="m-0 p-0 text-gray-800">
              Already have an account?
              <Link
                className="text-primary font-semibold hover:underline"
                to="/"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
