const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

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

  type Auth {
    user: ID!
    token: String!
    expiration: Int!
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
    bookings: [Booking!]!
    login(email: String!, password: String!): Auth
  }

  type RootMutation {
    createEvent(event: EventInput): Event
    createUser(user: UserInput): User
    createBooking(event: ID!): Booking!
    deleteBooking(booking: ID!): Event!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `)