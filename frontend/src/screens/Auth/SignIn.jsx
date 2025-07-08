import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import toast from "react-hot-toast";

const SignIn = () => {
  const {loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md ">
          <img src={logo} width={250} className="mx-auto" />
          <div className=" mt-12 space-y-3">
            <h3 className="text-white text-3xl font-bold text-center">
              Total Control of Your Money
            </h3>
            <p className="text-gray-300 text-center">
              Real-time tracking and reporting to empower your financial
              choices.
            </p>
            <Link to="/signup">
              <button className="w-full px-4 py-2 mt-8 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
                Create Account
              </button>
            </Link>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(59, 130, 246, 0.2) 4.54%, rgba(37, 99, 235, 0.26) 34.2%, rgba(59, 130, 246, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div className="">
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Login
              </h3>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-2 text-white font-medium bg-indigo-600
             hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
