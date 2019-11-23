var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name:"Clound's Rest",
		image: "https://cdn.pixabay.com/photo/2018/12/24/22/21/camping-3893598_960_720.jpg",
		description: "A nice place to go camping with the family"
	}, 	
	{
		name:"Deseert Mesa",
		image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022_960_720.jpg",
		description: "BLABLABLABLA"
	}, 	
	{
		name:"Canyon Floor",
		image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402_960_720.jpg",
		description: "BLABLABLABLA"
	}
];

function seedDB() {
	//Remove all campgrounds
	Campground.remove({}, (err) => {
	if(err){
		console.log(err);
	} else {
		console.log("Removed Campgrounds");
		//add campground
		data.forEach( (seed) => {
		Campground.create(seed, (err, campground) => {
			if(err){
				console.log(err);
			} else {
				console.log("Campground Added");
				//Create a comment
				Comment.create({
					text: "This place is great",
					author: "Jon"
				}, (err, comment) => {
							   if(err){
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log("Created Comment");
								}
							   });
			}
		});
	});
		}
	});
}

module.exports = seedDB;
