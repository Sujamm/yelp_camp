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
    methodOverride = require("method-override"),
    session = require("express-session"),
    flash = require("connect-flash");
User = require("./models/user");
//Requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
//mongodb://localhost/yelp_camp
//mongodb+srv://sujairamm:C4rL1sL300@cluster0-hf1hq.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect(process.env.DATABASEURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR: ', err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Remove all records and add new ones with seed file
//seedDB();
session
//-momery unleaked---------
app.set('trust proxy', 1);

app.use(session({
    cookie: {
        secure: true,
        maxAge: 60000
    },
    secret: "harry potter books are the best",
    saveUninitialized: true,
    resave: false
}));

app.use(function(req, res, next) {
    if (!req.session) {
        return next(new Error('Oh no')) //handle error
    }
    next() //otherwise continue
});


//Passport configuration
/*app.use(require("express-session")({
    secret: "harry potter books are the best",
    resave: false,
    saveUninitialized: false
}));*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Routes configuration
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server Started ", process.env.IP, ":", process.env.PORT);
});