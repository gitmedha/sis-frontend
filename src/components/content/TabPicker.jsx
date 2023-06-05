import { useState } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const TabPicker = ({ options, setActiveTab = () => {} }) => {
  // const [tabs, setTabs] = useState(options);
  const [activeTab, setActive] = useState(options[0].key);

  const changeTab = (tab) => {
    console.log("Tab",tab);
    setActive(tab.key);
    setActiveTab(tab);
  };
  useEffect(() => {
    console.log("activeTab",options);
  }, [])
  

  return (
    <div className="topnav my-3 latto-regular">
      {options.map((tab) => (
        <div
          key={tab.key}
          onClick={() => changeTab(tab)}
          className={activeTab === tab.key ? `active` : ""}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
};

TabPicker.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default TabPicker;
