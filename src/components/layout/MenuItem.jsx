import styled from "styled-components";
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import {BsChevronDown, BsChevronRight} from 'react-icons/bs';

const MenuEl = styled.div`
  overflow: hidden;
  justify-content: ${(props) => (props.isOpen ? `start` : "center")};
`;

const MenuItem = (props) => {
  const { icon, to, title, isOpen } = props;
  const isActiveFirstLevel = window.location.pathname === to || props.activeFirstLevel === props.title;
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(!isActiveFirstLevel);
  const showSubMenuIcon = isOpen && props.children?.length;

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <NavLink
        to={to}
        className={`menu-item-link d-flex align-items-center ${isOpen ? 'w-100 justify-content-between' : 'justify-content-center'}`}
        style={{paddingLeft: isOpen ? '30px' : '', paddingRight: isOpen ? '30px' : ''}}
        isActive={() => isActiveFirstLevel}
        activeClassName="sidebar-link-active"
        activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
        onClick={() => props.setActiveFirstLevel(props.title)}
      >
        <div className={`d-flex align-items-center w-100 justify-content-start`}>
          {icon}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0 }}
                style={{ marginLeft: "10px" }}
              >
                <span>{title}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showSubMenuIcon && subMenuCollapsed && <BsChevronRight onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
        {showSubMenuIcon && !subMenuCollapsed && <BsChevronDown onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
      </NavLink>
      <div className={`sub-menu d-flex flex-column align-items-start w-100 ${subMenuCollapsed ? 'd-none' : ''}`}>
        {props.children && props.children.map((child, index) => (
          isOpen && (
            <NavLink
              key={index}
              to={child.to}
              className="menu-item-link d-flex align-items-center w-100"
              style={{paddingLeft: isOpen ? '40px' : ''}}
              isActive={(match, location) =>{
                if (!match) return false;
                return location.hash.substr(1) === child.to.split('#')[1] || location.pathname === child.to;
              }}
              activeClassName="sidebar-link-active"
              activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
              onClick={() => props.setActiveFirstLevel(props.title)}
            >
              <div className={`d-flex align-items-center w-100 justify-content-start`}>
                {isOpen && child.icon}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0 }}
                      style={{ marginLeft: "15px" }}
                    >
                      <span>{child.title}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
          )
        ))}
      </div>
    </MenuEl>
  );
};

export default MenuItem;
