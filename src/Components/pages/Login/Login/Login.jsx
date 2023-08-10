import { useState, useEffect } from "react";
import "./Login.css";
import useToken from "./useToken";
import { NavLink } from "react-router-dom";
import logo from "../../../../assets/cookieLogo.png";

async function loginUser(credentials) {
  return fetch("https://kouzi-kook-backend.onrender.com/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("isAdmin", data.isAdmin);
      sessionStorage.setItem("id", data.id);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

function Login() {
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const { setToken } = useToken();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email,
        password,
      });
      console.log(response);
      if (!response.message) {
        setToken(response.token);
        sessionStorage.setItem("token", response.token);
        sessionStorage.setItem("isAdmin", response.isAdmin);
        sessionStorage.setItem("loggedIn", "true");
        setIsLoggedIn(true);
      } else {
        setValid(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoggedIn) {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (isAdmin) {
      window.location.href = "/Dashboard";
    } else {
      window.location.href = "/";
    }
  }
  useEffect(() => {
    let timer;
    if (valid) {
      timer = setTimeout(() => {
        setValid(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [valid]);
  return (
    <div className="Login">
      <div className="Loginbox">
        <div className="Logotitle">
          <NavLink to="/" className="logo loginLogo">
            <img src={logo} alt="" className=" loginLogo logo" />
          </NavLink>
          <h1 className="Logintitle">Login</h1>
        </div>

        {valid ? (
          <i className="ErrorMessageLogin">Wrong password or email</i>
        ) : null}
        <form action="#" className="LoginForm">
          <div className="LoginInputs">
            <div className="input-field">
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="Logininput"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field">
              <input
                type="password"
                placeholder="Password"
                className="Logininput"
                onChange={(e) => setPassword(e.target?.value)}
              />
            </div>
          </div>
          <div className="LoginButton-txt">
            <input
              type="submit"
              value="Login"
              className="btn solid LoginButton"
              onClick={handleSubmit}
            />
            <p>
              Create a new account?
              <NavLink to="/Signup" className="signupInLoginTxt">
                {" "}
                Signup.
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Login;
