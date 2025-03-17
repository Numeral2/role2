const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const makeUrl = "https://hook.eu2.make.com/y94u5xvkf97g5nym3trgz2j2107nuu12"; // Replace with your Make.com URL

  try {
    const response = await axios.post(makeUrl, { text });

    // Log the raw response body to see what you're getting from Make.com
    console.log("Raw response from Make.com:", response.data);

    // Return the summary or success message from Make.com
    return res.json({ summary: response.data.summary || "Sent successfully" });
  } catch (err) {
    console.error("Error sending to Make.com:", err);

    // Log more detailed error response if available
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
    } else {
      console.error("Request error:", err.message);
    }

    return res.status(500).json({ error: "Failed to send text" });
  }
};
