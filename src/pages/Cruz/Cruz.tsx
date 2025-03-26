import React from "react";
import { Hero } from "../../components/Hero/Hero";
import { Heading } from "../../components/Heading/Heading";
import { Card } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { getUserData } from "../../utils/Utils";
import { useEffect, useState } from "react";
import "../../assets/scss/cruz.scss";
import { MODAL_TYPES, useGlobalModalContext } from "../../utils/GlobalModal";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import ContentLoader, { Instagram } from 'react-content-loader';
import { CruzLayout } from "../../components/Layout/CruzLayout";
import { useCMSPageMutation } from "../../features/CmsContent/CmsContentApiSlice";
import { CmsPage } from "../../types";
function Cruz() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const userData = getUserData("userData");
  let memberType = "";
  let IsEmployer = "";
  let IsEmployee = "";
  try {
    if (userData !== null) {
      memberType = userData.Member_type;
      IsEmployer = userData.IsEmployer;
      IsEmployee = userData.IsEmployee;
    } else {
      console.error("User data not found in local storage");
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  const [jobDetails, setJobDetails] = useState<CmsPage>({ pageHeader: '', pageDetails: '', pageImage: '', pageSlug: '' });
  const [crewDetails, setCrewDetails] = useState<CmsPage>({ pageHeader: '', pageDetails: '', pageImage: '', pageSlug: '' });
  const [cmsPageMutation, { isLoading }] = useCMSPageMutation();

  const fetchCMSContentFromAPI = async () => {
    try {
      const response = await cmsPageMutation({ slug: 'cruz_jobs' });
      const crewresponse = await cmsPageMutation({ slug: 'cruz_crew' });
      if ("error" in response) {
        throw new Error("Failed to fetch cms page");
      } else {
        const data = await response.data.data;
        setJobDetails(data); // Update state with fetched data
      }
      if ("error" in crewresponse) {
        throw new Error("Failed to fetch cms page");
      } else {
        const data = await crewresponse.data.data;
        setCrewDetails(data); // Update state with fetched data
      }

    } catch (error) {
      console.error("Failed to cms page codes:", error);
    }
  };

  // Fetch cms page  when the component mounts
  useEffect(() => {
    fetchCMSContentFromAPI();
  }, []);

  let sidebar = '';
  if (IsEmployer === 'Y' && IsEmployee === 'Y') {
    sidebar = 'both';
  } else if (IsEmployer === 'Y') {
    sidebar = 'Employer';
  } else if (IsEmployee === 'Y') {
    sidebar = 'Employee';
  }
  const { showModal } = useGlobalModalContext();
  const memberModal = () => {
    showModal(MODAL_TYPES.MEMBERSHIP_MODAL);
  };
  useEffect(() => {
    if (!memberType) memberModal();
  }, []);
  const employerNavigate = () => {
    if (IsEmployer === "Y")
      navigate("/cruz/viewcampaign/livecampaign", { state: "livecampaign" });
    else navigate("/cruz/job");
  };
  const employeeNavigate = () => {
    // if (memberType != "M") {
    //   memberModal();
    // } else {
    if (IsEmployee === "Y")
      navigate("/cruz/employeedashboard");
    else navigate("/cruz/profilesetup");
    //}

  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, []);
  const [hasCruzCustomClass, setHasCruzCustomClass] = useState(false);
  useEffect(() => {
    const cruzCustomElement = document.querySelector('.cruz-custom');
    if (cruzCustomElement) {
      setHasCruzCustomClass(true);
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className={`cruz-page cruz-homepage ${hasCruzCustomClass ? '' : 'cruz-withMenuHome'}`}>
      {isLoading ? (
        <div className="page-loader">
          <div className="page-innerLoader">
            <div className="spinner-border" role="status">
              <img src={require("../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      ) : ""}
      <Hero
        source={require("../../assets/images/cruz/jobpost.png")}
        title=""
      >
      </Hero>

      {/* {loading ? (
        <div className="row mx-0 d-flex align-items-center justify-content-center">
          <div className="col-md-4">
            <CustomLoader className={""} />
          </div>
          <div className="col-md-4">
            <CustomLoader className={""} />
          </div>
         </div>
      ) : ( */}
      <CruzLayout link={sidebar}>
        <div className="inner-child">
          <div className="cruz-headinghomepage">
            <Heading tag="h1" className="primary-heading">
              FIND YOUR IDEAL <span className="text-pink">JOB</span> OR LOOK FOR YOUR PERFECT <span className="text-green">CREW</span>
            </Heading>
          </div>
          <div className="row mx-0">
            <div className="col-md-6 col-12 px-0 Find-Jobcard">
              <Card source={jobDetails.pageImage}>
                <div className="text-center">
                  <Heading tag="h2">{jobDetails.pageHeader}</Heading>
                  <p className="sub-captiontext">
                    <div className="text-white text-custom"
                      dangerouslySetInnerHTML={{ __html: jobDetails.pageDetails }}
                    />
                  </p>
                  <Button
                    onClick={() => employeeNavigate()}
                    text="Search Jobs"
                    icon={true}
                    theme="dark"
                  />
                </div>
              </Card>
            </div>
            <div className="col-md-6 col-12 px-0 memberslooking-card">
              <Card source={crewDetails.pageImage}>
                <div className="text-center">
                  <Heading tag="h2">{crewDetails.pageHeader}</Heading>
                  <p className="sub-captiontext">
                    <div className="text-white text-custom"
                      dangerouslySetInnerHTML={{ __html: crewDetails.pageDetails }}
                    />
                  </p>
                  <Button
                    onClick={() => employerNavigate()}
                    text="Search Crew"
                    icon={true}
                    theme="dark"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </CruzLayout>
      {/* )} */}
    </div>

  );
}

export default Cruz;
