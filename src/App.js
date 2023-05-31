import "./App.css";
import NavigationBar from "./Components/navbar/NavigationBar";
import PageRoutes from "./Components/navbar/Routes";
import { Routes, Route, Navigate } from "react-router-dom";
//Pages
import Home from "./Components/pages/Home/Home";
import Search from "./Components/pages/Search/Search";
import Challenge from "./Components/pages/Challenge/Challenge";
import Profile from "./Components/pages/Profile/Profile";
import Login from "./Components/pages/Login/Login/Login";
import Signup from "./Components/pages/Login/Signup/Signup";
import Dashboard from "./Components/dashboard/Dashboard";
import CreateRecipe from "./Components/pages/Profile/RecipeCreate";
import EditProfile from "./Components/pages/Profile/EditProfile";
import Users from "./Components/dashboard/users/UsersDash";
import Categories from "./Components/dashboard/Categories/Categories";
import UserInfo from "./Components/pages/userInfo";
import RecipeInfo from "./Components/pages/recipeInfo";
//css
import { toast } from "react-toastify";
import Followers from "./Components/pages/followersInfo";
import Following from "./Components/pages/followingInfo";
import Recipes from "./Components/dashboard/Recipes/Recipes";

function App() {
  const isAdmin = window.sessionStorage.getItem("isAdmin") === "true";

  const checkAdminAccess = (element) => {
    if (isAdmin) {
      return element;
    } else {
      const pathName = window.location.pathname;
      const isDashboardPage = pathName.startsWith("/dashboard");
      const isDashboardErrorActive = toast.isActive("dashboard-error");

      if (isDashboardPage && !isDashboardErrorActive) {
        toast.error("You don't have access to this part of the website", {
          toastId: "dashboard-error",
        });
      }

      return <Navigate to="/Dashboard" replace />;
    }
  };
  return (
    <div className="App">
      <NavigationBar />
      <Routes className="pagesRouts">
      <Route exact path="/" element={<Home />} />
      <Route exact path="/user/:userId" element={<UserInfo />} />      
      <Route exact path="/recipe/:recipeId" element={<RecipeInfo />} />      
      <Route exact path="/challenge" element={<Challenge />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/profile/myfollowers" element={<Followers />} />
      <Route exact path="/profile/myfollowing" element={<Following />} />
      <Route exact path="/createRecipe" element={<CreateRecipe />} />
      <Route exact path="/editprofile" element={<EditProfile />} />
      <Route exact path="/search" element={<Search />} />
      <Route exact path="/search/:userId" element={<UserInfo />} />
      <Route exact path="/search/recipe/:recipeId" element={<RecipeInfo />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/dashboard/*" element={checkAdminAccess(<Dashboard />)}/>
      <Route exact path="/dashboard/users" element={checkAdminAccess(<Users />)}/>
      <Route exact path="/dashboard/categories" element={checkAdminAccess(<Categories />)}/>
      <Route exact path="/dashboard/recipes" element={checkAdminAccess(<Recipes />)}/>
    </Routes>
      {/* <PageRoutes  /> */}
    </div>
  );
}

export default App;
