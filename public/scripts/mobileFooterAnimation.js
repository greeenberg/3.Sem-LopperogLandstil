var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    // Add animation to the mobile navigation
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("fixedMenu").style.bottom = "30px";
    } else {
        document.getElementById("fixedMenu").style.bottom = "-100px";
    }
    prevScrollpos = currentScrollPos;
}