import "./MobileNavbar.scss";
import Logo from "../../Logo/Logo";
import { NavLink } from "react-router-dom";
import { Button } from "../../Button/Button";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserData, clearUserData } from "../../../utils/Utils";
import { useLogoutMutation } from "../../../features/Login/authApiSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalModalContext, MODAL_TYPES } from "../../../utils/GlobalModal";
import { useSocket } from "../../../contexts/SocketContext";
export const MobileNavbar = () => {
  const { hideModal } = useGlobalModalContext();
  const userData = getUserData('userData');
  let Token = "";
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();
  const { leaveChat } = useSocket();
  const handleLogout = async () => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("mobilenav-open");
    try {
      const response = await logoutMutation({ token: Token });
      if ("error" in response) {
        console.error("Error logging out:", response.error);
      } else {
        clearUserData();
        window.location.replace("/");
      }
      leaveChat();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const { showModal } = useGlobalModalContext();
  const authModal = (e: React.MouseEvent<HTMLElement>) => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("mobilenav-open");
    e.preventDefault();
    showModal(MODAL_TYPES.AUTH_MODAL, {
      title: "Sign In / Sign Up",
      confirmBtn: "Save",
    });
  };
  const GotoProfile = () => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("mobilenav-open");
    navigate("/profile");
  }
  const memberModal = (e: React.MouseEvent<HTMLElement>) => {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("mobilenav-open");
    e.preventDefault();
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };
  return (
    <div className="mobile-menu">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center  header-parent-content">
          <div className="close-icon">
            <a
              className="icon"
              onClick={() => {
                document
                  .getElementsByTagName("body")[0]
                  .classList.remove("mobilenav-open");
              }}
            >
              <svg
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z"
                  fill="#ffffff"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
                  fill="#ffffff"
                ></path>
              </svg>
            </a>
          </div>
          <div className="logo-content">
            <Logo />
          </div>
          <div></div>
        </div>
        <div className="menu-items">
          <Navbar className="navbar-menu navbar-sm-menu">
            <Nav className="me-auto" navbar>

              <NavItem>
                <NavLink to="/partners" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>Partners</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/chandlery" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>Chandlery</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/experts" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>Experts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/club-house" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>ClubHouse</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/charter" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>Charter</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/Weather" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>Weather</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/cruz" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>CRUZ</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <div className="menu-footer-section">
          {!userData?.Token ? (
            <div className="sigin-before d-flex align-items-center justify-content-between pt-40">
              <div className="sign-actions">
                <Button
                  onClick={(e) => memberModal(e)}
                  text="Sign Up"
                  icon={true}
                  theme="light"
                />
              </div>
              <div className="Member-Sign-In">
                <a className="text-link" href="#" onClick={(e) => authModal(e)}>
                  Member Login
                </a>
              </div>
            </div>
          ) : (
            <div className="sign-after ">
              <div className="sign-details">
                <div className="profile-icon">
                  <img src={userData?.members_profile_picture} alt="" className="img-fluid" />
                </div>
                <div className="profile-details">
                  <h5 className="customHeading" onClick={() => GotoProfile()} >{userData?.Member_fullname}</h5>
                  <div className="d-block mb-3">
                    <div className="link">
                      <a className="pagelink" href="/profile" onClick={() => { document.getElementsByTagName("body")[0].classList.remove("mobilenav-open"); }}>My Account</a>
                    </div>
                  </div>
                  <div className="d-block second-block">
                    <div className="link">
                      <a className="pagelink" onClick={handleLogout}>Logout</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
