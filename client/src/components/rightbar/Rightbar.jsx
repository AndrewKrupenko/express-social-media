import './rightbar.css';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import Friend from "../friend/Friend";

const Rightbar = ({ user, isHome }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [isFollowed, setIsFollowed] = useState(
    currentUser?.followings.includes(user?._id)
  );

  useEffect(() => {
    setIsFollowed(currentUser?.followings.includes(user?._id));
  }, [currentUser, user?._id]);

  useEffect(() => {
    // function here because we can't use 'async' for useEffect
    const getFriends = async () => {
      try {
        const friendsList = await axios.get('/users/friends/' + user?._id);
        setFriends(friendsList.data);
      } catch (e) {
        console.log(e);
      }
    }
    if (user?._id) {
      getFriends();
    }
  }, [user?._id]);

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={`${PF}gift.png`} alt=""/>
          <span className="birthdayText">
            {" "}
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>
        <img className="rightbarAd" src={`${PF}ad.png`} alt="" />
        <h4 className="rightbarTitle">My Friends:</h4>
        <ul className="rightbarFriendList">
          {friends.map(user => (
            <Friend key={user._id} user={user} />
          ))}
        </ul>
      </>
    )
  }

  const handleFollowClick = async () => {
    try {
      if (isFollowed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put('/users/' + user._id + '/follow', {
          userId: currentUser._id
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (e) {
      console.log(e);
    }
    setIsFollowed(!isFollowed);
  }

  const ProfileRightbar = () => {
    return (
      <>
        {user?.username !== currentUser?.username && (
         <button className="rightbarFollowButton" onClick={handleFollowClick}>
           {isFollowed ? "Unfollow" : "Follow"}
           {isFollowed ? <Remove /> : <Add />}
         </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{ user.city }</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{ user.from }</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 1
                  ? "Married"
                  : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map(friend => (
            <Link to={'/profile/' + friend.username} key={friend._id}>
              <div className="rightbarFollowing">
                <img
                  className="rightbarFollowingImg"
                  src={friend.profilePicture ?
                    PF + friend.profilePicture :
                    PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <span className="rightbarFollowingName">{ friend.username }</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {!isHome ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default Rightbar;