import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { getUserData } from "../utils/Utils";
import { EmployeeInterface, MemberInterface, MessageInterface, MessageRequestInterface } from '../types/PrivateChatInterfaces';
import EnvelopeIcon from '../features/Chat/PrivateChat/components/EnvelopeIcon';

interface ISocketContext {
    socket: Socket | null;
    joinChat: () => void;
    leaveChat: () => void;
    isConnected: boolean;
    privateChatMember: MemberInterface | undefined;
    setPrivateChatMember: React.Dispatch<React.SetStateAction<MemberInterface | undefined>>;
    showChatList: boolean;
    setShowChatList: React.Dispatch<React.SetStateAction<boolean>>;
    isChatVisible: boolean;
    isInterview: boolean;
    employeeDetails: EmployeeInterface | undefined;
    setIsChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setIsInterview: React.Dispatch<React.SetStateAction<boolean>>;
    setEmployeeDetails: React.Dispatch<React.SetStateAction<EmployeeInterface | undefined>>;
    privateMembers: MemberInterface[];
    setPrivateMembers: React.Dispatch<React.SetStateAction<MemberInterface[]>>;
    cruzMembers: MemberInterface[];
    messageRequests: MessageRequestInterface[];
    isShowEnvelopeIcon: boolean;
    setIsShowEnvelopeIcon: React.Dispatch<React.SetStateAction<boolean>>;
    chatType: string;
    setChatType: React.Dispatch<React.SetStateAction<string>>;
    notifications: MessageInterface[];
    setNotifications: React.Dispatch<React.SetStateAction<MessageInterface[]>>;
    cruzPendingMsgCount: number;
    setCruzPendingMsgCount: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);
const socketUrl: string = process.env.REACT_APP_SOCKET_URL as string;

export const useSocket = (): ISocketContext => {
    const context = useContext(SocketContext);

    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
};

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [privateChatMember, setPrivateChatMember] = useState<MemberInterface>();
    const [showChatList, setShowChatList] = useState<boolean>(false);
    const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
    const [isInterview, setIsInterview] = useState<boolean>(false);
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeInterface>();
    const [privateMembers, setPrivateMembers] = useState<MemberInterface[]>([]);
    const [cruzMembers, setCruzMembers] = useState<MemberInterface[]>([]);
    const [messageRequests, setMessageRequests] = useState<MessageRequestInterface[]>([]);
    const [isShowEnvelopeIcon, setIsShowEnvelopeIcon] = useState<boolean>(true);
    const [chatType, setChatType] = useState<string>('PRIVATE');
    const [notifications, setNotifications] = useState<MessageInterface[]>([]);
    const [cruzPendingMsgCount, setCruzPendingMsgCount] = useState<number>(0);

    const joinChat = () => {
        const userData = getUserData('userData');

        if (userData?.Member_id && socket?.connected) {
            socket.emit("privateJoin", { member_id: userData.Member_id });
        }
    };

    const leaveChat = () => {
        socket?.emit("privateLeave");
    };

    useEffect(() => {
        if (socket?.connected) {
            joinChat();
        }
    }, [socket]);

    useEffect(() => {
        if (isChatVisible && !isShowEnvelopeIcon) {
            setIsShowEnvelopeIcon(true);
        }
    }, [isChatVisible]);

    useEffect(() => {
        if (!socket?.connected) return;

        if (chatType == 'PRIVATE') {
            socket.emit('privateMembers');
            socket.emit('unreadMessageCount');
        } else if (chatType == 'CRUZ') {
            socket.emit('cruzChatList');
            socket.emit('unreadCruzMessageCount');
        }
    }, [isChatVisible])

    useEffect(() => {
        if (!socket?.connected) return;

        socket.on('unreadCruzMessageCount', (count: number) => {
            setCruzPendingMsgCount(count);
        });

        return () => {
            socket.off('unreadCruzMessageCount');
        };
    }, [socket]);

    useEffect(() => {
        const newSocket = io(socketUrl, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            secure: true,
            withCredentials: true,
        });

        newSocket.on('connect', () => {
            setSocket(newSocket);
            setIsConnected(true);
            //console.log('Socket:', 'Chat server connected');
        });

        newSocket.on('disconnect', () => {
            setSocket(null);
            setIsConnected(false);
            //console.log('Socket:', 'Chat server disconnected');
        });

        newSocket.on('privateMembers', (privateMembers: MemberInterface[]) => {
            setPrivateMembers(privateMembers);
        });

        newSocket.on('messageRequest', (messageRequest: MessageRequestInterface) => {
            setMessageRequests((prevRequest) => {
                return [...prevRequest, messageRequest];
            });
            newSocket.emit('unreadMessageCount');
        });

        newSocket.on('messageRequests', (messageRequests: MessageRequestInterface[]) => {
            setMessageRequests(messageRequests);
        });

        newSocket.on('updatePrivateMembers', () => {
            newSocket.emit('privateMembers');
        });

        newSocket.on('updateCruzChatList', () => {
            newSocket.emit('cruzChatList');
        });

        newSocket.on('privateJoined', () => {
            newSocket.emit('unreadMessageCount');
            newSocket.emit('messageRequests');
            newSocket.emit('unreadCruzMessageCount');
        });

        newSocket.on('cruzChatList', (cruzMembers: MemberInterface[]) => {
            setCruzMembers(cruzMembers);
        });

        newSocket.on('updateCruzChatList', () => {
            newSocket.emit('cruzChatList');
            newSocket.emit('unreadCruzMessageCount');
        });

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            joinChat,
            leaveChat,
            isConnected,
            privateChatMember,
            cruzMembers,
            setPrivateChatMember,
            showChatList,
            setShowChatList,
            isChatVisible,
            setIsChatVisible,
            isInterview,
            setIsInterview,
            employeeDetails,
            setEmployeeDetails,
            privateMembers,
            messageRequests,
            isShowEnvelopeIcon,
            setIsShowEnvelopeIcon,
            chatType,
            setChatType,
            notifications,
            setNotifications,
            cruzPendingMsgCount,
            setCruzPendingMsgCount,
            setPrivateMembers
        }}>
            {children}
        </SocketContext.Provider>
    );
};
