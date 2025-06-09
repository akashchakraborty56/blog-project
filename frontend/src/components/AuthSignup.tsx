import type { ChangeEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SignupSchema } from "@akash56/common";
import axios from "axios";
import { BACKEND_URL } from "../config.tsx";

export const AuthSignup = () => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupSchema>({
        email: "",
        password: "",
        name: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function sendRequest() {
        if (!postInputs.email || !postInputs.password || !postInputs.name) {
            setError("Please fill in all fields");
            return;
        }
        
        setIsLoading(true);
        setError("");
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, postInputs);
            const jwt = response.data?.token;

            if (jwt) {
                localStorage.setItem("token", jwt);
                navigate("/blogs");
            } else {
                setError("Registration failed - no token received");
            }
        } catch(e: any) {
            setError(e.response?.data?.message || "Error while signing up. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); sendRequest(); }}>
                        <LabelledInput 
                            label="Username" 
                            placeholder="John Doe" 
                            value={postInputs.name}
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    name: e.target.value
                                })
                            }} 
                        />
                        
                        <LabelledInput 
                            label="Email address" 
                            placeholder="johndoe@example.com" 
                            type="email"
                            value={postInputs.email}
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
                            placeholder="At least 8 characters" 
                            value={postInputs.password}
                            onChange={(e) => {
                                setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                                })
                            }} 
                        />

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing up...
                                    </>
                                ) : 'Sign up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    value?: string;
}

function LabelledInput({ label, placeholder, onChange, type, value }: LabelledInputType) {
    return (
        <div>
            <label htmlFor={label.toLowerCase()} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={label.toLowerCase()}
                    name={label.toLowerCase()}
                    type={type || "text"}
                    autoComplete={type === "password" ? "new-password" : "off"}
                    required
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
    );
}