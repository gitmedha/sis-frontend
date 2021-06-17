import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = () => {
  const [openItem, setOpen] = useState(false);
  return (
    <div className="card">
      <div
        onClick={() => setOpen(!openItem)}
        className="card-header bg-white d-flex align-items-center justify-content-start"
      >
        <FontAwesomeIcon className="mr-3" icon={["fa", "gauge-simple"]} />
        Dashboard
      </div>
      {openItem && (
        <div className="card-body py-1">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
