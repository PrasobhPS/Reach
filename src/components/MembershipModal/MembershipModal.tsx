import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { Button } from "../Button/Button";
import { Heading } from "../Heading/Heading";
import "../../assets/scss/membership.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../utils/Utils";
import { useGetMemberFeaturesMutation } from "../../features/Login/authApiSlice";

function MembershipModal() {
  const { hideModal } = useGlobalModalContext();
  const location = useLocation();
  const [title, setTitle] = useState<string>('');
  const [buttonName, setButtoneName] = useState<string>('');
  const [fetaureDetails, setFeatureDetails] = useState<string>('');

  const userData = getUserData("userData");
  let memberType = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
    } else {
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  const pathname = location.pathname;
  const state = location.state || {};
  const navigate = useNavigate();
  const handleModalToggle = () => {
    if (pathname.includes('specialists-details') && memberType !== '') {
      navigate('/specialists-details', { state });
    } else if (pathname.includes('/cruz') && memberType !== '') {
      navigate(-1);
    }
    else {
      navigate("/");
    }

    hideModal();
  };
  const navigateSignup = () => {
    if (memberType) {
      navigate("/member-signup");
    } else {
      navigate("/joinmembership");
    }

    hideModal();
  };
  const { showModal } = useGlobalModalContext();
  const authModal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    showModal(MODAL_TYPES.AUTH_MODAL, {
      title: "Sign In / Sign Up",
      confirmBtn: "Save",
    });
  };

  const [getMemberFeatures] = useGetMemberFeaturesMutation();
  const fetchFeatures = async (status: string) => {
    const passData = {
      status: status,
    };

    const response = await getMemberFeatures(status);

    if ('data' in response) {
      setTitle(response.data.data.membership_title);
      setButtoneName(response.data.data.membership_button);
      setFeatureDetails(response.data.data.membership_description);
    } else {
      console.log('Error occured while fetching data');
    }
  }
  useEffect(() => {
    let status = 'L';
    if (userData !== null) {
      status = 'F';
    }

    fetchFeatures(status);
  }, []);

  return (
    <div>
      <Modal
        isOpen={true}
        // toggle={toggle}
        centered
        className="login-modal membership-lockmodal"
      >
        <ModalBody>
          <ModalHeader></ModalHeader>
          <div className="login-box">
            <div className="login-box-inner">
              <div className="row  mx-0">
                <div className="col-md-6 col-12 img-box">
                  <div className="Member-lock">
                    <div className="content-block">
                      <img
                        src={require("../../assets/images/membership/lock.png")}
                        alt=""
                      />
                      <h2 className="customHeading">members only CONTENT</h2>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-12 content-box">
                  <Heading tag="h3" className="text-center">
                    {title}
                  </Heading>
                  <div className="sign-upContent">
                    <div className="list-content">
                      <p>Membership gives you access to:</p>
                      <div className="list">
                        <div
                          dangerouslySetInnerHTML={{ __html: fetaureDetails }}
                        />
                      </div>
                    </div>
                    <div>
                      <Button
                        onClick={() => navigateSignup()}
                        text={buttonName}
                        icon={true}
                        theme="dark"
                        className="w-100"
                      />
                    </div>
                    <div className="row sub-box">
                      <div className="col-12 text-center">
                        <div className="d-flex align-items-center justify-content-between">
                          {!memberType ? (
                            <div className="d-flex align-items-center justify-content-start w-100">
                              <a href="" onClick={(e) => authModal(e)}>
                                <p className="not-a-member">
                                  <div className="sign-uptag">Member Login</div>
                                </p>
                              </a>
                            </div>
                          ) : ""}
                          <div className="d-flex align-items-center justify-content-end w-100">
                            <a href="" onClick={() => handleModalToggle()}>
                              <p className="not-a-member">
                                <div className="sign-uptag">Return to site</div>
                              </p>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default MembershipModal;
