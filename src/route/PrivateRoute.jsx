import { Redirect, Route } from "react-router";

// screen if you're not yet authenticated.
export const PrivateRoute = ({ children, ...rest }) => {
  let token = localStorage.getItem('token');
  if (!token) {
    return <Redirect to={{pathname: '/login'}} />
  }
  return (
    <Route
      {...rest}
      render={() => children}
    />
  );
}
