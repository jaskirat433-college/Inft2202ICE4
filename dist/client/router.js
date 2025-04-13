"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const header_1 = require("./header");
const footer_1 = require("./footer");
class Router {
    routes;
    protectedRoutes;
    constructor(routes, protectedRoutes) {
        this.routes = routes;
        this.protectedRoutes = protectedRoutes;
    }
    init() {
        window.addEventListener("hashchange", () => this.loadRoute());
        window.addEventListener("load", () => this.loadRoute());
    }
    navigate(path) {
        window.location.hash = path;
    }
    async loadRoute() {
        const path = window.location.hash.slice(1) || "/";
        const page = this.routes[path] || this.routes["/404"];
        if (this.protectedRoutes.includes(path) && !this.AuthGuard()) {
            this.navigate("/login");
            return;
        }
        try {
            const response = await fetch(page);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = content;
            }
            else {
                console.error("Error: 'main' element not found in the document.");
            }
            // Pass the current router instance (this) so that LoadHeader receives a parameter.
            await (0, header_1.LoadHeader)(this);
            await (0, footer_1.LoadFooter)();
        }
        catch (error) {
            console.error("Error loading page:", error);
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = `<p>Error loading page: ${error.message}</p>`;
            }
        }
    }
    AuthGuard() {
        // Replace with your actual authentication check logic.
        return !!localStorage.getItem("authenticated");
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map