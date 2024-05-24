import "dotenv/config"
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";

import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import "./db.js";
import { authMiddleware } from "./helpers/authMiddleware.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/api/users", usersRouter);


app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Server error")
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});