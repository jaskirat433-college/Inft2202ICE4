// src/user.ts
export class User {
    private _displayName: string;
    private _emailAddress: string;
    private _username: string;
    private _password: string;

    constructor(
        displayName: string = "",
        emailAddress: string = "",
        username: string = "",
        password: string = ""
    ) {
        this._displayName = displayName;
        this._emailAddress = emailAddress;
        this._username = username;
        this._password = password;
    }

    get displayName(): string {
        return this._displayName;
    }

    get emailAddress(): string {
        return this._emailAddress;
    }

    get username(): string {
        return this._username;
    }

    set displayName(displayName: string) {
        this._displayName = displayName;
    }

    set emailAddress(emailAddress: string) {
        this._emailAddress = emailAddress;
    }

    set username(username: string) {
        this._username = username;
    }

    /**
     * Returns a formatted string representation of the user.
     */
    public toString(): string {
        return `DisplayName: ${this._displayName}\nEmail Address: ${this._emailAddress}\nUsername: ${this._username}`;
    }

    /**
     * Converts the user data to a JSON-serializable object.
     */
    public toJSON(): { DisplayName: string; EmailAddress: string; Username: string; Password: string } {
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
    public fromJSON(data: any): void {
        this._displayName = data.DisplayName;
        this._emailAddress = data.EmailAddress;
        this._username = data.Username;
        this._password = data.Password;
    }

    /**
     * Serializes the user data into a comma-separated string.
     * Returns null if required properties are missing.
     */
    public serialize(): string | null {
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
    public deserialize(data: string): void {
        const propertyArray = data.split(",");
        this._displayName = propertyArray[0];
        this._emailAddress = propertyArray[1];
        this._username = propertyArray[2];
    }
}
