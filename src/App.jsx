import { connect } from "react-redux";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Session from "./views/Batches/sessions";
import { useToasts } from "react-toast-notifications";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ReactTooltip from 'react-tooltip';

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/AppHeader";
import LayoutContainer from "./components/layout/Container";
import AppContainer from "./components/layout/AppContainer";

// Route Components
import Login from "./views/Login";
import Batches from "./views/Batches/Batches";
import Home from "./views/Dashboard/Home";
import Batch from "./views/Batches/Batch";
import Institution from "./views/Institutions/Institution";
import Institutions from "./views/Institutions/Institutions";
import Student from "./views/Students/Student";
import Students from "./views/Students/Students";
import AddSession from "./views/Batches/batchComponents/AddSession";
import updateSession from "./views/Batches/sessions/updateSession";

import TableView from "./views/Tables";

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
  margin-top: 70px;
`;

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toggleMenu = () => setIsOpen(!isOpen);

  const { addToast, removeAllToasts } = useToasts();

  useEffect(() => {
    if (props.alert.message && props.alert.variant) {
      addToast(props.alert.message, { appearance: props.alert.variant });
    } else {
      removeAllToasts();
    }
    // eslint-disable-next-line
  }, [props.alert]);

  if (!user) {
    return <Login />
  }

  return (
    <Router>
      <Route path="/login" exact component={Login} />
      <AppContainer>
        <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
        <LayoutContainer>
          <Header isOpen={isOpen} />
          <RouteContainer>
            <Switch>
              <Route path="/dashboard" exact component={Home} />
              <Route path="/students" exact component={() => <Students isSidebarOpen={isOpen} />} />
              <Route path="/student/:id" exact component={Student} />
              <Route path="/institutions" exact component={Institutions} />
              <Route path="/institution/:id" exact component={Institution} />
              <Route path="/batches" exact component={Batches} />
              <Route path="/batch/:id" exact component={Batch} />
              <Route
                exact
                component={AddSession}
                path="/new-session/:batchId"
              />
              <Route path="/session/:sessionID" exact component={Session} />
              <Route
                exact
                component={updateSession}
                path="/update-session/:sessionID"
              />
              <Route path="/test" exact component={TableView} />
            </Switch>
          </RouteContainer>
        </LayoutContainer>
        <ReactTooltip />
      </AppContainer>
    </Router>
  );
};

const mapStateToProps = (state) => ({
  alert: state.notification,
});

export default connect(mapStateToProps, {})(App);
