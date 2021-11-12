import './feed.css';
import Share from "../share/Share";
import Post from "../post/Post";
import { useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/auth/AuthContext";
import { PostContext } from "../../context/post/PostContext";

const Feed = ({ username }) => {
  const { posts, dispatch } = useContext(PostContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get('/posts/profile/' + username)
        : await axios.get('posts/timeline/' + user._id);
      const sortedPosts = res.data.sort((a,b) => {
        return new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      }).reverse();
      dispatch({ type: "GET_POSTS_LIST_SUCCESS", payload: sortedPosts });
    }
    fetchPosts();
  }, [username, user?._id, dispatch]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user?.username) && <Share />}
        {posts.map(post => (
          <Post
            key={post._id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;