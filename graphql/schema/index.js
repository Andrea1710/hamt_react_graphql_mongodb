const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type Joining {
      _id: ID!
      mtclass: Class!
      user: User!
      createdAt: String!
      updatedAt: String!
    }

    type Class {
      _id: ID!
      title: String!
      description: String!
      date: String!
      time: String!
      creator: User!
    }

    type User {
      _id: ID!
      name: String!
      email: String!
      password: String!
      date: String!
      gender: String!
      createdClasses: [Class!]
    }

    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    input ClassInput {
      title: String!
      description: String!
      date: String!
      time: String!
    }

    input UserInput {
      name: String!
      email: String!
      password: String!
      date: String!
      gender: String!
    }

    type RootQuery {
      classes: [Class!]!
      joinings: [Joining!]!
      login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
      createClass(classInput: ClassInput): Class
      createUser(userInput: UserInput): User
      joinClass(classId: ID!): Joining!
      joinCancel(joiningId: ID!): Class!
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);
