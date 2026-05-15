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

exports.getUsers = (req, res) => {
    const sql = "SELECT * FROM USERS";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};

exports.createUser = (req, res) => {
    const { name, email, street, city, pincode } = req.body;

    if (!name || !email || !street || !city || !pincode) {
        return res.status(400).json({ message: "Please provide name, email, street, city, and pincode." });
    }

    getNextId("USERS", "USER_ID", (err, nextId) => {
        if (err) {
            return res.status(500).json(err);
        }

        const sql = "INSERT INTO USERS (USER_ID, NAME, EMAIL, STREET, CITY, PINCODE) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [nextId, name, email, street, city, pincode];

        db.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({ userId: result.insertId || nextId, message: "User created successfully." });
        });
    });
};