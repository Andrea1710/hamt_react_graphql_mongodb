import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import SideDrawer from "./components/Navigation/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import HistoryAdmin from "./pages/HistoryAdmin";
import Users from "./pages/Users";
import JoiningsPage from "./pages/Joinings";
import ClassesPage from "./pages/Classes";
import MainNavigation from "./components/Navigation/MainNavigation";

import AuthContext from "./context/auth-context";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
    username: null,
    email: null,
    plan: null,
    planExpiration: null,
    tokenExpiration: null,
    sideDrawerOpen: false
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return {
        sideDrawerOpen: !prevState.sideDrawerOpen
      };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  login = (
    token,
    userId,
    tokenExpiration,
    username,
    email,
    plan,
    planExpiration
  ) => {
    this.setState({
      token: token,
      userId: userId,
      username: username,
      email: email,
      plan: plan,
      planExpiration: planExpiration
    });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler} />;
    }
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              tokenExpiration: this.state.tokenExpiration,
              userId: this.state.userId,
              username: this.state.username,
              plan: this.state.plan,
              planExpiration: this.state.planExpiration,
              email: this.state.email,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation
              drawerClickHandler={this.drawerToggleClickHandler}
            />
            <SideDrawer show={this.state.sideDrawerOpen} />
            {backdrop}
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/auth" to="/" exact />}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/classes" component={ClassesPage} />
                {this.state.token && (
                  <Route path="/joinings" component={JoiningsPage} />
                )}
                {this.state.token &&
                  this.state.userId === "5c9d930f1134f1e2f2a7bd97" && (
                    <Route path="/history-admin" component={HistoryAdmin} />
                  )}
                {this.state.token &&
                  this.state.userId === "5c9d930f1134f1e2f2a7bd97" && (
                    <Route path="/users" component={Users} />
                  )}
                {!this.state.token && <Redirect to="/auth" exact />}
                <Route path="/" component={Dashboard} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
