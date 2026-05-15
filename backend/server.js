const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));

const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/users", userRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message || err });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});