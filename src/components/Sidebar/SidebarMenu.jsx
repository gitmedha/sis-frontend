import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const SidebarLink = styled(Link)`
  height: 60px;
  display: flex;
  padding: 20px;
  color: #808080;
  font-size: 16px;
  list-style: none;
  align-items: center;
  text-decoration: none;
  justify-content: space-between;
  font-family: Latto-Regular !important;
  &:hover {
    color: #207b69;
    cursor: pointer;
    background: none;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  height: 60px;
  color: #000;
  display: flex;
  font-size: 15px;
  padding-left: 3rem;
  background: #fff;
  align-items: center;
  text-decoration: none;
  font-family: Latto-Regular !important;
  &:hover {
    color: #207b69;
    cursor: pointer;
    background: #fff;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <SidebarLink to={item.path} onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <DropdownLink to={item.path} key={index}>
              {item.icon}
              <SidebarLabel>{item.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;
