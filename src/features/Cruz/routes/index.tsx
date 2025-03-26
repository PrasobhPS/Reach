import { Navigate, Route, Routes } from "react-router-dom";
import { ViewCampaign } from "../pages/Employer/ViewCampaign";
import ViewProfile from "../pages/Employer/ViewProfile";
import Register from "../pages/Employer/Register";
import PostJob from "../pages/Employer/PostJob";
import MyMatches from "../pages/Employer/MyMatches";
import ReviewEmployerPost from "../pages/Employer/ReviewEmployerPost";
import ProfileSetup from "../pages/Employee/ProfilesetUp";
import Cruz from "../../../pages/Cruz/Cruz";
import Dashboard from "../pages/Employee/Dashboard";
import EmployeeMyMatches from "../pages/Employee/EmployeeMyMaches";
import ReviewEmployeeProfile from "../pages/Employee/ReviewEmployeeProfile";
import ReviewEmployerProfile from "../pages/Employer/ReviewEmployerProfile";
import EmployeeJobs from "../pages/Employee/Job";
import EmployeeMatchProfile from "../pages/Employee/EmployeeMatchProfile";
import Job from "../pages/Employer/Job";
import JobPostStatus from "../pages/Employer/JobPostStatus";
import EmployeeJobpostStatus from "../pages/Employee/EmployeeJobpostStatus";
import SetStatus from "../pages/Employee/SetStatus";
import ViewJob from "../pages/Employer/ViewJob";
import CreateProfile from "../pages/Employee/CreateProfile";
import { EmployerViewsJobs } from "../pages/Employee/EmployerViewsJobs";
import PreviewEmployee from "../pages/Employer/PreviewEmployee";
import EmployeeLikedJobs from "../pages/Employee/EmployeeLikedJobs";
import MyLikedProfile from "../pages/Employer/MyLikedProfile";
import EmployeeDisLikedJobs from "../pages/Employee/EmployeeDisLikedJobs";
import MyDislikedProfile from "../pages/Employer/MyDislikedProfile";
import Notification from "../pages/Notification/Notification";
const CruzRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<Cruz />} />
      <Route path="/matchedprofile" element={<ViewProfile />} />
      <Route path="/jobpoststatus" element={<JobPostStatus />} />
      <Route path="/employerviewsjobs" element={<EmployerViewsJobs />} />
      <Route path="/setupstatus" element={<SetStatus />} />
      <Route path="/likedjobs" element={<EmployeeLikedJobs />} />
      <Route path="/dislikedjobs" element={<EmployeeDisLikedJobs />} />
      <Route
        path="/reviewemployerprofile"
        element={<ReviewEmployerProfile />}
      />
      <Route
        path="/previewemployee"
        element={<PreviewEmployee />}
      />
      <Route
        path="/employeejobpoststatus"
        element={<EmployeeJobpostStatus />}
      />
      {/* <Route path="/ReviewEmployerPost" element={<ReviewEmployerPost />} /> */}
      <Route path="/employeedashboard" element={<Dashboard />} />
      <Route path="/employeejobs" element={<EmployeeJobs />} />
      <Route path="/employeematchprofile" element={<EmployeeMatchProfile />} />
      <Route path="/employeemymatches" element={<EmployeeMyMatches />} />
      <Route
        path="/reviewemployeeprofile"
        element={<ReviewEmployeeProfile />}
      />
      <Route path="/profilesetup" element={<ProfileSetup />} />
      <Route path="/createprofile" element={<CreateProfile />} />
      <Route path="/createprofile/:id" element={<CreateProfile />} />
      <Route path="/mymatches" element={<MyMatches />} />
      <Route path="/mylikedprofile" element={<MyLikedProfile />} />
      <Route path="/mydislikedprofile" element={<MyDislikedProfile />} />
      <Route path="/viewcampaign/:params" element={<ViewCampaign />} />
      <Route path="/register" element={<Register />} />
      <Route path="/postjob" element={<PostJob />} />
      <Route path="/job" element={<Job />} />
      <Route path="/job/:id" element={<Job />} />
      <Route path="*" element={<Navigate to="." />} />
      <Route path="/viewsinglecampaign/:id" element={<ViewJob />} />
      <Route path="/notification" element={<Notification />} />
    </Routes>
  );
};

export default CruzRoutes;
