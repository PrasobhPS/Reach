import React from 'react';
import { TwoColumnImageBoxProps } from '../../types';
import './TwoColumnImageBox.scss';

export const TwoColumnImageBox = (props: TwoColumnImageBoxProps) => {
    const { source, children, swapColumn, isBackground, logo } = props;

    // Define the style object for background image if isBackground is true
    const backgroundStyle = isBackground ? { backgroundImage: `url(${source})` } : {};

    return (
        <div className={`container-fluid two-col-box g-0 ${isBackground ? 'background-image' : ''}`} style={backgroundStyle}>
            <div className="logo-container">
                {logo && (<img src={logo} alt="Image"  className='img-fluid' />)}
            </div>
            <div className='row g-0 align-items-center Twocolumnimagebox'>
                <div className={`col-md-6 col-12 ${swapColumn ? 'order-md-last' : ''}`}>
                    <div className='image-box'>
                        {!isBackground && <img src={source} alt="Image" className='img-fluid' />}

                    </div>
                </div>
                <div className='col-md-6 col-12'>
                    <div className='content-box'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoColumnImageBox;
