import React, { useEffect, useState } from "react";
import { useCMSPageMutation } from "../../features/CmsContent/CmsContentApiSlice";
import { CmsPage } from "../../types";
import { useLocation } from 'react-router-dom';

export const Privacy = () => {

    const location = useLocation();

    const [cmsPageDetails, setCmsPage] = useState<CmsPage>({ pageHeader: '', pageDetails: '', pageImage: '', pageSlug: '', leftsidecontent: '' });

    const [cmsPageMutation, { isLoading }] = useCMSPageMutation();

    // Function to fetch cms page from the API
    const fetchCMSContentFromAPI = async () => {
        try {
            const response = await cmsPageMutation({ slug: 'privacy' });
            if ("error" in response) {
                throw new Error("Failed to fetch cms page");
            }
            const data = await response.data.data;
            setCmsPage(data); // Update state with fetched data
        } catch (error) {
            console.error("Failed to cms page codes:", error);
        }
    };

    // Fetch cms page  when the component mounts
    useEffect(() => {
        fetchCMSContentFromAPI();
    }, []);
    return (
        <div className="terms-and-condition">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        <div className='inner-child inner-subtext'>
                            <div className="subtext">
                                <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: cmsPageDetails.pageDetails }}
                                />
                            </div>
                        </div >
                    </div>
                </div >
            </div >
        </div>
    )
}
export default Privacy;