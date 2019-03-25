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
            </ul>
          </nav>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default SideDrawer;