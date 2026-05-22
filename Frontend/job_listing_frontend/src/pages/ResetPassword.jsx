import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify";
import { PublicNavbar } from "../components/PublicNavbar"
import ButtonLoader from "../components/loaders/ButtonLoader"
import { GoEye, GoEyeClosed } from "react-icons/go"

export const ResetPassword = () => {

    const { token } = useParams()
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passwordErrorMessage, setPasswordErrorMessage] = useState(false)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    
    const [isLoading, setIsLoading] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setPasswordErrorMessage(true)
            return;
        }

        setPasswordErrorMessage(false)
        setIsLoading(true)

        try {   
            const response = await fetch(BASE_URL + `/api/auth/set-new-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, newPassword })
            })
    
            const data = await response.json();
            if(data.success) {
                toast.success(data.message)
                navigate("/login", {replace: true})
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to connect to the server. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col dark:bg-slate-900">
            <PublicNavbar />
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
                    
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400 mb-3 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
                            Reset Password
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-2 max-w-xs">
                            Enter and confirm your new secure password below to complete the reset process.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col">
                        <div className="mb-4 relative">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Enter new password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                                    </svg>
                                </span>
                                <input 
                                    type={showNewPassword ? "text" : "password"} 
                                    id="newPassword"
                                    name="newPassword" 
                                    placeholder="Enter new password..."
                                    required
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-all duration-200"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowNewPassword(!showNewPassword)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 text-sm transition-colors cursor-pointer"
                                >
                                    {showNewPassword ? <GoEye /> : <GoEyeClosed />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 relative">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Confirm new password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                </span>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    id="confirmPassword"
                                    name="confirmPassword" 
                                    placeholder="Confirm new password..."
                                    required
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white transition-all duration-200"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 text-sm transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <GoEye /> : <GoEyeClosed />}
                                </button>
                            </div>
                        </div>
                        
                        {
                            passwordErrorMessage && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold flex items-center gap-2 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400 animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                    Passwords do not match
                                </div>
                            )
                        }
                        
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer"
                        >
                            {isLoading ? <ButtonLoader /> : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )

}