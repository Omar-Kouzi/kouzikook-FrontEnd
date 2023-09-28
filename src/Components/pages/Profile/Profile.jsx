import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import MyRecipes from "./MyRecipe";
import SavedRecipe from "./SavedRecipe";
import { NavLink } from "react-router-dom";

function Profile() {
  const [data, setUserData] = useState([]);
  const [followingNum, setFollowingnum] = useState("");
  const [followersNum, setFollowersNUm] = useState("");
  const [showMyRecipes, setShowMyRecipes] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = "/Login";
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("id");
    sessionStorage.clear();
  };

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/Login");
    }
  });

  // fetching the user
  useEffect(() => {
    async function fetchUserProfile() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/user/${userId}`
        );
        setUserData(response.data);
        setFollowingnum(response.data.following.length);
        console.log(response.data.following)
        setFollowersNUm(response.data.followers.length);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchUserProfile();
  }, []);

  const handlefollowersClick = () => {
    navigate(`/profile/myfollowers`);
  };
  const handlefollowingClick = () => {
    navigate(`/profile/myfollowing`);
  };

  return (
    <section className="ProfilePage">
      <header className="ProfileHeader">
        <div className="ProfileHeaderImageName">
          <img
            src={data.profilePic}
            className="ProfilePicture"
            alt="ProfilePic"
          />
          <div className="NameFollowingFollowersHeader">
            <h1>{data.name}</h1>
            <div className="FollowingFollowersHeader">
              <div onClick={() => handlefollowingClick()}>
                <h2 className="FollowingFollowers">Following:</h2>
                <b>{followingNum}</b>
              </div>
              <div onClick={() => handlefollowersClick()}>
                <h2 className="FollowingFollowers">Followers:</h2>
                <b>{followersNum}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="ProfileHeaderButtons">
          <NavLink to={"/editprofile"}>Edit Profile</NavLink>
          <NavLink to={"/CreateRecipe"}>CreateRecipe</NavLink>
          <NavLink to={"/"} onClick={handleLogout}>
            Logout
          </NavLink>
        </div>
      </header>
      <nav className="ProfileNavigator">
        <p onClick={() => setShowMyRecipes(true)}>Recipes</p>
        <p onClick={() => setShowMyRecipes(false)} style={{ display: "none" }}>
          Saved
        </p>
      </nav>
      {showMyRecipes ? <MyRecipes /> : <SavedRecipe />}
    </section>
  );
}

export default Profile;
