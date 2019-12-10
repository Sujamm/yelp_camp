var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash("error", "Comment not found");
            return res.redirect("back");
        } else {
            res.render("comments/new", { camp: camp });
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash("error", "Comment not found");
            return res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Somenthing went wrong. Your comment was not created");
                    return res.redirect("back");
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
});

//EDIT - Show form to edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                req.flash("error", "Comment not found");
                return res.redirect("back");
            }
            res.render("comments/edit", { camp_id: req.params.id, comment: foundComment });
        });
    });
});

//UPDATE - Update a  comment routes
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findOneAndUpdate({ _id: req.params.comment_id }, req.body.comment, (err, updatedComment) => {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//DELETE - Destroy a  comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err || !comment) {
            req.flash("error", "Comment not found");
            return res.redirect("back");
        }
        comment.remove();
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;