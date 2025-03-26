import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { CruzLayoutProps } from "../../types";
import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "../../features/Cruz/components/Sidebar/Sidebar";
import "../../assets/scss/cruz.scss";
import { useLocation } from "react-router-dom";
import { getUserData } from "../../utils/Utils";
import { useGetDashboardCountQuery } from "../../features/Cruz/Api/CruzMainApiSlice";
import { useSocket } from "../../contexts/SocketContext";

type MenuItem = {
  text: string;
  target: string;
  className: string;
  count?: number;
  button?: boolean;
  label?: boolean;
};
export const CruzLayout = (props: CruzLayoutProps) => {
  const { socket, cruzPendingMsgCount, setCruzPendingMsgCount } = useSocket();
  const userData = getUserData("userData");
  let IsEmployer = "";
  let IsEmployee = "";
  let token = "";
  try {
    if (userData !== null) {
      token = userData.Token;
      IsEmployer = userData.IsEmployer;
      IsEmployee = userData.IsEmployee;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  let sidebar = '';
  if (IsEmployer === 'Y' && IsEmployee === 'Y') {
    sidebar = 'both';
  } else if (IsEmployer === 'Y') {
    sidebar = 'Employer';
  } else if (IsEmployee === 'Y') {
    sidebar = 'Employee';
  }
  const location = useLocation();
  let CruzMenu: MenuItem[] = [];
  const { data, error, isLoading, isSuccess } = useGetDashboardCountQuery({}, { skip: !token });
  const allCounts = data?.data || [];


  if (sidebar !== '') {

    if (sidebar === "Employee") {
      CruzMenu = [
        {
          text: "INTERVIEWS/MESSAGES",
          target: "/cruz/notification",
          className: "link Notification",
          count: allCounts['notification_count'] + cruzPendingMsgCount
        },
        {
          text: "FIND A JOB",
          target: "#",
          className: "personal-caption",
          label: true,
        },
        {
          text: "Dashboard",
          target: "/cruz/employeedashboard",
          className: "second-menu"
        },
        {
          text: "Set Status",
          target: "/cruz/setupstatus",
          className: "second-menu"
        },
        {
          text: "View Available Jobs",
          target: "/cruz/employeejobs",
          className: "link second-menu",
          count: allCounts['available_jobs'],
        },
        {
          text: "My Matches",
          target: "/cruz/employeemymatches",
          className: "link second-menu",
          count: allCounts['my_matches'],
        },
        {
          text: "Liked Jobs",
          target: "/cruz/likedjobs",
          className: "link second-menu",
          count: allCounts['liked_jobs'],
        },
        {
          text: "Disliked Jobs",
          target: "/cruz/dislikedjobs",
          className: "link second-menu",
          count: allCounts['disliked_jobs'],
        },
        {
          text: "Manage Profile",
          target: "/cruz/reviewemployeeprofile",
          className: "second-menu"
        },
      ];
    } else if (sidebar === "Employer") {
      CruzMenu = [
        {
          text: "INTERVIEWS/MESSAGES",
          target: "/cruz/notification",
          className: "link Notification",
          count: allCounts['notification_count'] + cruzPendingMsgCount
        },
        {
          text: "FIND CREW",
          target: "#",
          className: "BUSINESS-caption",
          button: true,
          // button: {
          //   text: "Add Business",
          //   onClick: () => {
          //     console.log("Add Business button clicked");
          //   }
          // }
        },
        {
          text: "New Campaign",
          target: "/cruz/job",
          className: "NewCampaign newCampaign-business firstmenu"
        },
        {
          text: "Live Campaigns",
          target: "/cruz/viewcampaign/livecampaign",
          className: "link firstmenu",
          count: allCounts['live_campaigns'],
        },
        {
          text: "Draft Campaigns",
          target: "/cruz/viewcampaign/draftcampaign",
          className: "link firstmenu",
          count: allCounts['draft_campaigns'],
        },
        {
          text: "Campaign Archive",
          target: "/cruz/viewcampaign/archivecampaign",
          className: "link firstmenu",
          count: allCounts['archive_campaigns'],
        },
      ];

    } else {
      CruzMenu = [
        {
          text: "INTERVIEWS/MESSAGES",
          target: "/cruz/notification",
          className: "link Notification",
          count: allCounts['notification_count'] + cruzPendingMsgCount
        },
        {
          text: "FIND CREW",
          target: "#",
          className: "BUSINESS-caption ",
          button: true,
          label: false,
          // button: {
          //   text: "Add Business",
          //   onClick: () => {
          //     console.log("Add Business button clicked");
          //   }
          // }
        },
        {
          text: "New Campaign",
          target: "/cruz/job",
          className: "NewCampaign newcampaign-menuoption firstmenu"
        },
        {
          text: "New Campaign",
          target: "/cruz/job",
          className: "NewCampaign new-campaignbox firstmenu"
        },
        {
          text: "Live Campaigns",
          target: "/cruz/viewcampaign/livecampaign",
          className: "link firstmenu",
          count: allCounts['live_campaigns'],
        },
        {
          text: "Draft Campaigns",
          target: "/cruz/viewcampaign/draftcampaign",
          className: "link firstmenu",
          count: allCounts['draft_campaigns'],
        },
        {
          text: "Campaign Archive",
          target: "/cruz/viewcampaign/archivecampaign",
          className: "link firstmenu",
          count: allCounts['archive_campaigns'],
        },
        {
          text: "FIND A JOB",
          target: "#",
          className: "personal-caption",
          button: false,
          label: true,
        },

        {
          text: "Dashboard",
          target: "/cruz/employeedashboard",
          className: "second-menu"
        },
        {
          text: "Set Status",
          target: "/cruz/setupstatus",
          className: "second-menu"
        },
        {
          text: "View Available Jobs",
          target: "/cruz/employeejobs",
          className: "link second-menu",
          count: allCounts['available_jobs'],
        },
        {
          text: "My Matches",
          target: "/cruz/employeemymatches",
          className: "link second-menu",
          count: allCounts['my_matches'],
        },
        {
          text: "Liked Jobs",
          target: "/cruz/likedjobs",
          className: "link second-menu",
          count: allCounts['liked_jobs'],
        },
        {
          text: "Disliked Jobs",
          target: "/cruz/dislikedjobs",
          className: "link second-menu",
          count: allCounts['disliked_jobs'],
        },
        {
          text: "Manage Profile",
          target: "/cruz/reviewemployeeprofile",
          className: "second-menu"
        },

      ];
    }
  }

  // console.log(location.pathname);
  return (
    <>
      <div className="cruz-contents">
        <div className="container-fluid">
          <div className="row">
            {CruzMenu.length > 0 ? (
              <div className="col-xl-3 col-md-4 col-12 cruz-custom">

                <Sidebar CruzMenu={CruzMenu} pageLink={props.link} />
              </div>
            ) : ""}
            <div className={`col-xl-9 col-md-8 col-12 cruz-layoutChild-section ${CruzMenu.length > 0 ? 'cruz-customdesign' : 'cruz-emptyMenu'}`}>
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
