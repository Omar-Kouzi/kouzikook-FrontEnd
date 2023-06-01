import "./Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Loader from "../../../assets/loader/Loader";

function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

      const approvedRecipes = combinedData.filter(recipe => recipe.approved);
      
      approvedRecipes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setData(approvedRecipes);
      setIsLoading(false); // Set isLoading to false after fetching the data
    };

    fetchData();
  }, []);

  const handleRecipeClick = (index) => {
    const recipeId = data[index]._id;
    navigate(`/recipe/${recipeId}`);
  };

  const handleUserClick = (index) => {
    const userId = data[index].user;
    navigate(`/user/${userId}`);
  };
  
  return (
    <section className="HomePage">
      {isLoading ? ( // Conditionally render the loader
        <div className="LoaderWrapper">
          <Loader />
        </div>
      ) : (
        <div className="HomeMainSlider">
          {data.map((item, index) => (
            <div key={index} className="HomeCard">
              <header className="HomeCardHeader">
                <div
                  className="HomeCardHeaderTitleRating"
                  onClick={() => handleUserClick(index)}
                >
                  <img
                    src={item.userimg}
                    alt="profilepic"
                    className="HomeCardHeaderPic"
                  />
                  <div className="HomeCardHeaderTitle">
                    <h2>{item.title}</h2>
                    <h3>{item.username}</h3>
                  </div>
                </div>
              </header>
              <div className="HomeCardMainImage  ">
                <img
                  src={item.image}
                  alt="main Recipe"
                  className="HomeCardMainImage"
                  onClick={() => handleRecipeClick(index)}
                />
              </div>
              <div className="HomeCardDescription">
                <h3>Description: </h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
