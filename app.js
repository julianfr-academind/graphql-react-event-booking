const app = require("express")();
const { buildSchema } = require("graphql");
const bcrypt = require("bcryptjs");

app.use(require("body-parser").json());

const Event = require("./models/event");
const User = require("./models/user");

app.use("/graphql", require("express-graphql")({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
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
  `),
  rootValue: {
    events: () => Event
      .find()
      .then(events => events.map(events => { return { ...events._doc } }))
      .catch(err => { throw err }),

    createEvent: args => {
      let createdEvent;

      const event = new Event({
        title: args.event.title,
        description: args.event.description,
        price: +args.event.price,
        date: new Date().toISOString(),
        user: "5c656eb62b75bd2650daa55b",
      })

      return event
        .save()
        .then(result => createdEvent = result._doc)
        .then(() =>
          User
            .findById("5c656eb62b75bd2650daa55b")
            .then(user => {
              if (!user) return new Error("User doesn't exists.");

              user.events.push(event);

              return user
                .save()
                .then(result => createdEvent)
            })
        )
        .catch(err => console.log(err));
    },

    createUser: args =>
      User
        .findOne({ email: args.user.email })
        .then(user => user
          ? new Error("User already exists.")
          : bcrypt.hash(args.user.password, 12)
            .then(password => new User({ email: args.user.email, password: password, }).save())
            .then(user => { return { email: user.email, _id: user.id } })
        )
        .catch(err => { throw err }),
  },
  graphiql: true,
}));

require("mongoose")
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@julianfr-academind-node-shop-large.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(() => app.listen(3001))
  .catch(error => console.log(error))