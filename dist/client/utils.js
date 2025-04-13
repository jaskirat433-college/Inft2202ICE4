"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToStorage = saveToStorage;
exports.getFromStorage = getFromStorage;
exports.removeFromStorage = removeFromStorage;
exports.AddContact = AddContact;
exports.handleEditClick = handleEditClick;
exports.handleCancelClick = handleCancelClick;
exports.DisplayWeather = DisplayWeather;
const contact_1 = require("./contact");
// ------------------------------------------------------
// LocalStorage Helpers
// ------------------------------------------------------
/**
 * Saves a string value to localStorage using the given key.
 */
function saveToStorage(key, value) {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
    }
    else {
        console.warn("Local Storage is not available.");
    }
}
/**
 * Retrieves a string value from localStorage for the given key.
 */
function getFromStorage(key) {
    if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
    }
    console.warn("Local Storage is not available.");
    return null;
}
/**
 * Removes the specified key from localStorage.
 */
function removeFromStorage(key) {
    if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
    }
    else {
        console.warn("Local Storage is not available.");
    }
}
// ------------------------------------------------------
// Contact Helper Functions (Accept Router as a Parameter)
// ------------------------------------------------------
/**
 * Creates and stores a new Contact in localStorage.
 *
 * @param router - The Router instance (passed for consistency even if not used here).
 * @param fullName - The contact's full name.
 * @param contactNumber - The contact's phone number.
 * @param emailAddress - The contact's email address.
 * @returns true if the contact was saved successfully.
 */
function AddContact(router, fullName, contactNumber, emailAddress) {
    const contact = new contact_1.Contact(fullName, contactNumber, emailAddress);
    const serialized = contact.serialize();
    if (serialized) {
        // Generate a unique key using the first letter of fullName and a timestamp.
        const key = fullName.substring(0, 1) + Date.now();
        saveToStorage(key, serialized);
        return true;
    }
    return false;
}
/**
 * Handles an edit click event.
 *
 * @param event - The click event.
 * @param router - The Router instance used to navigate.
 */
function handleEditClick(event, router) {
    event.preventDefault();
    // Use currentTarget instead of relying on "this"
    const target = event.currentTarget;
    const contactKey = target.getAttribute("data-key");
    if (contactKey) {
        router.navigate(`/edit?contact=${contactKey}`);
    }
}
/**
 * Handles the cancel click event.
 *
 * @param event - The click event.
 * @param router - The Router instance used to navigate.
 */
function handleCancelClick(event, router) {
    event.preventDefault();
    router.navigate("/contacts");
}
// ------------------------------------------------------
// Weather Fetching Function
// ------------------------------------------------------
/**
 * Fetches and displays weather data for Toronto.
 */
async function DisplayWeather() {
    const apiKey = "ca2125e6be90c820fa2c4252731d88f7";
    const city = "Toronto";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        console.log("weather API response", data);
        const weatherDataElement = document.getElementById("weather-data");
        if (weatherDataElement) {
            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                      <strong>Temperature: </strong> ${data.main.temp}&deg;C<br>
                                      <strong>Weather: </strong> ${data.weather[0].description}<br>`;
        }
    }
    catch (error) {
        console.error("Error fetching weather data", error);
        const weatherDataElement = document.getElementById("weather-data");
        if (weatherDataElement) {
            weatherDataElement.textContent = "Unable to fetch weather data at this time";
        }
    }
}
//# sourceMappingURL=utils.js.map