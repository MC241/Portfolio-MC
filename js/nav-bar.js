(function () {
    function setNavOffset () {
        const navbar = document.querySelector("header")
        if (!navbar) return;
        document.documentElement.style.setProperty("--nav-h", navbar.offsetHeight + "px");
    }

    setNavOffset();

    let resizeRAF = null;
    window.addEventListener("resize", () => {
        if (resizeRAF) cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(setNavOffset);
        });
})
();