import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

//create express app and http server
const app = express();
const server = http.createServer(app);

//middleware setup
app.use(express.json({ limit: "4mb" }));
app.use("/api/status", (req, res) => {
  res.send("Server is Live");
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Server is running on Port:" + port);
});
