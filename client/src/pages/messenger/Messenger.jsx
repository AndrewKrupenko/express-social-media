import './messenger.css';
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import {useContext, useEffect, useRef, useState} from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    })

    return () => {

    }
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', users => {
      setOnlineUsers(
        user.followings.filter(
          following => users.some(
            user => user.userId === following
          )
        )
      );
    })
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversations/${user._id}`);
        setConversations(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleMessageChange = e => {
    setNewMessage(e.target.value);
  }

  const handleSendMessage = async e => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(member => member !== user._id);

    if (newMessage) {
      socket.current.emit('sendMessage', {
        senderId: user._id,
        receiverId,
        text: newMessage,
      })

      try {
        const res = await axios.post('/messages', message);
        setMessages([...messages, res.data]);
        setNewMessage('');
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar/>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <h3>Active Chats:</h3>
            {conversations.map(conversation => (
              <div
                onClick={() => setCurrentChat(conversation)}
                key={conversation._id}
              >
                <Conversation
                  currentUser={user}
                  conversation={conversation}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map(message => (
                    <div ref={scrollRef} key={message.createdAt}>
                      <Message
                        message={message}
                        own={message.sender === user._id}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Write your message..."
                    className="chatMessageInput"
                    onChange={handleMessageChange}
                    value={newMessage}
                  />
                  <button
                    className="chatSubmitButton"
                    onClick={handleSendMessage}
                  >Send</button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a Conversation to Start a Chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
