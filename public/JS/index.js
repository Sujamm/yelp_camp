var icons = document.querySelectorAll("i");
var inputRating = document.getElementsByName("#i-rating");

function iconsStart(num) {
    var i = 0;
    while (i <= num) {
        icons[i].classList.remove("far");
        icons[i].classList.add("fas", "checked");
        i++;
    }

    while (i < 5) {
        icons[i].classList.remove("fas", "checked");
        icons[i].classList.add("far");
        i++;
    }
};

function setRating(num) {
    console.log("Value before: " + inputRating.value);
    inputRating.value = num.toString();
    console.log("Value after: " + inputRating.value);
};