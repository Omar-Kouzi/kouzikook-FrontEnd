import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./followers.css";
function Followers() {
  const [followersData, setFollowersData] = useState([]);
  const navigate = useNavigate();
  // fetching the followers of the user
  useEffect(() => {
    async function fetchFollowers() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/user/followers/${userId}`
        );
        const Followers = response.data.followers;
        setFollowersData(Followers);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchFollowers();
  }, []);
  const handleUserClick = (index) => {
    const userId = followersData[index]._id;
    navigate(`/user/${userId}`);
  };
  return (
    <section className="FollowersSection">
      <header className="Following-FollowersHeader">
        <h1>My Followers</h1>
      </header>
      <hr />
      <div>
        {followersData.length > 0 ? (
          <div className="Following-FollowersProfilePopupCards">
            {followersData.map((follower, index) => (
              <div
                key={index}
                className="followingElements"
                onClick={() => handleUserClick(index)}
              >
                <div>{follower.name}</div>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>You have no followers</p>
        )}
      </div>
    </section>
  );
}
export default Followers;
