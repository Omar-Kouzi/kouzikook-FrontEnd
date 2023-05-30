import "./Home.css";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function Home() {
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [cardData, setCardData] = useState({
    userid: "",
    image: "",
    title: "",
    description: "",
    ingredients: [],
    steps: "",
    username: "",
    userimg: "",
  });
  const [userRecipes, setUserRecipes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState(false);
  const navigate = useNavigate();
  const nodeRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:1112/recipe`);

      const userData = await Promise.all(
        response.data.map((item) =>
          axios.get(`http://localhost:1112/user/${item.user}`)
        )
      );

      const combinedData = response.data.map((recipe, index) => ({
        ...recipe,
        userimg: userData[index].data.profilePic,
        username: userData[index].data.name,
        userid: userData[index].data._id,
        liked: false,
      }));

      combinedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setData(combinedData);
    };

    fetchData();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleImageClick = (index) => {
    setShowPopup(true);
    setCardData(data[index]);
  };

  const handleUserImageClick = async (index) => {
    setShowUserPopup(true);
    setCardData(data[index]);

    const userId = data[index].user;
    const response = await axios.get(`http://localhost:1112/recipe/`);
    const userRecipes = response.data.filter((item) => item.user === userId);
    setUserRecipes(userRecipes);
    const sessionStorageId = sessionStorage.getItem("id");
    userId !== sessionStorageId ? setCurrentUser(true) : setCurrentUser(false);
  };

  const handleFollow = async () => {
    try {
      const followResponse = await axios.post(
        `http://localhost:1112/user/follow`,
        { id: userRecipes[0].user },
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
        `http://localhost:1112/user/unfollow`,
        { id: userRecipes[0].user },
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

  const handleCloseUserPopup = () => {
    setShowUserPopup(false);
    setUserRecipes([]);
  };

  return (
    <section className="HomePage">
      <div className="HomeMainSlider">
        {data.map((item, index) => (
          <div key={index} className="HomeCard">
            <header className="HomeCardHeader">
              <div
                className="HomeCardHeaderTitleRating"
                onClick={() => handleUserImageClick(index)}
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
              {/* <img src={banner} alt="save" className="HomeCardSave" /> */}
            </header>
            <div className="HomeCardMainImage  ">
              <img
                src={item.image}
                alt="main Recipe"
                className="HomeCardMainImage"
                onClick={() => handleImageClick(index)}
              />
            </div>
            <div className="HomeCardDescription">
              <h3>Description: </h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <CSSTransition
        nodeRef={nodeRef}
        in={showUserPopup}
        timeout={300}
        classNames="Popup"
        unmountOnExit
      >
        <div ref={nodeRef} className="Popup">
          {" "}
          <div className="UserCArd">
            <div className="UserCArdContent">
              <header className="UserHeaderCard">
                <div className="UserHeaderCardImgName">
                  <img src={cardData.userimg} alt="" />
                  <h1>{cardData.username}</h1>
                </div>
                {isCurrentUser &&
                  (!isFollowing ? (
                    <h2
                      className="CardCloseButton followunfollowHome"
                      onClick={handleFollow}
                    >
                      Follow
                    </h2>
                  ) : (
                    <h2 className="CardCloseButton" onClick={handleUnFollow}>
                      Unfollow
                    </h2>
                  ))}

                <h2 onClick={handleCloseUserPopup} className="CardCloseButton">
                  Close
                </h2>
              </header>
              <hr />
              {userRecipes.length > 0 ? (
                <div className="RecipeHomePopupCards">
                  {userRecipes.map((recipe, index) => (
                    <div key={index} className="RecipeHomePopupCard">
                      <img
                        src={recipe.image}
                        alt=""
                        className="RecipeHomePopupCardImg"
                        onClick={() => handleImageClick(index)}
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
        </div>
      </CSSTransition>
      <CSSTransition
        nodeRef={nodeRef}
        in={showPopup}
        timeout={300}
        classNames="Popup"
        unmountOnExit
      >
        <div ref={nodeRef} className="Popup">
          {/* add the ref to the Popup div */}
          <div className="RecipeCArd">
            <img
              src={cardData.image}
              alt="Card"
              className="RecipeCardPopImage"
            />
            <div className="RecipeCArdContent">
              <header className="UserHeaderCard">
                <div className="UserHeaderCardImgName">
                  <h1>{cardData.title}:</h1>
                </div>
                <h2 onClick={handleClosePopup} className="CardCloseButton">
                  close
                </h2>
              </header>
              <hr />
              <h1>Discreption:</h1>
              <p>{cardData.description}</p>
              <hr />
              <h1>Ingredients:</h1>
              {cardData.ingredients &&
                cardData.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              <hr />
              <h1>How to apply the recipe:</h1>
              <p>{cardData.steps}</p>
            </div>
          </div>
        </div>
      </CSSTransition>
    </section>
  );
}

export default Home;
