import type { ChangeEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SigninSchema } from "@akash56/common";
import axios from "axios";
import { BACKEND_URL } from "../config.tsx";

export const AuthSignin = () => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SigninSchema>({
        email: "",
        password: "",
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, postInputs);
            const jwt = response.data?.token;

            if (jwt) {
                localStorage.setItem("token", jwt);
                navigate("/blogs");
            } else {
                alert("Authentication failed. Please try again.");
            }
        } catch(e) {
            alert("Error while signing in. Please check your credentials.");
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden mx-auto">
                <div className="p-6 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Don't have an account?{" "}
                            <Link 
                                to='/signup' 
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                        <LabelledInput 
                            label="Email" 
                            placeholder="johndoe@gmail.com" 
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    email: e.target.value
                                })
                            }} 
                        />
                        
                        <LabelledInput 
                            label="Password" 
                            type="password" 
                            placeholder="Enter your password" 
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                                })
                            }} 
                        />
                        
                        <button 
                            onClick={sendRequest}
                            className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input 
                onChange={onChange} 
                type={type || "text"} 
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-sm sm:text-base"
                placeholder={placeholder} 
                required 
                autoComplete="new-password" 
            />
        </div>
    )
}