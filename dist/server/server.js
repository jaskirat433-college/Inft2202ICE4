"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const contactRoutes_1 = require("./contactRoutes");
const app = (0, express_1.default)();
// Middleware to parse JSON bodies (necessary for POST and PUT requests).
app.use(express_1.default.json());
// Calculate the project root directory.
// Assuming that the compiled server files are in dist/server, then the project root is two levels up.
const projectRoot = path_1.default.join(__dirname, "..", "..");
// Serve static files for compiled client JS.
// For example, if you have compiled your client code to dist/client/.
app.use("/dist/client", express_1.default.static(path_1.default.join(projectRoot, "dist", "client")));
// Serve static files from the project root (for index.html, content, views, etc.)
app.use(express_1.default.static(projectRoot));
// Mount the contact routes under /api/contacts.
app.use("/api/contacts", contactRoutes_1.contactRoutes);
// (Existing sample user data endpoint, if needed)
const users = [
    {
        username: "jdoe",
        password: "password",
        displayName: "John Doe",
        emailAddress: "jdoe@example.com"
    },
    {
        username: "asmith",
        password: "secret",
        displayName: "Alice Smith",
        emailAddress: "alice@example.com"
    }
];
app.get("/users", (req, res) => {
    res.json(users);
});
// Serve the SPA's entry point (index.html) on the root route.
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(projectRoot, "index.html"));
});
// Start the server on port 3000.
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map