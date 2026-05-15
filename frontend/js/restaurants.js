const restaurantTableBody = document.getElementById("restaurantData");
const restaurantForm = document.getElementById("restaurantForm");
const restaurantMessage = document.getElementById("restaurantMessage");

function renderRestaurants(data) {
    let output = "";

    data.forEach((restaurant) => {
        output += `
            <tr>
                <td>${restaurant.RESTAURANT_ID}</td>
                <td>${restaurant.NAME}</td>
                <td>${restaurant.OPENING_TIME}</td>
                <td>${restaurant.CLOSING_TIME}</td>
                <td>${restaurant.LOCATION}</td>
                <td>${restaurant.RATING}</td>
            </tr>
        `;
    });

    restaurantTableBody.innerHTML = output;
}

function loadRestaurants() {
    fetch("https://foodproject1-uvv4.onrender.com/restaurants")
        .then((response) => response.json())
        .then(renderRestaurants)
        .catch((err) => {
            restaurantMessage.textContent = "Unable to load restaurants.";
            console.error(err);
        });
}

restaurantForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        opening_time: document.getElementById("opening_time").value,
        closing_time: document.getElementById("closing_time").value,
        location: document.getElementById("location").value.trim(),
        rating: Number(document.getElementById("rating").value)
    };

    fetch("https://foodproject1-uvv4.onrender.com/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(async (response) => {
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message || "Unable to create restaurant.");
            }
            return body;
        })
        .then((body) => {
            restaurantMessage.textContent = body.message;
            restaurantForm.reset();
            loadRestaurants();
        })
        .catch((error) => {
            restaurantMessage.textContent = error.message;
            console.error(error);
        });
});

loadRestaurants();
