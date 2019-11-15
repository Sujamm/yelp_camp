//Imports and initialize variables
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useUnifiedTopology: true,
useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema set up
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});
// Create a model
var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create({
	name: "Granite Hill",
	image: "https://cdn.pixabay.com/photo/2018/12/24/22/21/camping-3893598_960_720.jpg",
	description: "This is a huge granitie hill, no bathrooms. No water. Beautiful granite"
}, (err, camp) => {
	if(err){
		console.log(err);
	} else {
		console.log("Campground Added sucessfuly!!");
		console.log(camp);
	}
});*/

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
			res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new");
});

//SHOW - Shows infor for one campground
app.get("/campgrounds/:id", (req, res) => {
	var id = req.params.id
	Campground.findById(id, (err, camp) => {
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: camp});	
		}
	});
});

app.listen(3000, ()=>{
	console.log("Server Started ");
});