import { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import AuthContext from "../../context/AuthContext";

const Userbox = () => {
  const {user, logout} = useContext(AuthContext);

  return (
    <Dropdown className="user-box">
      <Dropdown.Toggle id="dropdown-basic" variant="white">
        <img
          alt="user-box"
          className=""
          src="https://avatars.githubusercontent.com/u/29309671?v=4"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item disabled>
          <div className="text-detail-title">{user?.username}</div>
          <div>{user?.email}</div>
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item onClick={() => logout()}>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Userbox;
