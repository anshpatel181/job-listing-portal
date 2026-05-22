import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { PublicNavbar } from "../components/PublicNavbar"
import ButtonLoader from "../components/loaders/ButtonLoader"

export const SendEmailPage = () => {

    const [email, setEmail] = useState("")
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [openOtpForm, setOpenOtpForm] = useState(false)
    const [otp, setOtp] = useState("")
    const navigate = useNavigate();
    const [token, setToken] = useState("")
    
    const [isEmailLoading, setIsEmailLoading] = useState(false)
    const [isOtpLoading, setIsOtpLoading] = useState(false)

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsEmailLoading(true);

        try {
            const response = await fetch(BASE_URL + "/api/auth/sendEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email})
            })

            const data = await response.json();
    
            if(data.success) {
                setOpenOtpForm(true)
                setToken(data.token)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to connect to the server. Please try again.")
        } finally {
            setIsEmailLoading(false);
        }
    }

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length !== 6) {
            toast.warn("Please enter a valid 6-digit OTP code")
            return;
        }

        setIsOtpLoading(true);

        try {
            const response = await fetch(BASE_URL + `/api/auth/verifyOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp: Number(otp), email })
            })

            const data = await response.json()

            if(data.success) {
                toast.success(data.message)
                navigate(`/reset-password/${token}`)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to verify OTP. Please try again.")
        } finally {
            setIsOtpLoading(false);
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col dark:bg-slate-900">
            <PublicNavbar />
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
                    
                    {!openOtpForm ? (
                        <div>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400 mb-3 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
                                    Forgot Password?
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-2 max-w-xs">
                                    Enter your registered email address and we'll send you an OTP to verify your identity.
                                </p>
                            </div>

                            <form onSubmit={handleEmailSubmit}>
                                <div className="mb-6 relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.62a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                            </svg>
                                        </span>
                                        <input 
                                            type="email" 
                                            id="email"
                                            required
                                            placeholder="Enter your registered email..."
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-slate-700 dark:text-white transition-all duration-200" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isEmailLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isEmailLoading ? <ButtonLoader /> : "Generate OTP"}
                                </button>
                            </form>

                            <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-8">
                                Remembered your password?{" "}
                                <span 
                                    onClick={() => navigate("/login")} 
                                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                                >
                                    Back to Login
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center dark:bg-green-900/30 dark:text-green-400 mb-3 shadow-inner">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
                                    Enter OTP Code
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-2 max-w-xs">
                                    We have sent a 6-digit OTP code to <br />
                                    <span className="font-semibold text-slate-850 dark:text-slate-200">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleOTPSubmit}>
                                <div className="mb-6">
                                    <label htmlFor="otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                                        6-Digit Verification Code
                                    </label>
                                    <input 
                                        type="text" 
                                        id="otp"
                                        maxLength={6}
                                        placeholder="••••••"
                                        required
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                                        className="w-full text-center tracking-[0.55em] font-mono text-2xl py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition-all duration-200"
                                    />
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={isOtpLoading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {isOtpLoading ? <ButtonLoader /> : "Submit OTP"}
                                </button>
                                
                                <button 
                                    type="button" 
                                    onClick={() => setOpenOtpForm(false)} 
                                    className="w-full mt-4 text-sm text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-300 text-center font-medium transition-colors cursor-pointer"
                                >
                                    Change Email Address
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}