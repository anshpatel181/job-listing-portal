import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogoutButton } from "./Logout";
import { FaBars, FaTimes } from "react-icons/fa";

export const DashboardNavbar = () => {
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 
    isActive ?  "text-blue-600 font-semibold md:border-b-2 md:border-blue-600"
      : "text-slate-600 hover:text-blue-600";

  return (
    <nav className="bg-white border-b shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <NavLink to={role === "job_seeker" ? "/seeker/dashboard" : "/employer/dashboard"} className="text-xl font-bold text-blue-600">
          JobPortal
        </NavLink>

        {/* Mobile menu button */}
        <button 
            className="lg:hidden text-slate-600 hover:text-blue-600 transition"
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {role === "employer" && (
            <>
              <NavLink to="/employer/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/employer/jobs" className={navLinkClass}>My Jobs</NavLink>
              <NavLink to="/employer/post-job" className={navLinkClass}>Post Job</NavLink>
              <NavLink to="/employer/profile" className={navLinkClass}>Company</NavLink>
            </>
          )}

          {role === "job_seeker" && (
            <>
              <NavLink to="/seeker/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/jobs" className={navLinkClass}>Find Jobs</NavLink>
              <NavLink to="/saved-jobs" className={navLinkClass}>Saved Jobs</NavLink>
              <NavLink to="/seeker/profile" className={navLinkClass}>Profile</NavLink>
              <NavLink to="/applications" className={navLinkClass}>Applied Jobs</NavLink>
            </>
          )}

          <LogoutButton />
        </div>
      </div>

      {/* Mobile menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md border-t border-slate-100 flex flex-col p-4 gap-4 z-50 text-sm font-medium">
          {role === "employer" && (
            <>
              <NavLink to="/employer/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/employer/jobs" onClick={() => setIsOpen(false)} className={navLinkClass}>My Jobs</NavLink>
              <NavLink to="/employer/post-job" onClick={() => setIsOpen(false)} className={navLinkClass}>Post Job</NavLink>
              <NavLink to="/employer/profile" onClick={() => setIsOpen(false)} className={navLinkClass}>Company</NavLink>
            </>
          )}

          {role === "job_seeker" && (
            <>
              <NavLink to="/seeker/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/jobs" onClick={() => setIsOpen(false)} className={navLinkClass}>Find Jobs</NavLink>
              <NavLink to="/saved-jobs" onClick={() => setIsOpen(false)} className={navLinkClass}>Saved Jobs</NavLink>
              <NavLink to="/seeker/profile" onClick={() => setIsOpen(false)} className={navLinkClass}>Profile</NavLink>
              <NavLink to="/applications" onClick={() => setIsOpen(false)} className={navLinkClass}>Applied Jobs</NavLink>
            </>
          )}
          
          <div className="pt-2 border-t border-slate-100">
             <LogoutButton />
          </div>
        </div>
      )}
    </nav>
  );
};
