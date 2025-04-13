import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";

const router = express.Router();

// Connection URI and database/collection names.
const uri = "mongodb://localhost:27017"; // adjust if needed
const dbName = "contactsDB";
const collectionName = "contacts";

// Create a MongoClient instance.
const client = new MongoClient(uri);

async function getContactsCollection() {
    if (!client.isConnected()) {
        await client.connect();
    }
    return client.db(dbName).collection(collectionName);
}

// GET / - Fetch all contacts.
router.get("/", async (req: Request, res: Response) => {
    try {
        const contactsCollection = await getContactsCollection();
        const contacts = await contactsCollection.find({}).toArray();
        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
});

// GET /:id - Fetch a single contact by ID.
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const contactsCollection = await getContactsCollection();
        const id = req.params.id;
        const contact = await contactsCollection.findOne({ _id: new ObjectId(id) });
        if (!contact) {
            res.status(404).json({ error: "Contact not found" });
        } else {
            res.json(contact);
        }
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ error: "Failed to fetch contact" });
    }
});

// POST / - Create a new contact with an auto-generated _id.
router.post("/", async (req: Request, res: Response) => {
    try {
        const contactsCollection = await getContactsCollection();
        const newContact = req.body;
        // Insert the new contact into the collection.
        const result = await contactsCollection.insertOne(newContact);
        // Append the generated _id to the newContact object.
        newContact._id = result.insertedId;
        res.status(201).json(newContact);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Failed to create contact" });
    }
});

// PUT /:id - Update an existing contact.
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const contactsCollection = await getContactsCollection();
        const id = req.params.id;
        const updatedData = req.body;
        // Update the contact document matching the provided _id.
        const result = await contactsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Contact not found" });
            return;
        }
        // Fetch the updated document.
        const updatedContact = await contactsCollection.findOne({ _id: new ObjectId(id) });
        res.json(updatedContact);
    } catch (error) {
        console.error("Error updating contact:", error);
        res.status(500).json({ error: "Failed to update contact" });
    }
});

// DELETE /:id - Delete a contact by ID.
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const contactsCollection = await getContactsCollection();
        const id = req.params.id;
        // Find the contact to delete.
        const contactToDelete = await contactsCollection.findOne({ _id: new ObjectId(id) });
        if (!contactToDelete) {
            res.status(404).json({ error: "Contact not found" });
            return;
        }
        // Delete the contact.
        await contactsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(contactToDelete);
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ error: "Failed to delete contact" });
    }
});

export { router as contactRoutes };
