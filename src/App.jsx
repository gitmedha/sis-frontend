import { connect } from "react-redux";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import Session from "./views/Batches/sessions";
import { useToasts } from "react-toast-notifications";
import { Switch, Route, useHistory, Redirect } from "react-router-dom";
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
import Opportunities from "./views/Opportunities/Opportunities";
import Opportunity from "./views/Opportunities/Opportunity";
import Student from "./views/Students/Student";
import Students from "./views/Students/Students";
import AddSession from "./views/Batches/batchComponents/AddSession";
import updateSession from "./views/Batches/sessions/updateSession";
import Employer from "./views/Employers/Employer";
import Employers from "./views/Employers/Employers";
import TableView from "./views/Tables";

import AuthContext from "./context/AuthContext";
import { PrivateRoute } from "./route/PrivateRoute";
import axios from "axios";
import { urlPath } from "./constants";
import { PublicRoute } from "./route/PublicRoute";

const RouteContainer = styled.div`
  flex: 1;
  z-index: 2;
  overflow: auto;
  margin-top: 70px;
`;

const App = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { addToast, removeAllToasts } = useToasts();
  const toggleMenu = () => setIsOpen(!isOpen);
  const history = useHistory();
  const token = localStorage.getItem("token");
  localStorage.setItem("user_state" , user?.state); 
  localStorage.setItem("user_area", user?.area);

  const logout = (callback = () => {}) => {
    setUser(null);
    localStorage.removeItem('token');
    callback();
  }

  useEffect(() => {
    if (props.alert.message && props.alert.variant) {
      addToast(props.alert.message, { appearance: props.alert.variant });
    } else {
      removeAllToasts();
    }
  }, [props.alert]);

  const getUserDetails = () => {
    if (token) {
      // authenticate the token on the server and place set user object
      axios.get(urlPath('/users/me'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (res.status !== 200) {
          localStorage.removeItem('token');
          setUser(null);
          return null;
        }
        setUser(res.data);
      });
    }
  }

  useEffect(() => {
    const accessToken = new URL(window.location.href).searchParams.get('access_token');
    // check for full path also.
    if (accessToken) {
      // make api request to fetch JSON
      axios.get(urlPath('/auth/microsoft/callback') + '?access_token=' + accessToken).then(data => {
        localStorage.setItem("token", data.data.jwt);
        setUser(data.data.user);
        history.push('/');
      })
    }
  }, []);


  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        isAuthenticated: !!user,
        logout: logout,
      }}
    >
      <Switch>
        <PublicRoute path="/login" exact component={Login} />
        <PublicRoute path="/auth/microsoft/callback" />
        <Route>
          <AppContainer>
            <Sidebar isOpen={isOpen} toggleMenu={toggleMenu} />
            <LayoutContainer>
              <Header isOpen={isOpen} />
              <RouteContainer id="main-content">
                <Switch>
                  <PrivateRoute path="/" exact component={Home} />
                  <PrivateRoute path="/students" exact component={() => <Students isSidebarOpen={isOpen} />} />
                  <PrivateRoute path="/student/:id" exact component={Student} />
                  <PrivateRoute path="/institutions" exact component={Institutions} />
                  <PrivateRoute path="/institution/:id" exact component={Institution} />
                  <PrivateRoute path="/batches" exact component={Batches} />
                  <PrivateRoute path="/batch/:id" exact component={Batch} />
                  <PrivateRoute path="/opportunities" exact component={Opportunities} />
                  <PrivateRoute path="/opportunity/:id" exact component={Opportunity} />
                  <PrivateRoute
                    exact
                    component={AddSession}
                    path="/new-session/:batchId"
                  />
                  <PrivateRoute path="/session/:sessionID" exact component={Session} />
                  <PrivateRoute
                    exact
                    component={updateSession}
                    path="/update-session/:sessionID"
                  />
                  <PrivateRoute path="/employers" exact component={Employers} />
                  <PrivateRoute path="/employer/:id" exact component={Employer} />
                  <Route path="/" render={() => <Redirect to={token ? '/' : '/login'} />} />
                </Switch>
              </RouteContainer>
            </LayoutContainer>
            <ReactTooltip />
          </AppContainer>
        </Route>
      </Switch>
    </AuthContext.Provider>
  );
};

const mapStateToProps = (state) => ({
  alert: state.notification,
});

export default connect(mapStateToProps, {})(App);
