/*===========================================================================================
                                    PROJECT DETAIL PAGES
============================================================================================*/
gsap.registerPlugin(ScrollTrigger);

// ===== SCROLL REVEAL =====
(function setupScrollReveal(){
    const targets = document.querySelectorAll(".reveal");
    if(!targets.length) return;

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        targets.forEach(el => el.classList.add("is-visible"));
        return;
    }

    targets.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            opacity: 0,
            duration: 0.7,
            ease: "cubic-bezier(0.4, 0 , 0.2 ,1)",
            stagger:0.1,
        });
    });
    
})();


// ===== CAROUSELS =====
//This stage builds a "stage progress" bar for a swiper carousel: a line of small stars with a gold fill that grows as you move through the slides, plus a row of numbered tag buttons that double as Swiper's pagination.

//Tags outline shape: identical for every stage
const TAG_OUTLINE_D = "M20.8057 7.68966C21.3366 6.77011 22.6634 6.77011 23.1943 7.68966L26.7783 13.8957H37.8623C40.1474 13.8958 41.9999 15.7483 42 18.0334V32.5168C41.9998 34.8019 40.1474 36.6544 37.8623 36.6545H6.1377C3.85262 36.6544 2.00021 34.8019 2 32.5168V18.0334C2.00013 15.7483 3.85257 13.8958 6.1377 13.8957H17.2217L20.8057 7.68966Z";

//Numbers inside tags svgs
const TAG_NUM_D = {
    1: "M19.96 23.256V22.2L22.84 21.48V30H21.82V22.704L19.96 23.256Z",
    2: "M18.74 30L22.712 25.764C22.896 25.564 23.052 25.368 23.18 25.176C23.316 24.976 23.416 24.776 23.48 24.576C23.552 24.368 23.588 24.152 23.588 23.928C23.588 23.744 23.552 23.564 23.48 23.388C23.408 23.212 23.3 23.052 23.156 22.908C23.02 22.764 22.852 22.648 22.652 22.56C22.452 22.472 22.224 22.428 21.968 22.428C21.608 22.428 21.296 22.512 21.032 22.68C20.776 22.84 20.58 23.076 20.444 23.388C20.308 23.692 20.24 24.056 20.24 24.48H19.22C19.22 23.88 19.328 23.356 19.544 22.908C19.76 22.452 20.072 22.1 20.48 21.852C20.896 21.596 21.392 21.468 21.968 21.468C22.432 21.468 22.832 21.548 23.168 21.708C23.504 21.86 23.78 22.06 23.996 22.308C24.212 22.548 24.372 22.808 24.476 23.088C24.58 23.368 24.632 23.636 24.632 23.892C24.632 24.324 24.528 24.752 24.32 25.176C24.112 25.6 23.844 25.98 23.516 26.316L20.84 29.04H24.668V30H18.74Z",
    3: "M21.536 25.86V25.2C21.808 25.2 22.048 25.164 22.256 25.092C22.464 25.012 22.64 24.908 22.784 24.78C22.928 24.644 23.036 24.488 23.108 24.312C23.188 24.136 23.228 23.948 23.228 23.748C23.228 23.484 23.18 23.252 23.084 23.052C22.988 22.844 22.844 22.684 22.652 22.572C22.468 22.46 22.236 22.404 21.956 22.404C21.564 22.404 21.232 22.528 20.96 22.776C20.688 23.016 20.552 23.32 20.552 23.688H19.58C19.58 23.248 19.68 22.864 19.88 22.536C20.088 22.208 20.368 21.952 20.72 21.768C21.08 21.576 21.488 21.48 21.944 21.48C22.424 21.48 22.836 21.584 23.18 21.792C23.532 22 23.8 22.272 23.984 22.608C24.176 22.944 24.272 23.312 24.272 23.712C24.272 24.104 24.156 24.464 23.924 24.792C23.692 25.12 23.372 25.38 22.964 25.572C22.556 25.764 22.08 25.86 21.536 25.86ZM21.896 30.12C21.488 30.12 21.12 30.06 20.792 29.94C20.464 29.82 20.184 29.656 19.952 29.448C19.72 29.232 19.54 28.984 19.412 28.704C19.284 28.416 19.22 28.108 19.22 27.78H20.252C20.252 28.044 20.32 28.28 20.456 28.488C20.6 28.696 20.796 28.86 21.044 28.98C21.292 29.1 21.576 29.16 21.896 29.16C22.216 29.16 22.492 29.1 22.724 28.98C22.964 28.852 23.148 28.676 23.276 28.452C23.404 28.228 23.468 27.964 23.468 27.66C23.468 27.404 23.416 27.18 23.312 26.988C23.216 26.788 23.08 26.624 22.904 26.496C22.728 26.36 22.524 26.26 22.292 26.196C22.06 26.132 21.808 26.1 21.536 26.1V25.44C21.944 25.44 22.324 25.484 22.676 25.572C23.036 25.66 23.352 25.8 23.624 25.992C23.904 26.176 24.12 26.416 24.272 26.712C24.432 27.008 24.512 27.364 24.512 27.78C24.512 28.252 24.396 28.664 24.164 29.016C23.94 29.368 23.632 29.64 23.24 29.832C22.848 30.024 22.4 30.12 21.896 30.12Z",
    4: "M18.24 28.32L22.896 21.6H23.316V30H22.296V27.888V27.756V23.868L19.92 27.42H22.716H22.92H24.636V28.32H18.24Z",
    5: "M24.288 27.24C24.288 27.72 24.212 28.14 24.06 28.5C23.908 28.86 23.696 29.16 23.424 29.4C23.152 29.64 22.84 29.82 22.488 29.94C22.136 30.06 21.756 30.12 21.348 30.12C20.836 30.12 20.388 30.04 20.004 29.88C19.628 29.72 19.304 29.508 19.032 29.244C18.768 28.972 18.544 28.676 18.36 28.356L19.224 27.768C19.352 28.008 19.52 28.236 19.728 28.452C19.944 28.66 20.192 28.832 20.472 28.968C20.752 29.096 21.044 29.16 21.348 29.16C21.748 29.16 22.088 29.08 22.368 28.92C22.648 28.76 22.86 28.536 23.004 28.248C23.156 27.96 23.232 27.624 23.232 27.24C23.232 26.856 23.148 26.52 22.98 26.232C22.82 25.944 22.596 25.72 22.308 25.56C22.028 25.4 21.708 25.32 21.348 25.32C21.084 25.32 20.84 25.344 20.616 25.392C20.4 25.432 20.18 25.508 19.956 25.62C19.74 25.724 19.488 25.876 19.2 26.076L20.304 21.6H24.264V22.5H21.096L20.532 24.72C20.732 24.616 20.936 24.54 21.144 24.492C21.36 24.436 21.572 24.408 21.78 24.408C22.26 24.408 22.688 24.528 23.064 24.768C23.448 25.008 23.748 25.34 23.964 25.764C24.18 26.188 24.288 26.68 24.288 27.24Z",
};

