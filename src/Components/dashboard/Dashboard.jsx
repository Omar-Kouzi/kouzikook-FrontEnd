import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !sessionStorage.getItem("token") ||
      sessionStorage.getItem("isAdmin") === "false"
    ) {
      navigate("/Login");
    }
  });

  return (
    <section className="DashboardPage">
      <header className="DashboardHeader">
        <NavLink to={"/dashboard/users"}>Users</NavLink>
        <NavLink to={"/dashboard/categories"}>Categories</NavLink>
        <NavLink to={"/dashboard/recipes"}>Recipes</NavLink>
      </header>
    </section>
  );
}

export default Dashboard;
