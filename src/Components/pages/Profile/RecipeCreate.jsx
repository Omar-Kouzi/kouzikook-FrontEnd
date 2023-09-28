import { useState, useEffect } from "react";
import axios from "axios";
import "./RecipeCreate.css";
import { useNavigate } from "react-router-dom";

function CreateRecipe() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    category: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const PostRecipe = async () => {
    const userId = sessionStorage.getItem("id");
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("ingredients", formData.ingredients);
    formDataToSend.append("steps", formData.steps);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("image", formData.image);

    try {
      await axios.post(
        `https://kouzi-kook-backend.onrender.com/recipe/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      navigate("/profile");
    } catch (err) {
      console.error(err);
      // handle error here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      await PostRecipe();
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://kouzi-kook-backend.onrender.com/category"
        );
        const sortedCategories = res.data.categories.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setCategories(sortedCategories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "file" ? e.target.files?.[0] : e.target.value;

    if (name === "category") {
      const selectedIndex = e.target.selectedIndex - 1;
      const selectedOption = categories[selectedIndex];

      if (selectedOption) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: selectedOption._id,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <section className="RecipeCreateSection">
     <div class="RecipeDropdown">
  <p class="RecipeButton">Recipe Tips</p>
  <div class="RecipeContent">
    <h1> Tips </h1>
    <p>
      So you can provide one of the most understanding and easy to read Recipes.
    </p>
    <h3>Title</h3>
    <p style={{ border: "1px solid", padding: "4px" }}>
      For the title just put the name of the plate/spice/sauce...
    </p>

    <h3>Description</h3>

    <p style={{ border: "1px solid", padding: "4px" }}>
      Some keywords for your description are 'Spicy' 'Sour' 'Sweet' 'Hot'
      'Cold' 'Savory' 'Tangy' 'Bitter' 'Umami' 'Zesty' 'Rich' 'Creamy'
      'Smoky' 'Tart' 'Mild' 'Fresh' 'Robust' 'Aromatic' 'Bold' 'Nutty'
      'Fruity' 'Succulent' 'Juicy' 'Crispy' "
    </p>
    <h3>Ingredients</h3>

    <p style={{ border: "1px solid", padding: "4px" }}>
      Separate the ingredients with a semi-colon ';' and don't forget to put
      the measurements in square brackets []. Without the semi-colon your
      ingredients will be on the same bullet point.
    </p>
    <h3>Steps</h3>

    <p style={{ border: "1px solid", padding: "4px" }}>
      Let your steps be clear and understandable.
    </p>
  </div>
</div>

      <form onSubmit={handleSubmit}>
        <h1>Post a Recipe</h1>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
          required
          maxLength="12"
        />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          maxLength="250"
          required
          spellCheck
        />
        <label htmlFor="ingredients">Ingredients:</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          placeholder="Ingredients"
          onChange={handleChange}
          value={formData.ingredients}
          required
          spellCheck
        />
        <label htmlFor="steps">Steps:</label>
        <input
          type="text"
          id="steps"
          name="steps"
          placeholder="Steps"
          onChange={handleChange}
          value={formData.steps}
          required
          spellCheck
        />
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          onChange={handleChange}
          required
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          name="category"
          onChange={handleChange}
          value={formData.category}
          required
        >
          <option value=""> Choose a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
        <button
          className="btn-add-recipe"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
        </button>
      </form>
    </section>
  );
}

export default CreateRecipe;
