gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

ScrollTrigger.config({autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"});

// ===== FUNCTION TO UPDATE NAVIGATION BAR =====
function updateActiveNav(section) {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.section === section);
    });
}

// ===== SCROLL CUE =====
(function setupScrollCue(){
    const cue = document.getElementById("scrollCue");
    const cosmos = document.getElementById("projects");
    if (!cue || !cosmos) return;

    cue.addEventListener("click", () => {
        gsap.to(window, {duration: 1, scrollTo: cosmos, ease: "power2.inOut"});
    });
})();

// ===== STAR GENERATION =====
(function createStars() {
    const layer = document.getElementById("starsLayer");
    if (!layer) return;

    const count = 80;
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");
        star.className = "star-particle";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        const size = (Math.random() * 2 + 1) + "px";
        star.style.width = size;
        star.style.height = size;
        star.style.setProperty("--duration", (Math.random() * 4 + 2) + "s");
        star.style.setProperty("--delay", (Math.random() * 4) + "s");
        star.style.setProperty("--max-opacity", (Math.random() * 0.6 + 0.3).toString());
        layer.appendChild(star);
    }
})();

// ===== SCROLL GEOMETRY =====

const heroOverlay = document.getElementById("home");
const scrollDriver = document.getElementById("scrollDriver");
const header = document.querySelector("header");

let overlayTravel = 0;

function calcScrollGeometry(){
    if(!heroOverlay || !scrollDriver) return;

    const overlayHeight = heroOverlay.offsetHeight;
    overlayTravel = Math.max(overlayHeight, window.innerHeight);
    scrollDriver.style.height = overlayTravel + "px";

}

// ===== DEFINING NAVBAR HEIGHT =====
//Stores the navbar height as a CSS variable
function setNavOffset() {
    const navbar = document.querySelector("header");
    if (!navbar) return;
        document.documentElement.style.setProperty("--nav-h", navbar.offsetHeight + "px");
}

calcScrollGeometry();
setNavOffset();

let resizeRAF = null;
window.addEventListener("resize", () => {
    if (resizeRAF) cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(() => {
        calcScrollGeometry();
        setNavOffset();
        ScrollTrigger.refresh(true);

        heroTimeline.scrollTrigger.update();
    });
});

// ===== GSAP SCROLLTRIGGER (hero pin + TRANSITION) =====
const heroTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "#scrollDriver",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onLeaveBack: () => {
            if (heroOverlay) gsap.set(heroOverlay, { y: 0 });
        },
        onUpdate(self) {
            // Changing header theme (light to dark)
            if (self.progress > 0.70) {
                header.classList.add("dark");
            } else {
                header.classList.remove("dark");
            }
        }
    }
});

heroTimeline.to(heroOverlay,{
    y: () => -overlayTravel,
    ease:"none",
}, 0);


// ===== ENTRANCE ANIMATIONS =====
gsap.from(".cosmos-title", {
    opacity: 0,
    scale: 0.85,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#projects",
        start: "top 50%",
        end: "top top",
        scrub: 1,
    }
});

gsap.from(".planet-card", {
    scale: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".planets-row",
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1,
    }
});

gsap.from(".about-title", {
    opacity: 0,
    scale: 0.85,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#about",
        start: "top 50%",
        end: "top top",
        scrub: 1,
    }
});

// GO TO A SECTION FUCNTION
function goToSection(section){
    isScrollingFromClick = true;
    clearTimeout(scrollTimeout);
    updateActiveNav(section);

    if(section === "home"){
    gsap.to(window, {duration: 0.5, scrollTo:0, ease:"power2.out"});

    }else{
        const target = document.getElementById(section);
        if (target) gsap.to(window, {duration: 0.5, scrollTo: target, ease:"power2.out"});
    }

    scrollTimeout = setTimeout(() => {
        isScrollingFromClick = false;
    }, 800);

}


// NAVIGATION THROUGH SCROLL
const sectionIds=["home", "projects", "about", "contacts"];

function getActiveSection() {
    // How far the user has scrolled from the top
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;

    //Lopping backwards through sections: last section whose top has scrolled past the navbar is the section currently on screen
    for (let i = sectionIds.length -1; i>= 0; i--){
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;

        //Since home is fixed, use scrollDriver as a stand in position marker for home instead
        let proxy;
        if(sectionIds[i] === "home"){
            proxy = document.getElementById("scrollDriver");
        }else{
            proxy = el;
        }
        //getBoundingclientrest: gives the element's distance from the top of the viewport
        //when value <= navbar height + 10 px buffer => section has scroller into view past the nav bar so it's the active one.
        if (proxy.getBoundingClientRect().top <= navH + 10){
            return sectionIds[i]
        }
    }
    return "home";
}

//Flags to prevent scroll listener fighting with click navigation
let isScrollingFromClick = false;
let scrollTimeout;
let requestAnimationFramePending = false;

//set correct active link on page load
updateActiveNav(getActiveSection());


// ===== NAVIGATION THROUGH CLICK =====
//Click a nav link, scroll to that section and lock active state during scrolling
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        //Reading which section was clicked
        goToSection(this.dataset.section);

        const navMenu = document.getElementById("navMenu");
        const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
        if (bsCollapse) bsCollapse.hide();
    });
});

//Runs getActiveSection() on every scroll event and passes the result to updateActiveNav() to toggle the active class.
window.addEventListener("scroll", () => {
    //ignore while a click scroll is running
    if (isScrollingFromClick) return;
    if (requestAnimationFramePending) return;
    requestAnimationFramePending = true;
    //pre-set browser function: keeps code in sync with screen's natual refresh rate
    requestAnimationFrame (() => {
        updateActiveNav(getActiveSection());
        requestAnimationFramePending = false;
    });
}, {passive:true});


// ===== UPDATING SCROLL TRIGGER AFTER LOADING =====
//Recalculates scroll position once images/fonts are fully loaded
window.addEventListener("load", () => {
    ScrollTrigger.refresh();

    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section) {
        requestAnimationFrame(() => {
            goToSection(section);
            history.replaceState(null, "", "./index.html");
        });
    }
});
