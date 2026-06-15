const API_URL = "https://aovpkpo1a3.execute-api.ap-south-1.amazonaws.com/prod/order";

// Load cart
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Render Cart
function renderCart() {

```
const cartContent = document.getElementById("cart-content");
const cartSummary = document.getElementById("cart-summary");

if (cartItems.length === 0) {

    cartContent.innerHTML = `
        <div class="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add pets to continue shopping.</p>
        </div>
    `;

    cartSummary.style.display = "none";
    return;
}

let html = `
    <table class="cart-table">
        <thead>
            <tr>
                <th>Pet</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
`;

let subtotal = 0;

cartItems.forEach((item, index) => {

    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    html += `
        <tr>
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                ${item.quantity}
                <button onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
            </td>
            <td>₹${itemSubtotal}</td>
            <td>
                <button onclick="removeItem(${index})">
                    Remove
                </button>
            </td>
        </tr>
    `;
});

html += "</tbody></table>";

cartContent.innerHTML = html;

updateCartSummary(subtotal);

cartSummary.style.display = "block";
```

}

// Update Summary
function updateCartSummary(subtotal) {

```
const shipping = 50;
const tax = subtotal * 0.18;
const total = subtotal + shipping + tax;

document.getElementById("subtotal").innerText =
    "₹" + subtotal.toFixed(2);

document.getElementById("shipping").innerText =
    "₹" + shipping.toFixed(2);

document.getElementById("tax").innerText =
    "₹" + tax.toFixed(2);

document.getElementById("total").innerText =
    "₹" + total.toFixed(2);
```

}

// Quantity Update
function updateQuantity(index, quantity) {

```
if (quantity < 1) return;

cartItems[index].quantity = quantity;

localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems)
);

renderCart();
```

}

// Remove Item
function removeItem(index) {

```
cartItems.splice(index, 1);

localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems)
);

renderCart();
```

}

// User Display
function updateUserInfoDisplay() {

```
const userName =
    document.getElementById("userName").value.trim();

const userAddress =
    document.getElementById("userAddress").value.trim();

const userPhone =
    document.getElementById("userPhone").value.trim();

const display =
    document.getElementById("userInfoDisplay");

if (userName && userAddress && userPhone) {

    display.style.display = "block";

    document.getElementById("displayName").innerText =
        userName;

    document.getElementById("displayAddress").innerText =
        userAddress;

    document.getElementById("displayPhone").innerText =
        userPhone;
}
```

}

// Place Order
async function placeOrder() {

```
const userName =
    document.getElementById("userName").value.trim();

const userAddress =
    document.getElementById("userAddress").value.trim();

const userPhone =
    document.getElementById("userPhone").value.trim();

if (!userName || !userAddress || !userPhone) {

    alert("Please fill all details");
    return;
}

if (cartItems.length === 0) {

    alert("Cart is empty");
    return;
}

const subtotal = parseFloat(
    document.getElementById("subtotal")
    .innerText.replace("₹", "")
);

const tax = parseFloat(
    document.getElementById("tax")
    .innerText.replace("₹", "")
);

const total = parseFloat(
    document.getElementById("total")
    .innerText.replace("₹", "")
);

const orderData = {

    customerName: userName,
    address: userAddress,
    phone: userPhone,

    cartItems: cartItems,

    subtotal: subtotal,
    tax: tax,
    total: total
};

try {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(orderData)
    });

    const result =
        await response.json();

    if (!response.ok) {

        throw new Error(
            result.message || "Order Failed"
        );
    }

    document.getElementById("orderId")
        .innerText =
        result.orderId;

    document.getElementById("customerName")
        .innerText =
        userName;

    document.getElementById("customerAddress")
        .innerText =
        userAddress;

    document.getElementById("orderTotal")
        .innerText =
        "₹" + total;

    document.getElementById(
        "orderNotification"
    ).style.display = "flex";

    localStorage.removeItem(
        "cartItems"
    );

    cartItems = [];

    renderCart();

} catch (error) {

    console.error(error);

    alert(
        "Order Failed : " + error.message
    );
}
```

}

// Page Load
document.addEventListener(
"DOMContentLoaded",
function () {

```
    renderCart();

    const inputs =
        document.querySelectorAll(
            "#userInfoForm input"
        );

    inputs.forEach(input => {

        input.addEventListener(
            "input",
            updateUserInfoDisplay
        );
    });

    document
        .getElementById("checkout-btn")
        .addEventListener(
            "click",
            placeOrder
        );
}
```

);

window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
