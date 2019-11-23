var mongoose = require("mongoose");

var commetSchema = mongoose.Schema({
	text: String,
	author: String
});
 
module.exports = mongoose.model("Comment", commetSchema);