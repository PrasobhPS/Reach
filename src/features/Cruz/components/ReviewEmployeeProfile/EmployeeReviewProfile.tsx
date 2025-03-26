import { Heading } from '../../../../components/Heading/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import './Employeeprofile.scss';
import { Hero } from '../../../../components/Hero/Hero';
import { Button } from "../../../../components/Button/Button";
import { useEmployeeProfileQuery } from "./EmployeeProfileApiSlice";
import { CruzLayout } from "../../../../components/Layout/CruzLayout";
import { useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { EmployeeProfile } from "../EmployeeProfile/EmployeeProfile";
import React, { useState, useEffect, useRef } from "react";
import VideoPlayer from '../../../../components/VideoPlayer/VideoPlayer';
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs';
interface Media {
  id: number;
  media_file: string;
}

interface Referrance {
  id: string;
  name: string;
}
interface EmployeeProfile {
  employee_id: number;
  members_name: string;
  members_fname: string;
  members_lname: string;
  employee_passport: string;
  employee_location: string;
  employee_experience: string;
  employee_avilable: string;
  employee_salary_expection: string;
  employee_visa: string;
  employee_dob: string;
  employee_gender: string;
  employee_last_role: string;
  employee_interest: string;
  employee_about: string;
  employee_intro: string;
  employee_role: string;
  employee_qualification: string;
  employee_languages: string;
  employee_position: string;
  employee_vessel: string;
  is_liked: string;
  is_match: string;
  referrance: Referrance[];
}

export const EmployeeReviewProfile = () => {
  const { data, error, isLoading, isSuccess, refetch } = useEmployeeProfileQuery({});
  const employeeProfile: EmployeeProfile = data?.data.employeeDetails;
  const medias: Media[] = data?.data.mediaDetails || [];
  const searchParameterName = data?.data.searchParameterName;
  useEffect(() => {
    refetch();
  }, [])
  const handleSubmit = () => {
    try {
      navigate('/cruz/employeejobpoststatus');
    } catch (error) {
      // Handle error response here
      console.error("Error saving job:", error);
    }
  };
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const dobFormat = (originalDate: string) => {
    const [year, month, day] = originalDate
      ? originalDate.split("-")
      : "0000-00-00".split("-");
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
    return dateOfBirth;
  };
  const baseUrl = process.env.REACT_APP_STORAGE_URL;

  const navigate = useNavigate();
  const handlePreview = async () => {
    try {
      navigate('/cruz/previewemployee');
    } catch (error) {
      // Handle error response here
      console.error("Error saving job:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="row mx-0 Employeeprofile-parents employeereviewprofile-parent">
      <CruzLayout link="Employer">
        <div className="col-lg-12 ">
          <div className="Employeeprofile-page reviewEmployeeprofile-pageparent">
            {isLoading ? (
              <div className="page-loader">
                <div className="page-innerLoader">
                  <div className="spinner-border" role="status">
                    <img src={require("../../../../assets/images/cruz/Frame.png")} alt="" className="img-fluid" />
                  </div>
                </div>
              </div>
            ) : ""}
            <div className="container">
              <div className="row">
                <div className="inner-bodypage Employeeprofile pb-0">
                  <Breadcrumbs mainbreadcrumb="Setup Profile" secondbreadcrumb="Summary of Profile" redirectUrl="/cruz/employeedashboard" />
                  <h2 className="customHeading">review your profile</h2>
                  <div className="table-datats">
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="table-content">
                          <div className="table-details">
                            <div className='table-datadetails'>
                              <div className='details-card'>
                                <label className="odd">PERSONAL DETAILS</label>
                              </div>
                              <div className='details-card-body'>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Full Name</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span>
                                      {employeeProfile?.members_fname + " " + employeeProfile?.members_lname}
                                    </span>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Main job role</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      <span>
                                        {employeeProfile?.employee_role}
                                      </span>
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Passport</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_passport}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 1,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Availability</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_avilable}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 2,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Date of Birth</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_dob ? dobFormat(employeeProfile?.employee_dob) : ""}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 3,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Current Location</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_location}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 4,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Gender</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_gender}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 5,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} /></a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="table-details history">

                            <div className='table-datadetails'>
                              <div className='details-card'>
                                <label className="odd">HISTORY</label>
                              </div>
                              <div className='details-card-body'>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Years of Experience</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_experience}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 2,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion  block-class'>
                                  <div className='odd-questiontitle'>
                                    <h5>Last Role</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px", whiteSpace: "pre-line" }}>
                                      {employeeProfile?.employee_last_role}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 2,
                                          secondIndex: 1,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Qualification</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_qualification}{" "}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 2,
                                          secondIndex: 2,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/*  */}

                          </div>
                          <div className="table-details other-information">
                            <div className='table-datadetails'>
                              <div className='details-card'>
                                <label className="odd text-uppercase">other information</label>
                              </div>
                              <div className='details-card-body'>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Languages Spoken</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_languages}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 3,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Visas</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_visa}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 3,
                                          secondIndex: 1,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>

                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Interests</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.employee_interest}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 3,
                                          secondIndex: 2,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Bio</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 4,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>One liner</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>

                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 4,
                                          secondIndex: 1,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>

                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Reference</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {employeeProfile?.referrance
                                        .map((ref, index) => (
                                          <React.Fragment key={ref.id}>
                                            <a style={{ cursor: "pointer" }}
                                              onClick={() =>
                                                navigate(`/publicprofile`, {
                                                  state: ref.id,
                                                })
                                              }
                                            >
                                              {ref.name}
                                            </a>
                                            {index < employeeProfile.referrance.length - 1 && ', '}
                                          </React.Fragment>
                                        ))}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 5,
                                          secondIndex: 1,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                          <div className="table-details Your-work">
                            <div className='table-datadetails'>
                              <div className='details-card'>
                                <label className="odd">SEARCH PARAMETER</label>
                              </div>
                              <div className='details-card-body'>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Vessel Type</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {searchParameterName?.vessel_type}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 5,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>

                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Vessel Size</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }}>
                                      {Array.isArray(searchParameterName?.vessel_size) ? (
                                        searchParameterName?.vessel_size.join(", ")
                                      ) : (
                                        searchParameterName?.vessel_size
                                      )}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 5,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                                <div className='data-listQuestion'>
                                  <div className='odd-questiontitle'>
                                    <h5>Job Duration</h5>
                                  </div>
                                  <div className='even-QuestionAns'>
                                    <span style={{ marginRight: "10px" }} >
                                      {searchParameterName?.job_duration}
                                    </span>
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 5,
                                          secondIndex: 0,
                                        },
                                      })}>
                                      <FontAwesomeIcon icon={faPenToSquare} />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-12 right-block">
                        <div className="table-content">
                          <div className="table-details grid-tablegallery">
                            <div className="table-details Your-work">
                              <div className='table-datadetails'>
                                <div className='details-card'>
                                  <label className="odd">YOUR WORK</label>
                                </div>
                                <div className='details-card-body'>
                                  <div className='data-listQuestion'>
                                    <div className='odd-questiontitle'>
                                      <h5>Position</h5>
                                    </div>
                                    <div className='even-QuestionAns'>
                                      <span style={{ marginRight: "10px" }}>
                                        {employeeProfile?.employee_position}
                                      </span>
                                      <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                        {
                                          state: {
                                            firstIndex: 1,
                                            secondIndex: 0,
                                          },
                                        })}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                      </a>
                                    </div>
                                  </div>
                                  <div className='data-listQuestion'>
                                    <div className='odd-questiontitle'>
                                      <h5>Preferred Vessel Type</h5>
                                    </div>
                                    <div className='even-QuestionAns'>
                                      <span style={{ marginRight: "10px" }} >
                                        {employeeProfile?.employee_vessel}
                                      </span>
                                      <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                        {
                                          state: {
                                            firstIndex: 1,
                                            secondIndex: 1,
                                          },
                                        })}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                      </a>
                                    </div>
                                  </div>
                                  <div className='data-listQuestion'>
                                    <div className='odd-questiontitle'>
                                      <h5>Salary Expectations</h5>
                                    </div>
                                    <div className='even-QuestionAns'>
                                      <span style={{ marginRight: "10px" }}>
                                        {employeeProfile?.employee_salary_expection}
                                      </span>
                                      <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                        {
                                          state: {
                                            firstIndex: 1,
                                            secondIndex: 2,
                                          },
                                        })}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="odd">media</th>
                                  <th className="even">
                                    <a onClick={() => navigate(`/cruz/createprofile/${employeeProfile.employee_id}`,
                                      {
                                        state: {
                                          firstIndex: 0,
                                          secondIndex: 6,
                                        },
                                      })}><FontAwesomeIcon icon={faPenToSquare} /></a>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <div className="grid-gallery">
                                    {medias?.map((media, index) => {
                                      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
                                      const extension = media.media_file.split('.').pop()?.toLowerCase() || '';
                                      const className =
                                        index % 2 === 0 ? "even col-6 " : "odd col-6";
                                      if (imageExtensions.includes(extension)) {
                                        return (
                                          <div className={className} key={index}>
                                            <div className="image-grid">
                                              <img
                                                src={baseUrl + media.media_file}
                                                alt=""
                                                className="img-fluid"
                                              />
                                            </div>
                                          </div>
                                        );
                                      } else {
                                        return (
                                          <div className={className} key={index}>
                                            <div className="image-grid">
                                              <VideoPlayer
                                                videoId="specialist-video"
                                                chapters={[]}
                                                source={baseUrl + media.media_file}
                                              />
                                            </div>
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="action-field">
                          <div className="card">
                            <div className="card-body">
                              <div className="card-content">
                                <Button
                                  text="Preview My Profile"
                                  icon={false}
                                  className="btn-prev btn-transparent"
                                  // onClick={handlePreview}
                                  onClick={toggle}
                                />
                                <p>
                                  When you’re satified with your choices, click below.
                                  You can edit and update your profile at any time.
                                </p>
                                <div className="btn-action">
                                  <Button
                                    // onClick={() => navigate('/cruz/Register')}
                                    onClick={handleSubmit}
                                    text="Post"
                                    icon={true}
                                    theme="light"
                                    className="w-100"
                                  />
                                </div>
                                <div className="action-button">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div className="goback">
                                      <a onClick={handleSubmit}>Go back</a>
                                    </div>
                                    <div className="goback">
                                      <a onClick={handleSubmit}>Save and exit</a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CruzLayout>
      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        className="Preview-mode-modal"
      >
        <ModalBody>
          <ModalHeader toggle={toggle}>
          </ModalHeader>
          <div className="action-modal">
            <EmployeeProfile employeeProfile={employeeProfile} medias={medias} />
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};
