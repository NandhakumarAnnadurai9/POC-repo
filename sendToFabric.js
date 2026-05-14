const axios = require("axios");

// Replace these with Fabric details
const FABRIC_URL = "<YOUR_EVENTSTREAM_INPUT_URL>";
const FABRIC_KEY = "<YOUR_SHARED_ACCESS_KEY>";

// Sample event data
const event = {
    id: 1,
    device: "sensor-01",
    status: "active",
    message: "Hello from Node.js"
};

async function sendEvent() {
    try {
        const response = await axios.post(
            FABRIC_URL,
            event,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `SharedAccessSignature ${FABRIC_KEY}`
                }
            }
        );

        console.log("Event sent!", response.status, response.statusText);

    } catch (error) {
        console.error("Error sending to Eventstream:", error.response?.data || error.message);
    }
}

sendEvent();
