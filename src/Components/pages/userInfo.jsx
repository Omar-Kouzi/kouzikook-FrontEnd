import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

function UserInfo() {
  const userId = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1112/user/${userId.userId}`
        );
        setUser(response.data);
      } catch (err) {
        console.log("Err", err);
      }
    };

    const fetchUserRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1112/recipe?user=${userId.userId}`
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

  return (
    <section>
      <div className="UserCArd">
        <div className="UserCArdContent">
          <header className="UserHeaderCard">
            <div className="UserHeaderCardImgName">
              <img src={user.profilePic} alt="" />
              <h1>{user.name}</h1>
            </div>

          </header>
          <hr />
          {recipes.length > 0 ? (
            <div className="RecipeHomePopupCards">
              {recipes
                .filter((item) => item.user === userId.userId)
                .map((recipe, index) => (
                  <div key={index} className="RecipeHomePopupCard">
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
