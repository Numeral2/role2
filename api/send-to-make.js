const axios = require("axios");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const makeUrl = "https://hook.eu2.make.com/y94u5xvkf97g5nym3trgz2j2107nuu12";

  try {
    const response = await axios.post(makeUrl, { text });
    return res.json({ summary: response.data.summary || "Sent successfully" });
  } catch (err) {
    console.error("Error sending to Make.com:", err);
    return res.status(500).json({ error: "Failed to send text" });
  }
};
