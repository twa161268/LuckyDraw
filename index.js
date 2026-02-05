require("dotenv").config();

const express = require("express");
const { connectDB } = require("./server/db");

const undianRoutes = require("./server/routes/undian.routes");

const path = require("path");


const app = express();
const PORT = 3000;

const errorHandler = require("./middlewares/errorHandler");

// static folder

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/undian", undianRoutes);

//app.use("/api/undian", require("./routes/undian.routes"));

app.use(errorHandler);

app.listen(PORT, () => {

    console.log(`Server jalan di http://localhost:${PORT}`);
});

