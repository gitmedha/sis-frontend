import { useState } from "react";
import SidebarNav from "./SidebarNav";
import logo from "../../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const [open, toggleSidebar] = useState(true);

  return (
    <div className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div
        className={`sidebar-button-wrapper ${
          open ? "sidebar-button-wrapper-open" : ""
        }`}
      >
        <button
          className={`sidebar-button ${open ? "sidebar-button-open" : ""}`}
          onClick={() => toggleSidebar(!open)}
        >
          {open ? (
            <FontAwesomeIcon icon={["fas", "times"]} />
          ) : (
            <FontAwesomeIcon icon={["fas", "bars"]} />
          )}
        </button>
      </div>
      <div>
        <div className="sidebar-brand-logo">
          <img
            src={logo}
            className={`img-fluid brand-logo ${open ? "brand-logo-open" : ""}`}
          />
        </div>
        <div className="mt-4">
          <SidebarNav />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
