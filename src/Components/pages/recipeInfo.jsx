import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../../assets/loader/Loader";

function RecipeInfo() {
  const recipeId = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://kouzi-kook-backend.onrender.com/recipe/${recipeId.recipeId}`
      );
      setRecipe(response.data);
      setIsLoading(false); // Set isLoading to false after fetching the data
    };
    fetchData();
  }, [recipeId]);

  return (
    <>
      {isLoading ? (
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <section>
          <div className="RecipeCArd">
            <img
              src={recipe.image}
              alt="Card"
              className="RecipeCardPopImage"
            />
            <div className="RecipeCArdContent">
              <header className="UserHeaderCard">
                <div className="UserHeaderCardImgName">
                  <h1>{recipe.title}:</h1>
                </div>
              </header>
              <hr />
              <h1>Description:</h1>
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
      )}
    </>
  );
}

export default RecipeInfo;
