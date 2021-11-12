import './conversation.css';
import { useEffect, useState } from "react";
import axios from "axios";

const Conversation = ({ currentUser, conversation }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find(friend => friend !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`/users?userId=${friendId}`);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture ?
            PF + user.profilePicture :
            `${PF}person/noAvatar.png`
        }
        alt=""
      />
      <span className="conversationName">{ user?.username }</span>
    </div>
  );
};

export default Conversation;