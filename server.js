const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const bodyParser = require("body-parser");

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/program", require("./routes/program"));

app.get("*", (req, res) => {
  console.log("test");
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => console.log(`server running on port:${port}`));
