console.log('loading slide out');
/* Open when someone clicks on the span element */
function slideOpen() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function slideClose() {
    document.getElementById("myNav").style.width = "0%";
}
  