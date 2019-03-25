import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import ClassList from "../components/Classes/ClassList/ClassList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Classes.css";

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

class ClassesPage extends Component {
  state = {
    title: "",
    description: "",
    date: "",
    time: "",
    formErrors: {
      title: "",
      description: "",
      date: "",
      time: ""
    },
    creating: false,
    classes: [],
    isLoading: false,
    selectedClass: null,
    sideDrawerOpen: false
  };
  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchClasses();
  }

  startCreateClassHandler = () => {
    this.setState({ creating: true });
  };

  onChangeHandler = event => {
    const { name, value } = event.target;
    let formErrors = this.state.formErrors;

    switch (name) {
      case "title":
        formErrors.title = value.length === 0 ? "This field is required" : "";
        break;
      case "description":
        formErrors.description =
          value.length === 0 ? "This field is required" : "";
        break;
      case "date":
        formErrors.date = value.length === 0 ? "This field is required" : "";
        break;
      case "time":
        formErrors.time = value.length === 0 ? "This field is required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value }, () => console.log(this.state));
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.state.title;
    const description = this.state.description;
    const date = this.state.date;
    const time = this.state.time;

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

    const mtclass = {
      title: title,
      description: description,
      date: date,
      time: time
    };
    console.log(mtclass);

    const requestBody = {
      query: `
          mutation {
            createClass(classInput: {title: "${title}", description: "${description}", date: "${date}", time: "${time}"}) {
              _id
              title
              description
              date
              time
              creator {
                _id
                name
              }
          }
        }
        `
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);

        this.setState(prevState => {
          const updatedClasses = [...prevState.classes];
          updatedClasses.push({
            _id: resData.data.createClass._id,
            title: resData.data.createClass.title,
            description: resData.data.createClass.description,
            date: resData.data.createClass.date,
            time: resData.data.createClass.time,
            creator: {
              _id: this.context.userId
            }
          });
          return {
            classes: updatedClasses
          };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedClass: null });
  };

  fetchClasses() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            classes {
              _id
              title
              description
              date
              time
              creator {
                _id
                name
                email
              }
            }
          }
        `
    };

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
        const classes = resData.data.classes;
        if (this.isActive) {
          this.setState({ classes: classes, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = classId => {
    this.setState(prevState => {
      const selectedClass = prevState.classes.find(c => c._id === classId);
      return { selectedClass: selectedClass };
    });
  };

  joinClassHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedClass: null });
      return;
    }
    const requestBody = {
      query: `
          mutation {
            joinClass(classId: "${this.state.selectedClass._id}") {
              _id
             createdAt
             updatedAt
            }
          }
        `
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({ selectedClass: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    console.log(this.context.userId);

    const { formErrors } = this.state;

    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedClass) && <Backdrop />}
        {this.state.creating && (
          <Modal
            className="modal"
            title="Creation of a Muay Thai Class"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText="Confirm"
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input
                  className={formErrors.title.length > 0 ? "error" : null}
                  name="title"
                  type="text"
                  id="title"
                  value={this.state.title}
                  onChange={event => this.onChangeHandler(event)}
                />
                {formErrors.title.length > 0 && (
                  <span className="errorMessage">{formErrors.title}</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  className={formErrors.description.length > 0 ? "error" : null}
                  name="description"
                  type="text"
                  id="description"
                  rows="4"
                  value={this.state.description}
                  onChange={event => this.onChangeHandler(event)}
                />
                {formErrors.description.length > 0 && (
                  <span className="errorMessage">{formErrors.description}</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input
                  className={formErrors.date.length > 0 ? "error" : null}
                  name="date"
                  type="date"
                  id="date"
                  value={this.state.date}
                  onChange={event => this.onChangeHandler(event)}
                />
                {formErrors.date.length > 0 && (
                  <span className="errorMessage">{formErrors.date}</span>
                )}
              </div>
              <div className="form-control">
                <label htmlFor="time">Time</label>
                <input
                  className={formErrors.time.length > 0 ? "error" : null}
                  name="time"
                  type="text"
                  id="time"
                  value={this.state.time}
                  onChange={event => this.onChangeHandler(event)}
                />
                {formErrors.time.length > 0 && (
                  <span className="errorMessage">{formErrors.time}</span>
                )}
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedClass && (
          <Modal
            title={this.state.selectedClass.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.joinClassHandler}
            confirmText={this.context.token ? "Join" : "Confirm"}
          >
            <h1>{this.state.selectedClass.title}</h1>
            <h2>{this.state.selectedClass.description}</h2>
            <p>{this.state.selectedClass.date}</p>
            <p>{this.state.selectedClass.time}</p>
          </Modal>
        )}
        {this.context.token &&
          this.context.userId === "5c9451446232f74543d6bc9c" && (
            <div className="classes-control">
              <p>Create a new Muay Thai Class</p>
              <button className="btn" onClick={this.startCreateClassHandler}>
                Create Class
              </button>
            </div>
          )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ClassList
            classes={this.state.classes}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ClassesPage;
