const win = document.getElementById("startup");
const openBtn = document.getElementById("start_button");


openBtn.onclick = (e) => {
    e.stopPropagation(); // Prevent this click from immediately closing it

    win.style.display =
        win.style.display === "flex" ? "none" : "flex";
};

win.onclick = (e) => {
    e.stopPropagation(); // Clicking inside the startup menu won't close it
};

document.addEventListener("click", () => {
    win.style.display = "none";
});



const desktop = document.getElementById("dekstop");

// Only desktop icons, not the start menu buttons
const icons = desktop.querySelectorAll(".exes .apps");

icons.forEach((icon, index) => {

    // Make sure JS controls positioning
    icon.style.position = "absolute";

    // Starting positions
    if (!icon.dataset.init) {
        icon.style.left = "40px";
        icon.style.top = `${40 + index * 140}px`;
        icon.dataset.init = "true";
    }

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    icon.addEventListener("mousedown", (e) => {

        if (e.button !== 0) return;

        dragging = true;
        moved = false;

        startX = e.clientX;
        startY = e.clientY;

        const rect = icon.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        icon.style.zIndex = 9999;

        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {

        if (!dragging) return;

        // Don't start dragging until mouse moves a little
        if (
            !moved &&
            Math.abs(e.clientX - startX) < 5 &&
            Math.abs(e.clientY - startY) < 5
        ) {
            return;
        }

        moved = true;

        const rect = desktop.getBoundingClientRect();

        let x = e.clientX - rect.left - offsetX;
        let y = e.clientY - rect.top - offsetY;

        // Restrict inside desktop
        x = Math.max(
            0,
            Math.min(x, desktop.clientWidth - icon.offsetWidth)
        );

        y = Math.max(
            0,
            Math.min(y, desktop.clientHeight - icon.offsetHeight)
        );

        icon.style.left = x + "px";
        icon.style.top = y + "px";
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
        icon.style.zIndex = "";
    });

    // Prevent opening window after dragging
    icon.addEventListener("click", (e) => {
        if (moved) {
            e.preventDefault();
            e.stopImmediatePropagation();
            moved = false;
        }
    }, true);

});