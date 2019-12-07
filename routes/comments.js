var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { camp: camp });
        }
    });
});

//Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
});

//EDIT - Show form to edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        res.render("comments/edit", { camp_id: req.params.id, comment: foundComment });
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
        comment.remove();
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;