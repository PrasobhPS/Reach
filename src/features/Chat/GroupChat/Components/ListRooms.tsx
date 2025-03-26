import { MemberInterface, MessageInterface, RoomInterface } from "../../../../types/GroupChatInterfaces";
import "../../../../components/chatDesign/ChatDesign.scss";
import { CustomSlider } from "../../../../components/CustomSlider/CustomSlider";
// import ChatLoader from "../../../../../components/Loader/ChatLoader";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
interface Props {
    roomId: string;
    rooms: RoomInterface[];
    members: MemberInterface[];
    handleshowUsers: () => void;
    messages: MessageInterface[];
    setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
    setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}
type SliderRef = Slider & { slickGoTo: (index: number) => void };

export const ListRooms = (data: Props) => {
    const rooms = data.rooms;
    const members = data.members;
    const handleshowUsers = data.handleshowUsers;
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const navigate = useNavigate();
    const sliderRef = useRef<SliderRef | null>(null);

    useEffect(() => {
        const activeElement = document.querySelector('.chat-slider-active');
        var currentIndex: any = activeElement?.parentElement?.parentElement?.dataset.index;
        var totalIndex: any = document.querySelectorAll('.slick-slide').length;
        if (activeElement && sliderRef.current) {
            sliderRef.current?.slickGoTo((totalIndex - 6 < currentIndex) ? totalIndex - 6 : currentIndex);
        }

        const mediaQuery = window.matchMedia('(max-width:767px)');
        if (mediaQuery.matches && activeElement && sliderRef.current) {
            sliderRef.current?.slickGoTo((totalIndex - 4 < currentIndex) ? totalIndex - 4 : currentIndex);
        }
    }, [rooms]);

    const slidesettings = {
        dots: false,
        infinite: false,
        slidesToShow: 6,
        // slidesToShow: rooms.length > 7 ? 7 : rooms.length,
        slidesToScroll: 1,
        draggable: false,
        variableWidth: false,
        centerPadding: "0",

        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    arrows: false,
                    centerPadding: "0px",
                    slidesToShow: 4,
                    variableWidth: true,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    arrows: false,
                    centerPadding: "0px",
                    slidesToShow: 4,
                    variableWidth: true,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    arrows: false,
                    centerPadding: "0",
                    slidesToShow: 4,
                    variableWidth: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerPadding: "0",
                    slidesToShow: 3,
                    variableWidth: true,
                },
            },
        ],
    };

    const formatRoomNames = (rooms: RoomInterface[]): RoomInterface[] => {
        rooms.map(room => {
            room.room_name = room.room_name.split(' ').map(word => {
                return word.trim().charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');

            return room;
        });

        return rooms;
    };

    const slides = formatRoomNames(rooms).map(room => ({
        image: baseUrl + room.room_image,
        alt: 'Club Image',
        title: room.room_name,
        active: (room.room_id == data.roomId),
        url: window.location.origin + '/group-chat/' + room.room_id,
        isLink: true,
        room_id: room.room_id
    }));

    const handleChangeGroup = (roomId: string) => {
        navigate('/group-chat/' + roomId);
    }

    const sliderClass = rooms.length < 4 ? 'slick-slider-wrapper few-items' : 'slick-slider-wrapper';
    return (
        <>
            <div className={rooms.length > 0 ? "chat-slider-block" : "d-none"}>
                <div className="container-fluid inner-slider-block">
                    <div className={`chat-slider ${sliderClass}`}>

                        <CustomSlider clickCallback={handleChangeGroup} settings={slidesettings} items={slides} ref={sliderRef} />
                    </div>
                </div>
            </div>
            <div className="room-container d-lg-none d-md-none" id="show_users" onClick={handleshowUsers}>
                <h5 className="chat-search-head">{members.length} GUESTS IN THE ROOM</h5>
            </div>
        </>
    );
}
