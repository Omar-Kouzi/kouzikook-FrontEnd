import axios from "axios";
import { useEffect, useState } from "react";
import "./followers.css";
import { useNavigate } from "react-router";
function Following() {
  const [followingData, setFollowingData] = useState([]);
const navigate = useNavigate()
  // fetching the users this user is following
  useEffect(() => {
    async function fetchFollowing() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/user/following/${userId}`
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
        `https://kouzi-kook-backend.onrender.com/user/unfollow/${id}`,
        {},
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
  const handleUserClick = (index) => {
    const userId = followingData[index]._id;
    navigate(`/user/${userId}`);
  };
  return (
    <section className="FollowersSection">
      <header className="Following-FollowersHeader">
        <h1>My Following</h1>
      </header>
      <hr />
      <div>
        {followingData.length > 0 ? (
          <div className="followingContainer">
            {followingData.map((following, index) => (
              <div
                key={index}
                className="followingElements"
                onClick={() => handleUserClick(index)}
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
    </section>
  );
}
export default Following;
