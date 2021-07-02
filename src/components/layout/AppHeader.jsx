import styled from "styled-components";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { motion, AnimatePresence } from "framer-motion";

import Userbox from "./Userbox";

const AppHeader = styled.div`
  z-index: 3;
  width: 100%;
  display: flex;
  positon: sticky;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  background-color: white;
  height: 70px !important;
  justify-content: space-between;
  border-bottom: 2px solid #f2f2f2;
`;

const Header = ({ isOpen, toggleMenu }) => {
  return (
    <AppHeader>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            exit={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            initial={{ rotate: -90 }}
            transition={{ duration: 0.3 }}
          >
            <MenuIcon style={{ color: "#207B69" }} onClick={toggleMenu} />
          </motion.div>
        ) : (
          <motion.div
            exit={{ opacity: -90 }}
            animate={{ rotate: 0 }}
            initial={{ rotate: -90 }}
            transition={{ duration: 1 }}
          >
            <CloseIcon onClick={toggleMenu} style={{ color: "#207B69" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <Userbox />
    </AppHeader>
  );
};

export default Header;
