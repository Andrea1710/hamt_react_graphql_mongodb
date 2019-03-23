import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import ClassList from "../components/Classes/ClassList/ClassList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Classes.css";

class ClassesPage extends Component {
  state = {
    creating: false,
    classes: [],
    isLoading: false,
    selectedClass: null
  };
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.descriptionElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.timeElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchClasses();
  }

  startCreateClassHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const date = this.dateElRef.current.value;
    const time = this.timeElRef.current.value;

    if (
      title.trim().length === 0 ||
      description.trim().length === 0 ||
      date.trim().length === 0 ||
      time.trim().length === 0
    ) {
      return;
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
              _id: this.context.userId,
              name: resData.data.createClass.name,
              gender: resData.data.createClass.gender
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
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedClass) && <Backdrop />}
        {this.state.creating && (
          <Modal
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
                <input type="text" id="title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  rows="4"
                  ref={this.descriptionElRef}
                />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="time">Time</label>
                <input type="text" id="time" ref={this.timeElRef} />
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
            <h2>{this.state.selectedClass.date}</h2>
            <h2>{this.state.selectedClass.time}</h2>
          </Modal>
        )}
        {this.context.token && (
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
