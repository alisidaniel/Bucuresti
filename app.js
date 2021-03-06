require("dotenv").config();
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var morgan = require("morgan");

var { PORT, PRIVATE_KEY } = require("./config/config");

var indexRoutes = require("./router/indexRoutes");
var productRoutes = require("./router/productRoutes");
var shippingRoutes = require("./router/shippingRoutes");

const db = require("./models");

db.sequelize
  .sync()
  .then(() => {
    console.log("running db here ...");
  })
  .catch((err) => {
    console.log(`DB:: sync error: ${err}`);
  });

const app = express();

app.set("view engine", "ejs");

app.use("/assets", express.static("assets"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(
  session({
    key: "user_sid",
    secret: `${PRIVATE_KEY}`,
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 1000 * 60 * 60 * 60 * 24, // 2hrs
    },
  })
);

app.use(indexRoutes);
app.use(productRoutes);
app.use(shippingRoutes);

//Page not found
app.use(function (req, res, next) {
  res.render("404");
});

// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

//Error
app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    //Handle SyntaxError here.
    return res.status(500).send({ data: "Invalid data" });
  } else {
    next();
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Project running on port ${PORT}`);
});
