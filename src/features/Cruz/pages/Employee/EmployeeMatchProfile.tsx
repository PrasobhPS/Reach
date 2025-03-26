import { useState } from "react";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/cruz.scss";
import { Button } from "../../../../components/Button/Button";
import { Modal, ModalBody } from "reactstrap";
import { CustomSlider } from "../../../../components/CustomSlider/CustomSlider";
import { useLocation } from "react-router-dom";
export const EmployeeMatchProfile = () => {
  // const location = useLocation();
  // const { job_id, employee_ids } = location.state;
  // console.log(job_id, employee_ids);
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);

  const toggleModal1 = () => {
    setModal1Open(!modal1Open);
  };
  const toggleModal2 = () => {
    setModal2Open(!modal2Open);
  };
  const slides = [
    {
      image: require("../../../../assets/images/partners/banner-1.png"),
      alt: "Image 1",
    },
    {
      image: require("../../../../assets/images/partners/banner-1.png"),
      alt: "Image 2",
    },
    {
      image: require("../../../../assets/images/partners/banner-1.png"),
      alt: "Image 2",
    },
  ];
  const slidesettings = {
    slidesToShow: 3,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerPadding: "10%",
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="employee-profile-parent">
      {/* <div className="container-fluid">
        <div className="page-path">
          <div className="parent-direction">
            <label>Campaign</label>
          </div>
          <span className="direction-arrow">
            <FontAwesomeIcon icon={faAngleRight} />
          </span>
          <div className="child-direction">
            <label>Deck Hand for Two Months in the Carribbean</label>
          </div>
        </div>
      </div>
      <CruzLayout link="Employer">
        <div className="profile-section col-lg-8">
          <div className="view-profile-section">
            <div className="profile-box">
              <div className="profile-box-header">
                <div className="profile-name">
                  <h1 className="customHeading">Chief Stewardess</h1>
                </div>
              </div>
              <div className="profile-box-body">
                <ul className="quick-details">
                  <li>25m Sailing Yacht</li>
                  <li>Permanent</li>
                  <li>Caribbean</li>
                </ul>
                <CustomSlider settings={slidesettings} items={slides} />
                <div className="employer-custom-card">
                  <div className="employer-custom-card-title">
                    <h1 className="customHeading">THE ROLE</h1>
                  </div>
                  <div className="employer-custom-card-body">
                    <div className="item-box">
                      <label>Job Title :</label>
                      <span>Deck hand</span>
                    </div>
                    <div className="item-box">
                      <label>Charter / Private :</label>
                      <span>Private</span>
                    </div>
                    <div className="item-box">
                      <label>Duration :</label>
                      <span>Permanent</span>
                    </div>
                    <div className="item-box">
                      <label>Start Date:</label>
                      <span>18 March 2024</span>
                    </div>
                  </div>
                </div>
                <div className="employer-custom-card">
                  <div className="employer-custom-card-title">
                    <h1 className="customHeading">THE BOAT</h1>
                  </div>
                  <div className="employer-custom-card-body">
                    <div className="item-box">
                      <label>Vessel :</label>
                      <span>17ft Classic Whaler</span>
                    </div>
                    <div className="item-box">
                      <label>Location :</label>
                      <span>Mauritius</span>
                    </div>
                    <div className="item-box">
                      <label>Motor / Sail: </label>
                      <span>Sail</span>
                    </div>
                    <div className="item-box">
                      <label>Size:</label>
                      <span>25M Sailing Yacht</span>
                    </div>
                  </div>
                </div>
                <div className="employer-custom-card">
                  <div className="employer-custom-card-title">
                    <h1 className="customHeading">summary</h1>
                  </div>
                  <div className="employer-custom-card-body">
                    <p className="para">
                      The current system is categorically floored whereby vast
                      amounts of money is spent by yacht owners and management
                      companies for a service that is largely for show and adds
                      almost no value to the yachting ecosystem.
                    </p>
                    <p className="para">
                      Cruz will strip out what the employers need and give them
                      even more, while making it a simple, fast, and fun
                      experience for employers and crew alike.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="layout-action col-lg-4">
          <div className="views">
            <p>Viewing job 1 of 16</p>
          </div>
          <div className="action-options">
            <a href="#">
              <img
                src={require("../../../../assets/images/cruz/close-icon.png")}
                alt=""
                className="img-fluid"
              />
            </a>
            <a href="#" onClick={toggleModal2}>
              <img
                src={require("../../../../assets/images/cruz/direction.png")}
                alt=""
                className="img-fluid"
              />
            </a>
            <a href="#" onClick={toggleModal1}>
              <img
                src={require("../../../../assets/images/cruz/Tick.png")}
                alt=""
                className="img-fluid"
              />
            </a>
          </div>
        </div>
      </CruzLayout>
      <Modal
        isOpen={modal1Open}
        toggle={toggleModal1}
        className="sidebar-modal"
        fade={false}
      >
        <ModalBody>
          <div className="Employee-Profilemodal">
            <div className="row">
              <h2 className="customHeading">What’s next?</h2>
              <div className="text-para">
                <p>
                  We’ve let the person know you’re interested in this role, if
                  they’re interested too, you’ll be connected.
                </p>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal2Open}
        toggle={toggleModal2}
        className="sidebar-modal"
        fade={false}
      >
        <ModalBody>
          <div className="Employee-ProfilematchModal">
            <div className="row">
              <h2 className="customHeading">IT’S A MATCH!</h2>
              <div className="text-para">
                <p>You’re both interested in each other.</p>
              </div>
              <div className="imagegrid">
                <div className="grid">
                  <img
                    src={require("../../../../assets/images/cruz/gall-1.png")}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="grid">
                  <img
                    src={require("../../../../assets/images/cruz/gall-2.png")}
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="chatOption-btn">
                <Button
                  onClick={() => console.log("Hello")}
                  text="Chat with the Employer"
                  icon={true}
                  className="chat-optionbtn"
                />
                <a href="#" className="chatlater">
                  Continue & chat later
                </a>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal> */}
    </div>
  );
};
export default EmployeeMatchProfile;
