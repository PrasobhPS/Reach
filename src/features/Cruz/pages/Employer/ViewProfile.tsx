import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { EmployerProfile } from "../../components/EmployerProfile/EmployerProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody } from "reactstrap";
import { useState, useEffect } from "react";
import { EmployeeProfile } from "../../components/EmployeeProfile/EmployeeProfile";
import { Button } from "../../../../components/Button/Button";
import { ProfileMatch } from "../../components/Modal/ProfileMatch"
import { WhatHappen } from "../../components/Modal/WhatHappen"
import { useLocation, useNavigate } from "react-router-dom";
import { useEmployeeProfileQuery } from "../../components/ReviewEmployeeProfile/EmployeeProfileApiSlice";
import { useCampaignMatchesListMutation, useLikeCampaignMutation, useUnLikeCampaignMutation } from "../../components/EmployerProfile/EmployerProfileApiSlice";
import SingleChatMain from "../../../Chat/PrivateChat/SingleChatMain/SingleChatMain";
import { EmployeeInterface, MemberInterface } from "../../../../types/PrivateChatInterfaces";
import { Breadcrumbs } from "../../components/Breadcrumbs/Breadcrumbs";
import { useSocket } from "../../../../contexts/SocketContext";

interface EmpDetails {
  job_id: number;
  employee_ids: number[];
  employee_count: number;
}
interface Media {
  id: number;
  media_file: string;
}

