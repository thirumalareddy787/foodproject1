const userTableBody = document.getElementById("userData");
const userForm = document.getElementById("userForm");
const userMessage = document.getElementById("userMessage");

function renderUsers(data) {
    let output = "";

    data.forEach((user) => {
        output += `
            <tr>
                <td>${user.USER_ID}</td>
                <td>${user.NAME}</td>
                <td>${user.EMAIL}</td>
                <td>${user.STREET}</td>
                <td>${user.CITY}</td>
                <td>${user.PINCODE}</td>
            </tr>
        `;
    });

    userTableBody.innerHTML = output;
}

function loadUsers() {
    fetch("http://localhost:5000/users")
        .then((response) => response.json())
        .then(renderUsers)
        .catch((err) => {
            userMessage.textContent = "Unable to load users.";
            console.error(err);
        });
}

userForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        street: document.getElementById("street").value.trim(),
        city: document.getElementById("city").value.trim(),
        pincode: document.getElementById("pincode").value.trim()
    };

    fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(async (response) => {
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message || "Unable to create user.");
            }
            return body;
        })
        .then((body) => {
            userMessage.textContent = body.message;
            userForm.reset();
            loadUsers();
        })
        .catch((error) => {
            userMessage.textContent = error.message;
            console.error(error);
        });
});

loadUsers();