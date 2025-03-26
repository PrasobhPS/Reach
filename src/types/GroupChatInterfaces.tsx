export interface MemberInterface {
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile_picture: string;
}

export interface MessageInterface {
    message_id: string;
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile_picture: string;
    content: string;
    file: string | null;
    timestamp: string;
    reply_of: string | null;
    reply_of_member_id: string | null;
    reply_of_member_fname: string | null;
    reply_of_member_lname: string | null;
    reply_of_member_profile_picture: string | null;
    reply_of_content: string | null;
    reply_of_file: string | null;
    emoji_replaced?: boolean;
    is_editing?: boolean;
}

export interface RoomInterface {
    room_id: string;
    room_name: string;
    room_image: string;
}

export interface replyInterface {
    reply_of_message_id: string;
    reply_of_member_id: string;
    reply_of_member_fname: string;
    reply_of_member_lname: string;
    reply_of_content: string;
    reply_of_file: string | null;
};

export interface ReactionInteface {
    reaction_id: string;
    room_id: string;
    message_id: string;
    reaction: string;
    emoji_id: string;
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile_picture: string;
}
