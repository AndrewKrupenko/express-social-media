import './chatOnline.css';
import { useEffect, useState } from "react";
import axios from "axios";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(`/users/friends/${currentId}`);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(
      friends.filter(friend => onlineUsers.includes(friend._id))
    )
  }, [friends, onlineUsers]);

  const handleClick = async user => {
    try {
      const res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
      setCurrentChat(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="chatOnline">
      <h3>Followings in Chat: </h3>
      {onlineFriends.map(onlineFriend => (
        <div
          className="chatOnlineFriend"
          onClick={() => handleClick(onlineFriend)}
          key={onlineFriend._id}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={ onlineFriend?.profilePicture ?
                PF + onlineFriend.profilePicture :
                `${PF}person/noAvatar.png`
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <div className="chatOnlineName">
            { onlineFriend.username }
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;