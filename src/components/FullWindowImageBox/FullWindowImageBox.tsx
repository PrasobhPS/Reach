import { FullWindowImageBoxProps } from '../../types';
import './FullWindowImageBox.scss'

export const FullWindowImageBox = (props: FullWindowImageBoxProps) => {
    const { isVideo, source, children, className } = props;

    return (
        <div className={`container-fluid g-0 full-window-image-box ${className}`}>
            <div className="row g-0">
                <div className="col-12">
                    {
                        isVideo ? (
                            <>
                                <div className='video-box'>
                                    <video playsInline muted autoPlay loop>
                                        <source src={source} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </>
                        )
                            :
                            (
                                <>
                                    <div className="image-box">
                                        <img src={source} alt="" />
                                    </div>
                                </>
                            )
                    }
                    <div className='content-box'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}