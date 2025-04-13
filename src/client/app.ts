"use strict";

import { LoadHeader, UpdateActiveNavLink, CheckLogin, handleLogout } from "./header";
import { LoadFooter } from "./footer";
import { Router } from "./router";
import { DisplayWeather } from "./utils";
import { Contact } from "./contact";
import * as contactAPI from "./api/contacts"; // API helper functions for contacts

(function () {
    const pageTitles: { [path: string]: string } = {
        "/": "Home",
        "/products": "Products",
        "/services": "Services",
        "/about": "About",
        "/contacts": "Contact List",
        "/login": "Login",
        "/404": "404"
    };

    function DisplayHomePage(router: Router): void {
        console.log("Called DisplayHomePage() ... ");
        const aboutUsBtn = document.getElementById("AboutUsBtn");
        if (aboutUsBtn) {
            aboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }

        DisplayWeather();

        // Remove previous paragraphs if present
        const mainParagraph = document.getElementById("MainParagraph");
        if (mainParagraph) mainParagraph.remove();
        const articleParagraph = document.getElementById("ArticleParagraph");
        if (articleParagraph) articleParagraph.remove();

        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.insertAdjacentHTML(
                "beforeend",
                `<p id="MainParagraph" class="mt-3">This is my first paragraph</p>`
            );
        }
        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container"><p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`
        );
    }

    async function DisplayContactListPage(router: Router): Promise<void> {
        console.log("ContactList Page");

        // Add "Add New Contact" button if not present.
        const existingButton = document.getElementById("addContactButton");
        if (existingButton) {
            existingButton.addEventListener("click", () => {
                router.navigate("/edit");
            });
        } else {
            const addButton = document.createElement("button");
            addButton.id = "addContactButton";
            addButton.className = "btn btn-success mt-3";
            addButton.innerHTML = '<i class="fas fa-plus"></i> Add New Contact';
            addButton.addEventListener("click", () => {
                router.navigate("/edit");
            });
            const mainElement = document.querySelector("main");
            if (mainElement) mainElement.appendChild(addButton);
        }

        try {
            // Fetch contacts from the server instead of localStorage.
            const contacts = await contactAPI.fetchContacts();
            let tableRows = "";
            contacts.forEach((contact: any, index: number) => {
                tableRows += `<tr>
                    <th scope="row" class="text-center">${index + 1}</th>
                    <td>${contact.fullName}</td>
                    <td>${contact.contactNumber}</td>
                    <td>${contact.emailAddress}</td>
                    <td>
                      <button class="btn btn-primary edit" data-id="${contact.id}">
                        <i class="fas fa-edit"></i>
                      </button>
                    </td>
                    <td>
                      <button class="btn btn-danger delete" data-id="${contact.id}">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </td>
                </tr>`;
            });
            const contactList = document.getElementById("contactList");
            if (contactList) {
                contactList.innerHTML = tableRows;
            }

            // Attach listeners for edit buttons.
            document.querySelectorAll(".edit").forEach((button) => {
                button.addEventListener("click", (event: Event) => {
                    const id = (button as HTMLElement).getAttribute("data-id");
                    if (id) {
                        router.navigate(`/edit?contact=${id}`);
                    }
                });
            });

            // Attach listeners for delete buttons.
            document.querySelectorAll(".delete").forEach((button) => {
                button.addEventListener("click", async function (this: HTMLElement) {
                    const id = this.getAttribute("data-id");
                    if (id && confirm("Are you sure you want to delete this contact?")) {
                        await contactAPI.deleteContact(id);
                        // Refresh the contact list.
                        await DisplayContactListPage(router);
                    }
                });
            });
        } catch (error: any) {
            console.error("Error fetching contacts from server:", error);
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = `<p>Error loading contacts: ${error.message}</p>`;
            }
        }
    }

    async function DisplayEditPage(router: Router): Promise<void> {
        console.log("Edit Contact Page");

        const params = new URLSearchParams(window.location.search);
        const contactId = params.get("contact");
        const isAddOperation = !contactId;
        const pageTitle = document.querySelector("h1");
        const submitButton = document.getElementById("editButton");

        if (isAddOperation) {
            if (pageTitle) pageTitle.textContent = "Add Contact";
            if (submitButton) {
                submitButton.textContent = "Add Contact";
                submitButton.classList.replace("btn-primary", "btn-success");
            }
        } else {
            if (pageTitle) pageTitle.textContent = "Edit Contact";
            if (submitButton) {
                submitButton.textContent = "Update Contact";
                submitButton.classList.replace("btn-success", "btn-primary");
            }
            // Fetch contact data from the server for editing.
            try {
                const contact = await contactAPI.fetchContact(contactId as string);
                (document.getElementById("fullName") as HTMLInputElement).value = contact.fullName;
                (document.getElementById("contactNumber") as HTMLInputElement).value = contact.contactNumber;
                (document.getElementById("emailAddress") as HTMLInputElement).value = contact.emailAddress;
            } catch (error: any) {
                console.error("Error fetching contact:", error);
            }
        }

        if (submitButton) {
            submitButton.addEventListener("click", async function (event: Event) {
                event.preventDefault();
                const fullName = (document.getElementById("fullName") as HTMLInputElement).value;
                const contactNumber = (document.getElementById("contactNumber") as HTMLInputElement).value;
                const emailAddress = (document.getElementById("emailAddress") as HTMLInputElement).value;
                const newData = { fullName, contactNumber, emailAddress };

                try {
                    if (isAddOperation) {
                        // Create a new contact via the API.
                        await contactAPI.createContact(newData);
                    } else {
                        // Update the existing contact via the API.
                        await contactAPI.updateContact(contactId as string, newData);
                    }
                    router.navigate("/contacts");
                } catch (error: any) {
                    console.error("Failed to save contact:", error);
                }
            });
        }

        const cancelButton = document.getElementById("cancelButton");
        if (cancelButton) {
            cancelButton.addEventListener("click", (event: Event) => {
                event.preventDefault();
                router.navigate("/contacts");
            });
        }
    }

    // DisplayLoginPage remains largely unchanged (it uses the /users endpoint).
    function DisplayLoginPage(router: Router): void {
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

        loginButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            const username = (document.getElementById("username") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value.trim();

            try {
                const response = await fetch("/users");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const users = await response.json();
                if (!Array.isArray(users)) {
                    throw new Error("Invalid user data structure");
                }
                const authenticatedUser = users.find((user: any) => {
                    return user.username === username && user.password === password;
                });
                if (authenticatedUser) {
                    sessionStorage.setItem(
                        "user",
                        JSON.stringify({
                            displayName: authenticatedUser.displayName,
                            emailAddress: authenticatedUser.emailAddress,
                            username: authenticatedUser.username
                        })
                    );
                    if (messageArea) {
                        messageArea.style.display = "none";
                        messageArea.classList.remove("alert-danger");
                    }
                    router.navigate("/contacts");
                } else {
                    if (messageArea) {
                        messageArea.textContent = "Invalid username or password. Please try again.";
                        messageArea.classList.add("alert-danger");
                        messageArea.style.display = "block";
                    }
                    (document.getElementById("username") as HTMLInputElement).focus();
                    (document.getElementById("username") as HTMLInputElement).select();
                }
            } catch (error: any) {
                console.error("[ERROR] Authentication failed:", error);
                if (messageArea) {
                    messageArea.textContent =
                        "Failed to connect to authentication service. Please try again later.";
                    messageArea.classList.add("alert-danger");
                    messageArea.style.display = "block";
                }
            }
        });

        cancelButton.addEventListener("click", (event: Event) => {
            event.preventDefault();
            (loginForm as HTMLFormElement).reset();
            router.navigate("/");
        });
    }

    function handlePageLogic(router: Router): void {
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

    async function Start(): Promise<void> {
        console.log("Starting App...");

        const routes: { [key: string]: string } = {
            "/": "views/pages/home.html",
            "/products": "views/pages/products.html",
            "/services": "views/pages/services.html",
            "/about": "views/pages/about.html",
            "/contacts": "views/pages/contact.html",
            "/login": "views/pages/login.html",
            "/404": "views/pages/404.html"
        };

        const protectedRoutes: string[] = ["/contact-list", "/edit"];

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
