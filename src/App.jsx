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
import Batches from "./views/Batches";
import Home from "./views/Dashboard/Home";
import Batch from "./views/Batches/Batch";
import NewBatch from "./views/Batches/NewBatch";
import Institution from "./views/Students/Institution";
import Institutions from "./views/Students/Institutions";
import AddSession from "./views/Batches/batchComponents/AddSession";
import updateSession from "./views/Batches/sessions/updateSession";

import TableView from "./views/Tables";

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
`;

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <Router>
      <AppContainer>
        <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
        <LayoutContainer>
          <Header isOpen={isOpen} />
          <RouteContainer>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/institutions" exact component={Institutions} />
              <Route path="/institution/:id" exact component={Institution} />
              <Route path="/batches" exact component={Batches} />
              <Route path="/batch/:id" exact component={Batch} />
              <Route
                exact
                component={AddSession}
                path="/new-session/:batchId"
              />
              <Route path="/add-new-batch" exact component={NewBatch} />
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
