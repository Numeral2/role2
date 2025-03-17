const Tesseract = require("tesseract.js");
const formidable = require("formidable");

module.exports = async (req, res) => {
  // Set CORS headers to allow requests from any domain (you can restrict this later if needed)
  res.setHeader("Access-Control-Allow-Origin", "https://role2-fu9l.vercel.app/"); // Replace "*" with your frontend domain if you want to restrict access
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS requests for CORS pre-flight check
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests for file upload
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp"; // Vercel only allows writing to /tmp
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Failed to process form" });
    }

    const filesArray = Object.values(files);
    if (filesArray.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      let extractedText = "";
      for (const file of filesArray) {
        const result = await Tesseract.recognize(file.path, "eng", {
          logger: (m) => console.log(m),
        });
        extractedText += result.data.text + "\n\n";
      }

      return res.json({ extracted_text: extractedText });
    } catch (err) {
      console.error("OCR processing error:", err);
      return res.status(500).json({ error: "Error processing files" });
    }
  });
};
