import express from "express";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import examRoutes from "./routes/examRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import { exec } from "child_process";
import fs from "fs";
import { writeFileSync } from "fs";
import path from "path";
import cors from "cors";
import crypto from "crypto";
import os from "os";

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 5000;

// to parse req body
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    origin: [
      "https://ai-proctored-system.vercel.app",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.post("/api/run-python", (req, res) => {
  const { code } = req.body; // Get Python code from request body
  const filename = path.join(os.tmpdir(), `script_${crypto.randomUUID()}.py`);
  writeFileSync(filename, code); // Write code to unique file

  exec(`python ${filename}`, (error, stdout, stderr) => {
    fs.unlink(filename, () => {}); // Cleanup
    if (error) {
      res.send(`Error is: ${stderr}`); // Send error message if any
    } else {
      res.send(stdout); // Send output of the Python script
    }
  });
});

app.post("/api/run-javascript", (req, res) => {
  const { code } = req.body; // Get JavaScript code from request body
  const filename = path.join(os.tmpdir(), `script_${crypto.randomUUID()}.js`);
  writeFileSync(filename, code); // Write code to unique file

  exec(`node ${filename}`, (error, stdout, stderr) => {
    fs.unlink(filename, () => {}); // Cleanup
    if (error) {
      res.send(`Error: ${stderr}`); // Send error message if any
    } else {
      res.send(stdout); // Send output of the JavaScript code
    }
  });
});

app.post("/api/run-java", (req, res) => {
  const { code } = req.body; // Get Java code from request body
  const dir = path.join(os.tmpdir(), `temp_${crypto.randomUUID()}`);
  fs.mkdirSync(dir);
  const filepath = path.join(dir, "Main.java");
  writeFileSync(filepath, code); // Write code to Main.java inside unique directory

  exec(`javac ${filepath} && java -cp ${dir} Main`, (error, stdout, stderr) => {
    fs.rm(dir, { recursive: true, force: true }, () => {}); // Cleanup
    if (error) {
      res.send(`Error: ${stderr}`); // Send error message if any
    } else {
      res.send(stdout); // Send output of the Java program
    }
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/users", examRoutes);
app.use("/api/users", resultRoutes);
app.use("/api/coding", codingRoutes);

// we we are deploying this in production
// make frontend build then
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  // we making front build folder static to serve from this app
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // if we get an routes that are not define by us we show then index html file
  // every enpoint that is not api/users go to this index file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("<h1>server is running </h1>");
  });
}

// Error handling middleware - must be after all routes
app.use(notFound);
app.use(errorHandler);

// Server
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});

// Todos:
// -**POST /api/users**- Register a users
// -**POST /api/users/auth**- Authenticate a user and get token
// -**POST /api/users/logout**- logou user and clear cookie
// -**GET /api/users/profile**- Get user Profile
// -**PUT /api/users/profile**- Update user Profile
