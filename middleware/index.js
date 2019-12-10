// Middleware functions
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, camp) => {
            if (err || !camp) {
                req.flash("error", "Campground not found");
                return res.redirect("/campgrounds");
            } else {
                if (camp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't haver permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err || !comment) {
                req.flash("error", "Comment not found");
                return res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't haver permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        return res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;