//Builds a row of small star icons, one per slide
//It's job is to create the DOM element and drop them inside the track container, and return an array of the star slots elements for further use.

function buildStarTrack(trackE1, slideCount) {
    const starSlots = [];
    for (let i = 0; i < slideCount; i++) {
        const slot = document.createElement("div");
        slot.className = "stage-star-slot position-relative z-2 d-flex align-items-center justify-content-center";
        slot.innerHTML =`
        <svg class="stage-star" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12,1 14.5,9.5 23,12 14.5,14.5 12,23 9.5,14.5 1,12 9.5,9.5"/>
        </svg>`;
        //Takes the last element and inserts it as the last child in the track container
        trackE1.appendChild(slot);
        //Saves a reference in javascript in a plain javascript array
        starSlots.push(slot);
    }
    return starSlots;
}

//Returns the HTML string for a single tag. Swiper calls this itself, once per slide, whenever it builds its pagination.
function renderTagBullets(index, swiperClassName) {
    const num = index + 1;
    const numPathD = TAG_NUM_D[num];
    const numMarkup = `<path class="stage-tag-num" d ="${TAG_NUM_D[num]}"/>`
        return `<button class="${swiperClassName} stage-tag opacity-100 m-0" aria-label="Go to slide ${num}"><svg class="stage-tag-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${numMarkup}<path class="stage-tag-outline" d="${TAG_OUTLINE_D}"/></svg></button>`;
}

