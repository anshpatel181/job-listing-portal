import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LinkedinCallback = () => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const hasRun = useRef(false)
    const BASE_URL = import.meta.env.VITE_BACKEND_URL

    const fetchLinkedInLoginAPI = async () => {

        const code = queryParams.get("code");
        const state = queryParams.get("state");

        const role = state.split("__")[1]

        const isLoginFlow = !role || role === "undefined";
        const successMessage = isLoginFlow ? "You have logged in successfully" : "You have registered successfully"
        const csrf_token = state.split("__")[0]

        const savedToken = sessionStorage.getItem("linkedin_csrf_token")

        if(savedToken !== csrf_token) {
            toast.error("Security Verification failed. Please try again.")
            navigate("/register")
            return;
        }

        sessionStorage.removeItem("linkedin_csrf_token")

        const response = await fetch(`${BASE_URL}/api/auth/linkedinRegister`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, role })
        })

        const data = await response.json();

        console.log(data.message, data.role, data.token);

        if (data.success === false) {
            toast.error(data.message)
            navigate(isLoginFlow ? "/login" : "register")
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "job_seeker") {
            toast.success(successMessage)
            navigate("/seeker/dashboard", { replace: true })
        }

        if (data.role === "employer") {
            toast.success(successMessage)
            navigate("/employer/dashboard", { replace: true })
        }
    }

    useEffect(() => {
        
        if(hasRun.current) return; //this is used to prevent running useEffect twice because the code we get from Linkedin url can be used for a single time

        hasRun.current = true
        fetchLinkedInLoginAPI()
    }, []);

    return <div>LinkedIn Login Processing...</div>;
};

export default LinkedinCallback;