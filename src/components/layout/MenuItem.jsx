import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MenuEl = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  overflow: hidden;
  align-items: center;
  padding-left: ${(props) => (props.isOpen ? `30px` : "")};
  justify-content: ${(props) => (props.isOpen ? `start` : "center")};
`;

const MenuItem = (props) => {
  const { icon, to, title, isOpen } = props;

  return (
    <MenuEl isOpen={isOpen}>
      <NavLink
        exact
        to={to}
        className="menu-item-link"
        activeClassName="sidebar-link-active"
      >
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
      </NavLink>
    </MenuEl>
  );
};

export default MenuItem;
