var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//---- ROUTES ------
//HOME - Landing page
router.get("/", (req, res) => {
    res.render("landing");
});

//Shwo register form
router.get("/register", (req, res) => {
    res.render("register", { page: 'register' });
});

//Sign up logic
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("register", { page: 'register' });
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YempCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", (req, res) => {
    res.render("login", { page: 'login' });
});

//Handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "Welcome!",
    failureFlash: "Invalid username or password"
}), (req, res) => {});

//Logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login", { page: 'login' });
}

module.exports = router;