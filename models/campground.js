var mongoose = require("mongoose");
var Comment = require("./comment");
//Schema set up
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

campgroundSchema.pre('remove', async function(next) {
	try {
		await Comment.deleteMany({
			"_id" : {
				$in: this.comments
			}
		});
		next();
	} catch(err){
		next(err);
	}
});

// Create a model
module.exports = mongoose.model("Campground", campgroundSchema);