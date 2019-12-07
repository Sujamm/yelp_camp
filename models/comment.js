var mongoose = require("mongoose");

var commetSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

commetSchema.post('remove', async function(document) {
    const commentId = document._id;
    const Campground = mongoose.model('Campground');
    try {
        await Campground.updateMany({ comments: { $in: [commentId] } }, { $pull: { comments: commentId } });
    } catch (err) {
        console.log(err);
    }
});

module.exports = mongoose.model("Comment", commetSchema);