export const ViewProfile = () => {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modalCall, setModalCall] = useState(true);

  const toggleModal1 = () => {
    setModal1Open(!modal1Open);
  };

  const toggleModal2 = () => {
    setModal2Open(!modal2Open);
  };
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState<EmpDetails>(location.state as EmpDetails);
  const [availableProfile] = useCampaignMatchesListMutation();
  const [likeCampaign] = useLikeCampaignMutation();
  const [unLikeCampaign] = useUnLikeCampaignMutation();
  const [empProfilePic, setEmpProfilePic] = useState();
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState(null);
  const { setIsChatVisible, setPrivateChatMember, setIsInterview, setEmployeeDetails: socketSetEmployeeDetails, setChatType } = useSocket();
  const [pageDetails, setPageDetails] = useState('');
  const [isMatch, setIsmMatch] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState();
  const Loading = () => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      if (employeeDetails.employee_ids && employeeDetails.job_id) {
        let jobData = {
          employee_ids: employeeDetails.employee_ids,
          job_id: employeeDetails.job_id,
          page: page,
        };
        setLoading(true);
        try {
          const response = await availableProfile(jobData);
          if ('data' in response && response.data) {
            setEmployeeProfile(response.data.data[0]);
            setMedias(response.data.data[0].employee_images);
            setEmployeeName(response.data.data[0].members_name)
            setEmployeeId(response.data.data[0].employee_id);
            if (response.data.data[0].is_match === 'Y') {
              setIsmMatch(true);

              setEmpProfilePic(response.data.data[0].member_profile_picture);
              setIsInterview(true);
              setChatType('CRUZ');
              setPrivateChatMember(response.data.data[0].member);
              setIsChatVisible(true);
              socketSetEmployeeDetails({
                employee_id: response.data.data[0].employee_id,
                job_id: employeeDetails.job_id
              });
              toggleModal2();

            }
          }
        } catch (error) {
          console.error("Error fetching available jobs:", error);
        } finally {
          Loading();
        }
      }
    };

    fetchAvailableJobs();
    setPageDetails(`Viewing ${page} of ${employeeDetails.employee_count} matching profiles`);
  }, [employeeDetails.employee_ids, employeeDetails.job_id, page, availableProfile]);

  const navigate = useNavigate();
  const handleNext = async () => {
    if (page < employeeDetails.employee_count) {
      setPage(prevPage => prevPage + 1);
    } else {
      setPageDetails('No more Profiles to show');
      const timer = setTimeout(() => {
        navigate('/cruz/viewcampaign/livecampaign');
      }, 700);
    }


  }
  const handleBack = async () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }

  }
  const handleLike = async () => {
    try {
      //setLoading(true);
      let profileData = {
        job_id: employeeDetails.job_id,
        employee_id: employeeId,
      }
      const response = await likeCampaign(profileData);
      if ('data' in response && response.data) {
        if (response.data.is_match === 'Y') {
          setEmpProfilePic(response.data.data.member_profile_picture);
          setIsInterview(true);
          setChatType('CRUZ');
          setPrivateChatMember(response.data.data);
          setIsChatVisible(true);
          if (profileData.employee_id && profileData.job_id) {
            socketSetEmployeeDetails({
              employee_id: profileData.employee_id,
              job_id: profileData.job_id
            });
          }
          toggleModal2();
        } else {
          if (modalCall === true) {
            toggleModal1();
          }
          setModalCall(false);
          if (page - 1 < employeeDetails.employee_count) {
            handleNext();
          } else {
            handleBack();
          }
        }

      }
    } catch (error) {
      console.error("Error fetching available jobs:", error);
    } finally {
      setLoading(false);
    }
  }
  const handleDisLike = async () => {
    try {
      //setLoading(true);
      let profileData = {
        job_id: employeeDetails.job_id,
        employee_id: employeeId,
      }
      const response = await unLikeCampaign(profileData);
      if ('data' in response && response.data) {
        handleNext();
      }
    } catch (error) {
      console.error("Error fetching available jobs:", error);
    } finally {
      setLoading(false);
    }
  }
  const handleSubmit = () => {
    toggleModal1();

  };

  const handleSubmitNext = () => {
    toggleModal2();
    setIsChatVisible(false);
    if (page - 1 < employeeDetails.employee_count) {
      handleNext();
    } else {
      handleBack();
    }
  };

  const handleChat = () => {
    toggleModal2();
    if (page - 1 < employeeDetails.employee_count) {
      handleNext();
    } else {
      handleBack();
    }
  };
  const [isEnvelopePresent, setIsEnvelopePresent] = useState(false);
  useEffect(() => {
    const checkForEnvelope = () => {
      const hasEnvelopeWrapper = document.body.contains(document.querySelector('.envolope-wrapper'));
      setIsEnvelopePresent(hasEnvelopeWrapper);
    };
    checkForEnvelope();
    const observer = new MutationObserver(checkForEnvelope);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="viewProfile employer-profileparent view-profile-componentPage">
      <div className="d-flex align-items-center justify-content-between d-md-none profile-componentPage">
        <div className="findjobs">
          <span>Find Jobs</span>
          <span className="direction-arrow">
            <FontAwesomeIcon icon={faAngleRight} />
          </span>
        </div>
        <div className="d-md-none d-sm-block count-employeecount">
          <p>{page} of {employeeDetails.employee_count}</p>
        </div>
      </div>
      <CruzLayout link="Employer">
        {loading ? (
          <div className="page-loader">
            <div className="page-innerLoader">
              <div className="spinner-border" role="status">
                <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        ) : (
          <div className="center-layout">
            <div className="d-flex align-items-center justify-content-between">
              <Breadcrumbs
                mainbreadcrumb="Live Campaign"
                secondbreadcrumb={employeeName}
                redirectUrl="/cruz/viewcampaign/liveCampaign"
              />
            </div>
            <EmployeeProfile employeeProfile={employeeProfile} medias={medias} />
          </div>
        )}
        {!isMatch && (
          <div className="layout-action">
            <div className={`action-options ${isEnvelopePresent ? 'active-menu' : ''}`}>
              <a onClick={() => handleDisLike()}>
                <img
                  src={require("../../../../assets/images/cruz/close-icon.png")}
                  alt=""
                  className="img-fluid"
                />
              </a>
              <a onClick={() => handleBack()}>
                <img
                  src={require("../../../../assets/images/cruz/direction.png")}
                  alt=""
                  className="img-fluid"
                />
              </a>
              <a onClick={() => handleLike()}>
                <img
                  src={require("../../../../assets/images/cruz/Tick.png")}
                  alt=""
                  className="img-fluid"
                />
              </a>
            </div>
            <div className="views">
              <p>{pageDetails}</p>
            </div>
          </div>
        )}
      </CruzLayout>
      <Modal
        isOpen={modal1Open}
        toggle={toggleModal1}
        className="sidebar-modal"
        fade={false}
        backdrop="static"
      >
        <ModalBody>
          <WhatHappen handleSubmit={handleSubmit} />
        </ModalBody>
      </Modal>
      <Modal
        isOpen={modal2Open}
        toggle={toggleModal2}
        className="sidebar-modal"
        fade={false}
      >
        <ModalBody>
          <ProfileMatch handleChat={handleChat} handleSubmitNext={handleSubmitNext} profilePic={empProfilePic} />
        </ModalBody>
      </Modal>
    </div>
  );
};
export default ViewProfile;
