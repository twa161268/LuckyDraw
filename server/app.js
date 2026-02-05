require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/undian", require("./routes/undian.routes"));

app.listen(3000, () =>
    console.log("🔥 Undian app running at http://localhost:3000")
);