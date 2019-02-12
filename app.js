const app = require("express")();

app.use(require("body-parser").json());

app.get("/", (req, res, next) => res.status(200).send("Olo"));

app.listen(3001);