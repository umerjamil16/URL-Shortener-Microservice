var express = require("express");
var app = express();
var PORT = process.env.PORT;
var express = require("express");
var path = require("path");

require("./routes/routes.js")(express, app);

app.engine("html", require("hogan-express"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, function() {
    console.log("Listening to PORT " + PORT);
});