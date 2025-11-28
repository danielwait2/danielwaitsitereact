const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
// CORS configuration - adjust origin for your domain
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : (process.env.NODE_ENV === "production"
      ? ["https://danielwait.com", "https://www.danielwait.com"]
      : ["http://localhost:4000", "http://127.0.0.1:4000", "http://localhost:6000"]);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (process.env.NODE_ENV === "production") {
        // In production, only allow danielwait.com domains
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } else {
        // In development, allow all origins
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/analytics", require("./routes/analytics"));

// Serve static files from React app build
const buildPath = path.join(__dirname, "../client/build");
if (process.env.NODE_ENV === "production" || fs.existsSync(buildPath)) {
  // Serve static files from React build
  app.use(express.static(buildPath));
  
  // Serve React app for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve React app for API routes
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API route not found" });
    }
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  // In development, provide a helpful message
  app.get("/", (req, res) => {
    res.send(`
      <h1>Development Mode</h1>
      <p>Please run the React development server:</p>
      <pre>cd client && npm start</pre>
      <p>Or build the React app:</p>
      <pre>npm run build</pre>
    `);
  });
}

// Initialize database
const db = require("./database");
db.init()
  .then(() => {
    console.log("Database initialized");
    // Listen on all interfaces (0.0.0.0) so it can be accessed via domain
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Accessible at: http://localhost:${PORT}`);
      if (process.env.NODE_ENV === "production") {
        console.log(`Production domain: https://danielwait.com`);
      }
    });
  })
  .catch((err) => {
    console.error("Database initialization error:", err);
    process.exit(1);
  });
