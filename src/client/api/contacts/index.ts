// src/client/api/contacts/index.ts

/**
 * Fetch all contacts from the server.
 */
export async function fetchContacts(): Promise<any[]> {
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
export async function fetchContact(id: string): Promise<any> {
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
export async function createContact(contact: any): Promise<any> {
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
export async function updateContact(id: string, contact: any): Promise<any> {
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
export async function deleteContact(id: string): Promise<any> {
    const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error(`Error deleting contact: ${response.status}`);
    }
    return response.json();
}
