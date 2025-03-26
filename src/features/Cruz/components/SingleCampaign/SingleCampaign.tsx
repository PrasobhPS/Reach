import { Button } from "../../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import {
  faEye,
  faPauseCircle,
  faEdit,
  faTrashAlt,
  faSearch,
  faAngleRight,
  faEllipsisH,
  faClone,
  faPlayCircle,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import "./SingleCampaign.scss";
import profileimage from "../../../../assets/images/campaign-profile.png";
import { FormProvider, useForm } from "react-hook-form";
import {
  useGetLiveCampaignsQuery,
  usePauseCampaignMutation,
  useDeleteCampaignMutation,
  useRemoveCampaignMutation,
  useGetDraftCampaignsQuery,
  useGetArchiveCampaignsQuery,
  useActivateCampaignMutation,
} from "../../Api/CampaignApiSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eyeImage from "../../../../assets/images/cruz/eye.png";
import search from "../../../../assets/images/cruz/search.png";
import Eye from "../../../../assets/images/cruz/icon/eye.png";
import edit from "../../../../assets/images/cruz/icon/edit.png";
import activate from "../../../../assets/images/cruz/icon/activate.png";
import editparameter from "../../../../assets/images/cruz/edit.png";
import trash from "../../../../assets/images/cruz/icon/Trash.png";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from "reactstrap";
import Swal from "sweetalert2";

