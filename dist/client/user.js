"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/user.ts
class User {
    _displayName;
    _emailAddress;
    _username;
    _password;
    constructor(displayName = "", emailAddress = "", username = "", password = "") {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }
    get displayName() {
        return this._displayName;
    }
    get emailAddress() {
        return this._emailAddress;
    }
    get username() {
        return this._username;
    }
    set displayName(displayName) {
        this._displayName = displayName;
    }
    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }
    set username(username) {
        this._username = username;
    }
    /**
     * Returns a formatted string representation of the user.
     */
    toString() {
        return `DisplayName: ${this._displayName}\nEmail Address: ${this._emailAddress}\nUsername: ${this._username}`;
    }
    /**
     * Converts the user data to a JSON-serializable object.
     */
    toJSON() {
        return {
            DisplayName: this._displayName,
            EmailAddress: this._emailAddress,
            Username: this._username,
            Password: this._password,
        };
    }
    /**
     * Populates the user data from a JSON object.
     * @param data - The JSON data with user properties.
     */
    fromJSON(data) {
        this._displayName = data.DisplayName;
        this._emailAddress = data.EmailAddress;
        this._username = data.Username;
        this._password = data.Password;
    }
    /**
     * Serializes the user data into a comma-separated string.
     * Returns null if required properties are missing.
     */
    serialize() {
        if (this._displayName !== "" && this._emailAddress !== "" && this._username !== "") {
            return `${this._displayName},${this._emailAddress},${this._username}`;
        }
        console.error("[ERROR] Failed to serialize user, properties missing");
        return null;
    }
    /**
     * Deserializes a comma-separated string to populate user properties.
     * @param data - A string containing displayName, emailAddress, and username.
     */
    deserialize(data) {
        const propertyArray = data.split(",");
        this._displayName = propertyArray[0];
        this._emailAddress = propertyArray[1];
        this._username = propertyArray[2];
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map