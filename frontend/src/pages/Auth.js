import React, { Component } from "react";

import AuthContext from "../context/auth-context";

import "./Auth.css";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach(val => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach(val => {
    val === null && (valid = false);
  });
  return valid;
};

class AuthPage extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    gender: "",
    formErrors: {
      name: "",
      email: "",
      password: "",
      gender: ""
    },
    errors: "",
    isLogin: true,
    showEye: false
  };

  static contextType = AuthContext;

  showPassword = () => {
    this.setState(prevState => {
      return {
        showEye: !prevState.showEye
      };
    });
  };

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  onChangeHandler = event => {
    const { name, value } = event.target;
    let formErrors = this.state.formErrors;

    switch (name) {
      case "name":
        formErrors.name =
          value.length < 3 ? "Minimum 3 characters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "Invalid Email address";
        break;
      case "password":
        formErrors.password =
          value.length < 6 ? "Minimum 6 characters required" : "";
        break;
      case "gender":
        formErrors.gender = value.length === 0 ? "This field is required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value });
  };

  submitHandler = event => {
    event.preventDefault();
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    const gender = this.state.gender;

    if (formValid(this.state)) {
      console.log(`
        --SUBMITTING
          Name: ${this.state.name}
          Email: ${this.state.email}
          Password: ${this.state.password}
          Gender: ${this.state.gender}
      `);
    } else {
      console.error("FORM INVALID - DISPLAY ERROR MESSAGE");
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
            username 
          }
        }
      `
    };

    if (!this.state.isLogin) {
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
          this.setState({
            errors: "Email or password are incorrect. Check and try again."
          });
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.username,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { formErrors, errors } = this.state;

    let showPassword = "fa fa-eye";
    let passwordText = "password";
    if (this.state.showEye) {
      showPassword = "fa fa-eye active";
      passwordText = "text";
    }

    const signup = (
      <div className="form-wrapper">
        <h1 style={{ color: "red" }}>REGISTER</h1>
        <form onSubmit={this.submitHandler}>
          <div className="name">
            <label htmlFor="name">Name</label>
            <input
              className={formErrors.name.length > 0 ? "error" : null}
              name="name"
              placeholder=" Name"
              value={this.state.name}
              onChange={event => this.onChangeHandler(event)}
              type="text"
              id="name"
            />
            {formErrors.name.length > 0 && (
              <span className="errorMessage">{formErrors.name}</span>
            )}
          </div>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              className={formErrors.email.length > 0 ? "error" : null}
              name="email"
              placeholder=" test@test.com"
              type="email"
              id="email"
              value={this.state.email}
              onChange={event => this.onChangeHandler(event)}
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}
          </div>
          <div className="password">
            <div>
              <label htmlFor="password" id="password">
                Password
              </label>
              <i className={showPassword} onClick={this.showPassword} />
            </div>
            <input
              className={formErrors.password.length > 0 ? "error" : null}
              name="password"
              placeholder=" Password"
              type={passwordText}
              id="password"
              value={this.state.password}
              onChange={event => this.onChangeHandler(event)}
            />
            {formErrors.password.length > 0 && (
              <span className="errorMessage">{formErrors.password}</span>
            )}
          </div>
          <div className="gender">
            <label htmlFor="gender">Gender</label>
            <input
              className={formErrors.gender.length > 0 ? "error" : null}
              name="gender"
              placeholder=" Male / Female"
              type="text"
              id="gender"
              value={this.state.gender}
              onChange={event => this.onChangeHandler(event)}
            />
            {formErrors.gender.length > 0 && (
              <span className="errorMessage">{formErrors.gender}</span>
            )}
          </div>
          <div className="createAccount">
            <button type="submit">Register</button>
            <small>Already have an Account?</small>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to Login
            </button>
          </div>
        </form>
      </div>
    );

    const login = (
      <div className="form-wrapper">
        <h1 style={{ color: "red" }}>LOGIN</h1>
        <form onSubmit={this.submitHandler}>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              className={formErrors.email.length > 0 ? "error" : null}
              name="email"
              placeholder=" test@test.com"
              type="email"
              id="email"
              value={this.state.email}
              onChange={event => this.onChangeHandler(event)}
            />
            {formErrors.email.length > 0 && (
              <span className="errorMessage">{formErrors.email}</span>
            )}
          </div>
          <div className="password">
            <div>
              <label htmlFor="password" id="password">
                Password
              </label>
              <i className={showPassword} onClick={this.showPassword} />
            </div>
            <input
              className={formErrors.password.length > 0 ? "error" : null}
              name="password"
              placeholder=" Password"
              type={passwordText}
              id="password"
              value={this.state.password}
              onChange={event => this.onChangeHandler(event)}
            />
            {formErrors.password.length > 0 && (
              <span className="errorMessage">{formErrors.password}</span>
            )}
            {errors.length > 0 && (
              <span className="errorMessage">{errors}</span>
            )}
          </div>
          <div className="createAccount">
            <button type="submit">Login</button>
            <small>Don't have an Account yet?</small>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to Signup
            </button>
          </div>
        </form>
      </div>
    );
    return <div className="wrapper">{this.state.isLogin ? login : signup}</div>;
  }
}

export default AuthPage;
