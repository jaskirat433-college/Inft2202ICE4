"use strict";
import { LoadHeader } from "./header";
import { LoadFooter } from "./footer";
export class Router {
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
            await LoadHeader(this);
            await LoadFooter();
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
//# sourceMappingURL=router.js.map