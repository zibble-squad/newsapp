const express = require("express");
const connectDB = require("./config/db");
const formData = require("express-form-data");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const newsRoutes = require("./routes/newsRoute");
const wishListRoutes = require("./routes/wishListRoute");

const morgan = require("morgan");
connectDB();
const app = express();
// Remove Cors Origin Policy Error !
var cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.options("*", cors());

if (process.env.NODE_ENV === "development") {
     app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(formData.parse());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/wishList", wishListRoutes);

// Defined at last of code

app.get("*", function (req, res) {
     res.status(404).json({
          msg: "Api path not found",
     });
});

app.listen(
     PORT,
     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);