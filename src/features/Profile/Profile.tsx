import React, { useEffect, useState, ChangeEvent } from "react";
import { Hero } from "../../components/Hero/Hero";
import { Heading } from "../../components/Heading/Heading";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import "./Components/Profile.scss";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { EditProfile } from "./Components/EditProfile";
import { useProfileMutation, useStatusUpdateMutation } from "./profileApiSlice";
import { getUserData, setUserData } from "../../utils/Utils";
import { ProfileData, initialProfileData } from "../../types/ProfileData";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { Button } from "../../components/Button/Button";
import { MyBookings } from "./Components/MyBookings";
import { Settings } from "./Components/Settings";
import Transaction from "./Transaction";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MyReferrals } from "./MyReferrals";
import Subscription from "./Subscription";
import { useMembershipFeeQuery } from "../Login/authApiSlice";
import { useLocation } from "react-router-dom";
import axios from "axios";
interface UserData {
  Member_fullname: string;
  Member_type: string;
  Token: string;
  members_profile_picture: string;
  Member_id: string;
  IsEmployer: string;
  IsEmployee: string;
  is_specialist: string;
  currency?: string;
}

function Profile() {
  const [statusUpdateMutation] = useStatusUpdateMutation();
  const [memberShipFee, setMemberShipFee] = useState(0);
  const [yearlyFee, setYearlyFee] = useState(0);
  const getMemberShipFee = useMembershipFeeQuery({});
  const location = useLocation();
  const {
    mainTab = '',
    tabActive = '',
  } = location.state || {};
  const userData: UserData | null = getUserData("userData");
  useEffect(() => {
    if (userData?.currency === 'USD') {
      setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee_dollar);
      setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee_dollar);
    } else if (userData?.currency === 'EUR') {
      setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee_euro);
      setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee_euro);
    } else {
      setMemberShipFee(getMemberShipFee?.data?.data.monthly_membership_fee);
      setYearlyFee(getMemberShipFee?.data?.data.full_membership_fee);
    }
  }, [getMemberShipFee?.data?.data])
  const handleSwitchToggle = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    let status = "";
    if (checked) {
      status = "A";
    } else {
      status = "I";
    }
    setProfileData((prevData) => ({
      ...prevData,
      displayStatus: {
        ...prevData.displayStatus,
        [name]: status,
      },
    }));

    const updateData = {
      field_name: name,
      field_status: status,
    };
    const userData = await statusUpdateMutation(updateData);
    if ("error" in userData) {
      console.error("Error logging in:", userData.error);
    } else {
      // console.log(userData.data.success, "user");
      fetchData();
    }
  };

  const { showModal } = useGlobalModalContext();

  const [activeTab, setActiveTab] = useState("MyProfile");
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    //console.log(tabName);
  };
  useEffect(() => {
    // Check if state contains mainTab or tabActive
    if (location.state && location.state.mainTab) {
      setActiveTab(location.state.mainTab);
    }
  }, [location.state])
  const handleSubmit = () => {
    console.log("");
  }
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
    fetchData();
  };

  const [profileMutation] = useProfileMutation();
  const [profileData, setProfileData] =
    useState<ProfileData>(initialProfileData);
  let token = "";
  let is_specialist = "";
  let memberType = "";
  try {
    if (userData !== null) {
      token = userData.Token;
      is_specialist = userData.is_specialist;
      memberType = userData.Member_type;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  useEffect(() => {
    // console.log(token, "token");

    if (token) fetchData();
  }, []);

  useEffect(() => {
    // console.log(token, "token");

    if (mainTab) {
      setActiveTab(mainTab);
    }
  }, [mainTab]);

  const fetchData = async () => {
    try {
      const response = await profileMutation(token);
      if ("error" in response) {
        console.error("Error logging in:", response.error);
      } else {
        setProfileData(response.data.data);
        if (userData != null) {
          userData.members_profile_picture =
            response.data.data.members_profile_picture;
          setUserData(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error (e.g., display error message to the user)
    }
  };
  // console.log(profileData.members_dob, "profileData");
  let originalDate = "0000-00-00";
  if (profileData.members_dob) originalDate = profileData.members_dob;
  const [year, month, day] = originalDate.split("-");
  const dateObject = new Date(`${year}-${month}-${day}`);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateOfBirth = `${dateObject.getDate()} ${months[dateObject.getMonth()]
    } ${dateObject.getFullYear()}`;

  const [buttonCopied, setbuttonCopied] = useState<"dark" | "light" | "grey">('light');
  const [urlCopied, seturlCopied] = useState<"dark" | "light" | "grey">('light');
  const [buttonDisable, setbuttonDisable] = useState<boolean>(false);
  const [urlDisable, seturlDisable] = useState<boolean>(false);
  const handleCopyClick = (couponCode: string | undefined, from: string) => {
    if (!couponCode) {
      console.error("Coupon code is empty");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(couponCode)
        .then(() => {
          if (from === 'url') {
            seturlCopied('grey');
            seturlDisable(true);
            setbuttonCopied('light');
            setbuttonDisable(false);
          } else {
            setbuttonCopied('grey');
            setbuttonDisable(true);
            seturlCopied('light');
            seturlDisable(false);
          }

        })
        .catch((error) => {
          console.error("Failed to copy text to clipboard:", error);
        });
    } else {
      console.error("Clipboard API not available");
      fallbackCopyTextToClipboard(couponCode, from);
    }
  };

  const fallbackCopyTextToClipboard = (text: string, from: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      if (from === 'url') {
        seturlCopied('grey');
        seturlDisable(true);
        setbuttonCopied('light');
        setbuttonDisable(false);
      } else {
        setbuttonCopied('grey');
        setbuttonDisable(true);
        seturlCopied('light');
        seturlDisable(false);
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }
    document.body.removeChild(textArea);
  };
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    centerPadding: "10px",
    variableWidth: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false,
          infinite: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          centerPadding: "10px",
          variableWidth: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const fullFeatures = [
    'Full access to the entire site and content',
    'Discounts with Selected Partners',
    'Book calls with boating experts',
    'Browse and accept jobs on CRUZ',
  ];
  const freeFeatures = [
    'Free for Life',
    'Access to Weather Reporting',
    'Access to Club House (Chat)',
    'Monthly Email Newsletter',
    'Access to selected online events',
    'Post Job Opportunities within CRUZ',
  ];

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const downloadPdf = async () => {
    try {
      axios.get(`${baseUrl}/member/generatePdf`, {
        responseType: 'blob', // Specify that the response should be a Blob
        headers: {
          "X-API-KEY": "493d25ea-24d9-4662-ae7b-c96255ecbbe6",
          "Authorization": `Bearer ${token}`
        }
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'membershipcard.pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  return (
    <div className="App">
      <div className="profile-page-content">
        <Hero
          source={require("../../assets/images/profile/banner-1.jpeg")}
          title={profileData.members_fname + " " + profileData.members_lname}
        >
          <div className="inner-child" style={{ textAlign: "center" }}>
            <div className="row w-100"></div>
          </div>

          <div className="tab-menu tabmenu-slider">
            <ul className="tab-menu-ul d-block">
              <Slider {...settings}>

                <div className="tab-menu-item">
                  <a
                    className={activeTab === "MyProfile" ? "active" : ""}
                    onClick={() => handleTabClick("MyProfile")}
                  >
                    My Profile
                  </a>
                </div>
                <div className="tab-menu-item">
                  <a
                    className={activeTab === "MyBookings" ? "active" : ""}
                    onClick={() => handleTabClick("MyBookings")}
                  >
                    My Bookings
                    {/* {is_specialist === "Y" ? "Bookings" : "My Bookings"} */}
                  </a>
                </div>
                {memberType === 'M' ? (
                  <div className="tab-menu-item">
                    <a
                      className={activeTab === "MyRefferals" ? "active" : ""}
                      onClick={() => handleTabClick("MyRefferals")}
                    >
                      My Referral
                    </a>
                  </div>
                ) : ""}


                <div className="tab-menu-item">
                  <a
                    className={activeTab === "Settings" ? "active" : ""}
                    onClick={() => handleTabClick("Settings")}
                  >
                    Settings
                  </a>
                </div>

                <div className="tab-menu-item">
                  <a
                    className={activeTab === "Subscription" ? "active" : ""}
                    onClick={() => handleTabClick("Subscription")}
                  >
                    Subscription
                  </a>
                </div>
                <div className="tab-menu-item">
                  <a
                    className={activeTab === "Transaction" ? "active" : ""}
                    onClick={() => handleTabClick("Transaction")}
                  >
                    Payments
                  </a>
                </div>
              </Slider>
            </ul>
          </div>
        </Hero>

        {
          activeTab === 'MyProfile' &&
          <div className="container profile-div" id="MyProfile">
            <div className="profile-image-container">
              {profileData.members_profile_picture ? (
                <img
                  src={profileData.members_profile_picture}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <img
                  src={require("../../assets/images/profile/Default.jpg")}
                  alt="Profile"
                  className="profile-image"
                />
              )}
            </div>
            <div className="profile-text">
              <p>{profileData.members_biography}</p>
            </div>
            <div className="row w-100 mx-0">
              <div className="col-md-12 col-12 py-2 profile-parent" style={{ maxWidth: '700px', margin: 'auto', display: 'block' }}>
                <div className="profile-action">
                  <Heading tag="h3" className="profile-heading">
                    Profile Information
                  </Heading>
                  <a
                    onClick={toggle}
                    style={{
                      color: "#FFF",
                      cursor: "pointer",
                      borderBottom: "1px solid",
                    }}
                  >
                    Edit Profile
                  </a>


                </div>

                <div className="display-text">
                  <p>Display on public profile?</p>
                </div>
                <div className="list-details">
                  <div className="row w-100">
                    <div className="list" style={{ paddingRight: '0px' }}>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Full Name</span>
                        </div>
                        <div className="data-list">
                          <span>
                            {profileData.members_fname +
                              " " +
                              profileData.members_lname}
                          </span>
                        </div>

                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Email Address</span>
                        </div>
                        <div className="data-list">
                          <span>
                            {profileData.members_email}
                          </span>
                        </div>
                        <div className="swicthaction">
                          <FormGroup switch>
                            <Input
                              type="switch"
                              checked={
                                profileData.displayStatus.members_email === "A"
                              }
                              name="members_email"
                              onChange={handleSwitchToggle}
                              id="switchEmail"
                            />
                            <Label htmlFor="switchEmail"></Label>
                          </FormGroup>
                        </div>
                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Phone</span>
                        </div>
                        <div className="data-list">
                          <span>
                            {profileData.members_phone !== null && (
                              <a
                                href={`tel:${profileData.members_dial_code}${profileData.members_phone}`}
                                className="tel-text"
                              >

                                {
                                  profileData.members_dial_code +
                                  " - " +
                                  profileData.members_phone
                                }


                              </a>
                            )}
                          </span>
                        </div>
                        <div className="swicthaction">
                          <FormGroup switch>
                            <Input
                              type="switch"
                              checked={
                                profileData.displayStatus.members_phone === "A"
                              }
                              name="members_phone"
                              onChange={handleSwitchToggle}
                              id="switchPhone"
                            />
                            <Label htmlFor="switchPhone"></Label>
                          </FormGroup>
                        </div>
                      </div>

                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Address</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_address}</span>
                        </div>
                        <div className="swicthaction">
                          <FormGroup switch>
                            <Input
                              type="switch"
                              checked={
                                profileData.displayStatus.members_address === "A"
                              }
                              name="members_address"
                              onChange={handleSwitchToggle}
                              id="switchAddress"
                            />
                            <Label htmlFor="switchAddress"></Label>
                          </FormGroup>
                        </div>
                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Town</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_town}  </span>
                        </div>
                        <div className="swicthaction"></div>
                      </div>


                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Region / County</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_region}</span>
                        </div>

                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Postcode</span>
                        </div>
                        <div className="data-list">
                          <span>{profileData.members_postcode}</span>
                        </div>
                        <div className="swicthaction"></div>
                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Country</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_country}</span>
                        </div>

                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Current Employment</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_employment}</span>
                        </div>
                        <div className="swicthaction"></div>
                      </div>
                      <div className="list-details-data EmploymentHistory">
                        <div className="headerName">
                          <span>Employment History</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_employment_history}</span>
                        </div>
                        <div className="swicthaction"></div>
                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>About Me</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_biography}</span>
                        </div>

                      </div>
                      <div className="list-details-data">
                        <div className="headerName">
                          <span>Interests</span>
                        </div>
                        <div className="data-list">
                          <span className="capitalize-first-letter">{profileData.members_interest}</span>
                        </div>

                      </div>


                    </div>
                  </div>
                </div>
              </div>

              <div className="downloadpdf-section">
                <Button
                  onClick={downloadPdf}
                  text="DOWNLOAD MEMBERSHIP CARD"
                  icon={true}
                  theme="light"
                />

              </div>

            </div>
          </div>
        }
        <div className="profile-box">
          <div className="profile-box-inner">
            <Modal
              isOpen={modal}
              toggle={toggle}
              centered
              className="Profilebox-modal"
            >
              <ModalBody>
                <ModalHeader toggle={toggle}>
                  <Heading tag="h3" className="text-center">
                    Edit Profile
                  </Heading>
                </ModalHeader>
                <EditProfile profileData={profileData} toggle={toggle} />
              </ModalBody>
            </Modal>
          </div>
        </div>
        {
          activeTab === 'MyBookings' &&
          <div className="mybooking-tabs" id="mybooking">
            <MyBookings tabActive={tabActive} />
          </div>
        }
        {
          activeTab === 'Settings' &&
          <div className="mybooking-tabs" id="settings">
            <Settings />
          </div>
        }
        {activeTab === 'MyRefferals' &&
          <div className="MyRefferals px-2" id="MyRefferals">
            <MyReferrals />
          </div>
        }
        {activeTab === 'Subscription' &&
          <div className="Subscription px-2" id="Subscription">
            <Subscription heading={"Free Membership"} membershipExpire={profileData.members_subscription_end_date} discountAmount={profileData.discount_amount} keyFeatures={fullFeatures} membershipFee={memberShipFee} yearlyFee={yearlyFee} subscriptionPlan={profileData.members_subscription_plan} memberType={memberType} referral_code={profileData.referral_code} />
          </div>
        }
        {activeTab === 'Transaction' &&
          <div className="Transaction">
            <Transaction />
          </div>
        }
      </div>
    </div>
  );
}

export default Profile;
