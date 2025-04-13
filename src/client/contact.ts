// src/contact.ts
export class Contact {
    private _id: string;             // New: id property for server-managed IDs.
    private _fullName: string;
    private _contactNumber: string;
    private _emailAddress: string;

    /**
     * Constructs a new Contact instance.
     * @param fullName - The full name of the contact.
     * @param contactNumber - The contact number (formatted as XXX-XXX-XXXX).
     * @param emailAddress - The email address of the contact.
     * @param id - An optional id (server-managed); defaults to an empty string.
     */
    constructor(
        fullName: string = "",
        contactNumber: string = "",
        emailAddress: string = "",
        id: string = ""
    ) {
        this._id = id;
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }

    /**
     * Gets the server-managed ID of the contact.
     * @returns {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     * Sets the contact id.
     * @param id - The id to be assigned.
     */
    set id(id: string) {
        this._id = id;
    }

    /**
     * Gets the full name of the contact.
     * @returns {string}
     */
    get fullName(): string {
        return this._fullName;
    }

    /**
     * Sets the full name of the contact.
     * Validates input to ensure it's a non-empty string.
     * @param fullName - The full name to set.
     */
    set fullName(fullName: string) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid fullName: must be a non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * Gets the contact number of the contact.
     * @returns {string}
     */
    get contactNumber(): string {
        return this._contactNumber;
    }

    /**
     * Sets the contact number for the contact.
     * Uses a regex to validate the number format (e.g. "123-456-7890").
     * @param contactNumber - The contact number to set.
     */
    set contactNumber(contactNumber: string) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactNumber)) {
            throw new Error(
                "Invalid contactNumber: must be a 10 digit number formatted as XXX-XXX-XXXX"
            );
        }
        this._contactNumber = contactNumber;
    }

    /**
     * Gets the email address for the contact.
     * @returns {string}
     */
    get emailAddress(): string {
        return this._emailAddress;
    }

    /**
     * Sets the email address for the contact.
     * Validates using a regex.
     * @param emailAddress - The email address to set.
     */
    set emailAddress(emailAddress: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid emailAddress: must be a valid email");
        }
        this._emailAddress = emailAddress;
    }

    /**
     * Returns a human-readable string format of the contact details.
     * @returns {string}
     */
    public toString(): string {
        return `ID: ${this._id}\nFull Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail Address: ${this._emailAddress}`;
    }

    /**
     * Serializes the contact details into a comma-separated string format.
     * Format: id,fullName,contactNumber,emailAddress
     * @returns {string|null} The serialized string or null if any property is missing.
     */
    public serialize(): string | null {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more of the contact properties are missing or invalid");
            return null;
        }
        return `${this._id},${this._fullName},${this._contactNumber},${this._emailAddress}`;
    }

    /**
     * Deserializes a comma-separated string to update the contact properties.
     * Expected format: id,fullName,contactNumber,emailAddress.
     * If the id is missing, it is set to an empty string.
     * @param data - The comma-separated string of contact details.
     */
    public deserialize(data: string): void {
        if (typeof data !== "string") {
            console.error("Data provided for deserialization is not a string");
            return;
        }
        const propArray = data.split(",");
        if (propArray.length < 3) {
            console.error("Invalid data format for deserialization");
            return;
        }
        // If there are 4 parts, use them; otherwise, leave id as empty
        if (propArray.length === 4) {
            this._id = propArray[0];
            this._fullName = propArray[1];
            this._contactNumber = propArray[2];
            this._emailAddress = propArray[3];
        } else {
            // No id provided in the string.
            this._id = "";
            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }
    }
}