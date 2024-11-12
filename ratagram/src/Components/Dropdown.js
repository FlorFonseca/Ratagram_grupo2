import * as React from "react";
import { useNavigate } from "react-router-dom";

const getUsers = async () => {
  const token = localStorage.getItem("token");
  const usersFetch = await fetch("http://localhost:3001/api/user/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await usersFetch.json();
  console.log(users);
  return users;
};

const Dropdown = () => {
  const [users, setUsers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  React.useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/friendprofile/${userId}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id} onClick={() => handleUserClick(user._id)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
