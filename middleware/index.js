// Middleware functions
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, camp) => {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                if (camp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;