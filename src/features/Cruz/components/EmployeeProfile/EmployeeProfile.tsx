import { CustomSlider } from "../../../../components/CustomSlider/CustomSlider";
import { Heading } from "../../../../components/Heading/Heading";
import "./EmployeeProfile.scss";
import { Button } from "../../../../components/Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEmployeeProfileQuery } from "../ReviewEmployeeProfile/EmployeeProfileApiSlice";
import React from "react";


interface Media {
    id: number;
    media_file: string;
}
interface Slide {
    image: string;
    url: string;
    alt: string;
    isLink: boolean;
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

interface EmployeeProfileProps {
    employeeProfile: EmployeeProfile | null;
    medias: Media[];
}
export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
    employeeProfile,
    medias
}) => {

    const calculateAge = (dob: string | undefined): number => {
        if (dob != undefined) {
            const birthDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                return age - 1;
            }

            return age;
        }
        return 0;
    };
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    let slides: Slide[] = [];
    let imageNum = 1;

    if (Array.isArray(medias)) {
        imageNum = medias.length;
        slides = medias
            .filter((media: Media) => {
                const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
                const extension = media.media_file.split('.').pop()?.toLowerCase();
                return imageExtensions.includes(extension || '');
            })
            .map((media: Media) => ({
                image: baseUrl + media.media_file,
                url: '#',
                alt: `Image ${media.id}`,
                isLink: true,
            }));
    }
    const slidesettings = {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: slides.length > 1,
        dots: true,
        centerPadding: "100%",
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    centerPadding: "10%",
                    arrows: false,
                },
            },
        ],
    };



    return (
        <div className="profile-section">
            <div className="view-profile-section">
                <div className="profile-box">
                    <div className="profile-box-header">
                        <div className="profile-name">
                            <Heading>
                                {employeeProfile?.members_fname +
                                    " " +
                                    employeeProfile?.members_lname}
                            </Heading>
                            <div className="location">{employeeProfile?.employee_location}</div>
                        </div>
                        {employeeProfile?.is_liked && employeeProfile?.is_liked === 'Y' && employeeProfile?.is_match !== 'Y' && (
                            <div className="profile-status">
                                <span className="d-block">Available</span>
                                <div className="Matched ">
                                    <span className="Matched-names">I’M KEEN</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-box-body">
                        <ul className="quick-details">
                            <li>{employeeProfile?.employee_role}</li>
                            <li>{calculateAge(employeeProfile?.employee_dob)} years</li>
                            <li>{employeeProfile?.employee_gender}</li>
                        </ul>
                        <div className="profile-overview" style={{ whiteSpace: "pre-line" }}>
                            <p>{employeeProfile?.employee_intro} </p>
                        </div>
                        {slides?.length > 0 ? (
                            <CustomSlider settings={slidesettings} items={slides} />
                        ) : (
                            ""
                        )}
                        <div className="employer-custom-card">
                            <div className="employer-custom-card-title">
                                <Heading>Essentials</Heading>
                            </div>
                            <div className="employer-custom-card-body">
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Name:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span> {employeeProfile?.members_fname +
                                                " " +
                                                employeeProfile?.members_lname}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Role :</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-3'>
                                        <label>Nationality:</label>
                                    </div>
                                    <div className='col-xl-9 col-md-3 col-5'>
                                        <div className="view-data">
                                            <span> {employeeProfile?.employee_passport}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Available:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_avilable}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Age:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{calculateAge(employeeProfile?.employee_dob)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Location:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="employer-custom-card">
                            <div className="employer-custom-card-title">
                                <Heading>interested in</Heading>
                            </div>
                            <div className="employer-custom-card-body">
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Duration:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_position}</span>
                                        </div>
                                    </div>

                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Vessel Type:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_vessel}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Salary:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_salary_expection}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="employer-custom-card">
                            <div className="employer-custom-card-title">
                                <Heading>HISTORY</Heading>
                            </div>
                            <div className="employer-custom-card-body">
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Years experience:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_experience}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Last Role:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <span style={{ whiteSpace: "pre-line" }}>{employeeProfile?.employee_last_role}</span>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Qualifications:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_qualification}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="employer-custom-card">
                            <div className="employer-custom-card-title">
                                <Heading>OTHER</Heading>
                            </div>
                            <div className="employer-custom-card-body">
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Languages:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_languages}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Visas:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_visa}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Interests:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>{employeeProfile?.employee_interest}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-box row">
                                    <div className='options-heading col-md-3 col-5'>
                                        <label>Reference:</label>
                                    </div>
                                    <div className='col-xl-9 col-6'>
                                        <div className="view-data">
                                            <span>
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

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="employer-custom-card">
                            <div className="employer-custom-card-title">
                                <Heading>Bio</Heading>
                            </div>
                            <div className="employer-custom-card-body">
                                <div className="item-box">
                                    <span style={{ whiteSpace: "pre-line" }}>{employeeProfile?.employee_about} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}