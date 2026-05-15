const menuTableBody = document.getElementById("menuData");
const menuForm = document.getElementById("menuForm");
const menuMessage = document.getElementById("menuMessage");

function renderMenu(data) {
    let output = "";

    data.forEach((menu) => {
        output += `
            <tr>
                <td>${menu.ITEM_ID}</td>
                <td>${menu.ITEM_NAME}</td>
                <td>${menu.PRICE}</td>
                <td>${menu.CATEGORY}</td>
                <td>${menu.RESTAURANT_ID}</td>
            </tr>
        `;
    });

    menuTableBody.innerHTML = output;
}

function loadMenu() {
    fetch("http://localhost:5000/menu")
        .then((response) => response.json())
        .then(renderMenu)
        .catch((err) => {
            menuMessage.textContent = "Unable to load menu items.";
            console.error(err);
        });
}

menuForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
        item_name: document.getElementById("item_name").value.trim(),
        price: Number(document.getElementById("price").value),
        category: document.getElementById("category").value.trim(),
        restaurant_id: Number(document.getElementById("restaurant_id").value)
    };

    fetch("http://localhost:5000/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(async (response) => {
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message || "Unable to create menu item.");
            }
            return body;
        })
        .then((body) => {
            menuMessage.textContent = body.message;
            menuForm.reset();
            loadMenu();
        })
        .catch((error) => {
            menuMessage.textContent = error.message;
            console.error(error);
        });
});

loadMenu();