const formidable = require("formidable");
const Tesseract = require("tesseract.js");

module.exports = async (req, res) => {
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

    const uploadedFile = files.file; // Assuming the field name is 'file'

    if (!uploadedFile || !uploadedFile.path) {
      return res.status(400).json({ error: "File not found in request" });
    }

    try {
      // Perform OCR on the uploaded file using Tesseract
      let extractedText = "";
      const result = await Tesseract.recognize(uploadedFile.path, "eng", {
        logger: (m) => console.log(m),
      });

      extractedText += result.data.text;

      // Send the extracted text to the next API for Make.com processing
      const makeUrl = "https://role2-9x6u.vercel.app/api/send-to-make"; // The next API endpoint for sending to Make.com
      const response = await axios.post(makeUrl, { text: extractedText });

      return res.json({ summary: response.data.summary || "Sent successfully" });
    } catch (err) {
      console.error("OCR error:", err);
      return res.status(500).json({ error: "Failed to process OCR or send to Make.com" });
    }
  });
};
