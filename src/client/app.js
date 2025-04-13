"use strict";
import { LoadHeader, UpdateActiveNavLink, CheckLogin } from "./header";
import { LoadFooter } from "./footer";
import { Router } from "./router";
import { DisplayWeather, AddContact, handleEditClick, handleCancelClick, getFromStorage, saveToStorage, removeFromStorage } from "./utils";
import { Contact } from "./contact";
(function () {
    const pageTitles = {
        "/": "Home",
        "/products": "Products",
        "/services": "Services",
        "/about": "About",
        "/contacts": "Contact List",
        "/login": "Login",
        "/404": "404"
    };
    function DisplayHomePage(router) {
        console.log("Called DisplayHomePage() ... ");
        const aboutUsBtn = document.getElementById("AboutUsBtn");
        if (aboutUsBtn) {
            aboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        DisplayWeather();
        const mainParagraph = document.getElementById("MainParagraph");
        if (mainParagraph) {
            mainParagraph.remove();
        }
        const articleParagraph = document.getElementById("ArticleParagraph");
        if (articleParagraph) {
            articleParagraph.remove();
        }
        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.insertAdjacentHTML("beforeend", `<p id="MainParagraph" class="mt-3">This is my first paragraph</p>`);
        }
        document.body.insertAdjacentHTML("beforeend", `<article class="container"><p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`);
    }
    function DisplayContactListPage(router) {
        console.log("ContactList Page");
        // Add "Add New Contact" button if not present
        const existingButton = document.getElementById("addContactButton");
        if (existingButton) {
            existingButton.addEventListener("click", () => {
                router.navigate("/edit");
            });
        }
        else {
            const addButton = document.createElement("button");
            addButton.id = "addContactButton";
            addButton.className = "btn btn-success mt-3";
            addButton.innerHTML = '<i class="fas fa-plus"></i> Add New Contact';
            addButton.addEventListener("click", () => {
                router.navigate("/edit");
            });
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.appendChild(addButton);
            }
        }
        const contactList = document.getElementById("contactList");
        if (contactList) {
            let data = "";
            const keys = Object.keys(window.localStorage);
            keys.forEach((key, index) => {
                const contactData = getFromStorage(key);
                if (contactData) {
                    const contact = new Contact();
                    contact.deserialize(contactData);
                    data += `<tr>
            <th scope="row" class="text-center">${index + 1}</th>
            <td>${contact.fullName}</td>
            <td>${contact.contactNumber}</td>
            <td>${contact.emailAddress}</td>
            <td>
              <button class="btn btn-primary edit" data-key="${key}">
                <i class="fas fa-edit"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-danger delete" data-key="${key}">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>`;
                }
            });
            contactList.innerHTML = data;
        }
        // Attach listeners for edit buttons
        document.querySelectorAll(".edit").forEach((button) => {
            button.addEventListener("click", (event) => handleEditClick(event, router));
        });
        // Attach listeners for delete buttons
        document.querySelectorAll(".delete").forEach((button) => {
            button.addEventListener("click", function () {
                const contactKey = this.getAttribute("data-key");
                if (contactKey && confirm("Are you sure you want to delete this contact?")) {
                    removeFromStorage(contactKey);
                    window.location.reload(); // Refresh list
                }
            });
        });
    }
    function DisplayEditPage(router) {
        console.log("Edit Contact Page");
        const params = new URLSearchParams(window.location.search);
        const contactKey = params.get("contact");
        const isAddOperation = !contactKey;
        const pageTitle = document.querySelector("h1");
        const submitButton = document.getElementById("editButton");
        if (isAddOperation) {
            if (pageTitle)
                pageTitle.textContent = "Add Contact";
            if (submitButton) {
                submitButton.textContent = "Add Contact";
                submitButton.classList.replace("btn-primary", "btn-success");
            }
        }
        else {
            if (pageTitle)
                pageTitle.textContent = "Edit Contact";
            if (submitButton) {
                submitButton.textContent = "Update Contact";
                submitButton.classList.replace("btn-success", "btn-primary");
            }
            const contactData = getFromStorage(contactKey);
            if (contactData) {
                const contact = new Contact();
                contact.deserialize(contactData);
                document.getElementById("fullName").value =
                    contact.fullName;
                document.getElementById("contactNumber").value =
                    contact.contactNumber;
                document.getElementById("emailAddress").value =
                    contact.emailAddress;
            }
        }
        if (submitButton) {
            submitButton.addEventListener("click", function (event) {
                event.preventDefault();
                const fullName = document.getElementById("fullName")
                    .value;
                const contactNumber = document.getElementById("contactNumber").value;
                const emailAddress = document.getElementById("emailAddress").value;
                if (isAddOperation) {
                    if (AddContact(router, fullName, contactNumber, emailAddress)) {
                        router.navigate("/contacts");
                    }
                }
                else {
                    const contact = new Contact(fullName, contactNumber, emailAddress);
                    const serialized = contact.serialize();
                    if (serialized) {
                        saveToStorage(contactKey, serialized);
                        router.navigate("/contacts");
                    }
                }
            });
        }
        const cancelButton = document.getElementById("cancelButton");
        if (cancelButton) {
            cancelButton.addEventListener("click", (event) => handleCancelClick(event, router));
        }
    }
    function DisplayLoginPage(router) {
        console.log("[INFO] DisplayLoginPage() called...");
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        if (messageArea) {
            messageArea.style.display = "none";
            messageArea.classList.add("alert");
        }
        if (!loginButton || !cancelButton || !loginForm) {
            console.error("[ERROR] Required elements not found in the DOM");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                const response = await fetch("data/user.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                if (!Array.isArray(jsonData?.Users)) {
                    throw new Error("Invalid user data structure");
                }
                const authenticatedUser = jsonData.Users.find((user) => {
                    return user.Username === username && user.Password === password;
                });
                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));
                    if (messageArea) {
                        messageArea.style.display = "none";
                        messageArea.classList.remove("alert-danger");
                    }
                    router.navigate("/contacts");
                }
                else {
                    if (messageArea) {
                        messageArea.textContent =
                            "Invalid username or password. Please try again.";
                        messageArea.classList.add("alert-danger");
                        messageArea.style.display = "block";
                    }
                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Authentication failed:", error);
                if (messageArea) {
                    messageArea.textContent =
                        "Failed to connect to authentication service. Please try again later.";
                    messageArea.classList.add("alert-danger");
                    messageArea.style.display = "block";
                }
            }
        });
        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            loginForm.reset();
            router.navigate("/");
        });
    }
    function handlePageLogic(router) {
        switch (document.title) {
            case "Home":
                DisplayHomePage(router);
                break;
            case "Products":
                // DisplayProductsPage(router);
                break;
            case "Services":
                // DisplayServicesPage(router);
                break;
            case "About":
                // DisplayAboutPage(router);
                break;
            case "Contact":
                // DisplayContactPage(router);
                break;
            case "Contact List":
                DisplayContactListPage(router);
                break;
            case "Edit Contact":
                DisplayEditPage(router);
                break;
            case "Login":
                DisplayLoginPage(router);
                break;
            case "Register":
                // DisplayRegisterPage(router);
                break;
        }
    }
    async function Start() {
        console.log("Starting App...");
        const routes = {
            "/": "views/pages/home.html",
            "/products": "views/pages/products.html",
            "/services": "views/pages/services.html",
            "/about": "views/pages/about.html",
            "/contacts": "views/pages/contact.html",
            "/login": "views/pages/login.html",
            "/404": "views/pages/404.html"
        };
        const protectedRoutes = ["/contact-list", "/edit"];
        const router = new Router(routes, protectedRoutes);
        router.init();
        await LoadHeader(router);
        await LoadFooter();
        CheckLogin(router);
        UpdateActiveNavLink();
        document.addEventListener("routeLoaded", () => handlePageLogic(router));
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map