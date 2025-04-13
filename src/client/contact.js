// src/contact.ts
export class Contact {
    _fullName;
    _contactNumber;
    _emailAddress;
    /**
     * Constructs a new Contact instance
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */
    constructor(fullName = "", contactNumber = "", emailAddress = "") {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }
    /**
     * Gets the full name of the contact
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }
    /**
     * Sets the full name of the contact.
     * Validates input to ensure it's a non-empty string.
     * @param fullName
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid fullName: must be a non-empty string");
        }
        this._fullName = fullName;
    }
    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get contactNumber() {
        return this._contactNumber;
    }
    /**
     * Sets the contact number for the contact.
     * Uses a regex to validate the number format (e.g. "123-456-7890").
     * @param contactNumber
     */
    set contactNumber(contactNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid contactNumber: must be a 10 digit number formatted as XXX-XXX-XXXX");
        }
        this._contactNumber = contactNumber;
    }
    /**
     * Gets the email address for the contact.
     * @returns {string}
     */
    get emailAddress() {
        return this._emailAddress;
    }
    /**
     * Sets the email address for the contact.
     * Validates using a regex.
     * @param emailAddress
     */
    set emailAddress(emailAddress) {
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
    toString() {
        return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail Address: ${this._emailAddress}`;
    }
    /**
     * Serializes the contact details into a string format suitable for storage.
     * @returns {string|null}
     */
    serialize() {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more of the contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
    }
    /**
     * Deserializes a string of contact details and updates the contact properties.
     * @param data - A comma-separated string containing fullName, contactNumber, and emailAddress.
     */
    deserialize(data) {
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format for deserialization");
            return;
        }
        const propArray = data.split(",");
        this._fullName = propArray[0];
        this._contactNumber = propArray[1];
        this._emailAddress = propArray[2];
    }
}
//# sourceMappingURL=contact.js.map