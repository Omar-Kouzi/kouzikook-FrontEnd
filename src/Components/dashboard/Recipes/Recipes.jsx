import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Recipes() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://kouzi-kook-backend.onrender.com/recipe`);

      const userData = await Promise.all(
        response.data.map((item) =>
          axios.get(`https://kouzi-kook-backend.onrender.com/user/${item.user}`)
        )
      );

      const combinedData = response.data.map((recipe, index) => ({
        ...recipe,
        userimg: userData[index].data.profilePic,
        username: userData[index].data.name,
        userid: userData[index].data._id,
        liked: false,
      }));

      const unapprovedRecipes = combinedData.filter(
        (recipe) => !recipe.approved
      );

      unapprovedRecipes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setData(unapprovedRecipes);
    };

    fetchData();
  }, []);

  const handleRecipeClick = (index) => {
    const recipeId = data[index]._id;
    navigate(`/recipe/${recipeId}`);
  };

  const handleApproveClick = async (index) => {
    const recipeId = data[index]._id;

    try {
      await axios.patch(`https://kouzi-kook-backend.onrender.com/recipe/approve/${recipeId}`);
      // Update the state to remove the approved recipe
      setData((prevData) => prevData.filter((_, i) => i !== index));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="DashboardPage">
      <header className="DashboardHeader">
        <NavLink to={"/dashboard/users"}>Users</NavLink>
        <NavLink to={"/dashboard/categories"}>Categories</NavLink>
        <NavLink to={"/dashboard/recipes"}>Recipes</NavLink>
      </header>
      {data.map((item, index) => (
        <div
          key={index}
          className="RecipesDashElement"
          onClick={() => handleRecipeClick(index)}
        >
          <div>
            <div>
              <img src={item.image} className="RecipesDashElementImg" alt="" />
              <h2>{item.title}</h2>
            </div>

            <h2
              className="CardCloseButton"
              onClick={(e) => {
                e.stopPropagation();
                handleApproveClick(index);
              }}
            >
              Approve
            </h2>
          </div>
          <hr />
        </div>
      ))}
    </section>
  );
}

export default Recipes;
