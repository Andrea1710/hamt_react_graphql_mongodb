import React, { Component } from "react";

import { Table } from "antd";

import AuthContext from "../context/auth-context";

import Spinner from "../components/Spinner/Spinner";

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
             user {
               name
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

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
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
      {
        title: "Time",
        dataIndex: "time",
        key: "time",
        filters: [
          {
            text: "09:00",
            value: "09:00"
          },
          {
            text: "17:30",
            value: "17:30"
          }
        ],
        onFilter: (value, record) => record.time.indexOf(value) === 0
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "Joinees",
        dataIndex: "joinees",
        key: "joinees"
      }
    ];

    let data = [];
    const allJoinings = this.state.joinings.map(joining => {
      return {
        key: joining._id,
        title: joining.mtclass.title,
        time: joining.mtclass.time,
        date: joining.mtclass.date,
        joinees: joining.user.name
      };
    });
    data = allJoinings;

    return (
      <React.Fragment>
        <div style={{ padding: "1rem" }}>
          <h1>List of all the Joined Classes</h1>
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <Table
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: "5px",
                width: "100%"
              }}
              columns={columns}
              dataSource={data}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default HistoryAdmin;
