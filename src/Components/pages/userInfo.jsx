import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

function UserInfo() {
  const userId = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [isFollowing, setIsFollowing] = useState([]);
  const [isCurrentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/user/${userId.userId}`
        );
        setUser(response.data);

        // Check if the current user is following this user
        const followers = await response.data.followers;
        const sessionStorageId = sessionStorage.getItem("id");
        if (followers.some((follower) => follower === sessionStorageId)) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.log("Err", err);
      }
    };

    const fetchUserRecipes = async () => {
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/recipe?user=${userId.userId}`
        );
        setRecipes(response.data);
      } catch (err) {
        console.log("Err", err);
      }
    };
    const sessionStorageId = sessionStorage.getItem("id");
    userId.userId !== sessionStorageId
      ? setCurrentUser(true)
      : setCurrentUser(false);

    fetchUserData();
    fetchUserRecipes();
  }, [userId.userId]);

  const handleFollow = async () => {
    try {
      const followResponse = await axios.post(
        `https://kouzi-kook-backend.onrender.com/user/follow/${userId.userId}`,
        {}, // Empty object as payload
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(followResponse.data);
      setIsFollowing(true);
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  };
  const handleUnFollow = async () => {
    try {
      const followResponse = await axios.post(
        `https://kouzi-kook-backend.onrender.com/user/unfollow/${userId.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log(followResponse.data);

      // update the following state variable to false
      setIsFollowing(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRecipeClick = (index) => {
    const recipeId = recipes[index]._id;
    navigate(`/recipe/${recipeId}`);
  };
  return (
    <section>
      <div className="UserCArd">
        <div className="UserCArdContent">
          <header className="UserHeaderCard">
            <div className="UserHeaderCardImgName">
              <img src={user.profilePic} alt="" />
              <h1>{user.name}</h1>
            </div>
            {isCurrentUser &&
              (!isFollowing ? (
                <h2 className="CardCloseButton" onClick={handleFollow}>
                  Follow
                </h2>
              ) : (
                <h2 className="CardCloseButton" onClick={handleUnFollow}>
                  Unfollow
                </h2>
              ))}
          </header>
          <hr />
          {recipes.filter(recipe => recipe.approved).length > 0 ? (
            <div className="RecipeHomePopupCards">
              {recipes
                .filter((item) => item.user === userId.userId && item.approved)
                .map((recipe, index) => (
                  <div key={index} className="RecipeHomePopupCard" onClick={() => handleRecipeClick(index)}>
                    <img
                      src={recipe.image}
                      alt=""
                      className="RecipeHomePopupCardImg"
                    />
                    <h1>{recipe.title}</h1>
                  </div>
                ))}
            </div>
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserInfo;
