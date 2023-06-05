import { useEffect } from "react";
import { useState } from "react";
import styled from 'styled-components';

const Styled = styled.div`
  .tab {
    margin-left: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #787B96;
    padding: 7px;
    border-radius: 5px;

    .icon {
      margin-right: 5px;
    }

    .title {
      font-size: 14px;
      line-height: 1.25;
    }

    &.active {
      background: rgba(196, 196, 196, 0.28);
    }
  }
`;

const Tabs = ({ options, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleClick = (index) => {
    setActiveTab(index);
    console.log("options--------------->1",index);
    onTabChange(options[index]);
  };

  useEffect(() => {
    console.log("options--------------->",options);
  }, [])
  

  return (
    <Styled>
      <div className="navbar">
        {options.map((tab, key) => (
          <div className={`tab ${activeTab === key ? 'active' : ''}`} onClick={() => handleClick(key)} >
            {tab.icon && <span className="icon">{tab.icon}</span>}
            <span className="title">{tab.title}</span>
          </div>
        ))}
      </div>
    </Styled>
  );
};

export default Tabs;
