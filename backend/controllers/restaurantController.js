const db = require("../config/db");

const getNextId = (table, column, callback) => {
    const sql = `SELECT COALESCE(MAX(${column}), 0) + 1 AS nextId FROM ${table}`;
    db.query(sql, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result[0].nextId);
    });
};

exports.getRestaurants = (req, res) => {
    const sql = "SELECT * FROM RESTAURANT";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};

exports.createRestaurant = (req, res) => {
    const { name, opening_time, closing_time, location, rating } = req.body;

    if (!name || !opening_time || !closing_time || !location || rating == null) {
        return res.status(400).json({ message: "Please provide name, opening_time, closing_time, location, and rating." });
    }

    getNextId("RESTAURANT", "RESTAURANT_ID", (err, nextId) => {
        if (err) {
            return res.status(500).json(err);
        }

        const sql = "INSERT INTO RESTAURANT (RESTAURANT_ID, NAME, OPENING_TIME, CLOSING_TIME, LOCATION, RATING) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [nextId, name, opening_time, closing_time, location, rating];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({ restaurantId: result.insertId || nextId, message: "Restaurant created successfully." });
        });
    });
};