import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import {BsChevronDown, BsChevronRight} from 'react-icons/bs';

const MenuEl = styled.div`
  overflow: hidden;
  padding-left: ${(props) => (props.isOpen ? `30px` : "")};
  padding-right: ${(props) => (props.isOpen ? `30px` : "")};
  justify-content: ${(props) => (props.isOpen ? `start` : "center")};
`;

const MenuItem = (props) => {
  const { icon, to, title, isOpen } = props;
  const level = props.level || 0;
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(false);
  const showSubMenuIcon = isOpen && level === 0 && props.subMenu?.length;

  return (
    <MenuEl isOpen={isOpen} className="w-100 d-flex flex-column align-items-center">
      <div className={`d-flex align-items-center w-100 ${isOpen ? 'justify-content-between' : 'justify-content-center'}`}>
        <NavLink
          exact
          to={to}
          className="menu-item-link d-flex align-items-center"
          activeClassName="sidebar-link-active"
          style={{minHeight: '70px', fontSize: '18px'}}
        >
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
        </NavLink>
        {showSubMenuIcon && subMenuCollapsed && <BsChevronRight onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
        {showSubMenuIcon && !subMenuCollapsed && <BsChevronDown onClick={() => setSubMenuCollapsed(!subMenuCollapsed)} className="c-pointer" />}
      </div>
      <div className={`sub-menu d-flex flex-column align-items-start ${subMenuCollapsed ? 'd-none' : ''}`}>
        {props.subMenu && props.subMenu.map((child) => (
          isOpen && (
            <NavLink
              exact
              to={child.to}
              className="menu-item-link d-flex align-items-center"
              activeClassName="sidebar-link-active"
              style={{minHeight: '40px', fontSize: '16px'}}
            >
              {(level === 0 || isOpen) && <span onClick={() => setSubMenuCollapsed(!subMenuCollapsed)}>{child.icon}</span>}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0 }}
                    style={{ marginLeft: "10px" }}
                  >
                    <span>{child.title}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          )
        ))}
      </div>
    </MenuEl>
  );
};

export default MenuItem;
