import React, { Component } from "react";

import { Table } from "antd";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import Spinner from "../components/Spinner/Spinner";
import ClassList from "../components/Classes/ClassList/ClassList";
import AuthContext from "../context/auth-context";
import "./Classes.css";

class ClassesPage extends Component {
  state = {
    title: "",
    description: "",
    date: "",
    time: "",
    trainer: "",
    formErrors: {
      title: "",
      description: "",
      date: "",
      time: "",
      trainer: ""
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
      case "trainer":
        formErrors.trainer = value.length === 0 ? "This field is required" : "";
        break;
      default:
        break;
    }
    this.setState({ formErrors, [name]: value });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.state.title;
    const description = this.state.description;
    const date = this.state.date;
    const time = this.state.time;
    const trainer = this.state.trainer;

    const mtclass = {
      title: title,
      description: description,
      date: date,
      time: time,
      trainer: trainer
    };
    console.log(mtclass);

    const requestBody = {
      query: `
          mutation {
            createClass(classInput: {title: "${title}", description: "${description}", date: "${date}", time: "${time}", trainer: "${trainer}"}) {
              _id
              title
              description
              date
              time
              creator {
                _id
                name
              }
              trainer
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
            },
            trainer: resData.data.createClass.trainer
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
              trainer
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

  deleteClassHandler = classId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelClass($id: ID!) {
            cancelClass(classId: $id) {
              _id
              title
            }
          }
        `,
      variables: {
        id: classId
      }
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
        this.setState(prevState => {
          const updatedClasses = prevState.classes.filter(mtclass => {
            return mtclass._id !== classId;
          });
          return { classes: updatedClasses, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
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
    const { formErrors } = this.state;

    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        filters: [
          {
            text: "Open",
            value: "Open"
          },
          {
            text: "Morning",
            value: "Morning"
          }
        ],
        onFilter: (value, record) => record.title.indexOf(value) === 0
      },
      { title: "Time", dataIndex: "time", key: "time" },
      {
        title: "Date",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "Trainer",
        dataIndex: "trainer",
        key: "trainer"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <button onClick={() => this.deleteClassHandler(record.key)}>
              Delete <strong>{record.title}</strong>
            </button>
          </span>
        )
      }
    ];

    let data = [];
    const allClasses = this.state.classes.map(mtclass => {
      return {
        key: mtclass._id,
        title: mtclass.title,
        time: mtclass.time,
        date: mtclass.date,
        description: mtclass.description,
        trainer: mtclass.trainer
      };
    });
    data = allClasses;

    let showClasses;
    if (this.context.userId === "5c9d930f1134f1e2f2a7bd97") {
      showClasses = (
        <Table
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "5px",
            width: "100%"
          }}
          columns={columns}
          expandedRowRender={record => (
            <p style={{ margin: 0 }}>{record.description}</p>
          )}
          dataSource={data}
        />
      );
    } else {
      showClasses = (
        <ClassList
          classes={this.state.classes}
          authUserId={this.context.userId}
          onViewDetail={this.showDetailHandler}
        />
      );
    }

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
                  rows="2"
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
              <div className="form-control">
                <label htmlFor="trainer">Trainer</label>
                <input
                  className={formErrors.trainer.length > 0 ? "error" : null}
                  name="trainer"
                  type="text"
                  id="trainer"
                  value={this.state.trainer}
                  onChange={event => this.onChangeHandler(event)}
                />
                {formErrors.trainer.length > 0 && (
                  <span className="errorMessage">{formErrors.trainer}</span>
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
            onConfirm={
              new Date().getHours + ":00" === this.state.selectedClass.time
                ? this.joinClassHandler
                : this.modalCancelHandler
            }
            confirmText={
              this.context.token &&
              new Date().getHours + ":00" === this.state.selectedClass.time
                ? "Join"
                : "Confirm"
            }
          >
            <h1>{this.state.selectedClass.title}</h1>
            <p>
              <strong>Class Description: </strong>
              <br /> {this.state.selectedClass.description}
            </p>
            <p>
              <strong>Date: </strong> {this.state.selectedClass.date}
            </p>
            <p>
              <strong>Time: </strong> {this.state.selectedClass.time}
            </p>
            <p>
              <strong>Trainer: </strong> {this.state.selectedClass.trainer}
            </p>
          </Modal>
        )}
        {this.context.token &&
          this.context.userId === "5c9d930f1134f1e2f2a7bd97" && (
            <div className="classes-control">
              <p>Create a new Muay Thai Class</p>
              <button className="btn" onClick={this.startCreateClassHandler}>
                Create Class
              </button>
            </div>
          )}
        {!this.context.token && (
          <div>
            <h1>These are the next Classes available this week!</h1>
            <h1>Login or SignUp to see more!</h1>
          </div>
        )}
        {this.state.isLoading ? <Spinner /> : showClasses}
      </React.Fragment>
    );
  }
}

export default ClassesPage;
