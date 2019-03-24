import React, { Component } from "react";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import JoiningList from "../components/Joinings/JoiningList/JoiningList";

class JoiningsPage extends Component {
  state = {
    isLoading: false,
    joinings: []
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchJoinings();
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
        const joinings = resData.data.joinings;
        this.setState({ joinings: joinings, isLoading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  deleteJoiningHandler = joiningId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          mutation CancelJoining($id: ID!) {
            joinCancel(joiningId: $id) {
              _id
              title
            }
          }
        `,
      variables: {
        id: joiningId
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
          const updatedJoinings = prevState.joinings.filter(joining => {
            return joining._id !== joiningId;
          });
          return { joinings: updatedJoinings, isLoading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  render() {
    let joiningPage;
    if (this.state.joinings.length > 0) {
      joiningPage = (
        <JoiningList
          joinings={this.state.joinings}
          onDelete={this.deleteJoiningHandler}
        />
      );
    } else {
      joiningPage = (
        <h3 style={{ textAlign: "center" }}>
          You didn't join any Muay Thai class yet!
        </h3>
      );
    }

    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> : joiningPage}
      </React.Fragment>
    );
  }
}

export default JoiningsPage;
