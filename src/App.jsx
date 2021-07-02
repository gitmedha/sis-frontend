import { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Layout Components
import Sidebar from "./components/layout/Sidenav";
import Header from "./components/layout/AppHeader";
import Container from "./components/layout/Container";
import AppContainer from "./components/layout/AppContainer";

// Route Components
import Batches from "./views/Batches";
import Home from "./views/Dashboard/Home";
import Batch from "./views/Batches/Batch";
import NewBatch from "./views/Batches/NewBatch";
import Institution from "./views/Students/Institution";
import Institutions from "./views/Students/Institutions";
import AddSession from "./views/Batches/batchComponents/AddSession";
import AddNewInstitute from "./views/Students/Institution/AddInstitute";

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
`;

const App = () => {
  const [isOpen, toggler] = useState(false);
  const toggleMenu = () => toggler(!isOpen);

  return (
    <Router>
      <AppContainer>
        <Sidebar isOpen={isOpen} />
        <Container>
          <Header isOpen={isOpen} toggleMenu={toggleMenu} />
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
              <Route
                exact
                component={AddSession}
                path="/new-session/:batchId"
              />
              <Route path="/add-new-batch" exact component={NewBatch} />
            </Switch>
          </RouteContainer>
        </Container>
      </AppContainer>
    </Router>
  );
};

export default App;
