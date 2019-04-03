const app = require("express")();

app.use(require("body-parser").json());
app.use(require("./middleware/authenticate"));

app.use("/graphql", require("express-graphql")({
  schema: require("./graphql/schema"),
  rootValue: require("./graphql/resolvers"),
  graphiql: true,
}));

require("mongoose")
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@julianfr-academind-node-shop-large.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
  .then(() => app.listen(3001))
  .catch(error => console.log(error))