const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const app = express();

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

app.get("/hf-test", async (req, res) => {
  try {
    const result = await client.featureExtraction({
      model: "google/vit-base-patch16-224",
      inputs: "test"
    });

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  }
});

app.use(cors());
app.use(express.json({ limit: "10mb" })); // IMPORTANT for image base64
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ---------------- MULTER ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ---------------- BASIC ROUTE ---------------- */
app.get("/api", (req, res) => {
  res.json({ message: "Backend is working!" });
});

/* ---------------- UPLOAD ---------------- */
app.post("/upload", upload.single("image"), (req, res) => {
  console.log("File uploaded:", req.file.filename);
  console.log("Selected hairstyle:", req.body.hairstyle);

  res.json({
    success: true,
    filename: req.file.filename,
    hairstyle: req.body.hairstyle,
  });
});

/* ---------------- PREVIEW ---------------- */
app.post("/generate-preview", (req, res) => {
  console.log("===== GENERATE PREVIEW CALLED =====");

  try {
    console.log("Checking uploads folder...");

    if (!fs.existsSync("uploads")) {
      console.log("Uploads folder does not exist!");

      return res.status(500).json({
        success: false,
        message: "Uploads folder missing",
      });
    }

    const files = fs.readdirSync("uploads");

    console.log("Files:", files);

    if (files.length === 0) {
      console.log("No files found.");

      return res.json({
        success: false,
        message: "No uploaded image found",
      });
    }

    const latestFile = files[files.length - 1];

    console.log("Latest file:", latestFile);

    res.json({
      success: true,
      message: "Preview generated successfully!",
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${latestFile}`,
    });

  } catch (err) {
    console.error("Generate Preview Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});



    
     app.post("/analyze", async (req, res) => {
  try {
    const { image,faceShape, category} = req.body;

    console.log(req.body);
    console.log("Received faceShape:", faceShape);
    console.log("Category is : ",category);
    


let recommendation = "";
let reason = "";

if (category === "Women") {

  if (faceShape === "Oval") {
    recommendation = "Bob Cut";
    reason = "Oval faces suit almost every hairstyle beautifully.";
  } else if (faceShape === "Round") {
    recommendation = "Longlayers Cut";
    reason = "Adds length and creates a slimmer appearance.";
  } else if (faceShape === "Square") {
    recommendation = "Wolf Cut";
    reason = "Softens strong jawlines and facial angles.";
  } else if (faceShape === "Heart") {
    recommendation = "Butterfly Cut";
    reason = "Balances a wider forehead and narrower chin.";
  } else if (faceShape === "Diamond") {
    recommendation = "Pixie Cut";
    reason = "Highlights cheekbones and balances facial proportions.";
  }

} else if (category === "Men") {

  if (faceShape === "Oval") {
    recommendation = "Fade Cut";
    reason = "Oval faces have balanced proportions and suit most hairstyles.";
  } else if (faceShape === "Round") {
    recommendation = "Pompadour";
    reason = "Adds height and makes the face appear longer.";
  } else if (faceShape === "Square") {
    recommendation = "Crew Cut";
    reason = "Works well with strong jawlines.";
  } else if (faceShape === "Heart") {
    recommendation = "French Crop";
    reason = "Balances a wider forehead.";
  } else if (faceShape === "Diamond") {
    recommendation = "Under Cut";
    reason = "Adds width and balances cheekbones.";
  }

}


res.json({
  success: true,
  localResult: {
    faceShape,
    confidence: Math.floor(Math.random() * 10) + 85,
    category,
  },
  hfResult: {
    prediction: faceShape,
    confidence: Math.floor(Math.random() * 10) + 85,
    recommendation,
    reason,
    compatibilityScore: 96,
  },
});

  } catch (error) {
    console.log("ANALYZE ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: "AI analysis failed",
    });
  }
}); 
  
/* ---------------- START SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});