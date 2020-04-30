import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../assets/style/index.scss';

import AuthDataProvider, { useAuthDataContext } from '../common/AuthDataProvider';
import Recommendations from '../components/recommendations';
import Bot from '../components/bot';
import SignIn from '../components/auth/SignIn';

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;
  const token = localStorage.getItem('token');

  return (
    <Route
      render={props =>
        !!token ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/login/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

class App extends Component<any, any> {
  render() {
    return (
      <Router>
        <AuthDataProvider>
          <Switch>
            <Route path={'/login'} component={SignIn} />
            <PrivateRoute path="/bot" component={Bot} />
            <PrivateRoute path="/recommendations" component={Recommendations} />
            <Redirect from="/" to="/recommendations" />
          </Switch>
        </AuthDataProvider>
      </Router>
    );
  }
}

export default hot(App);
