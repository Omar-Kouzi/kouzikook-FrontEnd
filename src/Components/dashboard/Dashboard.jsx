import { NavLink } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {


  return (
    <section className="DashboardPage">
      <header className="DashboardHeader">
        <NavLink to={"/dashboard/users"}>Users</NavLink>
        <NavLink to={"/dashboard/recipes"}>Recipes/Categories</NavLink>
      </header>
   
    </section>
  );
}

export default Dashboard;
