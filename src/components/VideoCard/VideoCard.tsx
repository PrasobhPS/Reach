import { Link, useNavigate } from 'react-router-dom'
import './VideoCard.scss'
import { Heading } from '../Heading/Heading'
import { VideoCardProps } from '../../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from "@fortawesome/free-solid-svg-icons"

export const VideoCard = (props: VideoCardProps) => {
    const { id, image, title, subtitle, videos, location, videoUrl, bio } = props.data;

    // Function to handle click event
    const handleClick = () => {

        props.onClick?.(videoUrl); // Pass the video source to the parent component
    };
    const navigate = useNavigate();
    return (
        <div className='videocard' onClick={handleClick}>
            <div style={{ cursor: "pointer" }} className='text-white' onClick={() => navigate(`/specialists-details`,
                {
                    state: id,
                })}>
                <div className='img-box'>
                    {image ? (
                        <img src={image} className='img-fluid' />
                    ) : (
                        <img src={require("../../assets/images/profile/Default.jpg")} className='img-fluid' />
                    )}

                    <span className='playbtn'>
                        <img src={require("../../assets/images/specialists/PlayButton.png")} />
                        {/* <FontAwesomeIcon icon={faPlay} /> */}
                    </span>
                </div>
                <div className="content-box">
                    <Heading tag='h6'>
                        <a style={{ cursor: "pointer" }} onClick={() => navigate(`/publicprofile`,
                            {
                                state: id,
                            })}>{title}</a>
                    </Heading>
                    <p>{subtitle}</p>
                    {/* {bio != '' && (
                        <div className='desc-box'>{bio}</div>
                    )}
                    {location != '' && (
                        <div className='desc-box'>{location}</div>
                    )} */}

                </div>
            </div>
        </div>
    )
}