import React, { Component } from "react";
import AuthContext from "../context/auth-context";

class Dashboard extends Component {
  static contextType = AuthContext;
  render() {
    console.log(this.context);

    return (
      <div>
        <h1>Welcome {this.context.username}!</h1>
      </div>
    );
  }
}

export default Dashboard;
