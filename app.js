//Imports and initialize variables
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user");
//Requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", { useUnifiedTopology: true,
useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Remove all records and add new ones with seed file
//seedDB();

//Passport configuration
app.use(require("express-session")({
	secret: "harry potter books are the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	next();
});

//Routes configuration
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, ()=>{
	console.log("Server Started ");
});