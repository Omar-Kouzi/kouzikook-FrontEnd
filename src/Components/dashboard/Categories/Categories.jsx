import { NavLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../Dashboard.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");

  // fetching the category
  async function fetchCategory() {
    try {
      const response = await axios.get("https://kouzi-kook-backend.onrender.com/category");
      const sortedCategories = response.data.categories.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setCategories(sortedCategories);
    } catch (err) {
      console.log("Err", err);
    }
  }
  fetchCategory();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://kouzi-kook-backend.onrender.com/category/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post(
        "https://kouzi-kook-backend.onrender.com/category",
        { title: newCategoryTitle },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setCategories((prevCategories) => [
        ...prevCategories,
        { title: newCategoryTitle },
      ]);
      setNewCategoryTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="DashboardPage">
      <header className="DashboardHeader">
        <NavLink to={"/dashboard/users"}>Users</NavLink>
        <NavLink to={"/dashboard/categories"}>Categories</NavLink>
        <NavLink to={"/dashboard/recipes"}>Recipes</NavLink>
      </header>
      <div className="UserList">
        {categories.map((category, index) => (
          <div key={index} className="UserItem">
            <div className="UserItemImageName">
              <h3>{category.title}</h3>
            </div>

            <div className="UserItemEmailDelete">
              <hr />
              <h2
                onClick={() => handleDelete(category._id)}
                className="CardCloseButton"
              >
                Delete
              </h2>
            </div>
          </div>
        ))}
        <div className="UserItem">
          <div className="UserItemImageName">
            <input
              value={newCategoryTitle}
              className="categoryAddInput"
              onChange={(e) => setNewCategoryTitle(e.target.value)}
            />
          </div>
          <hr />
          <div className="UserItemEmailDelete">
            <div></div>
            <h2 onClick={handleAddCategory} className="CardCloseButton">
              Add Category
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Categories;
