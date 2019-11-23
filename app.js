//Imports and initialize variables
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds");

//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", { useUnifiedTopology: true,
useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//---- ROUTES ------
//HOME - Landing page
app.get("/", (req, res) =>{
	res.render("landing");
});

///INDEX - show all campgrounds
app.get("/campgrounds", (req, res) =>{
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

///CREATE - show all campgrounds
app.post("/campgrounds", (req, res) =>{
	var name = req.body.name,
	 	image = req.body.image,
		desc = req.body.description,
	 	newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, (err, newlyCreated) => {
					  
					  });
	res.redirect("/campgrounds");
});

///NEW - show all campgrounds
app.get("/campgrounds/new", (req, res) =>{
	res.render("campgrounds/new");
});

//SHOW - Shows infor for one campground
app.get("/campgrounds/:id", (req, res) => {
	var id = req.params.id
	Campground.findById(id).populate("comments").exec((err, camp) => {
		if(err){
			console.log(err);
		} else {
			console.log(camp);
			res.render("campgrounds/show", {campground: camp});	
		}
	});
});

//====================
// COMMENTS ROUTES
//====================

app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {camp: camp});	
		}
	});
});

app.post("/campgrounds/:id/comments", (req, res) => { 
	Campground.findById(req.params.id, (err, camp) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					camp.comments.push(comment);
					camp.save();
					res.redirect("/campgrounds/" + camp._id);
				}
			});
		}
	});
});


app.listen(3000, ()=>{
	console.log("Server Started ");
});