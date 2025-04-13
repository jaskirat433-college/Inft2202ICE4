"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = AuthGuard;
let sessionTimeout;
function resetSessionTimer() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        const event = new Event('sessionExpired');
        window.dispatchEvent(event);
    }, 15 * 60 * 1000); // 15 minutes
}
function AuthGuard() {
    // Check if the user is logged in
    const isAuthenticated = !!sessionStorage.getItem('user');
    // Get the current path
    const path = window.location.hash.slice(1) || '/';
    // Define protected routes
    const protectedRoutes = ['/contact-list', '/edit'];
    // If the user is not authenticated and tries to access a protected route, redirect to /login
    if (!isAuthenticated && protectedRoutes.includes(path)) {
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
        window.location.hash = '/login';
        return false;
    }
    // Reset session timer on user activity
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
    resetSessionTimer();
    return isAuthenticated;
}
//# sourceMappingURL=authguard.js.map