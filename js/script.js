gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

//Disable auto-refresh on resize - the custom resize handler below
ScrollTrigger.config({autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"});


// ===== SPLASH SCREEN =====
(function initSplash(){
    const splash = document.getElementById("splash");
    const splashStar = document.getElementById("splashStar");
    const splashHint = document.getElementById("splashHint");
    const heroStar = document.getElementById("heroStar");

    const splashEnter = document.getElementById("splashEnter");

    if (!splash || !splashStar || !heroStar) return;

    // If user refreshes, show splash animation
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if(navType == "reload"){
        sessionStorage.removeItem("splashShown");
    }

    //Skip splash if already shown in that session
    if(sessionStorage.getItem("splashShown")) {
        splash.remove();
        return;
    }

    //Adding class .splash-active to body and html elements
    document.documentElement.classList.add("splash-active");
    document.body.classList.add("splash-active");

    const preventScroll = (e) => {e.preventDefault(); };
    window.addEventListener("wheel", preventScroll, {passive:false});
    window.addEventListener("touchmove", preventScroll, {passive:false});

    ScrollTrigger.getAll().forEach(t => t.disable());

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pulse = null;
    let intro = null;
    let dismissed = false;

    //Phase 1: star is born, hint fades in, star pulses
    if (reduceMotion) {
        gsap.set([splashStar, splashHint], {opacity:1});
    }else{
        intro = gsap.timeline();

        intro.from(splashStar, {
            opacity: 0,
            scale: 0.3,
            rotate: -15,
            duration: 1.5,
            ease: "power2.out"
        });

        intro.from(splashHint, {
            opacity: 0,
            duration: 0.8,
            ease: "power1.out"
        }, "-=0.4"); 

        intro.call(() => {
            pulse = gsap.to(splashStar, {
                scale: 1.5,
                opacity: 0.65,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1
            });
        });
    }

    function dismiss(){
        if (dismissed) return;
        dismissed = true;
        sessionStorage.setItem("splashShown", "1");
        if (intro) intro.kill();
        if (pulse) pulse.kill();

        const splashRect = splashStar.getBoundingClientRect();
        const heroRect = heroStar.getBoundingClientRect();

        //Finding exact position of star in hero so the splash star can travel to its exact location and morph with hero star
        const dx = (heroRect.left + heroRect.width / 2) - (splashRect.left + splashRect.width / 2);
        const dy = (heroRect.top + heroRect.height / 2) - (splashRect.top + splashRect.height / 2);

        const focusWasInSplash = splash.contains(document.activeElement);
        const outro = gsap.timeline ({
            onComplete: () => {
                splash.remove();
                window.removeEventListener("wheel", preventScroll);
                window.removeEventListener("touchmove", preventScroll);
                window.scrollTo(0,0);
                document.documentElement.classList.remove("splash-active");
                document.body.classList.remove("splash-active");
                ScrollTrigger.getAll().forEach(t => t.enable());
                ScrollTrigger.refresh(true);
                if (focusWasInSplash){
                    const cue = document.getElementById("scrollCue");
                    if(cue) cue.focus();
                }
                outro.kill();
            }
        });

        if(reduceMotion){
            outro.to(splash, {opacity: 0, duration: 0.4, ease: "power1.out"});
            return;
        }

        outro.to(splashHint, {
            opacity: 0,
            duration: 0.3,
            ease: "power1.out"
        }, 0);

        outro.set(splashStar, {scale: 1, opacity: 1}, 0);

        outro.to(splashStar, {
            x: dx,
            y: dy,
            duration: 1.2,
            ease: "power2.inOut"
        }, 0);

        outro.to(splash,{
            opacity: 0,
            duration: 2.0,
            ease: "power2.inOut",
        }, 0.2);
        
    }

    splash.addEventListener("click", dismiss);
    setTimeout(dismiss, 8000);

    //Any scroll input dismisses the splash immediately
    window.addEventListener("wheel", dismiss, {once: true, passive: true});
    window.addEventListener("touchstart", dismiss, {once: true, passive: true});
    window.addEventListener("keydown", dismiss, {once: true});
    
}) ();



// ===== FUNCTION TO UPDATE NAVIGATION BAR =====
function updateActiveNav(section) {
    document.querySelectorAll(".nav-link").forEach(link => {
        const isActive = link.dataset.section === section;
        link.classList.toggle("active", isActive);
        if (isActive){
            link.setAttribute("aria-current", "page");
        }else{
            link.removeAttribute("aria-current");
        }
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
    overlayTravel = overlayHeight;
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
        heroTimeline.invalidate();
        ScrollTrigger.refresh(true);
        ScrollTrigger.update();
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

heroTimeline.fromTo(heroOverlay,
    {y: 0},
    {
        y: () => -overlayTravel,
        ease:"none",
    }, 
    0
);


// ===== ENTRANCE ANIMATIONS =====
//Decorative animations: skipped for users who prefer reduced motion (WCAG 2.3.3)

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion){
    gsap.set(".cosmos-title, .planet-card, .about-title, .about-portrait, .about-bio-placeholder, .about-fact",{
        opacity: 1,
        scale: 1,
    });
} else {
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

    gsap.from(".about-title, .about-portrait", {
        opacity: 0,
        scale: 0.85,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
            end: "top top",
            scrub: 1,
        }
    });

    gsap.from(".about-bio-placeholder", {
        opacity: 0,
        ease: "power2.out",
        scrollTrigger:{
            trigger: "#about",
            start: "top 70%",
            end: "top top",
            scrub: 1,
        }
    });

    gsap.from(".about-fact", {
        opacity: 0,
        ease: "power2.out",
        stagger: 0.5,
        scrollTrigger:{
            trigger: "#about",
            start: "top 60%",
            end: "top top",
            scrub: 1,
        }
    });
}

const sectionIds=["home", "projects", "about", "contacts"];
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
function getActiveSection() {
    // How far the user has scrolled from the top
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0;

    //A section becomes active once its top crosses a thrid of the viewport instead of the nav edge
    //so the nav switches while the section is filling the screen rather than a whole section later
    const threshold = Math.max(navH + 10, window.innerHeight / 3);

    //The last section is short enough that its top never reaches the threshold, even at maximum scroll,
    //so the nav could never report it.
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if(maxScroll > 0 && window.scrollY >= maxScroll - 2){
        for (let i = sectionIds.length - 1; i>=0; i--){
            if(document.getElementById(sectionIds[i])) return sectionIds[i];
        }
    }
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
        if(!proxy) continue;
        //getBoundingclientrest: gives the element's distance from the top of the viewport
        //when value <= navbar height + 10 px buffer => section has scroller into view past the nav bar so it's the active one.
        if (proxy.getBoundingClientRect().top <= threshold){
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
    calcScrollGeometry();
    heroTimeline.invalidate();
    ScrollTrigger.refresh(true);

    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (section) {
        requestAnimationFrame(() => {
            goToSection(section);
            history.replaceState(null, "", "./index.html");
        });
    }
});
