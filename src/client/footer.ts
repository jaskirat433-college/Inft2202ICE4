"use strict";

export async function LoadFooter(): Promise<void> {
    console.log("[INFO] LoadFooter() called...");

    try {
        const response = await fetch("views/components/footer.html");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const footerElement = document.querySelector("footer");
        if (footerElement) {
            footerElement.innerHTML = data;
        } else {
            console.error("Footer element not found.");
        }
    } catch (error) {
        console.log("[ERROR] Unable to load footer", error);
    }
}