interface formValues {
  username: string;
  email: string;
}
interface CampaignProps {
  id: number;
  job_role: string;
  vessel_size: string;
  job_duration: string;
  job_location: string;
  created_at: string;
  matches: number;
  job_seen_count: number;
  job_images: string;
  job_status: string;
  is_deleted: string;
  employee_ids: number;
  employee_count: number;
}
interface PauseBoxClasses {
  [key: number]: string;
}
export const SingleCampaign = () => {
  const navigate = useNavigate();
  const { params } = useParams();
  const liveCampaignsQuery = useGetLiveCampaignsQuery({});
  const draftCampaignsQuery = useGetDraftCampaignsQuery({});
  const archiveCampaignQuery = useGetArchiveCampaignsQuery({});
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [dynamicId, setDynamicId] = useState<string | undefined>(undefined);
  const [selectedCampaign, setSelectedCampaign] = useState<{ id: number, status: string } | null>(null);
  const liveCampaigns =
    params === "livecampaign"
      ? liveCampaignsQuery.data
      : params === "draftcampaign"
        ? draftCampaignsQuery.data
        : params === "archivecampaign"
          ? archiveCampaignQuery.data
          : null;

  const refetch =
    params === "livecampaign"
      ? liveCampaignsQuery.refetch
      : params === "draftcampaign"
        ? draftCampaignsQuery.refetch
        : params === "archivecampaign"
          ? archiveCampaignQuery.refetch
          : null;
  const [pauseCampaignMutation] = usePauseCampaignMutation();
  const [deleteCampaignMutation] = useDeleteCampaignMutation();
  const [activateCampaignMutation] = useActivateCampaignMutation();
  const [removeCampaignMutation] = useRemoveCampaignMutation();
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const [campaigns, setCampaigns] = useState<CampaignProps[]>(
    liveCampaigns?.data || []
  );
  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [params])
  useEffect(() => {
    setCampaigns([]);
    if (liveCampaigns?.data) {
      setCampaigns(liveCampaigns.data);
    }
  }, [liveCampaigns]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //console.log("campaign-----", campaigns);
  // mobilebutton text
  const [isMobiletext, setIsMobiletext] = useState(window.matchMedia('(max-width: 767px)').matches);
  const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});
  const toggleDropdown = (index: number) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buttonText = isMobiletext ? 'Edit Campaign' : 'Edit';
  const form = useForm<formValues>();
  const { handleSubmit } = form;
  const [visibleActionSteps, setVisibleActionSteps] = useState<number | null>(
    null
  );
  const [pauseBoxClasses, setPauseBoxClasses] = useState<PauseBoxClasses>({});
  const toggleMenu = (index: number) => {
    setVisibleActionSteps((prevIndex) => (prevIndex === index ? null : index));
    setPauseBoxClasses((prevClasses) => ({
      ...prevClasses,
      [index]: prevClasses[index] === 'pausebox-add' ? '' : 'pausebox-add'
    }));
  };
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];
  const onSubmit = (data: formValues) => {
    //console.log("Form Submitted", data);
  };
  const pauseCampaign = async (id: number, status: string) => {
    let jobStatus = "";
    if (status === "A") jobStatus = "I";
    else jobStatus = "A";
    const response = await pauseCampaignMutation({ id, jobStatus });
    if ("error" in response) {
      console.error("Error logging in:", response.error);
    } else {
      if (refetch) {
        refetch();
      } else {
        console.warn("Refetch is null, cannot refetch data.");
      }
    }
  };
  const deleteCampaign = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive the campaign and delete all related details. This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
      cancelButtonText: 'Cancel',
      backdrop: `
    rgba(255, 255, 255, 0.5)
    left top
    no-repeat
    filter: blur(5px);
  `,
      background: '#fff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteCampaignMutation(id);
          if ("error" in response) {
            console.error("Error logging in:", response.error);
          } else {
            Swal.fire({
              title: "Archived!",
              text: "The Campaign is Archived successfully",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
              backdrop: `
              rgba(255, 255, 255, 0.5)
              left top
              no-repeat
              filter: blur(5px);
            `,
              background: '#fff',
            });
            if (refetch) {

              refetch();
            } else {
              console.warn("Refetch is null, cannot refetch data.");
            }
          }
        } catch (error) {
          console.error("Error archiving campaign:", error);
        }
      }
    });

  };

  const removeCampaign = async (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently Delete the campaign. This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel',
      backdrop: `
    rgba(255, 255, 255, 0.5)
    left top
    no-repeat
    filter: blur(5px);
  `,
      background: '#fff',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await removeCampaignMutation(id);
          if ("error" in response) {
            console.error("Error logging in:", response.error);
          } else {
            Swal.fire({
              title: "Deleted!",
              text: "The Campaign deleted successfully",
              icon: "success",
              timer: 3000,
              showConfirmButton: false,
              backdrop: `
              rgba(255, 255, 255, 0.5)
              left top
              no-repeat
              filter: blur(5px);
            `,
              background: '#fff',
            });
            if (refetch) {
              refetch();
            } else {
              console.warn("Refetch is null, cannot refetch data.");
            }
          }
        } catch (error) {
          console.error("Error archiving campaign:", error);
        }
      }
    });
  }


  const activateCampaign = async (id: number) => {
    const response = await activateCampaignMutation(id);
    if ("error" in response) {
      console.error("Error logging in:", response.error);
    } else {
      Swal.fire({
        title: "Activated!",
        text: "The Campaign is Reactivated as a new Campaign",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
        backdrop: `
        rgba(255, 255, 255, 0.5)
        left top
        no-repeat
        filter: blur(5px);
      `,
        background: '#fff',
      });
      navigate(`/cruz/job/${id}`)
    }
  };

  const jobView = (id: number) => {
    navigate(`/cruz/viewsinglecampaign/${id}`);
  };
  const handleToggle = (event: React.MouseEvent<HTMLAnchorElement>, data: { id: number, status: string } | null) => {
    event.preventDefault();
    setSelectedCampaign(data);
    if (isMobile) {
      const newVisibility = !isVisible;
      setIsVisible(newVisibility);
      setShowBackdrop(!showBackdrop);
      setDynamicId(newVisibility ? `dynamic-id-${Date.now()}` : undefined);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      if (window.innerWidth > 767) {
        setIsVisible(true);
        setShowBackdrop(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const createBackdrop = () => {
      if (showBackdrop) {
        const backdrop = document.createElement("div");
        backdrop.classList.add("backdrop");
        backdrop.addEventListener("click", () => {
          document.body.removeChild(backdrop);
          setIsVisible(!isVisible);
          setShowBackdrop(false);
        });
        document.body.appendChild(backdrop);
      }
    };
    createBackdrop();
    return () => {
      const existingBackdrop = document.querySelector(".backdrop");
      if (existingBackdrop) {
        existingBackdrop.remove();
      }
    };
  }, [showBackdrop]);

  return (
    <div>
      <div className="page-path">
        <div className="parent-direction">
          <label>Dashboard</label>
        </div>
        <span className="direction-arrow">
          <FontAwesomeIcon icon={faAngleRight} />
        </span>
      </div>
      <div className="employer-single-campaign">
        <div className="w-100">
          <div className="heading-content d-flex align-items-center justify-content-between flex-wrap">
            <h2 className="customHeading">
              {params === "livecampaign"
                ? "live campaigns"
                : params === "draftcampaign"
                  ? "Draft campaigns"
                  : "Archived campaigns"}
            </h2>
            <div>
              {/* <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <CustomSelect
                    name="myoption"
                    options={options}
                    registerConfig={{
                      required: { value: true, message: "Select is required" },
                    }}
                  />
                </form>
              </FormProvider> */}
            </div>
          </div>
        </div>
        <div className="row">
          {campaigns?.map((campaign, index) => (
            <div className="col-lg-6 col-12 campaigncard-parent" key={index}>
              <div className="campaign-card">
                {campaign.job_status === "I" ?
                  <div className={`Pause-box ${pauseBoxClasses[index] || ''}`}>
                    <div className="iconpause">
                      <img src={require("../../../../assets/images/cruz/pause.png")} alt="" className="img-fluid" />
                      <h2 className="customHeading">campaign paused</h2>
                    </div>
                  </div>
                  : ""}
                <div className="campaign-card-head">
                  <div className="card-image">
                    {campaign.job_images ? (
                      <img
                        src={baseUrl + campaign.job_images}
                        alt=""
                        className="img-fluid"
                      />
                    ) : (
                      <img
                        src={require("../../../../assets/images/profile/Default.jpg")}
                        alt="Profile"
                        className="imgfluid"
                      />
                    )}
                  </div>
                  <div className="card-text">
                    <h4 className="customHeading">{campaign.job_role}</h4>
                    <div className="listed-text">
                      <p>{campaign.vessel_size}</p>
                      <p>{campaign.job_duration}</p>
                      <p>{campaign.job_location}</p>
                    </div>
                  </div>
                </div>
                <div className="campaign-card-body">
                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <div className="view-box">
                        <div className="content-details-box">
                          <div className="content">
                            <div className="content-body">
                              <div className="heading-sec">
                                <div className="numberof-view">
                                  <h2 className="customHeading">
                                    {campaign.matches}
                                  </h2>
                                </div>
                                <div>
                                  <h2 className="customHeading mt-1">Matches</h2>
                                </div>
                              </div>
                              <div className="view-action">
                                <Button
                                  onClick={() => {
                                    if (campaign.job_status === "A") {
                                      if (campaign.matches !== 0) {
                                        navigate(`/cruz/mymatches`, {
                                          state: {
                                            id: campaign.id,
                                            job_role: campaign.job_role,
                                          }
                                        });
                                      } else {
                                        Swal.fire({
                                          title: "No Match!",
                                          text: "There is no matches",
                                          icon: "info",
                                          timer: 3000,
                                          showConfirmButton: false,
                                          backdrop: `
                                          rgba(255, 255, 255, 0.5)
                                          left top
                                          no-repeat
                                          filter: blur(5px);
                                        `,
                                          background: '#fff',
                                        });
                                      }
                                    }
                                  }}
                                  text="view"
                                  icon={false}
                                  iconname={faEye}
                                  className="button-reverse"
                                  theme="light"
                                  img={eyeImage}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-details-box find-crew-box">
                          <div className="content">
                            <div className="content-body col-12">
                              <div className="heading-sec">
                                <div>
                                  <h2 className="customHeading">Find Crew</h2>
                                </div>
                              </div>
                              <div className="view-action">
                                <Button
                                  onClick={() => {
                                    if (campaign.job_status === "A") {
                                      campaign.employee_count > 0
                                        ? navigate("/cruz/matchedprofile", {
                                          state: {
                                            job_id: campaign.id,
                                            employee_ids: campaign.employee_ids,
                                            employee_count: campaign.employee_count
                                          },
                                        })
                                        : Swal.fire({
                                          title: "No Crews!",
                                          text: "There is no matched crew profiles Found",
                                          icon: "info",
                                          timer: 3000,
                                          showConfirmButton: false,
                                          backdrop: `
                                          rgba(255, 255, 255, 0.5)
                                          left top
                                          no-repeat
                                          filter: blur(5px);
                                        `,
                                          background: '#fff',
                                        })
                                    }
                                  }}
                                  text="Go"
                                  icon={false}
                                  className="button-reverse"
                                  theme="light"
                                  img={search}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="view-postedSection">
                          <div className="posted">
                            <span>Posted : {campaign.created_at}</span>
                          </div>
                          <div className="Seen">
                            <span>
                              Seen by {campaign.job_seen_count} Members
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {campaign.job_status === "A" || campaign.job_status === "I" ? (
                      <div className="col-md-12 campaign-column">
                        <div className="view-details">
                          <h4 className="customHeading manage-campaign">
                            MANAGE Campaign
                          </h4>
                          <div className="menu-click">
                            <div className="link-text">
                              <a className="manage-campainlink" onClick={(event) => handleToggle(event, { id: campaign.id, status: campaign.job_status })}>Manage Campaign</a>
                            </div>
                          </div>
                          {(isMobile && isVisible) || !isMobile ? (
                            <div id={dynamicId} className="button-groups">
                              <div className="manage-campaigntext d-md-none">
                                <span>Manage Campaign</span>
                              </div>
                              <Button
                                onClick={() =>
                                  campaign.job_status !== "D"
                                    ? jobView(campaign.id)
                                    : ""
                                }
                                text="view"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={Eye}
                              />
                              <Button
                                onClick={() =>
                                  campaign.is_deleted === "N"
                                    ? navigate(`/cruz/job/${campaign.id}`)
                                    : ""
                                }
                                text={buttonText}
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={edit}
                              />
                              <div className="edit-parameteroption">

                                <Button
                                  onClick={() =>
                                    campaign.is_deleted === "N"
                                      ? navigate(`/cruz/job/${campaign.id}`,
                                        {
                                          state: {
                                            firstIndex: 3,
                                            secondIndex: 0,
                                          },
                                        })
                                      : ""
                                  }
                                  text="Edit Search Parameters"
                                  icon={false}
                                  className="button-reverse"
                                  theme="light"
                                  img={editparameter}
                                />
                              </div>
                              <div className="edit-parameteroption">
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/cruz/mylikedprofile`,
                                      {
                                        state: {
                                          id: campaign.id,
                                          job_role: campaign.job_role,
                                        }
                                      }
                                    )
                                  }
                                  text="Liked Profiles"
                                  icon={true}
                                  iconname={faThumbsUp}
                                  className="button-reverse liked-view"
                                  theme="light"
                                />
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/cruz/mydislikedprofile`,
                                      {
                                        state: {
                                          id: campaign.id,
                                          job_role: campaign.job_role,
                                        }
                                      }
                                    )
                                  }
                                  text="Disliked Profiles"
                                  icon={true}
                                  className="button-reverse"
                                  theme="light"
                                  iconname={faThumbsDown}
                                />
                              </div>
                              <Button
                                onClick={() => {
                                  if (selectedCampaign && selectedCampaign.status !== "D") {
                                    pauseCampaign(selectedCampaign.id, selectedCampaign.status);
                                  } else if (campaign && campaign.job_status !== "D") {
                                    pauseCampaign(campaign.id, campaign.job_status);
                                  }
                                }}

                                text={
                                  campaign.job_status === "I" ? isMobile ? "Unpause Campaign" : "Unpause"
                                    : isMobile ? "Pause Campaign" : "Pause"
                                }
                                icon={true}
                                iconname={
                                  campaign.job_status === "I"
                                    ? faPlayCircle
                                    : faPauseCircle
                                }
                                className="button-reverse"
                                theme="light"
                              />
                              <Button
                                onClick={() =>
                                  campaign.job_status !== "D"
                                    ? toggleMenu(index)
                                    : ""
                                }
                                text=""
                                icon={true}
                                iconname={faEllipsisH}
                                className="button-reverse btn-togglemenu d-none"
                                theme="light"
                              />
                              <div className="archive-camapaignoption">
                                <Button
                                  onClick={() => deleteCampaign(campaign.id)}
                                  text="End / Archive Campaign"
                                  icon={false}
                                  iconname={faTrashAlt}
                                  className="button-reverse"
                                  theme="light"
                                  img={trash}
                                />
                              </div>
                              <Dropdown
                                key={index}
                                isOpen={dropdownOpen[index] || false}
                                toggle={() => {
                                  if (campaign.job_status !== "D") {
                                    toggleDropdown(index);
                                  }
                                }}
                                className="d-sm-none d-md-block"
                                direction="down"
                              >
                                <DropdownToggle caret key={index}>
                                  <FontAwesomeIcon icon={faEllipsisH} />
                                </DropdownToggle>
                                <DropdownMenu container="body" key={index}>
                                  <DropdownItem onClick={function noRefCheck() { }}>
                                    <Button
                                      onClick={() => console.log("Hello")}
                                      text="Clone this Campaign"
                                      icon={true}
                                      iconname={faClone}
                                      className="button-reverse d-none"
                                      theme="light"
                                    />
                                  </DropdownItem>
                                  <DropdownItem onClick={function noRefCheck() { }}>
                                    <Button
                                      onClick={() =>
                                        campaign.is_deleted === "N"
                                          ? navigate(`/cruz/job/${campaign.id}`,
                                            {
                                              state: {
                                                firstIndex: 3,
                                                secondIndex: 0,
                                              },
                                            })
                                          : ""
                                      }
                                      text="Edit Search Parameters"
                                      icon={false}
                                      className="button-reverse"
                                      theme="light"
                                      img={editparameter}
                                    />
                                  </DropdownItem>
                                  <DropdownItem key={index} onClick={function noRefCheck() { }}>
                                    <Button
                                      onClick={() =>
                                        navigate(
                                          `/cruz/mylikedprofile`,
                                          {
                                            state: {
                                              id: campaign.id,
                                              job_role: campaign.job_role,
                                            }
                                          }
                                        )
                                      }
                                      text="My Liked Profiles"
                                      icon={true}
                                      iconname={faThumbsUp}
                                      className="button-reverse liked-view"
                                      theme="light"
                                    />
                                  </DropdownItem>
                                  <DropdownItem key={index} onClick={function noRefCheck() { }}>
                                    <Button
                                      onClick={() =>
                                        navigate(
                                          `/cruz/mydislikedprofile`,
                                          {
                                            state: {
                                              id: campaign.id,
                                              job_role: campaign.job_role,
                                            }
                                          }
                                        )
                                      }
                                      text="Disliked Profiles"
                                      icon={true}
                                      className="button-reverse dislike"
                                      theme="light"
                                      iconname={faThumbsDown}
                                    />
                                  </DropdownItem>
                                  <DropdownItem key={index} onClick={function noRefCheck() { }}>
                                    <Button
                                      onClick={() => deleteCampaign(campaign.id)}
                                      text="End / Archive Campaign"
                                      icon={false}
                                      className="button-reverse"
                                      theme="light"
                                      img={trash}
                                    />
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          ) : null}
                        </div>


                        {visibleActionSteps === index && (
                          <div className="action-steps">
                            <div className="button-groups">
                              <Button
                                onClick={() => console.log("Hello")}
                                text="Clone this Campaign"
                                icon={true}
                                iconname={faClone}
                                className="button-reverse d-none"
                                theme="light"
                              />
                              <Button
                                onClick={() =>
                                  campaign.is_deleted === "N"
                                    ? navigate(`/cruz/job/${campaign.id}`,
                                      {
                                        state: {
                                          firstIndex: 3,
                                          secondIndex: 0,
                                        },
                                      })
                                    : ""
                                }
                                text="Edit Search Parameters"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={editparameter}
                              />
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/cruz/mylikedprofile`,
                                    {
                                      state: {
                                        id: campaign.id,
                                        job_role: campaign.job_role,
                                      }
                                    }
                                  )
                                }
                                text="Liked Profiles"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={Eye}
                              />
                              <Button
                                onClick={() =>
                                  navigate(
                                    `/cruz/mydislikedprofile`,
                                    {
                                      state: {
                                        id: campaign.id,
                                        job_role: campaign.job_role,
                                      }
                                    }
                                  )
                                }
                                text="Disliked Profiles"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={Eye}
                              />
                              <Button
                                onClick={() => deleteCampaign(campaign.id)}
                                text="End / Archive Campaign"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={trash}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : campaign.job_status === "D" ?
                      (
                        <div>
                          {campaign.is_deleted === "N" ? (
                            <div className="d-flex button-archive">
                              <Button
                                onClick={() =>
                                  navigate(`/cruz/job/${campaign.id}`)
                                }
                                text={buttonText}
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={edit}
                              />
                              <Button
                                onClick={() => deleteCampaign(campaign.id)}
                                text="End / Archive Campaign"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={trash}
                              />
                            </div>
                          ) : (
                            <div className="d-flex button-archive">
                              <Button
                                onClick={() => activateCampaign(campaign.id)}
                                text={"Reactivate"}
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={activate}
                              />
                              <Button
                                onClick={() => removeCampaign(campaign.id)}
                                text="Delete Campaign"
                                icon={false}
                                className="button-reverse"
                                theme="light"
                                img={trash}
                              />
                            </div>
                          )}
                        </div>
                      ) : ""}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
