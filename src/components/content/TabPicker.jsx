import { useState } from "react";
import PropTypes from "prop-types";

const TabPicker = ({ options, setActiveTab = () => {} }) => {
  // const [tabs, setTabs] = useState(options);
  const [activeTab, setActive] = useState(options[0].key);
  const userState = (localStorage.getItem('user_state'))

  const changeTab = (tab) => {
    setActive(tab.key);
    setActiveTab(tab);
  };

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
