import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";

//create express app and http server
const app = express();
const server = http.createServer(app);

//middleware setup
app.use(express.json({ limit: "4mb" }));
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});

//routes setup
app.use("/api/auth", userRouter);

//database connection
await connectDB();
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server is running on Port:" + port);
});
