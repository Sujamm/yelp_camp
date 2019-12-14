var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
        }
    });
});

//CREATE - show all campgrounds
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name,
        image = req.body.image,
        desc = req.body.description,
        price = req.body.price,
        rating = req.body.rating,
        author = {
            id: req.user._id,
            username: req.user.username
        },
        newCampground = { name: name, image: image, description: desc, author: author, price: price, rating: rating };
    console.log(newCampground);
    Campground.create(newCampground, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show all campgrounds
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW - Shows infor for one campground
router.get("/:id", (req, res) => {
    var id = req.params.id
    Campground.findById(id).populate("comments").exec((err, camp) => {
        if (err || !camp) {
            console.log(err);
            req.flag("error", "Campground not found");
            return res.redirect("back");
        } else {
            res.render("campgrounds/show", { campground: camp });
        }
    });
});

//EDIT - Show form to edit a campground
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        res.render("campgrounds/edit", { campground: camp });
    });
});

//UPDATE - Updates the campground on the DB and redirects user
router.put("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findOneAndUpdate({ _id: req.params.id }, req.body.campground, (err, camp) => {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//DESTROY - Campground route
router.delete("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, camp) => {
        if (err || !camp) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        camp.remove();
        req.flash("success", "Campground deleted successfully!");
        res.redirect("/campgrounds/");
    });
});

module.exports = router;