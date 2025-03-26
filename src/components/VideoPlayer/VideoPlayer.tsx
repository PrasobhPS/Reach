import React, { useState, useEffect, useRef } from 'react';
import { VideoPlayerProps } from '../../types';
import { Progress } from 'reactstrap';
import './VideoPlayer.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faVolumeUp, faVolumeMute, faExternalLink } from "@fortawesome/free-solid-svg-icons";
const VideoPlayer = (props: VideoPlayerProps) => {
    const { videoId, chapters = [], source, autoPlay } = props; // Provide a default value for chapters
    const [play, setPlay] = useState(true);
    const [currentChapter, setCurrentChapter] = useState<number | null>(null);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoAvailable, setIsVideoAvailable] = useState(true);
    useEffect(() => {

        const video = document.getElementById(videoId) as HTMLVideoElement | null;
        if (video) {
            if (autoPlay) {
                video.play();
            }

            const handleTimeUpdate = () => {
                const currentTime = video.currentTime * 1000; // Convert current time to milliseconds
                const chapterIndex = chapters.findIndex(chapter => currentTime < chapter.time * 1000);
                setCurrentChapter(chapterIndex === -1 ? chapters.length - 1 : chapterIndex);
            };

            video.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, [videoId, chapters]);

    const videoSkip = (time: number) => {
        const video = document.getElementById(videoId) as HTMLVideoElement | null;
        if (video) {
            video.currentTime = time;
            if (video.paused) {
                video.play();
            }
        }
    };
    const handlePlayPause = () => {
        const video = document.getElementById(videoId) as HTMLVideoElement | null;

        if (video) {
            if (play) {
                video.pause();
            } else {
                video.play();
            }
            setPlay(!play);
        }
    };
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        setVolume(volume);
        if (videoRef.current) {
            videoRef.current.volume = volume;
            setIsMuted(volume === 0);
        }
    };
    const handleMuteUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };
    const handleVideoLoaded = () => {
        setIsVideoAvailable(true);
    };

    const handleVideoError = () => {
        setIsVideoAvailable(false);
    };

    return (
        <div className="video-player-box">
            <video className="w-100" onLoadedMetadata={handleVideoLoaded} onError={handleVideoError} id={videoId} controls={false} playsInline src={source} autoPlay={false} ref={videoRef}></video>
            {isVideoAvailable && (
                <div className='controls'>
                    <button onClick={handlePlayPause} className="play-button" disabled={!isVideoAvailable}>
                        {play ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    </button>
                    <div className="videoplayer-controls">
                        {/* <button className="ExternalLink">
                            <FontAwesomeIcon icon={faExternalLink} />
                        </button> */}
                        <button onClick={handleMuteUnmute} className="mute-button" disabled={!isVideoAvailable}>
                            {isMuted ? <FontAwesomeIcon icon={faVolumeMute} /> : <FontAwesomeIcon icon={faVolumeUp} />}
                        </button>
                    </div>
                </div>
            )}
            {/* <ul>
                {chapters.map((chapter, index) => (
                    <li key={index}>
                        <button
                            onClick={() => videoSkip(chapter.time)}
                            className={index === currentChapter ? 'active' : ''}
                        >
                            <Progress value={50} />
                            {chapter.title} ({chapter.time})
                        </button>
                    </li>
                ))}
            </ul> */}
        </div>
    );
};

export default VideoPlayer;
