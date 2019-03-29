import React, { Component } from "react";

import { Table, Tag } from "antd";

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

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
        console.log(joinings);

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
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title"
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time"
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "Tags",
        key: "tags",
        dataIndex: "tags",
        render: tags => (
          <span>
            {tags.map(tag => {
              let color;
              if (tag === "09:00") {
                color = "green";
                tag = "morning";
              } else {
                color = "red";
                tag = "afternoon";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        )
      },
      {
        title: "Joinee",
        dataIndex: "joinee",
        key: "joinee"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <button onClick={() => this.deleteJoiningHandler(record.key)}>
              Delete Joining
            </button>
          </span>
        )
      }
    ];

    let data = [];
    const allJoinings = this.state.joinings.map(joining => {
      return {
        key: joining._id,
        title: joining.mtclass.title,
        time: joining.mtclass.time,
        date: joining.mtclass.date,
        tags: [joining.mtclass.time.toString()],
        joinee: joining.user.name
      };
    });
    data = allJoinings;

    let joiningPage;
    if (this.state.joinings.length > 0) {
      joiningPage = (
        <Table
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "5px",
            width: "100%"
          }}
          columns={columns}
          dataSource={data}
        />
      );
    } else {
      joiningPage = (
        <h3 style={{ color: "white", textAlign: "center" }}>
          You didn't join any Muay Thai class yet!
        </h3>
      );
    }

    return (
      <React.Fragment>
        {this.context.userId === "5c9d930f1134f1e2f2a7bd97" && (
          <h1>List of all the Classes joined by the Users</h1>
        )}
        {this.state.isLoading ? <Spinner /> : joiningPage}
      </React.Fragment>
    );
  }
}

export default JoiningsPage;
