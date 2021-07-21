import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import {BsChevronDown, BsChevronRight} from 'react-icons/bs';

const MenuEl = styled.div`
  overflow: hidden;
  justify-content: ${(props) => (props.isOpen ? `start` : "center")};
`;

const MenuItem = (props) => {
  const { icon, to, title, isOpen } = props;
  const level = props.level || 0;
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(false);
  const showSubMenuIcon = isOpen && level === 0 && props.subMenu?.length;

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <NavLink
        exact
        to={to}
        className={`menu-item-link d-flex align-items-center ${isOpen ? 'w-100 justify-content-between' : 'justify-content-center'}`}
        activeClassName="sidebar-link-active"
        activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
        style={{paddingLeft: isOpen ? '30px' : '', paddingRight: isOpen ? '30px' : ''}}
      >
        <div className={`d-flex align-items-center w-100 justify-content-start`}>
          {(level === 0 || isOpen) && icon}
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
        {props.subMenu && props.subMenu.map((child) => (
          isOpen && (
            <NavLink
              exact
              to={child.to}
              className="menu-item-link d-flex align-items-center w-100"
              activeClassName="sidebar-link-active"
              style={{paddingLeft: isOpen ? '40px' : ''}}
              activeStyle={{borderRightColor: isOpen ? '#257b69' : 'transparent'}}
            >
              <div className={`d-flex align-items-center w-100 justify-content-start`}>
                {(level === 0 || isOpen) && child.icon}
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
