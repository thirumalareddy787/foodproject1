const menuSelect = document.getElementById("menuItem");
const quantityInput = document.getElementById("quantity");
const totalAmountSpan = document.getElementById("totalAmount");
const orderForm = document.getElementById("orderForm");
const orderMessage = document.getElementById("orderMessage");
const orderData = document.getElementById("orderData");

let menuItems = [];

function renderOrders(data) {
    let output = "";

    data.forEach((order) => {
        output += `
            <tr>
                <td>${order.ORDER_ID}</td>
                <td>${order.STATUS}</td>
                <td>${order.TOTAL_AMOUNT}</td>
                <td>${order.STREET}</td>
                <td>${order.CITY}</td>
                <td>${order.PINCODE}</td>
                <td>${order.ORDER_DATE}</td>
            </tr>
        `;
    });

    orderData.innerHTML = output;
}

function loadOrders() {
    fetch("https://foodproject1-uvv4.onrender.com/orders")
        .then((response) => response.json())
        .then(renderOrders)
        .catch((err) => {
            orderMessage.textContent = "Unable to load orders.";
            console.error(err);
        });
}

function loadMenu() {
    fetch("https://foodproject1-uvv4.onrender.com/menu")
        .then((response) => response.json())
        .then((data) => {
            menuItems = data;
            menuSelect.innerHTML = data.map((menu) => {
                return `<option value="${menu.ITEM_ID}" data-price="${menu.PRICE}">${menu.ITEM_NAME} - ₹${menu.PRICE}</option>`;
            }).join("");
            updateTotal();
        })
        .catch((err) => {
            orderMessage.textContent = "Unable to load menu items.";
            console.error(err);
        });
}

function updateTotal() {
    const selectedItem = menuSelect.options[menuSelect.selectedIndex];
    const price = Number(selectedItem?.dataset.price || 0);
    const quantity = Number(quantityInput.value || 1);
    totalAmountSpan.textContent = (price * quantity).toFixed(2);
}

menuSelect.addEventListener("change", updateTotal);
quantityInput.addEventListener("input", updateTotal);

orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedItemId = menuSelect.value;
    const selectedItem = menuItems.find((item) => String(item.ITEM_ID) === String(selectedItemId));
    const quantity = Number(quantityInput.value);
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    if (!selectedItem) {
        orderMessage.textContent = "Please choose a valid menu item.";
        return;
    }

    const totalAmount = selectedItem.PRICE * quantity;

    fetch("https://foodproject1-uvv4.onrender.com/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            total_amount: totalAmount,
            street,
            city,
            pincode
        })
    })
        .then(async (response) => {
            const text = await response.text();
            let body;

            try {
                body = text ? JSON.parse(text) : {};
            } catch (err) {
                throw new Error(`Server returned invalid JSON: ${text}`);
            }

            if (!response.ok) {
                throw new Error(body.message || `Server error ${response.status}`);
            }

            return body;
        })
        .then((body) => {
            orderMessage.textContent = `Order placed successfully. Order ID: ${body.orderId}`;
            orderForm.reset();
            updateTotal();
            loadOrders();
        })
        .catch((error) => {
            orderMessage.textContent = error.message;
            console.error(error);
        });
});

loadMenu();
loadOrders();
