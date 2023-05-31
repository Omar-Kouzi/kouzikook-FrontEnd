import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard.css";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
    }
  }, []);

  // fetching the users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("https://kouzi-kook-backend.onrender.com/user");
        setUsers(response.data);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchUsers();
  }, []);
  // deleting the users
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://kouzi-kook-backend.onrender.com/user/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setUsers((prevUser) => prevUser.filter((user) => user._id !== id));
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
        {users.map((user ,index) => (
          <div key={index} className="UserItem">
            <div className="UserItemImageName">
              <img
                src={user.profilePic}
                alt={user.name}
                className="UserItemimage"
              />
              <h3>{user.name}</h3>
            </div>
            <hr />
            <div className="UserItemEmailDelete">
              <p>{user.email}</p>
              <h2
                onClick={() => handleDelete(user._id)}
                className="CardCloseButton"
              >
                Delete
              </h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Users;
