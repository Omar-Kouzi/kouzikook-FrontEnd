import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const [userQuery, setUserQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // fetching the users and recipes
  useEffect(() => {
    async function fetchUsersAndRecipes() {
      try {
        const usersResponse = await axios.get("http://localhost:1112/user");
        setUsers(usersResponse.data);

        const recipesResponse = await axios.get("http://localhost:1112/recipe");
        setRecipes(recipesResponse.data);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchUsersAndRecipes();
  }, []);

  const handleUserClick = (index) => {
    const userId = users[index]._id;
    navigate(`/search/${userId}`);
  };

  const handleRecipeClick = (index) => {
    const recipeId = recipes[index]._id;
    navigate(`/search/recipe/${recipeId}`);
  }

  return (
    <section className="SearchSection">
      <header className="SearchSectionHeader">
        <input
          type="text"
          placeholder="@ UserName"
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="@ RecipeName"
          onChange={(e) => setRecipeQuery(e.target.value)}
        />
      </header>
      <div className="searchContainer">
        {(users
          .filter((user) => user.name.toLowerCase().includes(userQuery.toLowerCase()) && recipeQuery === "")
          .map((user, index) => (
            <div key={index}>
              <hr />
              <div
                className="searchUserContainer"
                onClick={() => handleUserClick(index)}
              >
                <img className="searchUserImage" src={user.profilePic} alt="" />
                <h4 className="searchUser">{user.name}</h4>
              </div>
            </div>
          ))) || <div>No users found.</div>}
        {(recipes
          .filter((recipe) => recipe.title.toLowerCase().includes(recipeQuery.toLowerCase()) && userQuery === "")
          .map((recipe, index) => (
            <div key={index}>
              <hr />
              <div
                className="searchUserContainer"
                onClick={() => handleRecipeClick(index)}
              >
                <img className="searchUserImage" src={recipe.image} alt="" />
                <h4 className="searchUser">{recipe.title}</h4>
              </div>
            </div>
          ))) || <div>No recipes found.</div>}
        <hr />
      </div>
    </section>
  );
}

export default Search;
