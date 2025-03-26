import React, { useState, useEffect, Component } from "react";
import { ListAccordionProps } from "../../types";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./ListAccordion.scss";
import { Heading } from "../Heading/Heading";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { getUserData } from "../../utils/Utils";
let tre = 0;

const ListAccordion = (
  props: ListAccordionProps & {
    isOpen: boolean;
    toggleAccordion: () => void;
    pageLink?: string;
  }

) => {
  const userData = getUserData("userData");
  let IsEmployer = "";
  let IsEmployee = "";
  let sidebar = '';
  let token = "";

  try {
    if (userData !== null) {
      token = userData.Token;
      IsEmployer = userData.IsEmployer;
      IsEmployee = userData.IsEmployee;
    } else {
      //console.error("User data not found in local storage");
    }
  } catch (error) {
    //console.error("Error parsing user data:", error);
  }
  const { title, list, isOpen, toggleAccordion, pageLink } = props;
  const navigate = useNavigate();
  const [isMenuTwo, SetIsMenuTwo] = useState(true);
  const [isFunctionActive, setIsFunctionActive] = useState(true);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  // const [shouldRunEffect, setShouldRunEffect] = useState(true);
  const location = useLocation();

  const handleCollapseMenuClick = (event: any) => {
    event.preventDefault();
    const allFirstMenus = document.querySelectorAll('.firstmenu');
    allFirstMenus.forEach(firstMenu => {
      if (firstMenu.classList.contains('hide')) {
        firstMenu.classList.remove('hide');
        firstMenu.classList.add('show');
        firstMenu.classList.remove('employer');
      } else {
        if (!firstMenu.classList.contains('show')) {
          firstMenu.classList.add('show');
        } else {
          firstMenu.classList.remove('show');
          firstMenu.classList.add('hide');
        }
      }
      if (firstMenu.classList.contains('employer')) {
        firstMenu.classList.remove('show');
        firstMenu.classList.add('hide');
      }
    });
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  useEffect(() => {

    const allFirstMenus = document.querySelectorAll('.firstmenu');
    const allSecondMenus = document.querySelectorAll('.second-menu');
    if (IsEmployee === 'Y' && IsEmployer == 'Y') {
      if (location.pathname === '/cruz/employeejobs' || location.pathname === '/cruz/employeedashboard' || location.pathname === '/cruz/setupstatus' || location.pathname === '/cruz/employeejobs' || location.pathname === '/cruz/employeemymatches' || location.pathname === '/cruz/likedjobs' || location.pathname === '/cruz/dislikedjobs' || location.pathname === '/cruz/reviewemployeeprofile' || location.pathname === '/cruz/employerviewsjobs') {
        setIsMenuCollapsed(false);
        SetIsMenuTwo(true);
        allFirstMenus.forEach((element,) => {
          element.classList.add('hide');
          element.classList.remove('show');
        })
        allSecondMenus.forEach((element,) => {
          element.classList.add('show');
          element.classList.remove('hide');
        })
      } else {
        setIsMenuCollapsed(true);
        SetIsMenuTwo(false);
        allFirstMenus.forEach((element,) => {
          element.classList.add('show');
          element.classList.remove('hide');
        })
        allSecondMenus.forEach((element,) => {
          element.classList.add('hide');
          element.classList.remove('show');
        })
      }
    }
  }, [IsEmployee, IsEmployer, location]);

  useEffect(() => {
    const checkPathAndToggleMenus = () => {
      const smalllist = document.querySelectorAll('.small-list');
      const allSecondMenus = document.querySelectorAll('.second-menu');
      const hasSpecialClass = Array.from(smalllist).some(element => element.classList.contains('small-list'));
      if (hasSpecialClass) {
        SetIsMenuTwo(true);
        allSecondMenus.forEach(element => {
          element.classList.add('employee');
        });
      }
      if (IsEmployee === 'Y' && IsEmployer !== 'Y') {
        if (location.pathname === '/cruz') {
          allSecondMenus.forEach(element => {
            if (element.classList.contains('hide')) {
              element.classList.remove('hide');
              element.classList.add('employee');
              element.classList.add('d-none')
              element.classList.remove('show');
            }

          });
        }
        if (location.pathname === '/cruz/notification') {
          allSecondMenus.forEach(element => {
            if (element.classList.contains('employee')) {
              element.classList.add('d-none');
            }
            if (!element.classList.contains('employee')) {
              element.classList.remove('d-none');
              element.classList.remove('hide');
            }
          });
          SetIsMenuTwo(false);
        }
      }
      if (location.pathname === '/cruz' || location.pathname === '/cruz/notification' || location.pathname === '/cruz/EmployeeDashboard' || location.pathname === '/cruz/SetUpStatus' || location.pathname === '/cruz/EmployeeJobs' || location.pathname === '/cruz/EmployeeMymatches' || location.pathname === '/cruz/LikedJobs' || location.pathname === '/cruz/DisLikedJobs' || location.pathname === '/cruz/ReviewEmployeeProfile' || location.pathname === '/cruz/EmployerViewsJobs') {
        allSecondMenus.forEach(element => {
          element.classList.add('employee');
        });
      }
    };
    if (IsEmployee === 'Y' && IsEmployer !== 'Y') {
      checkPathAndToggleMenus();
    }
  }, [IsEmployee, location]);

  useEffect(() => {
    const checkFirstMenu = () => {
      const smalllist = document.querySelectorAll('.small-list');
      const allFirstMenus = document.querySelectorAll('.firstmenu');
      const hasSpecialClass = Array.from(smalllist).some(element => element.classList.contains('small-list'));
      if (hasSpecialClass) {
        allFirstMenus.forEach(element => {
          element.classList.add('employer');
          // element.classList.remove('hide');
        });
      }
      if (location.pathname === '/cruz' || location.pathname === '/cruz/notification' || location.pathname === '/cruz/ViewCampaign/liveCampaign' || location.pathname === '/cruz/ViewCampaign/draftCampaign' || location.pathname === '/cruz/ViewCampaign/archiveCampaign') {
        allFirstMenus.forEach(element => {
          element.classList.add('employer');
          // element.classList.remove('hide');
        });
      }
    }
    if (IsEmployer === 'Y' && IsEmployee !== 'Y') {
      checkFirstMenu();
    }
  }, [IsEmployer, IsEmployee, location])

  const handleCollapseClick = (event: any) => {
    event.preventDefault();
    const allSecondMenus = document.querySelectorAll('.second-menu');
    allSecondMenus.forEach((element, index) => {
      if (element.classList.contains('hide')) {
        element.classList.remove('hide');
        element.classList.add('show');
      } else {
        if (!element.classList.contains('show')) {
          element.classList.add('show');
        } else {
          element.classList.remove('show');
          element.classList.add('hide');
        }
      }
      if (element.classList.contains('employee')) {
        element.classList.remove('employee');
        element.classList.add('hide');
        element.classList.remove('show');
      }
      if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
        element.classList.remove('hide');
        element.classList.remove('show');
      }
    });

    SetIsMenuTwo(!isMenuTwo);
  };
  return (
    <div className="list-accordion">
      <div
        className={`list-header ${isOpen ? "open" : ""}`}
        onClick={toggleAccordion}
      >
        <Heading tag="h3">{title}</Heading>
        <span className={`icon`}>
          {!isOpen ? (
            <FontAwesomeIcon icon={faPlus} />
          ) : (
            <FontAwesomeIcon icon={faMinus} />
          )}
        </span>
      </div>
      {pageLink === "Employer" ? (
        <Button
          onClick={() => navigate("/cruz/job")}
          text="New Campaign"
          icon={true}
          theme="light"
          className="btn-menulist New-Campaign d-none"
        />
      ) : (
        ""
      )}
      <ul className={`list-items ${isOpen ? "open" : ""} ${list.length > 10 ? "long-list" : "small-list"}`}>
        {list.map((item, index) => (
          <li className="linktxt" key={index}>
            <NavLink to={item.target ? item.target : "/"} onClick={toggleAccordion} className={`${item.className}`}><span className="text-menu">{item.text}</span>
              <span className="collpasemenu" onClick={handleCollapseMenuClick}>{item.button ? (<FontAwesomeIcon icon={isMenuCollapsed ? faMinus : faPlus} />) : ("")}</span>
              <span className="collpasemenutwo" onClick={handleCollapseClick}>{item.label ? (<FontAwesomeIcon icon={isMenuTwo ? faMinus : faPlus} />) : ("")}</span>
              <span className="count" style={{ float: "right" }}>{item.count && <span className="counts">{item.count}</span>}</span></NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListAccordion;