//Wires the carousel together 
//Find the pieces inside root "data-stage-progress-root" (the HTML custom attribute), builds the stars and tags using the functions above and hands everything to Swiper.
//This is the function that is actually called - once per carousel.
function initStageProgress(root, settings) {
    settings = settings || {};
    const autoplayDelay = settings.autoplayDelay || 3200;
    const loop = settings.loop || false;
    const showFill = settings.showFill !== false;

    const swiperE1 = root.querySelector("[data-stage-swiper]");
    const track = root.querySelector("[data-stage-track]");
    const fill = root.querySelector("[data-stage-fill]");
    const tagsE1 = root.querySelector("[data-stage-tags]");
    const progressE1 = root.querySelector(".stage-progress");
    //Counts the number of slides in the carousel, so it knows how many stars to build in the track
    const slideCount = swiperE1.querySelectorAll(".swiper-slide").length;

    //Array of stars with number of stars corresponding to the number of slides
    const starSlots = buildStarTrack(track, slideCount);

    if(!showFill){
        fill.style.display="none";
    }

    //Moves the gold fill line to exactly the active star and lights that star up.
    let currentIndex = 0;
    function syncTrack(activeIndex) {
        currentIndex = activeIndex;
        for (let i = 0; i < starSlots.length; i++){
            const slot = starSlots[i];
            const shouldBeActive = (i === activeIndex);
            slot.classList.toggle("is-active", shouldBeActive);
        }

        if(!showFill) return;

        //Returns the position of the progress bar on the screen
        const trackRect = track.getBoundingClientRect();
        //Returns the position of the active star on the screen
        const starRect = starSlots[activeIndex].getBoundingClientRect();
        //Calculating the star's horizontal center relative to the start of the progress bar
        const starCenterX = starRect.left + starRect.width / 2 - trackRect.left;
        //Reads the CSS rule {left: 20px} applied to the fill part of the progress bar of the element on the page 
        //saves the number 20 
        const fillInsetLeft = parseFloat(getComputedStyle(fill).left) || 0;
        //Calculates the number of pixels (width wise) needed for the fill progress bar to reach the middle of the active star
        //After that calculation -> turns the number into proper CSS string and applies directly to the element "fill progress bar"
        fill.style.width = `${starCenterX - fillInsetLeft}px`;
    }

    //Matches the progress bar's width with the width of carousel
    function syncProgressWidth() {
        const width = swiperE1.getBoundingClientRect().width;
        if (width > 0){
            progressE1.style.width = `${width}px`;
        }
    }

    new Swiper (swiperE1, {
        loop: loop,
        speed: 700,
        effect:"fade",
        fadeEffect: {
            crossFade: true,
        },
        autoplay: {
            delay: autoplayDelay,
            disableOnInteraction: false,
        },
        pagination: {
            el: tagsE1,
            clickable: true,
            //Not actually calling the function, just telling Swipper to call renderTagBullets instead of swiper's default pagination bullets.
            renderBullet: renderTagBullets,
        },
        on:{
            //If loop mode is on, swiper will duplicate slides to create an infinite scroll effect.
            //This function tells swiper to always point to the true version of the slide.
            slideChange: function(sw) {
                let indexToUse;
                if(loop) {
                    indexToUse = sw.realIndex;
                } else {
                    indexToUse = sw.activeIndex;
                }
                //Syncs the progress bar and star with the active slide
                syncTrack(indexToUse);
            },
            //Fires after swiper finishes recalculating its own layout on window resize
            //Using swipers own event avoids measuring one step too early before swiper has updaated itself.
            resize : function(){
                syncTrack(currentIndex);
                syncProgressWidth();
            }
        },
    });

    //Manually firing immediately to set the progress bar width to match the carousel, and to set the progress to the first star
    //Wihtout this,the page would load in a visible broken state, it would need to wait for the slideChange or resize to fire
    syncTrack(0);
    syncProgressWidth();
}

//For each specific element found in the page -> create the swiper instance
//If there are two carousels, this line runs twice, once per root: carousel's A never touches elements of carousel's B
const allRoots = document.querySelectorAll("[data-stage-progress-root]");

for (let i = 0; i < allRoots.length; i++){
    const root = allRoots[i];
    const showFill = root.dataset.stageFill !== "false";
    initStageProgress(root, {showFill});
}
