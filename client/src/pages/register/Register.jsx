import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.current.value !== repeatPassword.current.value) {
      password.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }
      try {
        await axios.post('/auth/register', user);
        navigate('/login');
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Awesome App</h3>
          <span className="loginDesc">
            Connect with friends and the world around you with Awesome app.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              ref={username}
              className="loginInput"
              required
            />
            <input
              type="email"
              placeholder="Email"
              ref={email}
              className="loginInput"
              required
            />
            <input
              type="password"
              placeholder="Password"
              ref={password}
              className="loginInput"
              required
              minLength="6"
            />
            <input
              type="password"
              placeholder="Repeat Password"
              ref={repeatPassword}
              className="loginInput"
              required
            />
            <button className="loginButton" type="submit">Sign Up</button>
            <Link className="loginRegisterButton" to="/login">
              Log into Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
