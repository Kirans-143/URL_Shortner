const mongoose = require("mongoose");
const express = require("express");
const app = express();
const urlRoute = require("./routes/url.router");
const URL = require("./models/url.model");
const { connectMongoDB } = require("./config/db.config");

const PORT = 8001;

connectMongoDB("mongodb://localhost:27017/short-url")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.log("Error while connecting");
  });

app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log("Server is up and running on " + PORT);
});
