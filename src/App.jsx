import "./utils/icons/IconImports";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./views/Dashboard/Home";
import Institution from "./views/Students/Institution";
import Institutions from "./views/Students/Institutions";
import Batches from "./views/Batches";
import Batch from "./views/Batches/Batch";
import AddNewInstitute from "./views/Students/Institution/AddInstitute";

const App = () => {
  return (
    <Router>
      <Sidebar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/institutions" exact component={Institutions} />
        <Route path="/institution/new" exact component={AddNewInstitute} />
        <Route path="/institution/:id" exact component={Institution} />
        <Route path="/batches" exact component={Batches} />
        <Route path="/batch/:id" exact component={Batch} />
      </Switch>
    </Router>
  );
};

export default App;
