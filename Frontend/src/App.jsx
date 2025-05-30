import axios from "axios";
import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setFilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  const getAllUsers = async () => {
    const res = await axios.get("https://crud-operation-8w2v.onrender.com");
    setUsers(res.data);
    setFilterusers(res.data);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterusers(filtered);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure, You wanted to delete the data ?");
    if (isConfirmed) {
      const res = await axios.delete(`https://crud-operation-8w2v.onrender.com/${id}`);
      setUsers(res.data);
      setFilterusers(res.data);
    }
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData._id) {
        await axios.patch(
          `https://crud-operation-8w2v.onrender.com/${userData._id}`,
          userData
        );
      } else {
        await axios.post("https://crud-operation-8w2v.onrender.com", userData);
      }
      getAllUsers();
      setIsModalOpen(false);
      setUserData({ name: "", age: "", city: "" });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleUpdateRecord = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h3>CRUD Application with React.Js and Node.Js</h3>
      <div className="input-search">
        <input
          placeholder="Search..."
          type="search"
          onChange={handleSearchChange}
        />
        <button className="btn green" onClick={handleAddRecord}>
          Add New Record
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterusers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td>
                <button className="btn green" onClick={() => handleUpdateRecord(user)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="btn red" onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{userData._id ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleData}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  name="age"
                  value={userData.age}
                  onChange={handleData}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  value={userData.city}
                  onChange={handleData}
                  required
                />
              </div>
              <button type="submit" className="btn green">
                {userData._id ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
