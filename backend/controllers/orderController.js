const db = require("../config/db");

exports.getOrders = (req, res) => {
    const sql = "SELECT * FROM ORDERS";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(200).json(result);
    });
};

exports.createOrder = (req, res) => {
    const { total_amount, street, city, pincode } = req.body;

    if (!total_amount || !street || !city || !pincode) {
        return res.status(400).json({ message: "Please provide total_amount, street, city, and pincode." });
    }

    const sql = "INSERT INTO ORDERS (STATUS, TOTAL_AMOUNT, STREET, CITY, PINCODE, ORDER_DATE) VALUES (?, ?, ?, ?, ?, NOW())";
    const values = ["Pending", total_amount, street, city, pincode];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({ orderId: result.insertId, message: "Order placed successfully." });
    });
};