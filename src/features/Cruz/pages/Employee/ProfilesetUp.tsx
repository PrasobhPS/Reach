import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "../../../../assets/scss/employee.scss";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, NavLink } from "reactstrap";
import { Heading } from '../../../../components/Heading/Heading';
import { Button } from '../../../../components/Button/Button';
import { Hero } from '../../../../components/Hero/Hero';
import { useNavigate } from "react-router-dom";
import { useCMSPageMutation } from '../../../CmsContent/CmsContentApiSlice';
export interface CruzeWork {
    cruz_title: string;
    short_description: string;
    cruz_description: string;

}
export const ProfileSetup = () => {
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate("/cruz/createprofile");
    };
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
    };
    const [cmsPageMutation, { isLoading }] = useCMSPageMutation();
    const [cruzDetails, setCruzDetails] = useState<CruzeWork>({ cruz_title: '', short_description: '', cruz_description: '' });
    const fetchCMSContentFromAPI = async () => {
        try {
            const response = await cmsPageMutation({ slug: 'cruz_jobs' });
            if ("error" in response) {
                throw new Error("Failed to fetch cms page");
            } else {
                const data = await response.data.data;;
                const short_description = data.cruz_description.slice(0, 167) + "...";
                setCruzDetails({ cruz_title: data.cruz_title, short_description: short_description, cruz_description: data.cruz_description });
            }


        } catch (error) {
            console.error("Failed to cms page codes:", error);
        }
    };

    // Fetch cms page  when the component mounts
    useEffect(() => {
        fetchCMSContentFromAPI();
    }, []);

    return (
        <div className="Employee-profilesetup">
            <Hero
                className="d-none"
                source={require("../../../../assets/images/cruz/hero-sec.png")}
                title="let’s set up your profile"
            >
            </Hero>
            <div className='profile-setup'>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <div className="setupprofile-leftblock">
                                <img src={require("../../../../assets/images/cruz/cruz-image.png")} alt="" className="img-fluid" />
                                <div className="caption">
                                    <h2 className="customHeading">let’s set up your profile</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="profilesetup-rightblock">
                                <div className="card">
                                    <div className="card-body">
                                        <div>
                                            <Button
                                                onClick={() => handleSubmit()}
                                                text="Begin"
                                                icon={true}
                                                theme="light"
                                                className="w-100"
                                            />
                                        </div>
                                        <div className="caption-text">
                                            <img src={require("../../../../assets/images/cruz/timer.png")} alt="" className="img-fluid" />
                                            <span>Takes approximately 6 mins to complete</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-details">
                                    <h2 className="customHeading">{cruzDetails.cruz_title}</h2>
                                    <div className="details">
                                        <span>
                                            <div className="text-white"
                                                dangerouslySetInnerHTML={{ __html: cruzDetails.short_description }}
                                            />
                                        </span>
                                        <a className="action-link" onClick={() => toggle()}>Learn more</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modal}
                toggle={toggle}
                centered
                className="CRUZ-info-Modal"
            >
                <ModalBody>
                    <ModalHeader toggle={toggle}>
                        <Heading tag="h3" className="text-center">

                            {cruzDetails.cruz_title}
                        </Heading>
                    </ModalHeader>
                    <div className="modal-content-details">
                        <div className="text-black"
                            dangerouslySetInnerHTML={{ __html: cruzDetails.cruz_description }}
                        />
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}
export default ProfileSetup;