"use strict";
// src/client/api/contacts/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchContacts = fetchContacts;
exports.fetchContact = fetchContact;
exports.createContact = createContact;
exports.updateContact = updateContact;
exports.deleteContact = deleteContact;
/**
 * Fetch all contacts from the server.
 */
async function fetchContacts() {
    const response = await fetch("/api/contacts");
    if (!response.ok) {
        throw new Error(`Error fetching contacts: ${response.status}`);
    }
    return response.json();
}
/**
 * Fetch a single contact by ID.
 * @param id - The contact's ID.
 */
async function fetchContact(id) {
    const response = await fetch(`/api/contacts/${id}`);
    if (!response.ok) {
        throw new Error(`Error fetching contact with id ${id}: ${response.status}`);
    }
    return response.json();
}
/**
 * Create a new contact.
 * @param contact - The new contact data.
 */
async function createContact(contact) {
    const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error(`Error creating contact: ${response.status}`);
    }
    return response.json();
}
/**
 * Update an existing contact.
 * @param id - The ID of the contact to update.
 * @param contact - The updated contact data.
 */
async function updateContact(id, contact) {
    const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error(`Error updating contact: ${response.status}`);
    }
    return response.json();
}
/**
 * Delete a contact by ID.
 * @param id - The ID of the contact to delete.
 */
async function deleteContact(id) {
    const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error(`Error deleting contact: ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=index.js.map