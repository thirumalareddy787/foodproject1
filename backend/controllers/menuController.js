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

exports.getMenu = (req, res) => {
    const sql = "SELECT * FROM MENU";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};

exports.createMenu = (req, res) => {
    const { item_name, price, category, restaurant_id } = req.body;

    if (!item_name || price == null || !category || !restaurant_id) {
        return res.status(400).json({ message: "Please provide item_name, price, category, and restaurant_id." });
    }

    getNextId("MENU", "ITEM_ID", (err, nextId) => {
        if (err) {
            return res.status(500).json(err);
        }

        const sql = "INSERT INTO MENU (ITEM_ID, ITEM_NAME, PRICE, CATEGORY, RESTAURANT_ID) VALUES (?, ?, ?, ?, ?)";
        const values = [nextId, item_name, price, category, restaurant_id];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({ itemId: result.insertId || nextId, message: "Menu item created successfully." });
        });
    });
};