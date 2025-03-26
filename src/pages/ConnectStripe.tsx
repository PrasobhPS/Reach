import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConnectStripe() {
    const navigate = useNavigate();

    // Utility to check if the browser is mobile
    const isMobileBrowser = () => {
        const userAgent = navigator.userAgent || navigator.vendor;
        return /android|iphone|ipad|ipod/i.test(userAgent);
    };

    useEffect(() => {
        if (isMobileBrowser()) {
            // Redirect to app via custom URL scheme
            const appUrl = "myapp://profile";
            window.location.href = appUrl;

            // Fallback to profile page if the app is not installed
            setTimeout(() => {
                navigate("/profile"); // Fallback navigation
            }, 2000); // Adjust timeout as needed
        } else {
            // If not on a mobile browser, navigate to the profile page
            navigate("/profile");
        }
    }, [navigate]);

    return <div>Connecting to Stripe...</div>;
}

export default ConnectStripe;
