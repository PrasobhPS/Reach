import React, { useEffect, useState } from "react";
import { Hero } from "../Hero/Hero";
import { useCMSPageMutation } from "../../features/CmsContent/CmsContentApiSlice";
import { CmsPage } from "../../types";
import { useLocation } from 'react-router-dom';
import MenuSlider from "../MenuSlider/MenuSlider";

interface Props {
    links: { url: string, text: string }[];
}

export const CmsHeader: React.FC<Props> = ({ links }) => {

    const location = useLocation();
    const urlPartWithSlash = location.pathname;
    // Remove the leading slash
    let urlPart = urlPartWithSlash.substring(1);
    let from = '';

    if (urlPart === 'member-signup' || urlPart.split('/')[0] === 'member-signup' || urlPart === 'joinmembership' || urlPart.split('/')[0] === 'joinmembership' || urlPart === 'freemembership') {
        from = 'join';
    }

    const [cmsPageDetails, setCmsPage] = useState<CmsPage>({ pageHeader: '', pageDetails: '', pageImage: '', pageSlug: '', leftsidecontent: '' });

    const [cmsPageMutation, { isLoading }] = useCMSPageMutation();

    // Function to fetch cms page from the API
    const fetchCMSContentFromAPI = async () => {
        try {
            if (from === 'join') {
                urlPart = urlPart.split('/')[0];
            }
            const response = await cmsPageMutation({ slug: urlPart });
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
        <>
            <Hero
                source={cmsPageDetails?.pageImage}
                title={cmsPageDetails.pageHeader}
                from={from}
            >
                {urlPart === 'discover-reach' ? (
                    <div className="inner-child">
                        <div className="row w-100">
                            <div className="w-50 py-4 w-sm-100">{cmsPageDetails.leftsidecontent && (
                                <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: cmsPageDetails.leftsidecontent }}
                                />
                            )}

                            </div>
                            <div className="w-50 py-4 w-sm-100">
                                <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: cmsPageDetails.pageDetails }}
                                />
                            </div>

                        </div>
                    </div>
                ) : (
                    urlPart !== 'legal' && urlPart !== 'privacy' && (
                        <div className='inner-child inner-subtext'>
                            <div className="subtext">
                                <div className="text-white text-custom"
                                    dangerouslySetInnerHTML={{ __html: cmsPageDetails.pageDetails }}
                                />
                            </div>
                        </div >
                    )

                )}

                {/* Render MenuSlider if links exist */}
                {/* {links && links.length > 0 && (
                <MenuSlider links={links} />
            )} */}
            </Hero >

            {
                urlPart === 'legal' || urlPart === 'privacy' ? (
                    <div className="container mb-20">
                        <div className="row">
                            <div className="col-md-10 offset-md-1">
                                <div className='inner-child inner-subtext'>
                                    <div className="subtext">
                                        <div className="text-white text-custom"
                                            dangerouslySetInnerHTML={{ __html: cmsPageDetails.pageDetails }}
                                        />
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                ) : ""
            }
        </>
    )
}