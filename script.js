/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


/* Close mobile menu after clicking a link */

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((item) => {

    item.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });

});


/* =========================================
   SCROLL REVEAL
========================================= */

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show-section");
            }

        });

    },

    {
        threshold: 0.12
    }

);


sections.forEach((section) => {

    section.classList.add("hidden-section");
    observer.observe(section);

});