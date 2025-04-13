"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActiveNavLink = UpdateActiveNavLink;
exports.LoadHeader = LoadHeader;
exports.handleLogout = handleLogout;
exports.CheckLogin = CheckLogin;
function UpdateActiveNavLink() {
    console.log("[INFO] UpdateActiveNavLink() called...");
    const currentPage = document.title.trim();
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        if (link.textContent && link.textContent.trim() === currentPage) {
            link.classList.add("active");
        }
        else {
            link.classList.remove("active");
        }
    });
}
async function LoadHeader(router) {
    console.log("[INFO] LoadHeader() called...");
    try {
        const response = await fetch("header.html");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const headerElement = document.querySelector("header");
        if (headerElement) {
            headerElement.innerHTML = data;
        }
        else {
            console.error("Header element not found.");
        }
        UpdateActiveNavLink();
        CheckLogin(router); // Call CheckLogin after loading the header
    }
    catch (error) {
        console.log("[ERROR] Unable to load header", error);
    }
}
function handleLogout(router) {
    sessionStorage.removeItem("user");
    router.navigate("/login");
}
function CheckLogin(router) {
    console.log("[INFO] Checking user login status.");
    const loginNav = document.querySelector(".login");
    if (!loginNav) {
        console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().");
        return;
    }
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
        loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
        // Type cast to ensure TS knows that 'href' exists.
        loginNav.href = "#";
        loginNav.addEventListener("click", (event) => {
            event.preventDefault();
            handleLogout(router);
        });
    }
}
//# sourceMappingURL=header.js.map