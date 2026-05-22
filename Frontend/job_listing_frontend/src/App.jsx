import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { lazy, Suspense } from "react";
import { ErrorPage } from "./pages/ErrorPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import FullScreenLoader from "./components/loaders/FullScreenLoader";
import AOS from "aos";
import "aos/dist/aos.css";

const Registration = lazy(() => import("./pages/Registration").then(m => ({ default: m.Registration })));
const Login = lazy(() => import("./pages/Login").then(m => ({ default: m.Login })));
const SeekerDashboard = lazy(() => import("./pages/SeekerDashboard").then(m => ({ default: m.SeekerDashboard })));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard").then(m => ({ default: m.EmployerDashboard })));
const EmployerProfile = lazy(() => import("./pages/EmployerProfile").then(m => ({ default: m.EmployerProfile })));
const SeekerProfile = lazy(() => import("./pages/SeekerProfile").then(m => ({ default: m.SeekerProfile })));
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const CreateJob = lazy(() => import("./pages/CreateJob").then(m => ({ default: m.CreateJob })));
const MyJobs = lazy(() => import("./pages/MyJobs").then(m => ({ default: m.MyJobs })));
const EditJobs = lazy(() => import("./pages/EditJobs").then(m => ({ default: m.EditJobs })));
const JobList = lazy(() => import("./pages/JobList").then(m => ({ default: m.JobList })));
const JobDetails = lazy(() => import("./pages/JobDetails").then(m => ({ default: m.JobDetails })));
const SavedJobs = lazy(() => import("./pages/SavedJobs").then(m => ({ default: m.SavedJobs })));
const AppliedJobs = lazy(() => import("./pages/AppliedJobs").then(m => ({ default: m.AppliedJobs })));
const ApplicantsList = lazy(() => import("./pages/ApplicantsList").then(m => ({ default: m.ApplicantsList })));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LinkedinCallback from "./pages/LinkedInCallback";
import { SendEmailPage } from "./pages/SendEmailPage";
import { ResetPassword } from "./pages/ResetPassword";

AOS.init({
  duration: 800,
  once: true,
});

const Router = createBrowserRouter([

  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />
  },

  {
    path: "/register",
    element: <PublicRoute><Registration /></PublicRoute>,
    errorElement: <ErrorPage />
  },

  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
    errorElement: <ErrorPage />
  },
  
  {
    path: "/linkedin/callback",
    element: <PublicRoute><LinkedinCallback /></PublicRoute>,
    errorElement: <ErrorPage />
  },
  
  {
    path: "/sendEmail",
    element: <PublicRoute><SendEmailPage /></PublicRoute>,
    errorElement: <ErrorPage />
  },

  {
    path: "/reset-password/:token",
    element: <PublicRoute><ResetPassword /></PublicRoute>,
    errorElement: <ErrorPage />
  },  

  {
    path: "/seeker/dashboard",
    element: (
      <ProtectedRoute allowedRole="job_seeker">
        <SeekerDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/dashboard",
    element: (
      <ProtectedRoute allowedRole="employer">
        <EmployerDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/profile",
    element: (
      <ProtectedRoute allowedRole="employer">
        <EmployerProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/seeker/profile",
    element: (
      <ProtectedRoute allowedRole="job_seeker">
        <SeekerProfile />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/post-job",
    element: (
      <ProtectedRoute allowedRole="employer">
        <CreateJob />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/jobs",
    element: (
      <ProtectedRoute allowedRole="employer">
        <MyJobs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/jobs/edit/:id",
    element: (
      <ProtectedRoute allowedRole="employer">
        <EditJobs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/jobs",
    element: (
      <ProtectedRoute allowedRole="job_seeker">
        <JobList />
      </ProtectedRoute>
    )
  },

  {
    path: "/jobs/:id",
    element: <JobDetails />,
  },

  {
    path: "/saved-jobs",
    element: (
      <ProtectedRoute allowedRole="job_seeker">
        <SavedJobs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/applications",
    element: (
      <ProtectedRoute allowedRole="job_seeker">
        <AppliedJobs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employer/jobs/:jobId/applicants",
    element: (
      <ProtectedRoute allowedRole="employer">
        <ApplicantsList />
      </ProtectedRoute>
    ),
  }
])

const App = () => {

  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<FullScreenLoader />}>
        <RouterProvider router={Router}></RouterProvider>
      </Suspense>
    </QueryClientProvider>
  )
}

export default App;

// react lazy: When you run npm run build, your bundler (Vite) sees this and says: "Okay, App.jsx needs JobList, so I will physically copy and paste all the code from JobList.jsx into the main index.js file." Vite does this for every single import. It grabs the Employer Dashboard, the PDF libraries, the graphs, the forms, and mashes them all into one giant file (usually several megabytes in size). When a user visits your site, their browser gets stuck downloading and parsing this massive file before it can show anything on the screen. This causes a slow "Time to Interactive" (TTI).

// but now react lazy comes and what is does is code splitting: When Vite sees lazy(() => import(...)), it completely changes its behavior. Instead of mashing everything together, it says: "Ah! I will package JobList.jsx into its own separate tiny file (e.g., joblist-chunk.js). I won't send it to the user immediately."

// Now, when the user visits your site:

// They download a tiny, lightweight main.js file. The site loads instantly.
// They click the "Find Jobs" button.
// React realizes it needs JobList, so it reaches out to the server and says, "Hey, give me joblist-chunk.js right now!"

// Why the weird .then(m => ...) syntax?
// You might have seen React Lazy written like this online: const HomePage = lazy(() => import('./HomePage'));

// That simple syntax only works if your component uses export default HomePage;. However, you used Named Exports in your files (e.g., export const HomePage = () => {}). React's lazy function strictly requires a default export to work.

// Instead of forcing you to go into all 15 of your page files and change them to export default, we used a neat JavaScript trick! We intercept the import using .then(), grab your named export (m.HomePage), and package it into a fake default object so React accepts it perfectly.

// Why do we need suspense:
// Because JobList is now in a separate file, downloading it takes time (maybe 50 milliseconds on fast Wi-Fi, or 2 seconds on a bad 3G mobile network).

// If a user clicks "Find Jobs", React has nothing to show on the screen while it waits for joblist-chunk.js to download. If we didn't have <Suspense>, your app would crash.

// <Suspense> acts as a safety net. It tells React: "If any lazy component inside you is currently downloading, don't crash. Just show this <FullScreenLoader /> until the download finishes!"