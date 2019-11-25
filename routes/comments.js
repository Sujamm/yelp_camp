var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments new
router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {camp: camp});	
		}
	});
});

//Comments create
router.post("/", isLoggedIn, (req, res) => { 
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					//add username and id to comment and save it
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

//Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
