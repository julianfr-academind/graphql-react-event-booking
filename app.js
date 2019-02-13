const app = require("express")();
const { buildSchema } = require("graphql");

app.use(require("body-parser").json());

const events = [];

const Event = require("./models/event");

app.use("/graphql", require("express-graphql")({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
    }
  
    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
  
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event
        .find()
        .then(events => {
          return events.map(events => { return { ...events._doc } });
        })
        .catch(err => {
          throw err
        });
    },
    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date().toISOString(),
      });
      return event
        .save()
        .then(result => {
          console.log(result);
          return { ...result._doc };
        })
        .catch(err => console.log(err));



    }
  },
  graphiql: true,
}));

require("mongoose")
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@julianfr-academind-node-shop-large.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(() => app.listen(3001))
  .catch(error => console.log(error))