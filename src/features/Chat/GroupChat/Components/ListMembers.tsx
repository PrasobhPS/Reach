import SearchBar from "../../../../components/SearchBox/SearchBar"
import "../../../../components/chatDesign/ChatDesign.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberInterface } from "../../../../types/GroupChatInterfaces";
import { getUserData } from "../../../../utils/Utils";

interface Props {
    members: MemberInterface[];
    toggleList?: boolean;
}

export const ListMembers = ({ members, toggleList }: Props) => {
    const baseUrl = process.env.REACT_APP_STORAGE_URL;
    const [search, setSearch] = useState<string>('');
    const navigate = useNavigate();
    const userData = getUserData("userData");

    return (
        <div className={`chat-section ${toggleList ? '' : 'd-none'}`} id="show_user_list">
            <div className="chat-search-area">
                <div className="chat-head-warapper">
                    <h5 className="chat-search-head">{members.length} GUESTS IN THE ROOM</h5>
                    <div className="search-area">
                        <SearchBar onSearch={setSearch} />
                    </div>
                </div>
                <div className="search-results">
                    <ul>
                        {userData && <li className="align-items-center d-flex" key={userData.Member_id}>
                            <div className="user-img cursor-pointer" onClick={() => navigate(`/publicprofile`,
                                {
                                    state: userData.Member_id,
                                })}>
                                <img
                                    src={userData.members_profile_picture ? userData.members_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                    alt="Profile Image"
                                />
                            </div>
                            <label>You</label>
                        </li>}
                        {
                            members?.filter(member => member.member_fname.toLowerCase().includes(search.toLowerCase()) || member.member_lname.toLowerCase().includes(search.toLowerCase()))
                                .map((member) => {
                                    return (
                                        <li className="align-items-center d-flex" key={member.member_id}>
                                            <div className="user-img cursor-pointer" onClick={() => navigate(`/publicprofile`,
                                                {
                                                    state: member.member_id,
                                                })}>
                                                <img
                                                    src={member.member_profile_picture ? baseUrl + member.member_profile_picture : require("../../../../assets/images/profile/Default.jpg")}
                                                    alt="Profile Image"
                                                />
                                            </div>
                                            <label>{member.member_fname} {member.member_lname}</label>
                                        </li>
                                    );
                                })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}
