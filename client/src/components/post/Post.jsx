import './post.css';
import { MoreVert } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from 'timeago.js';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth/AuthContext";

const Post = ({ post }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post?.likes.includes(currentUser?._id));
  }, [currentUser?._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    }
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put('/posts/' + post._id + '/like',
        { userId: currentUser._id })
    } catch (e) {

    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture ?
                  PF + user.profilePicture :
                  PF + "person/noAvatar.png"}
                alt=""
              />
            </Link>

            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{ format(post.createdAt) }</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <p className="postText">{ post?.desc }</p>
          { post?.img && <img className="postImg" src={PF + post.img} alt=""/>}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              alt=""
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{ like } people like it</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;