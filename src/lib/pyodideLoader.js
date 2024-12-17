let pyodideInstance = null;

async function loadPyodideScript() {
    if (window.loadPyodide) {
        // If loadPyodide is already defined, return immediately
        return;
    }

    // Create and add the Pyodide script dynamically
    const script = document.createElement("script");
    script.src = "/static/pyodide/pyodide.js"; // Use the local path to pyodide.js
    script.type = "text/javascript";

    // Return a Promise that resolves when the script has loaded
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error("Failed to load Pyodide script"));
        document.head.appendChild(script);
    });
}

export async function initializePyodide() {
    if (pyodideInstance) {
        // Return the existing instance if already loaded
        return pyodideInstance;
    }

    try {
        // Load the Pyodide script if not already loaded
        await loadPyodideScript();

        // Initialize Pyodide using loadPyodide function
        pyodideInstance = await window.loadPyodide({
            indexURL: "/static/pyodide/" // Local path for Pyodide resources
        });

        return pyodideInstance;
    } catch (error) {
        console.error("Failed to initialize Pyodide:", error);
        throw error;
    }
}

export default initializePyodide;
