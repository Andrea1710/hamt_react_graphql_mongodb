import React, { Component } from "react";

import AuthContext from "../context/auth-context";

import ClassList from "../components/Classes/ClassList/ClassList";
import JoiningList from "../components/Joinings/JoiningList/JoiningList";

class HistoryAdmin extends Component {
  state = {
    classes: [],
    isLoading: false,
    selectedClass: null,
    joinings: []
  };

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchClasses();
    this.fetchJoinings();
  }

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
        console.log(resData);

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

  fetchJoinings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            joinings {
              _id
             createdAt
             mtclass {
               _id
               title
               date
               time
             }
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

        const joinings = resData.data.joinings;
        this.setState({ joinings: joinings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <ClassList
            classes={this.state.classes}
            authUserId={this.context.userId}
          />
        </div>
        <div>
          <JoiningList
            joinings={this.state.joinings}
            onDelete={this.deleteJoiningHandler}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default HistoryAdmin;
