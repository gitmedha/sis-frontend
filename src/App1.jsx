import { useState } from "react";
import styled from "styled-components";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { motion, AnimatePresence } from "framer-motion";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Batches from "./views/Batches";
import Home from "./views/Dashboard/Home";
import Batch from "./views/Batches/Batch";
import Institution from "./views/Students/Institution";
import Institutions from "./views/Students/Institutions";
import AddNewInstitute from "./views/Students/Institution/AddInstitute";

const AppContainer = styled.div`
  z-index: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: start;
`;

const SideNav = styled.div`
  z-index: 1;
  height: 100%;
  align-self: stretch;
  background-color: #fff;
  transition: 0.15s ease-in;
  border-right: 2px solid #f2f2f2;
  width: ${(props) => (props.isOpen ? `250px` : "80px")};
`;

const Container = styled.div`
  flex: 1;
  z-index: 1;
  height: 100vh;
  display: flex;
  overflow: auto;
  @extend .container;
  flex-direction: column;
  background-color: white;
`;

const AppHeader = styled.div`
  z-index: 3;
  width: 100%;
  display: flex;
  positon: sticky;
  padding-left: 15px;
  padding-right: 15px;
  align-items: center;
  justify-content: start;
  height: 70px !important;
  background-color: white;
  border-bottom: 2px solid #f2f2f2;
`;

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
`;

const MenuItem = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  overflow: hidden;
  background: #257b69;
  align-items: center;
  justify-content: center;
  a {
    color: white;
    display: flex;
    font-size: 16px;
    text-decoration: none;
    font-family: Latto-Bold;
    align-items: center;
    justify-content: center;
  }
`;

const App = () => {
  const [isOpen, toggler] = useState(false);
  const toggleMenu = () => toggler(!isOpen);

  return (
    <Router>
      <AppContainer>
        <SideNav isOpen={isOpen}>
          <>
            <MenuItem>
              <Link to="/">
                <DashboardIcon style={{ color: "white", marginRight: "5px" }} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0 }}
                    >
                      <span>Dashboard</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/institutions">
                <FaUserGraduate size={22} style={{ marginRight: "5px" }} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0 }}
                    >
                      <span>Students</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/batches">
                <FaChalkboardTeacher size={22} style={{ marginRight: "5px" }} />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ duration: 0 }}
                    >
                      <span>Batches</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            </MenuItem>
          </>
        </SideNav>
        <Container>
          <AppHeader>
            <AnimatePresence>
              {!isOpen ? (
                <motion.div
                  exit={{ rotate: -90 }}
                  animate={{ rotate: -0 }}
                  initial={{ rotate: -90 }}
                  transition={{ duration: 1 }}
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
                  <CloseIcon
                    onClick={toggleMenu}
                    style={{ color: "#207B69" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </AppHeader>

          <RouteContainer>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/institutions" exact component={Institutions} />
              <Route
                exact
                path="/institution/new"
                component={AddNewInstitute}
              />
              <Route path="/institution/:id" exact component={Institution} />
              <Route path="/batches" exact component={Batches} />
              <Route path="/batch/:id" exact component={Batch} />
            </Switch>
          </RouteContainer>
        </Container>
      </AppContainer>
    </Router>
  );
};

export default App;
