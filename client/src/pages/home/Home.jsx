import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import './home.css';
import { useContext } from "react";
import { AuthContext } from "../../context/auth/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar user={user} isHome />
      </div>
    </>
  );
};

export default Home;