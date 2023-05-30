import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import MyRecipes from "./MyRecipe";
import SavedRecipe from "./SavedRecipe";
import { CSSTransition } from "react-transition-group";
import { NavLink } from "react-router-dom";

function Profile() {
  const [data, setUserData] = useState([]);
  const [followingNum, setFollowingnum] = useState("");
  const [followersNum, setFollowersNUm] = useState("");
  const [followingData, setFollowingData] = useState([]);
  const [followersData, setFollowersData] = useState([]);
  const [showMyRecipes, setShowMyRecipes] = useState(true);
  const [showFollowersPopup, setShowfollowersPopup] = useState(false);
  const [showFollowingPopup, setShowfollowingPopup] = useState(false);

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
  }, []);

  // fetching the user
  useEffect(() => {
    async function fetchUserProfile() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `http://localhost:1112/user/${userId}`
        );
        setUserData(response.data);
        setFollowingnum(response.data.following.length);
        setFollowersNUm(response.data.followers.length);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchUserProfile();
  }, []);

  // fetching the followers of the user
  useEffect(() => {
    async function fetchFollowers() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `http://localhost:1112/user/followers/${userId}`
        );
        const Followers = response.data.followers;
        setFollowersData(Followers);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchFollowers();
  }, []);

  // fetching the users this user is following
  useEffect(() => {
    async function fetchFollowing() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `http://localhost:1112/user/following/${userId}`
        );
        const Following = response.data.following;
        setFollowingData(Following);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchFollowing();
  }, []);

  // unfollowing a user

  const handleUnFollow = async (id) => {
    try {
      const followResponse = await axios.post(
        `http://localhost:1112/user/unfollow`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(followResponse.data);

      // update the following state variable to false
    } catch (error) {
      console.error(error);
    }
  };

  const handlefollowingClick = () => {
    setShowfollowingPopup(true);
  };
  const handlefollowingClose = () => {
    setShowfollowingPopup(false);
  };
  const handlefollowersClick = () => {
    setShowfollowersPopup(true);
  };
  const handlefollowersClose = () => {
    setShowfollowersPopup(false);
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
          <NavLink to={"/EditProfile"}>Edit Profile</NavLink>
          <NavLink to={"/CreateRecipe"}>CreateRecipe</NavLink>
          <NavLink to={"/"} onClick={handleLogout}>
            Logout
          </NavLink>
        </div>
      </header>
      <nav className="ProfileNavigator">
        <a onClick={() => setShowMyRecipes(true)}>Recipes</a>
        <a onClick={() => setShowMyRecipes(false)} style={{ display: "none" }}>
          Saved
        </a>
      </nav>
      {showMyRecipes ? <MyRecipes /> : <SavedRecipe />}
      <CSSTransition
        in={showFollowingPopup}
        timeout={300}
        classNames="ProfilePopup"
        unmountOnExit
      >
        <div className="ProfilePopup">
          <header className="Following-FollowersHeader">
            <h1>My Following</h1>
            <div onClick={handlefollowingClose} className="CardCloseButton">
              Close
            </div>
          </header>
          <hr />
          <div>
            {followingData.length > 0 ? (
              <div className="Following-FollowersProfilePopupCards">
                {followingData.map((following, index) => (
                  <div
                    key={index}
                    className="Following-FollowersProfilePopupCard"
                  >
                    <div>
                      <p>{following.name}</p>
                      <p
                        className="CardCloseButton"
                        onClick={() => handleUnFollow(following._id)}
                      >
                        unfollow
                      </p>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <p>You are following no one</p>
            )}
          </div>
        </div>
      </CSSTransition>{" "}
      <CSSTransition
        in={showFollowersPopup}
        timeout={300}
        classNames="ProfilePopup"
        unmountOnExit
      >
        <div className="ProfilePopup">
          <header className="Following-FollowersHeader">
            <h1>My Followers</h1>
            <div onClick={handlefollowersClose} className="CardCloseButton">
              Close
            </div>
          </header>
          <hr />
          <div>
            {followersData.length > 0 ? (
              <div className="Following-FollowersProfilePopupCards">
                {followersData.map((follower, index) => (
                  <div
                    key={index}
                    className="Following-FollowersProfilePopupCard"
                  >
                    <p>{follower.name}</p>
                    <hr />
                  </div>
                ))}
              </div>
            ) : (
              <p>You have no followers</p>
            )}
          </div>
        </div>
      </CSSTransition>
    </section>
  );
}

export default Profile;
