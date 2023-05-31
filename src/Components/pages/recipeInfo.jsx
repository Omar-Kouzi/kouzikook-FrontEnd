import { useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function RecipeInfo() {
  const recipeId = useParams();
  const [recipe, setRecipe] = useState([]);

  const fetchData = async () => {
    const response = await axios.get(
      `http://localhost:1112/recipe/${recipeId.recipeId}`
    );
    setRecipe(response.data);
  };
  fetchData();

  return (
    <section>
      <div className="RecipeCArd">
        <img src={recipe.image} alt="Card" className="RecipeCardPopImage" />
        <div className="RecipeCArdContent">
          <header className="UserHeaderCard">
            <div className="UserHeaderCardImgName">
              <h1>{recipe.title}:</h1>
            </div>
          </header>
          <hr />
          <h1>Discreption:</h1>
          <p>{recipe.description}</p>
          <hr />
          <h1>Ingredients:</h1>
          {recipe.ingredients &&
            recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          <hr />
          <h1>How to apply the recipe:</h1>
          <p>{recipe.steps}</p>
        </div>
      </div>
    </section>
  );
}

export default RecipeInfo;
