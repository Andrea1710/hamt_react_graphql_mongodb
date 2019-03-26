import React from "react";
import { NavLink } from "react-router-dom";

import image from "../../assets/hoi_an_muay_thai_logo.png";

import DrawerToggleButton from "./SideDrawer/DrawerToggleButton";

import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

const mainNavigation = props => {
  return (
    <AuthContext.Consumer>
      {context => {
        return (
          <header className="main-navigation">
            <div className="main-navigation__toggle-button">
              <DrawerToggleButton click={props.drawerClickHandler} />
            </div>
            <div className="main-navigation__logo">
              <NavLink to="/">
                <img className="image" src={image} alt="HOI AN MUAY THAI" />
              </NavLink>
            </div>
            <nav className="main-navigation__items">
              <ul>
                {!context.token && (
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/classes">Classes</NavLink>
                </li>
                {context.token && (
                  <React.Fragment>
                    <li>
                      <NavLink to="/joinings">History</NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}>Logout</button>
                    </li>
                  </React.Fragment>
                )}
                {context.token &&
                  context.userId === "5c9451446232f74543d6bc9c" && (
                    <React.Fragment>
                      <li>
                        <NavLink style={{ color: "green" }} to="/history-admin">
                          ADMIN
                        </NavLink>
                      </li>
                    </React.Fragment>
                  )}
              </ul>
            </nav>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default mainNavigation;
