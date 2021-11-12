import './friend.css';
import { Link } from "react-router-dom";

const Friend = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <Link to={`/profile/${user.username}`}>
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img src={PF+user.profilePicture} alt="" className="rightbarProfileImage" />
        </div>
        <span className="rightbarUsername">{user.username}</span>
      </li>
    </Link>
  );
};

export default Friend;