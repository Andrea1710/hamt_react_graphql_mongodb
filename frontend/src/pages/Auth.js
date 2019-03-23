import React, { Component } from "react";

import AuthContext from "../context/auth-context";

import "./Auth.css";

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.nameEl = React.createRef();
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.genderEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      const name = this.nameEl.current.value;
      const gender = this.genderEl.current.value;
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {name: "${name}", email: "${email}", password: "${password}", date: "${new Date().toISOString()}", gender: "${gender}"}) {
              _id
              name
              email
              gender
            }
          }
        `
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const signup = (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input placeholder=" Name" type="text" id="name" ref={this.nameEl} />
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            placeholder=" test@test.com"
            type="email"
            id="email"
            ref={this.emailEl}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            placeholder=" Password"
            type="password"
            id="password"
            ref={this.passwordEl}
          />
        </div>
        <div className="form-control">
          <label htmlFor="gender">Gender</label>
          <input
            placeholder=" Male / Female"
            type="text"
            id="gender"
            ref={this.genderEl}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Register</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to Login
          </button>
        </div>
      </form>
    );

    const login = (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            placeholder=" test@test.com"
            type="email"
            id="email"
            ref={this.emailEl}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            placeholder=" Password"
            type="password"
            id="password"
            ref={this.passwordEl}
          />
        </div>
        <div className="form-actions">
          <button type="submit">Login</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to Signup
          </button>
        </div>
      </form>
    );
    return <div>{this.state.isLogin ? login : signup}</div>;
  }
}

export default AuthPage;
