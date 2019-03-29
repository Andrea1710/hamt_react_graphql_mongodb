import React from "react";
import { NavLink } from "react-router-dom";

import image from "../../../assets/hoi_an_muay_thai_logo_black.png";

import AuthContext from "../../../context/auth-context";

import "./SideDrawer.css";

const SideDrawer = props => {
  let drawerClasses = "side-drawer";
  if (props.show) {
    drawerClasses = "side-drawer open";
  }
  return (
    <AuthContext.Consumer>
      {context => {
        return (
          <nav className={drawerClasses}>
            <NavLink to="/">
              <img className="image" src={image} alt="HOI AN MUAY THAI" />
            </NavLink>
            <ul>
              {!context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/auth">Authenticate</NavLink>
                  </li>
                </React.Fragment>
              )}
              <React.Fragment>
                <li>
                  <NavLink to="/classes">Classes</NavLink>
                </li>
              </React.Fragment>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/joinings">History</NavLink>
                  </li>
                  <li>
                    <button
                      style={{ fontSize: "1.2rem" }}
                      onClick={context.logout}
                    >
                      LOGOUT
                    </button>
                  </li>
                </React.Fragment>
              )}
              {context.token && context.userId === "5c9d930f1134f1e2f2a7bd97" && (
                <React.Fragment>
                  <li>
                    <NavLink style={{ color: "green" }} to="/history-admin">
                      ADMIN
                    </NavLink>
                  </li>
                  <li>
                    <NavLink style={{ color: "green" }} to="/users">
                      USERS
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default SideDrawer;
