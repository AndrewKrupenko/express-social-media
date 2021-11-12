import "./login.css";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import { loginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCall({
      email: email.current.value,
      password: password.current.value
    }, dispatch);
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Awesome app</h3>
          <span className="loginDesc">
            Connect with friends and the world around you with Awesome app.
          </span>
        </div>
        <div className="loginRight">
          <form
            className="loginBox"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
              ref={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              ref={password}
              required
              minLength="6"
            />
            <button
              className="loginButton"
              type="submit"
              disabled={isFetching}
            >
              {isFetching ?
                <CircularProgress style={{color: '#fff'}} size="20px" /> :
                "Log In"
              }
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link className="loginRegisterButton" to="/register">
              {isFetching ?
                <CircularProgress style={{color: '#fff'}} size="20px" /> :
                "Create a New Account"
              }
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
