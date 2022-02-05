const functions = require("firebase-functions");
const admin = require("firebase-admin");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("./passport/setup");

const objectRouter = require("./routes/cObject");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const cors = require("cors");
/* const updateUserIp = require("./passport/ipUpdates"); */

admin.initializeApp(functions.config().firebase);

const MONGO_URI = functions.config().intahon.db_connection;
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(console.log(`MongoDB connected`))
	.catch((err) => console.log(err));

const app = express();
app.use(cors({ origin: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Express Session
app.use(
	session({
		secret: functions.config().intahon.session_secret,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: MONGO_URI }),
	})
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/object", objectRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

exports.app = functions.https.onRequest(app);
