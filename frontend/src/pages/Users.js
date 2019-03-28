import React, { Component } from "react";
import { Table, Input, Button, Icon, Tag } from "antd";
import Highlighter from "react-highlight-words";

import moment from "moment";

import "antd/dist/antd.css";

import AuthContext from "../context/auth-context";

import Spinner from "../components/Spinner/Spinner";

class Users extends Component {
  state = {
    isLoading: false,
    users: [],
    selectedItems: []
  };
  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
              query {
                users {
                    _id 
                    name
                    email
                    password
                    date
                    gender
                    plan
                    planExpiration
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
        const users = resData.data.users;
        console.log(users);

        if (this.isActive) {
          this.setState({ users: users, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "10%",
        ...this.getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length
      },
      {
        title: "Plan",
        dataIndex: "plan",
        key: "plan",
        width: "15%"
      },
      {
        title: "Plan Expiration Date",
        dataIndex: "date",
        key: "date"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Gender",
        key: "gender",
        dataIndex: "gender",
        filters: [
          {
            text: "Male",
            value: "male"
          },
          {
            text: "Female",
            value: "female"
          }
        ],
        onFilter: (value, record) => record.gender.indexOf(value) === 0,
        render: gender => (
          <span>
            {gender.map(tag => {
              let color;
              if (tag === "male") {
                color = "blue";
              } else {
                color = "pink";
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
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <a
              href={`mailto:${record.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send email to <strong>{record.name}</strong>
            </a>
          </span>
        )
      }
    ];

    let data = [];
    const allUsers = this.state.users.map(user => {
      let expirDate;
      if (user.planExpiration === "") {
        expirDate = "No Plan";
      } else {
        expirDate = moment(parseInt(user.planExpiration)).format(
          "ddd Do MMM YYYY"
        );
      }
      return {
        key: user._id,
        name: user.name,
        email: user.email,
        date: expirDate,
        gender: [user.gender.toLowerCase()],
        plan: user.plan
      };
    });
    data = allUsers;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
      getCheckboxProps: record => ({
        disabled: record.name === "test",
        name: record.name
      })
    };

    return (
      <div style={{ padding: "1rem" }}>
        <h1>List of all Users</h1>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <Table
            rowSelection={rowSelection}
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "15px"
            }}
            dataSource={data}
            columns={columns}
          />
        )}
      </div>
    );
  }
}
export default Users;
