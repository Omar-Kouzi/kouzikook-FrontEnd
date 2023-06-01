import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./MyRecipe.css";

function MyRecipes() {
  const [data, setData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const userId = sessionStorage.getItem("id");
  const nodeRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://kouzi-kook-backend.onrender.com/recipe`);

      await Promise.all(
        response.data.map((item) =>
          axios.get(`https://kouzi-kook-backend.onrender.com/user/${item.user}`)
        )
      );

      const userId = sessionStorage.getItem("id");
      const userRecipes = response.data.filter((item) => item.user === userId);
      userRecipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setData(userRecipes);
    };
    fetchData();
  }, [userId]);

  const handleDeleteClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDeletePopup(true);
  };
  // console.log(selectedRecipe._id)

  const handleDeleteConfirm = async () => {
    console.log(selectedRecipe._id);

    try {
      await axios.delete(`https://kouzi-kook-backend.onrender.com/recipe/${selectedRecipe._id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setData((prevData) =>
        prevData.filter((item) => item._id !== selectedRecipe._id)
      );
      setSelectedRecipe(null);
      setShowDeletePopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedRecipe(null);
    setShowDeletePopup(false);
  };

  const handleImageClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleClosePopup = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="MyRecipeProfileSectiom">
      {data.map((recipe, index) => (
        <div key={index} className="MyRecipeCard">
          <p className="MyRecipeCardTitle">
            {recipe.title}  {recipe.approved ? <p className="MyApprovedRecipe"> Approved</p>  :  <span className="MyUnApprovedRecipe"> NotApproved</span>}
          </p>

          <img
            src={recipe.image}
            alt="main Recipe"
            className="MyRecipeCardImage"
            onClick={() => handleImageClick(recipe)}
          />
        </div>
      ))}
      <CSSTransition
        in={selectedRecipe !== null}
        timeout={300}
        classNames="Popup profileCard"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className="Popup profileCard">
          <div className="RecipeCArd PRecipeCArd">
            <img
              src={selectedRecipe?.image}
              alt="Card"
              className="RecipeCardPopImage profileCardImage"
            />
            <div className="RecipeCArdContent profileCardContent">
              <header className="UserHeaderCard">
                <h2
                  className="CardCloseButton"
                  onClick={() => handleDeleteClick(selectedRecipe)}
                >
                  Delete
                </h2>

                <h2 onClick={handleClosePopup} className="CardCloseButton">
                  Close
                </h2>
              </header>
              <hr />
              <h1>{selectedRecipe?.title}:</h1>
              <p>{selectedRecipe?.description}</p>
              <hr />
              <h1>Ingredients:</h1>
              {selectedRecipe?.ingredients &&
                selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              <hr />
              <h1>How to apply the recipe:</h1>
              <p>{selectedRecipe?.steps}</p>
            </div>
          </div>
        </div>
      </CSSTransition>
      <CSSTransition
        in={showDeletePopup}
        timeout={300}
        classNames="Popup deletePopup"
        unmountOnExit
      >
        <div className="Popup deletePopup">
          <div className="deletePopupContent">
            <h1>Are you sure you want to delete this recipe?</h1>
            <div>
              <h2 className="CardCloseButton yes" onClick={handleDeleteConfirm}>
                Yes
              </h2>
              <h2 className="CardCloseButton" onClick={handleDeleteCancel}>
                No
              </h2>
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}

export default MyRecipes;
