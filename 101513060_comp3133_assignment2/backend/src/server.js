import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createHandler } from "graphql-http/lib/use/express";
import multer from "multer";
import { connectDb } from "./config/db.js";
import { seedDatabase } from "./config/seed.js";
import { schema } from "./graphql/schema.js";
import { getUserFromAuthHeader } from "./graphql/auth.js";
import { uploadImageBuffer } from "./config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

// ─── GraphQL endpoint ────────────────────────────────
app.all(
  "/graphql",
  createHandler({
    schema,
    context: (req) => {
      const authHeader = req.headers.authorization || "";
      const authUser = getUserFromAuthHeader(authHeader);
      return { authUser, req };
    }
  })
);

// ─── REST photo upload endpoint ──────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPEG images are allowed"), false);
    }
  }
});

app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    // Verify auth
    const authHeader = req.headers.authorization || "";
    const authUser = getUserFromAuthHeader(authHeader);
    if (!authUser) {
      return res.status(401).json({ error: "Login required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadImageBuffer({
      buffer: req.file.buffer,
      filename: req.file.originalname,
      mimetype: req.file.mimetype
    });

    res.json({ url: result.secure_url || result.url || "" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

// ─── Serve Angular frontend (production) ─────────────
const frontendDist = path.resolve(__dirname, "../../frontend/dist/101513060-comp3133-assignment2/browser");
app.use(express.static(frontendDist));

// Fallback: serve index.html for all non-API routes (Angular routing)
app.get("*", (req, res) => {
  const indexPath = path.join(frontendDist, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If frontend isn't built yet, send a helpful message
      res.status(200).send(
        "Employee Management GraphQL API is running. " +
        "Build the frontend with 'npm run build:frontend' to serve the Angular app."
      );
    }
  });
});

// ─── Start ───────────────────────────────────────────
const port = Number(process.env.PORT || 4000);

await connectDb(process.env.MONGO_URI);
await seedDatabase();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});
