import React, { useEffect, useContext, useState, useRef, useCallback, useMemo } from 'react';
import { AuthContext } from '../login/OAuth';
import { jwtDecode } from 'jwt-decode';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useDispatch, useSelector } from 'react-redux';
import './chatPage.css';
import { selectProfiles, fetchUserProfiles } from '../../store/MatchSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { removeUserFromTogetherChatRoom, fetchTogetherChatRooms, setSelectedChat } from '../../store/ChatSlice';
import ReportModal from '../app/ReportModal';
import axios from 'axios';
import { useToast } from '../app/ToastProvider';
import useToProfile from '../../hooks/useToProfile';
import Swal from 'sweetalert2';

const ChatWindow = ({
    selectedChat,
    showMessageInput,
    formatMessageTime,
    sendMessage,
    setMessageInput,
    removeUserFromTogetherChatRoom,
    activeKey,
}) => {
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const { token, serverUrl, memberEmail } = useContext(AuthContext);

    const inputMessageRef = useRef(null);
    const scrollRef = useRef(null);

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState([]); 
    const [profileData, setProfileData] = useState([]); 
    const navigateToUserProfile = useToProfile();
    const isSender = (senderId) => senderId === loggedInUserId;

    const { toggleNotifications, isNotificationsEnabled } = useToast();

    // 신고 모달
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportedId, setReportedId] = useState(null);
    const handleReportModalOpen = () => setShowReportModal(true);
    const handleReportModalClose = () => setShowReportModal(false);
    
    // 날짜 포멧
    const formatDate = (date) => {
        // 예시 형식: 2024년 8월 2일
        return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
    };

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 에러:', error);
            }
        }
    }, [token]);

    // 채팅 참여자 불러오기
    useEffect(() => {
        if (selectedChat) {
            if (activeKey === 'together') {
                setParticipants(selectedChat.members || []);
            } else {
                setParticipants([selectedChat.member1, selectedChat.member2] || []);
            }
        }
        scrollToBottom();
    }, [selectedChat, activeKey, removeUserFromTogetherChatRoom]);


    const scrollToBottom = () => {
        if (scrollRef.current) {
            const element = scrollRef.current;
            const isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

            if (!isAtBottom) {
                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    };

    const getProfileForSender = async (email) => {
        if (email === "System" || email === memberEmail) {
            return null;
        }
        try {
            const response = await axios.get(`${serverUrl}/match/chattingPersonal`, {
                params: { email }
            }).catch((err)=>{
                if (err.response.data.message==="존재하지 않는 유저") {
                    return {
                        data : {
                            email : email,
                            imageType : null,
                            nickname : "알 수 없음"
                        }
                    };
                }
            });
            const profile = response.data;
            const profileData = {
                email: profile.email,
                nickname: profile.nickname,
                image: profile
                    ? profile.imageType : `${process.env.PUBLIC_URL}/images/default-user-icon.png`
            };
            return profileData;
        } catch (error) {
            console.error('프로필 이미지 가져오기 오류:', error);
            return `${process.env.PUBLIC_URL}/images/default-user-icon.png`;
        }
    }

    // 프로필 사진 저장 함수
    useEffect(() => {
        if (selectedChat && selectedChat.messages) {
            // 참여자 프로필 로드
            const newSenderIds = [...new Set(selectedChat.messages.map(msg => msg.sender_id))]
                                    .filter(id => !profileData[id]);
    
            const fetchProfiles = async () => {
                try {
                    const profilePromises = newSenderIds.map(id => getProfileForSender(id));
                    const profilesData = await Promise.all(profilePromises);
    
                    const newProfiles = profilesData.reduce((acc, profile, index) => {
                        if (profile) acc[newSenderIds[index]] = profile;
                        return acc;
                    }, {});
    
                    setProfileData(prevProfiles => ({ ...prevProfiles, ...newProfiles }));
                } catch (error) {
                    console.error('프로필 사진 로딩 오류:', error);
                }
            };
    
            fetchProfiles();
        }
    }, [selectedChat,participants]); 

    // 상단
    const getDisplayName = () => {
        if (!selectedChat || (!selectedChat.member1 && !selectedChat.member2 && !selectedChat.togetherId)) {
            return (
                <>
                    <div className='chat-window-top-no'>나랑 같이 취할 사람 찾으러 가기!</div>
                    {/*
                    <button className="notification-toggle no-style" onClick={toggleNotifications}>
                        {isNotificationsEnabled ? '🔔' : '🔕'}
                    </button>
                    */}
                </>
            ); 
        }
    
        if (selectedChat.togetherId) {
            const nonCurrentMembers = selectedChat.members.filter(member => member !== loggedInUserId);
            const avatarsToShow = nonCurrentMembers.slice(0, 1); 
            const additionalCount = nonCurrentMembers.length - 1; 
    
            return (
                <>
                    <div className="chat-name">
                        {selectedChat.togetherId}
                    </div>
                    <div className="participant-list">
                        <div className="participant-avatar-container">
                            {avatarsToShow.map((member, index) => (
                                <div
                                    key={index}
                                    className="participant-item"
                                    style={{ zIndex: avatarsToShow.length - index }}
                                >
                                    <img
                                        src={member.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`}
                                        alt={`member`}
                                        className="participant-img"
                                    />
                                </div>
                            ))}
                            {additionalCount > 0 && (
                                <div className="more-avatars">
                                     + {additionalCount}
                                </div>
                            )}
                        </div>
                        <button className="more" onClick={toggleParticipants}>
                            <MoreVertIcon />
                        </button>
                    </div>
                </>
            );
        }
    
       if (activeKey === 'one') {
        return (
            <>
            <div className="d-flex align-items-center">
                <div>
                <img 
                    src={selectedChat.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`} 
                    alt={`Profile of ${selectedChat.nickname}`} 
                    className="profile-img rounded-circle" 
                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                    onClick={() => navigateToUserProfile(selectedChat.member1 === memberEmail ? selectedChat.member2 : selectedChat.member1)}
                />
                <span onClick={() => navigateToUserProfile(selectedChat.member1 === memberEmail ? selectedChat.member2 : selectedChat.member1)}>{selectedChat.nickname}</span> 
                </div>
            </div>
            <div>
                <button  className="no-style" onClick={() => handleReport(selectedChat)}>🚨</button>
           </div>
           </>
        );
    }
    };

    const getDefaultMessage = () => {
        if (activeKey === 'one') {
            return ['조용하게', '둘이 한 잔?'];
        } else {
            return ['여럿이 먹는 술이', '더 꿀맛!'];
        }
    };
    
    const DefaultMessage = () => {
        const [line1, line2] = getDefaultMessage();
        return (
            <div>
                <>{line1}</>
                <br />
                <>{line2}</>
            </div>
        );
    };

    const toggleParticipants = () => {
        setShowParticipants(!showParticipants);
    };

    const getChatBubbleClasses = (senderId) => {
        return isSender(senderId) ? 'chat-bubble me' : 'chat-bubble you';
    };

    const renderMessagesWithDateSeparators = () => {
        if (!selectedChat || !selectedChat.messages) return null;
    
        let lastDate = null;
        


        if (activeKey === 'together') {
            const userFirstMessageIndex = selectedChat.messages.findIndex(msg => msg.sender_id === loggedInUserId);
            const startIndex = userFirstMessageIndex !== -1 ? userFirstMessageIndex : 0;
            const filteredMessages = selectedChat.messages.slice(startIndex);

            return filteredMessages.map((message, index) => {
                if (!message) {
                    console.error('Undefined message at index:', index);
                    return null;
                }
    
                const messageDate = formatDate(message.write_day);
                const showDateSeparator = lastDate !== messageDate;
    
                lastDate = messageDate;
    
                const senderProfile = profileData[message.sender_id] || {};
                const isSameSenderAsPrevious = index > 0 && filteredMessages[index - 1].sender_id === message.sender_id;
                const isProfileLoading = !profileData[message.sender_id];
    
                return (
                    <React.Fragment key={index}>
                        {showDateSeparator && (
                            <div className="date-separator">
                                <div className="messageDate">{messageDate}</div>
                            </div>
                        )}
                        <div className={`chat-bubble-container ${isSender(message.sender_id) ? 'me' : 'you'}`}>
                            {(message.sender_id !== "System") && !isSender(message.sender_id) && !isSameSenderAsPrevious && (
                                <div className="message-info">
                                    {isProfileLoading ? (
                                        <div className="skeleton-img skeleton-loading"></div>
                                    ) : (
                                        <img
                                            src={senderProfile.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`}
                                            alt={`Profile of ${senderProfile.nickname || 'Unknown'}`}
                                            className="profile-img rounded-circle"
                                            style={{ width: '40px', height: '40px' }}
                                            onClick={() => navigateToUserProfile(message.sender_id)}
                                        />
                                    )}
                                    <span className="nickname" onClick={() => navigateToUserProfile(message.sender_id)}>
                                        {isProfileLoading ? (
                                            <div className="skeleton-nick skeleton-loading"></div>
                                        ) : (
                                            senderProfile.nickname || '알수없음'
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className={getChatBubbleClasses(message.sender_id)}>
                                {message.message}
                            </div>
                            <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                        </div>
                    </React.Fragment>
                );
            });
        } else {
            return selectedChat.messages.map((message, index) => {
                if (!message) {
                    console.error('Undefined message at index:', index);
                    return null;
                }
    
                const messageDate = formatDate(message.write_day);
                const showDateSeparator = lastDate !== messageDate;
    
                lastDate = messageDate;
    
                const senderProfile = profileData[message.sender_id] || {};
                const isSameSenderAsPrevious = index > 0 && selectedChat.messages[index - 1].sender_id === message.sender_id;
                const isProfileLoading = !profileData[message.sender_id];
    
                return (
                    <React.Fragment key={index}>
                        {showDateSeparator && (
                            <div className="date-separator">
                                <div className="messageDate">{messageDate}</div>
                            </div>
                        )}
                        <div className={`chat-bubble-container ${isSender(message.sender_id) ? 'me' : 'you'}`}>
                            {(message.sender_id !== "System") && !isSender(message.sender_id) && !isSameSenderAsPrevious && (
                                <div className="message-info">
                                    {isProfileLoading ? (
                                        <div className="skeleton-img skeleton-loading"></div>
                                    ) : (
                                        <img
                                            src={senderProfile.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`}
                                            alt={`Profile of ${senderProfile.nickname || 'Unknown'}`}
                                            className="profile-img rounded-circle"
                                            style={{ width: '40px', height: '40px' }}
                                            onClick={() => navigateToUserProfile(message.sender_id)}
                                        />
                                    )}
                                    <span className="nickname" onClick={() => navigateToUserProfile(message.sender_id)}>
                                        {isProfileLoading ? (
                                            <div className="skeleton-nick skeleton-loading"></div>
                                        ) : (
                                            senderProfile.nickname || '알수없음'
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className={getChatBubbleClasses(message.sender_id)}>
                                {message.message}
                            </div>
                            <span className="chat-time">{formatMessageTime(message.write_day)}</span>
                        </div>
                    </React.Fragment>
                );
            });
        }
    };

    
    //강퇴
    const handleKick = (userEmailObj) => {
        const roomId = selectedChat.roomId;
        const userId = userEmailObj.email;
        if (!roomId || !userId) {
            console.error('Invalid roomId or userEmail:', roomId, userId);
            return;
        }
    
        Swal.fire({
            title: '정말로 이 사용자를 단체 채팅방에서 강퇴하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '강퇴',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeUserFromTogetherChatRoom({ roomId, userId, mode: 'kick' }))
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: '사용자 강퇴 성공',
                            text: '사용자가 성공적으로 강퇴되었습니다.',
                        });
    
                        const newParticipants = participants.filter(member => member.email !== userId);
                        setParticipants(newParticipants);
    
                        if (newParticipants.length > 0) {
                            setSelectedChat(prev => ({
                                ...prev,
                                members: newParticipants
                            }));
                        } else {
                            dispatch(setSelectedChat(null));
                        }
                        dispatch(fetchTogetherChatRooms({ serverUrl, userId: loggedInUserId }));
                        toggleParticipants(); // +
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: '강퇴 오류',
                            text: '단체 채팅방에서 사용자를 강퇴하는 중에 오류가 발생했습니다.',
                        });
                        console.error('단체 채팅방에서 사용자 강퇴 오류:', err);
                    });
            }
        });
    };

    const handleReport = (memberId) => {
        setReportedId(memberId.email);
    
        handleReportModalOpen();
    };

    return (
        <>
            <div className="chat-window-top">
                {selectedChat || activeKey === 'together' ? (
                    <div className="top-bar">
                        {getDisplayName()}
                    </div>
                ) : (
                    <div className="default-message">
                        <p className="chat-window-top-no">나랑 같이 취할 사람 찾으러 가기!</p>
                    </div>
                )}
            </div>
    
            {selectedChat ? (
                <div className="chat active-chat" data-chat={`person${selectedChat.roomId}`} ref={scrollRef}>
                    {selectedChat.messages && selectedChat.messages.length > 0 ? (
                        profileData && renderMessagesWithDateSeparators()
                    ) : (
                        <div className="no-messages">
                            <div>{DefaultMessage()}</div>
                        </div>
                    )}
                    <div ref={scrollRef}></div>
                </div>
            ) : ( <div className="chat active-chat">
                 <div className="no-messages">
                    <div>{DefaultMessage()}</div>
                </div>
            </div>)}

            {showMessageInput && selectedChat && (
                <div className="chat-write d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control flex-grow-1 chat-input"
                        placeholder="메시지를 입력하세요..."
                        ref={inputMessageRef}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage(inputMessageRef.current.value);
                                inputMessageRef.current.value = null;
                                scrollToBottom();
                            }
                        }}
                    />
                    <ArrowUpwardIcon
                        className="send-icon"
                        fontSize="large"
                        onClick={() => {
                            sendMessage(inputMessageRef.current.value);
                            inputMessageRef.current.value = null;
                            scrollToBottom();
                        }}
                    />
                </div>
            )}

            {/* 채팅 참여자 모달 */}
             <Modal show={showParticipants} onHide={toggleParticipants}>
                <Modal.Header closeButton>
                    <Modal.Title>채팅 참여자</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedChat && selectedChat.members ? (
                        <ul className="participant-modal-list">
                            {selectedChat.members.map((member, index) => (
                                <li key={index} className="participant-modal-item">
                                    <img
                                        src={member.image || `${process.env.PUBLIC_URL}/images/default-user-icon.png`}
                                        alt={`Profile of`}
                                        className="participant-modal-img"
                                        onClick={() => navigateToUserProfile(member.email)}
                                    />
                                    <span
                                        className="modal-nickname"
                                        onClick={() => navigateToUserProfile(member.email)} 
                                    >
                                        {member.nickname}
                                    </span>
                                    <div className="participant-modal-actions">

                                        { selectedChat.members[0].email === loggedInUserId && member.email !== loggedInUserId &&(
                                            <button className="no-style" onClick={() => handleKick(member)}>강퇴</button>
                                        )}
                                        {member !== loggedInUserId && member.email !== loggedInUserId &&(
                                            <button className="no-style" onClick={() => handleReport(member)}>🚨</button>
                                        )}
                                    </div>
                                    <br/>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>참여자가 없습니다.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleParticipants}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* 신고 모달 */}
            <ReportModal
                show={showReportModal}
                handleClose={handleReportModalClose}
                reportedId={reportedId}
                loggedInUserId={loggedInUserId}
                serverUrl={serverUrl}
            />
        </>
    );
};

export default ChatWindow;