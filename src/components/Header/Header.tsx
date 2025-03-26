import { useState, useEffect, ReactPropTypes } from "react";
import Logo from "../Logo/Logo";
import CruzLogo from "../Logo/CruzLogo";
import account from "../../assets/images/account.svg";
import "./Header.scss";
import { NavbarMenu } from "./Navbar/Navbar";
import { MobileNavbar } from "./MobileNavbar/MobileNavbar";
import { Button } from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { getUserData, clearUserData } from "../../utils/Utils";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { useAppDispatch } from "../../Hooks/hooks";
import { setCredentials } from "../../app/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import { useLogoutMutation } from "../../features/Login/authApiSlice";
import { auth } from "../GoogleAuth/GoogleAuth";
import { signOut } from "firebase/auth";
interface HeaderProps {
  [key: string]: any;
}
interface UserData {
  Member_fullname: string;
  Member_type: string;
  Token: string;
  members_profile_picture: string;
  token_type?: string;
}
interface Timer {
  id: NodeJS.Timeout | number;
}

function Header({ ...args }: HeaderProps) {
  const { state } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { socket, joinChat, leaveChat, isConnected, setShowChatList, setPrivateChatMember, setIsChatVisible } = useSocket();
  const [messageNotificationCount, setMessageNotificationCount] = useState<number>(0);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (socket?.connected) {
      socket.on('unreadMessageCount', (count: number) => {
        setMessageNotificationCount(count);
      });
    }

    return () => {
      socket?.off('unreadMessageCount');
    };
  }, [isConnected]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [hasAnnouncementMemberBar, setHasAnnouncementMemberBar] = useState(false);
  useEffect(() => {
    const announcementMemberBar = document.querySelector('.announcement-member-bar');
    if (announcementMemberBar) {
      setHasAnnouncementMemberBar(true);
    } else {
      setHasAnnouncementMemberBar(false);
    }
  },);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 0;
      if (scrollTop > scrollThreshold && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop <= scrollThreshold && isScrolled) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);
  const { showModal } = useGlobalModalContext();
  const [enableLogin, setEnableLogin] = useState(true);
  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find(row => row.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };
  const [hasCookies, setHasCookies] = useState(false);
  useEffect(() => {
    const cookieValue = getCookie("CookieConsent");
    setHasCookies(!!cookieValue); // Convert to boolean

  }, [document.cookie]);
  const authModal = () => {
    // if (hasCookies) {
    showModal(MODAL_TYPES.AUTH_MODAL, {
      title: "Sign In / Sign Up",
      confirmBtn: "Save",
    });
    // }
  };
  if (state?.login) authModal();
  const userData: UserData | null = getUserData("userData");
  let loggedIn = "";
  let loggedOut = "";
  let fullName = "";
  let Member_type = "";
  let Token = "";
  let profilePic = "";
  if (userData != null) {
    loggedIn = "d-none";
    fullName = userData.Member_fullname;
    Member_type = userData.Member_type;
    Token = userData.Token;
    profilePic = userData.members_profile_picture;
  } else loggedOut = "d-none";
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const users = userData;
    dispatch(setCredentials({ users, Token }));
    joinChat();
  }, [userData?.Token]);

  useEffect(() => {
    if (!userData?.Token) {
      setShowChatList(false);
      setPrivateChatMember(undefined);
      setIsChatVisible(false);
      leaveChat();
      // navigate('/');
    }
  }, [userData]);

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (userData?.token_type === 'google') {
        try {
          await signOut(auth);
          //console.log("User signed out from Firebase");
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      }
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

  // const resetTimer = () => {
  //   if (logoutTimer) {
  //     clearTimeout(logoutTimer);
  //   }
  //   const timer = setTimeout(() => {
  //     handleLogout();
  //   }, 60 * 60 * 1000);
  //   setLogoutTimer(timer);
  // };

  // useEffect(() => {
  //   const events = ["mousemove", "keydown", "mousedown", "touchstart"]; // Add other relevant events
  //   const resetTimerOnUserActivity = () => {
  //     resetTimer();
  //   };

  //   events.forEach((event) => {
  //     document.addEventListener(event, resetTimerOnUserActivity);
  //   });

  //   resetTimer();
  //   const urlParams = window.location.href;
  //   const bridgeParam = urlParams.split("?")[1];
  //   return () => {
  //     events.forEach((event) => {
  //       document.removeEventListener(event, resetTimerOnUserActivity);
  //     });
  //   };
  // }, []);
  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""} ${Member_type === 'M' ? "fullHeader" : ""} ${hasAnnouncementMemberBar ? 'unlogheader' : 'LoginHeader'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {Member_type ? (
        Member_type !== 'M' ? (
          <div className="announcement-member-bar">
            {/* <a href="#">SUMMER OFFER : UPGRADE TO PAID MEMBERSHIP FOR ONLY £160</a> */}
          </div>
        ) : (
          ""
        )
      ) : (
        <div className="announcement-member-bar"></div>
      )}



      <div className="container header-container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="mobile-toggle">
            <button
              className="nav-toggler"
              onClick={() => {
                document
                  .getElementsByTagName("body")[0]
                  .classList.add("mobilenav-open");
              }}
            >
              {/* <span className='first-line'></span>
              <span className='second-line'></span> */}
              <div className="icon-toggle">
                <svg
                  width="26"
                  height="9"
                  viewBox="0 0 26 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line y1="0.5" x2="25.2212" y2="0.5" stroke="white"></line>
                  <line y1="8.5" x2="25.2212" y2="8.5" stroke="white"></line>
                </svg>
              </div>
            </button>
          </div>
          <div className="header-logo">
            {pathname.includes('cruz') ? (
              <CruzLogo />
            ) : (
              <Logo />
            )}
          </div>
          <div className="nav-menu">
            <MobileNavbar />
            <NavbarMenu />
          </div>
          <div className="Sign-actions">
            <div className="sign-up-button d-flex align-items-center">
              <Button
                onClick={() => authModal()}
                text="Join / Login"
                icon={true}
                theme="light"
                className={`sign-up  ${loggedIn}`}
              />
              {/* <Button
                onClick={() => authModal()}
                text="Sign In / Up"
                icon={false}
                theme="light"
                className={`sign-up signin-and-up d-md-none d-sm-block  ${loggedIn}`}
              /> */}
              {(Token && isConnected) ?
                <div
                  className="message-notification"
                  onClick={() => { setShowChatList(true); setPrivateChatMember(undefined); setIsChatVisible(false) }}
                >
                  {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                  <img src={require("../../assets/images/header/message.png")} alt="" />
                  <span className={messageNotificationCount > 0 ? "notification" : "d-none"}>{messageNotificationCount}</span>
                </div>
                : ""
              }
              <Dropdown
                className={`user-dropdown ${loggedOut}`}
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                direction={"down"}
              >
                <DropdownToggle caret>
                  <div className="user-action">
                    {!profilePic ? (
                      <img src={account} alt="" className="img-fluid" />
                    ) : (
                      <div className="profile-icone">
                        <img src={profilePic} alt="" />
                      </div>
                    )}
                  </div>
                  <span className="user-name">{fullName}</span>
                </DropdownToggle>
                <DropdownMenu {...args}>
                  <DropdownItem>
                    <div className="user-action" onClick={() => navigate('/profile')}>
                      <img src={account} alt="" className="img-fluid" />
                    </div>
                    <a className="navlink" onClick={() => navigate('/profile')} >
                      Profile
                    </a>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    <div onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </div>
                    <a className="navlink" onClick={handleLogout}>
                      Sign Out
                    </a>
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>
              {/* <Modal
                isOpen={modal}
                toggle={toggle}
                centered
                className="login-modal"
              >
                <ModalBody>
                  <ModalHeader toggle={toggle}></ModalHeader>
                  {showRegister ? (
                    <Register
                      onSignInClick={handleSignInClick}
                      toggleModal={toggle}
                    />
                  ) : (
                    <Login
                      onSignUpClick={handleSignUpClick}
                      toggleModal={toggle}
                    />
                  )}
                </ModalBody>
              </Modal> */}
              {/* <AuthModal /> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
