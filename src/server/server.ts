import express from "express";
import path from "path";
import { contactRoutes } from "./contactRoutes";

const app = express();

// Middleware to parse JSON bodies (necessary for POST and PUT requests).
app.use(express.json());

// Calculate the project root directory.
// Assuming that the compiled server files are in dist/server, then the project root is two levels up.
const projectRoot = path.join(__dirname, "..", "..");

// Serve static files for compiled client JS.
// For example, if you have compiled your client code to dist/client/.
app.use("/dist/client", express.static(path.join(projectRoot, "dist", "client")));

// Serve static files from the project root (for index.html, content, views, etc.)
app.use(express.static(projectRoot));

// Mount the contact routes under /api/contacts.
app.use("/api/contacts", contactRoutes);

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
    res.sendFile(path.join(projectRoot, "index.html"));
});

// Start the server on port 3000.
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
