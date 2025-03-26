import React, { useEffect, useState } from "react";
import { Button } from "../components/Button/Button";
import { CmsHeader } from "../components/CmsHeader/CmsHeader";
export const Charter = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.booking-manager.com/down/wbm-alter.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <div className="charter-page">
            <CmsHeader links={[]}></CmsHeader>
            <div className="innter-content pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            {/* <iframe 
                                width="100%" 
                                height="1000" 
                                frameBorder="0" 
                                scrolling="auto" 
                                src="https://www.booking-manager.com/wbm2/page.html?companyid=7159&setlang=en&view=SmallSearchForm" 
                                allowTransparency
                            ></iframe> */}
                            <iframe id="wbmResult"
                                className="wbm"
                                width="100%"
                                height="800"
                                frameBorder="0"
                                scrolling="auto"
                                src="https://www.booking-manager.com/wbm2/page.html?companyid=7159&setlang=en&resultsPerPage=25"
                                allowTransparency
                                data-ccm-domain="www.booking-manager.com">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Charter;