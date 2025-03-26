export interface MemberInterface {
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile_picture: string;
    active: boolean;
    joined_at: string;
    pending_message_count: number;
    is_blocked: boolean;
    has_blocked_by: boolean;
    is_reported: boolean;
    has_reported_by: boolean;
    last_message_time?: string;
    job_role?: string;
    age?: string;
    gender?: string;
    job_summary?: string;
    location?: string;
    vessel_size?: string;
    about?: string;
    chat_request_status?: string;
}

export interface MessageInterface {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    status: string;
    message: string;
    timestamp: string;
    is_meeting?: string;
    is_file: string;
    file_path: string;
    emoji_replaced?: boolean;
    reply_of_message_id: string | null;
    reply_of_sender_id: string | null;
    reply_of_message: string | null;
    chat_type: string | null;
    url_keyword?: string;
    job_id?: string;
    employee_id?: string;
    is_reported?: number | null;
    reported_reason?: string | null;
}

export interface EmployeeInterface {
    employee_id: number | string;
    job_id: number;
}

export interface InterviewInterface {
    date: string;
    time: string;
    scheduler: MemberInterface;
    interview_id: string;
}

export interface MessageRequestInterface {
    request_id: string;
    member_id: string;
    member_fname: string;
    member_lname: string;
    member_profile_picture: string;
};

export interface ReactionInterface {
    id: string;
    message_id: string;
    member_id: string;
    reaction: string;
    emoji_id: string;
}
