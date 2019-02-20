const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      user: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      events: [Event!]
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }

    input UserInput {
      email: String!
      password: String!
    }
  
    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(event: EventInput): Event
      createUser(user: UserInput): User
    }
  
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `)