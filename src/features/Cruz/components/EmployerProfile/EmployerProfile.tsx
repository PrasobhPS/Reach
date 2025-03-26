import { CustomSlider } from "../../../../components/CustomSlider/CustomSlider";
import { Heading } from "../../../../components/Heading/Heading";
import "./EmployerProfile.scss";
import { Button } from "../../../../components/Button/Button";
import { useEmployerProfileQuery } from "./EmployerProfileApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
interface Media {
  media_file: string;
}
interface JobProfile {
  members_fname?: string;
  members_lname?: string;
  vessel_size?: number;
  job_duration?: string;
  boat_location?: string;
  employee_intro?: string;
  job_role?: string;
  boat_type?: string;
  job_start_date?: string;
  vessel_desc?: string;
  vessel_type?: string;
  job_summary?: string;
  is_match?: string;
  is_liked?: string;
}

interface EmployerProfileProps {
  jobProfile: JobProfile | null;
  medias: Media[];
  from?: string;
}
export const EmployerProfile: React.FC<EmployerProfileProps> = ({
  jobProfile,
  medias,
  from
}) => {
  const baseUrl = process.env.REACT_APP_STORAGE_URL;
  const [slides, setSlides] = useState<{ image: string; alt: string }[]>([]);

  useEffect(() => {
    if (medias?.length > 0) {
      const newSlides = medias.map((media: Media) => ({
        image: baseUrl + "/" + media.media_file,
        alt: "Image",
        url: '#',
        isLink: true,
      }));
      setSlides(newSlides);
    }
  }, [medias]);

  // const slides = [
  //   {
  //     image: require("../../../../assets/images/partners/banner-1.png"),
  //     alt: "Image 1",
  //   },
  //   {
  //     image: require("../../../../assets/images/partners/banner-1.png"),
  //     alt: "Image 2",
  //   },
  //   {
  //     image: require("../../../../assets/images/partners/banner-1.png"),
  //     alt: "Image 2",
  //   },
  // ];

  const slidesettings = {
    slidesToShow: 2,
    dots: true,
    slidesToScroll: 1,
    infinite: slides.length > 1,
    centerPadding: "100%",
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "10%",
          arrows: false,
        },
      },
    ],
  };
  let redirect = '/cruz/employeedashboard';
  if (from === 'Employer') {
    redirect = "/cruz/viewcampaign/livecampaign";
  }
  return (
    <div className="profile-section">
      <Breadcrumbs
        mainbreadcrumb="Dashboard"
        secondbreadcrumb={`${jobProfile?.job_role} for ${jobProfile?.job_duration} in the ${jobProfile?.boat_location}`}
        redirectUrl={redirect}
      />

      <div className="view-profile-section">
        <div className="profile-box">
          <div className="profile-box-header">
            <div className="profile-name">
              <Heading>
                {jobProfile?.job_role}
              </Heading>
              {/* <div className="location">{jobProfile?.location_name}</div> */}
            </div>
            {/* <div className="profile-status">
              <span>Available</span>
            </div> */}
            {jobProfile?.is_liked && jobProfile.is_liked === 'Y' && jobProfile.is_match !== 'Y' && (
              <div className="TheyLikeYou">
                <span>
                  THEY LIKE YOU</span>
              </div>
            )}
          </div>
          <div className="profile-box-body">
            <ul className="quick-details">
              <li>{jobProfile?.vessel_size} {jobProfile?.boat_type}</li>
              <li>{jobProfile?.job_duration}</li>
              <li>{jobProfile?.boat_location}</li>
            </ul>
            <div className="profile-overview">
              <p>{jobProfile?.employee_intro}</p>
            </div>
            {slides?.length > 0 ? (
              <CustomSlider settings={slidesettings} items={slides} />
            ) : (
              ""
            )}
            <div className="employer-custom-card">
              <div className="employer-custom-card-title">
                <Heading>The Role</Heading>
              </div>
              <div className="employer-custom-card-body">
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Job Title :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.job_role}</span>
                    </div>
                  </div>

                </div>
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Boat Type :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.boat_type}</span>
                    </div>
                  </div>
                </div>
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Duration :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.job_duration}</span>
                    </div>
                  </div>
                </div>
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Start Date :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.job_start_date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="employer-custom-card">
              <div className="employer-custom-card-title">
                <Heading>The Boat</Heading>
              </div>
              <div className="employer-custom-card-body">
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Vessel :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.vessel_desc}</span>
                    </div>
                  </div>
                </div>
                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Location :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.boat_location}</span>
                    </div>
                  </div>
                </div>

                <div className="item-box row">
                  <div className='options-heading col-md-3 col-5'>
                    <label>Size :</label>
                  </div>
                  <div className='col-xl-9 col-6'>
                    <div className="view-data">
                      <span>{jobProfile?.vessel_size} {jobProfile?.boat_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="employer-custom-card">
              <div className="employer-custom-card-title">
                <Heading>Summary</Heading>
              </div>
              <div className="employer-custom-card-body">
                <div className="item-box">
                  <span>{jobProfile?.job_summary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
