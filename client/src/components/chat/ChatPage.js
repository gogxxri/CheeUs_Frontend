import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatPage.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../login/OAuth';
import { 
    fetchChatRooms, 
    fetchTogetherChatRooms, 
    setSelectedChat, 
    setMessageInput, 
    setShowMessageInput, 
    setActiveKey, 
    updateMessageReadStatus,
    updateTogetherMessageReadStatus,
    updateOneOnOneChatRoomStatus,
    removeUserFromTogetherChatRoom
} from '../../store/ChatSlice';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import useSocketIo from '../../hooks/useSocketIo';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeKey = useSelector(state => state.chat.activeKey);
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const chatRooms = useSelector(state => state.chat.chatRooms);
    const togetherChatRooms = useSelector(state => state.chat.togetherChatRooms);
    const messageInput = useSelector(state => state.chat.messageInput);
    const showMessageInput = useSelector(state => state.chat.showMessageInput);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const { token, serverUrl } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 중 에러 발생:', error);
            }
        }
    }, [token]);

    const socket = useSocketIo(activeKey, selectedChat, loggedInUserId, setHasUnreadMessages);

    useEffect(() => {
        if (loggedInUserId) {
            dispatch(fetchChatRooms({serverUrl, loggedInUserId}));
            dispatch(fetchTogetherChatRooms());
        }
    }, [loggedInUserId, dispatch]);

    useEffect(() => {
        dispatch(setSelectedChat({ messages: [] }));
        dispatch(setMessageInput(''));
        dispatch(setShowMessageInput(false));
    }, [activeKey, dispatch]);

    const handlePersonClick = useCallback(async (roomId) => {
        try {
            const selectedRoom = chatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                console.error(`roomId ${roomId}에 해당하는 채팅방을 찾을 수 없습니다.`);
                return;
            }
            const response = await axios.get(`http://localhost:8889/api/messages/${roomId}`);
            const messages = response.data.map(message => ({
                ...message,
                write_day: new Date(message.writeDay || message.write_day).toISOString(),
                read: 1 
            }));
    
            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
    
            // 서버에 읽음 상태를 업데이트 요청
            dispatch(updateMessageReadStatus({ roomId }));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    }, [chatRooms, dispatch]);

    const handleTogetherRoomClick = useCallback(async (roomId) => {
        const userId = loggedInUserId;
        try {
            const selectedRoom = togetherChatRooms.find(room => room.roomId === roomId);
            if (!selectedRoom) {
                //console.error(`roomId ${roomId}에 해당하는 단체 채팅방을 찾을 수 없습니다.`);
                return;
            }
    
            const response = await axios.get(`http://localhost:8889/api/togetherMessages/${roomId}`);
            const messages = response.data.map(message => ({
                ...message,
                write_day: new Date(message.writeDay || message.write_day).toISOString(),
                read: Array.isArray(message.read) ? [...new Set([...message.read, userId])] : [userId] // 로그인한 사용자 아이디 추가
            }));
    
            dispatch(setSelectedChat({ ...selectedRoom, messages }));
            dispatch(setShowMessageInput(true));
            dispatch(setMessageInput(''));
    
            // 서버에 읽음 상태를 업데이트 요청
            dispatch(updateTogetherMessageReadStatus({ roomId, userId }));
        } catch (error) {
            console.error('메시지를 불러오는 중 에러 발생:', error);
        }
    }, [loggedInUserId, togetherChatRooms, dispatch]);

    const sendMessage = async (inputMessage) => {
        if (!inputMessage.trim() || !loggedInUserId) {
            console.log('Cannot send message: Empty input or missing user ID.');
            return;
        }
    
        // DB에 저장할 메시지
        const dbMessage = {
            sender_id: loggedInUserId,
            message: inputMessage,
            write_day: new Date().toISOString(),
            read: 0,
            ...(activeKey === 'one' ? { chat_room_id: selectedChat?.roomId } : { room_id: selectedChat?.roomId, read: [loggedInUserId] })
        };
    
        // 소켓으로 보낼 메시지
        const socketMessage = {
            ...dbMessage,
            ...(activeKey === 'one' ? {
                member: [selectedChat?.member1, selectedChat?.member2].filter(member => member !== loggedInUserId)
            } : {
                member: (selectedChat?.members || [])
            .filter(member => member.email !== loggedInUserId) 
            .map(member => member.email)
         })
        };
    
        // 소켓으로 메시지 전송
        if (socket.current) {
            socket.current.emit('sendMessage', socketMessage);
        } else {
            console.error('Socket is not connected.');
        }
    
        try {
            const endpoint = activeKey === 'one' ? 'http://localhost:8889/api/messages' : 'http://localhost:8889/api/togetherMessages';
            await axios.post(endpoint, dbMessage);
            dispatch(setMessageInput(''));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!loggedInUserId) {
        return (
            <div className="permissionMessage" >
                <div>로그인 후 이용할 수 있습니다.</div>
            </div>
        );
    }
    
    const formatMessageTime = (writeDay) => {
        const date = new Date(writeDay);
        return `${date.getHours()}:${date.getMinutes()}`;
    };

    const handleExitChat = (roomId) => {
        if (activeKey === 'one') {
            Swal.fire({
                title: '정말로 이 1:1 채팅방을 나가시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '채팅방 나가기',
                cancelButtonText: '머무르기'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(updateOneOnOneChatRoomStatus({ roomId, match: 3 }))
                        .then(() => {
                            dispatch(fetchChatRooms({ serverUrl, loggedInUserId }));
                            setSelectedChat(null); 
                            navigate('/chatpage');
                        })
                        .catch(err => console.error('1:1 채팅방 match 업데이트 오류:', err));
                }
            });
        } else {
            Swal.fire({
                title: '정말로 이 단체 채팅방에서 나가시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '채팅방 나가기',
                cancelButtonText: '머무르기'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(removeUserFromTogetherChatRoom({ roomId, userId: loggedInUserId }))
                        .then(() => {
                            dispatch(fetchTogetherChatRooms({ serverUrl, userId: loggedInUserId }));
                            setSelectedChat(null); 
                            navigate('/chatpage');
                        })
                        .catch(err => console.error('단체 채팅방에서 사용자 제거 오류:', err));
                }
            });
        }
    };

    return (
        <div className="chat-container">
            <div className="container-fluid chat-wrapper">
                <Nav variant="tabs" defaultActiveKey="one" onSelect={(selectedKey) => dispatch(setActiveKey(selectedKey))}>
                    <Nav.Item>
                        <Nav.Link eventKey="one">단둘이</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="together">함께</Nav.Link>
                    </Nav.Item>
                </Nav>

                <div className="row">
                    {activeKey === 'one' && (
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4 chat-left">
                                    <ChatList
                                        chatRooms={chatRooms}
                                        selectedChat={selectedChat}
                                        handlePersonClick={handlePersonClick}
                                        handleExitChat={handleExitChat} 
                                        isTogether={false}

                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        activeKey={activeKey}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeKey === 'together' && (
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-4 chat-left">
                                    <ChatList
                                        chatRooms={togetherChatRooms}
                                        selectedChat={selectedChat}
                                        handlePersonClick={handleTogetherRoomClick}
                                        handleExitChat={handleExitChat}
                                        isTogether={true}
                                    />
                                </div>
                                <div className="col-md-8 chat-right">
                                    <ChatWindow
                                        selectedChat={selectedChat}
                                        showMessageInput={showMessageInput}
                                        formatMessageTime={formatMessageTime}
                                        sendMessage={sendMessage}
                                        setMessageInput={(input) => dispatch(setMessageInput(input))}
                                        activeKey={activeKey}
                                        removeUserFromTogetherChatRoom={removeUserFromTogetherChatRoom}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;