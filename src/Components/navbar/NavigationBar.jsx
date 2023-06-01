import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/cookieLogo.png";
function NavigationBar() {
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const handleLogout = () => {
    window.location.href = "/Login";
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("id");
    sessionStorage.clear();
  };

  const isLoggedIn = window.sessionStorage.token;

  return (
    <>
      <nav className="NavigatorBar">
        <div className="NavlogoA">
          <img src={logo} alt="" className="Navlogo" />
        </div>
        <div className="PageNavigator ">
          <NavLink className="button-87" to="/">
            Home
          </NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/challenge" style={{ display: "none" }}>
            Challenge
          </NavLink>

          {isLoggedIn ? <NavLink to="/profile">Profile</NavLink> : null}
          {isAdmin ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        </div>
        {!isLoggedIn ? (
          <NavLink to="/Login" className="loginMinNav">
            Login
          </NavLink>
        ) : null}
        {isLoggedIn ? (
          <NavLink className="logoutMinNav" onClick={() => handleLogout()}>
            Logout
          </NavLink>
        ) : null}
      </nav>
    </>
  );
}

export default NavigationBar;
