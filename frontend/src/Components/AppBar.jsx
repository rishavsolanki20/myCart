import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoutIcon } from "../Asserts/logout.svg";
import axios from "axios";

export default function AppBar() {
  const navigate = useNavigate();
  const [showPopover, setShowPopover] = useState(false);
  const [username, setUsername] = useState("");

  const handlePopoverToggle = () => {
    setShowPopover(!showPopover);
  };
  useEffect(() => {
    const storeName = localStorage.getItem("username");
    if (storeName) {
      setUsername(storeName);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove token and user data from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      // Redirect to signin page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="shadow h-14 flex justify-between items-center">
      <div className="ml-4">myCart</div>
      <div className="flex items-center">
        <div className="flex flex-col justify-center mr-4">{username}</div>
        <button
          className="rounded-full h-12 w-12 bg-gray-200 flex justify-center items-center mr-4"
          onClick={handlePopoverToggle}
        >
          {username && username.length > 0 && (
            <div className="text-black text-xl">
              {username[0].toUpperCase()}
            </div>
          )}
        </button>
        {showPopover && (
          <div className="absolute right-0 mt-14 mr-4 bg-white p-2 rounded shadow">
            <button onClick={handleLogout} className="flex items-center">
              <LogoutIcon className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-red-500">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
