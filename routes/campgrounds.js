var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//INDEX - show all campgrounds
router.get("/", (req, res) =>{
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", { campgrounds: allCampgrounds });
		}
	});
});

//CREATE - show all campgrounds
router.post("/", isLoggedIn, (req, res) =>{
	var name = req.body.name,
	 	image = req.body.image,
		desc = req.body.description,
		author = {
				id: req.user._id, 
				username: req.user.username
			},
	 	newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show all campgrounds
router.get("/new", isLoggedIn , (req, res) =>{
	res.render("campgrounds/new");
});

//SHOW - Shows infor for one campground
router.get("/:id", (req, res) => {
	var id = req.params.id
	Campground.findById(id).populate("comments").exec((err, camp) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: camp});	
		}
	});
});

//EDIT - Show form to edit a campground
router.get("/:id/edit", (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: camp});
		}
	});
});

//UPDATE - Updates the campground on the DB and redirects user
router.put("/:id", (req, res) => {
	Campground.findOneAndUpdate({_id: req.params.id}, req.body.campground ,(err, foundCamp) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY - Campground route
router.delete("/:id", (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
		} else {
			camp.remove();
			//req.flash('success', 'Campground deleted successfully!');
			res.redirect("/campgrounds/")
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