import { useState, useEffect } from "react";
import "./Signup.css";
import "react-toastify/dist/ReactToastify.css";
import { NavLink, useNavigate } from "react-router-dom";

import axios from "axios";
import logo from "../../../../assets/cookieLogo.png";

function Signup() {
  const navigate = useNavigate();
  // const [user,setUser] = useState([]);
  const [imagee, SetImagee] = useState("");
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const registerUser = async (userData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", userData.name);
      formDataToSend.append("email", userData.email);
      formDataToSend.append("password", userData.password);
      formDataToSend.append("image", imagee);

      const res = await axios.post(
        "https://kouzi-kook-backend.onrender.com/user",
        formDataToSend
      );
      // setUser((prevRents) => [...prevRents, res.data.data]);
      if (!res.data.success) {
        setError(res.data.message);
        setValid(true);
      }
      if (res.data.success === undefined) {
        navigate("/login");
        setError("Signed up successfully");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.message + " Please Try Latter");
        // console.log(error)
        // console.log(err.message);
      } else {
        console.log(err);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    registerUser(formData);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    SetImagee(e.target.files[0]);
  };
  useEffect(() => {

    if (valid) {
     setTimeout(() => {
        setValid(false);
      }, 4000);
    }
  });

  return (
    <div className="Signup">
      {/* <div className="Signupbox"> */}
        <div className="SignupFormBox">
          <div className="signuptitle">
          <NavLink to="/" className="logo SignupLogo">
            <img src={logo} alt="" className="logo SignupLogo" />
          </NavLink>
          <h1 className="Signuptitle">Sign up</h1>
          </div>
          
          {valid ? <i className="ErrorMessageSignup">{error}</i> : null}

          <form action="#" className="SignupForm" onSubmit={handleSignUp}>
            <div className="SignupInputs">
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Name"
                  className="Signupinput"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="Signupinput"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="Signupinput"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="input-field picinput">
                <input
                  type="file"
                  id="file"
                  name="Image"
                  className="Signupinput"
                  onChange={handleImageChange}
                  required
                />
              </div>
            </div>
            <div className="SignupButton-txt">
              <input
                type="submit"
                value="Sign Up"
                className="btn solid SignupButton"
              />
              <p>
                Already have an account?
                <NavLink to="/Login" className="signupInSignupTxt">
                  {" "}
                  Login.
                </NavLink>
              </p>
            </div>
          </form>
        </div>
  
    </div>
  );
}

export default Signup;
