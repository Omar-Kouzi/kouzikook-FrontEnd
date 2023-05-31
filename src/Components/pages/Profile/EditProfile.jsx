import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./EditProfile.css";
import axios from "axios";

function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserProfile() {
      const userId = sessionStorage.getItem("id");
      try {
        const response = await axios.get(
          `https://kouzi-kook-backend.onrender.com/user/${userId}`
        );
        setUserData(response.data);

        setName(response.data.name);
        setEmail(response.data.email);
      } catch (err) {
        console.log("Err", err);
      }
    }
    fetchUserProfile();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = sessionStorage.getItem("id");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    axios
      .patch(`https://kouzi-kook-backend.onrender.com/user/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => setUserData(response.data),navigate('/profile'))
      .catch((error) => console.log(error));
  };

  return (
    <section className="EditRecipe">
      {userData && (
        <div>
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="EditingForm">
            <input
              type="text"
              id="name"
              placeholder="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="password"
              id="password"
              value={password}
              placeholder="password"
              onChange={(event) => setPassword(event.target.value)}
            />

            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              style={{display:"none"}}
              onChange={(event) => setImageFile(event.target.files[0])}
            />

            <button className="SubmitEditButton" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default EditProfile;
