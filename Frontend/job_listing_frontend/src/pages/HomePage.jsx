import { NavLink } from "react-router-dom";
import {
  FaUserTie,
  FaBriefcase,
  FaShieldAlt,
  FaUserCheck,
} from "react-icons/fa";
import { PublicNavbar } from "../components/PublicNavbar";
import { DashboardNavbar } from "../components/DashboardNavbar";

export const HomePage = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isLoggedIn = !!token;
  const loggedInPath = role === "employer" ? "/employer/jobs/new" : "/jobs";
  const loggedInText = role === "employer" ? "Post a Job" : "Browse Jobs";

  return (
    <div className="bg-[var(--background)] min-h-screen flex flex-col">
      {/* Navbar */}
      {isLoggedIn ? <DashboardNavbar /> : <PublicNavbar />}

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div
          className="
            max-w-6xl mx-auto px-6 py-12 md:py-24
            grid grid-cols-1 md:grid-cols-2
            gap-12 items-center
          "
        >
          <div
            className="text-center md:text-left"
            data-aos="fade-right"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Ready to Build Your Next Opportunity?
            </h1>

            <p
              className="
                text-base sm:text-lg md:text-xl
                text-blue-100
                mb-8
                max-w-xl md:max-w-none
              "
            >
              Move forward with the right opportunities today. Employers can
              post jobs instantly, and candidates can explore openings and
              apply with ease.
            </p>

            <div className="flex flex-col sm:flex-row md:justify-start justify-center gap-4">
              {isLoggedIn ? (
                <NavLink
                  to={loggedInPath}
                  className="
                    bg-white
                    text-blue-600
                    px-6 py-3
                    rounded-lg
                    font-semibold
                    shadow-md
                    hover:shadow-lg
                    hover:bg-blue-50
                    active:scale-95
                    transition-all
                  "
                >
                  {loggedInText}
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/register"
                    className="
                      bg-white
                      text-blue-600
                      px-6 py-3
                      rounded-lg
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:bg-blue-50
                      active:scale-95
                      transition-all
                    "
                  >
                    Create Free Account
                  </NavLink>

                  <NavLink
                    to="/login"
                    className="
                      bg-white
                      text-blue-600
                      px-6 py-3
                      rounded-lg
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:bg-blue-50
                      active:scale-95
                      transition-all
                    "
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>

          <div
            className="flex justify-center md:justify-end"
            data-aos="fade-left"
          >
            <img
              src="/hero-illustration.svg"
              alt="Job portal illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <h2
          className="
            text-3xl
            font-bold
            text-center
            mb-12
            text-[var(--foreground)]
          "
        >
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Seekers */}
          <div
            className="
              bg-[var(--card)]
              border border-[var(--border)]
              rounded-xl
              p-6 sm:p-8
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            <h3
              className="
                text-xl
                font-semibold
                mb-3
                text-[var(--primary)]
                flex
                items-center
                gap-2
              "
            >
              <FaUserCheck />
              For Job Seekers
            </h3>

            <ul className="space-y-2 text-[var(--muted-foreground)]">
              <li>✔ Create your profile</li>
              <li>✔ Upload your resume</li>
              <li>✔ Explore job opportunities</li>
              <li>✔ Apply with ease</li>
            </ul>
          </div>

          {/* Employers */}
          <div
            className="
              bg-[var(--card)]
              border border-[var(--border)]
              rounded-xl
              p-6 sm:p-8
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            <h3
              className="
                text-xl
                font-semibold
                mb-3
                text-[var(--secondary)]
                flex
                items-center
                gap-2
              "
            >
              <FaUserTie />
              For Employers
            </h3>

            <ul className="space-y-2 text-[var(--muted-foreground)]">
              <li>✔ Create company profile</li>
              <li>✔ Post job openings</li>
              <li>✔ Review applications</li>
              <li>✔ Hire the best talent</li>
            </ul>
          </div>
        </div>
      </section>


      {/* PLATFORM FEATURES */}
      <section
        className="bg-[var(--surface)]"
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2
            className="
              text-3xl
              font-bold
              text-center
              mb-12
              text-[var(--foreground)]
            "
          >
            Platform Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Secure Authentication */}
            <div
              className="
                bg-[var(--muted-surface)]
                border border-[var(--border)]
                p-6
                rounded-xl
                text-center
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <FaShieldAlt className="text-3xl text-[var(--primary)] mx-auto mb-3" />

              <h4
                className="
                  font-semibold
                  text-lg
                  mb-2
                  text-[var(--foreground)]
                "
              >
                Secure Authentication
              </h4>

              <p
                className="
                  text-[var(--muted-foreground)]
                  text-sm
                "
              >
                JWT-based login system with role-based access control.
              </p>
            </div>

            {/* Profile Management */}
            <div
              className="
                bg-[var(--muted-surface)]
                border border-[var(--border)]
                p-6
                rounded-xl
                text-center
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <FaBriefcase className="text-3xl text-[var(--primary)] mx-auto mb-3" />

              <h4
                className="
                  font-semibold
                  text-lg
                  mb-2
                  text-[var(--foreground)]
                "
              >
                Profile Management
              </h4>

              <p
                className="
                  text-[var(--muted-foreground)]
                  text-sm
                "
              >
                Job seekers and employers can manage detailed profiles.
              </p>
            </div>

            {/* Modern UI */}
            <div
              className="
                bg-[var(--muted-surface)]
                border border-[var(--border)]
                p-6
                rounded-xl
                text-center
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              <h4
                className="
                  font-semibold
                  text-lg
                  mb-2
                  text-[var(--foreground)]
                "
              >
                Modern UI
              </h4>

              <p
                className="
                  text-[var(--muted-foreground)]
                  text-sm
                "
              >
                Clean, responsive design built with React & Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        className="bg-[var(--muted-surface)] py-12"
        data-aos="fade-up"
      >
        <div className="flex flex-col items-center px-6">
          <h2
            className="
              text-3xl
              font-bold
              text-center
              mb-8
              text-[var(--foreground)]
            "
          >
            Connecting Talent with Opportunity
          </h2>

          <p
            className="
              text-base sm:text-lg md:text-xl
              mb-8
              max-w-3xl
              text-center
              text-[var(--muted-foreground)]
            "
          >
            Thousands of job seekers and employers are already using our
            platform to find the right opportunities and talent.
          </p>
        </div>

        <div
          className="
            max-w-6xl
            mx-auto
            px-6
            grid
            grid-cols-1
            md:grid-cols-3
            gap-8
            text-center
          "
        >
          {/* Job Seekers */}
          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">
              10K+
            </h3>

            <p className="text-[var(--muted-foreground)]">
              Job Seekers
            </p>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">
              2K+
            </h3>

            <p className="text-[var(--muted-foreground)]">
              Employers
            </p>
          </div>

          {/* Jobs Posted */}
          <div>
            <h3 className="text-3xl font-bold text-[var(--primary)]">
              15K+
            </h3>

            <p className="text-[var(--muted-foreground)]">
              Jobs Posted
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
        "
        data-aos="fade-up"
      >
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          {isLoggedIn ? (
            <>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>

              <p className="text-blue-100 mb-6">
                Join today and take the next step in your career or hiring
                journey.
              </p>

              <NavLink
                to="/register"
                className="
                  inline-block
                  bg-white
                  text-blue-600
                  px-8 py-3
                  rounded-lg
                  font-semibold
                  hover:bg-blue-50
                  transition
                "
              >
                Create Free Account
              </NavLink>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>

              <p className="text-blue-100 mb-6">
                Join today and take the next step in your career or hiring
                journey.
              </p>

              <NavLink
                to="/register"
                className="
                  inline-block
                  bg-white
                  text-blue-600
                  px-8 py-3
                  rounded-lg
                  font-semibold
                  hover:bg-blue-50
                  transition
                "
              >
                Create Free Account
              </NavLink>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="
          bg-slate-950
          text-slate-400
          text-center
          py-6
          px-4
        "
      >
        <p className="text-sm text-slate-300">
          © {new Date().getFullYear()} Job Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};