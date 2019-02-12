const app = require("express")();
const { buildSchema } = require("graphql");

app.use(require("body-parser").json());

app.use("/graphql", require("express-graphql")({
  schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }
  
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return ["Romantic Cooking", "Sailing", "All-Night Coding"];
    },
    createEvent: (args) => {
      return args.name;
    }
  },
  graphiql: true,
}));

app.listen(3001);