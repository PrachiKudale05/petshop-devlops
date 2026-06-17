console.log("cart.js loaded");
const API_URL = "https://aovpkpo1a3.execute-api.ap-south-1.amazonaws.com/prod/order";

const imageMap = {
    "Cat Food": "images/Cat Food.jpg",
    "Cat Toy": "images/Cat Toy.jpg",
    "Dog Food": "images/Dog Food.jpeg",
    "Dog Leash": "images/Dog Leash.jpg",
    "Dog Toy": "images/Dog Toy.jpg",
    "German Shepherd": "images/German_Shepherd.jpeg",
    "Pet Boarding": "images/Pet Boarding.jpg",
    "Pet Grooming": "images/Pet Grooming.jpg",
    "Ragdoll": "images/Ragdoll.jpg",
    "Siberian Husky": "images/Siberian Huskies.jpeg",
    "Veterinary Care": "images/Veterinary Care.jpg",
    "American Shorthair": "images/american_shorthair.jpg",
    "Labrador": "images/labrador.jpg",
    "Persian Cat": "images/persian cat.jpg",
    "Pets World": "images/petsworld.jpeg"
};


// Cart page functionality

// Get cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


// Render cart items
function renderCart() {
      console.log("renderCart running");
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    
    if(cartItems.length === 0) {
    cartContent.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to see them here</p>
        </div>
    `;

    if (cartSummary) {
        cartSummary.style.display = 'none';
    }

    return;
}
    
    let cartHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
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
        const itemImage = getImagePath(item.name);
        const isPetItem = isPet(item.name);
        const itemType = isPetItem ? 'pet' : 'product';
        
        cartHTML += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${itemImage}" alt="${item.name}" class="cart-item-image" 
                             onerror="this.src='https://placehold.co/80x80/4a69bd/ffffff?text=${item.name.split(' ')[0]}'">
                        <div>
                            <div style="display: flex; align-items: center;">
                                <strong>${item.name}</strong>
                                <span class="item-type ${itemType}">${itemType}</span>
                            </div>
                            <small style="color: #666;">${isPetItem ? 'Live Pet' : 'Pet Product'}</small>
                        </div>
                    </div>
                </td>
                <td>₹${item.price}</td>
                <td>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td style="font-weight: 600; color: #059669;">₹${itemSubtotal}</td>
                <td><button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i> Remove</button></td>
            </tr>
        `;
    });
    
    cartHTML += `</tbody></table>`;
    
    cartContent.innerHTML = cartHTML;    
    
    // Calculate and display summary
    updateCartSummary(subtotal);
    
    if (cartSummary) cartSummary.style.display = 'block';
}

// Update cart summary
function updateCartSummary(subtotal) {
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = "₹0";
    document.getElementById('shipping').textContent = "₹0";
    document.getElementById('tax').textContent = "₹0";
    document.getElementById('total').textContent = "₹0";
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if(newQuantity < 1) return;
    
    cartItems[index].quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
    
    // Update cart count on main page if possible
    if (window.opener) {
        window.opener.updateCartCount();
    }
}

// Remove item from cart
function removeItem(index) {
    if(confirm('Are you sure you want to remove this item from your cart?')) {
        cartItems.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
        
        // Update cart count on main page if possible
        if (window.opener) {
            window.opener.updateCartCount();
        }
    }
}

// Clear entire cart
function clearCart() {
    if(cartItems.length === 0) {
        alert('Your cart is already empty!');
        return;
    }
    
    if(confirm('Are you sure you want to clear your entire cart?')) {
        cartItems = [];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        renderCart();
        
        // Update cart count on main page if possible
        if (window.opener) {
            window.opener.updateCartCount();
        }
        
        alert('Cart cleared successfully!');
    }
}

// Checkout functionality
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn) {

        checkoutBtn.addEventListener('click', () => {

            const customerName = document.getElementById("userName").value.trim();
            const phone = document.getElementById("userPhone").value.trim();
            const address = document.getElementById("userAddress").value.trim();

            if (!customerName || !phone || !address) {
                alert("Please fill all customer details");
                return;
            }

            if (cartItems.length === 0) {
                alert("Your cart is empty");
                return;
            }

            // Calculate totals
            const subtotal = cartItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            );

            const shipping = 50;
            const tax = subtotal * 0.18;
            const total = subtotal + shipping + tax;

            // Order summary
            let orderSummary = "Order Summary\n\n";

            cartItems.forEach(item => {
                orderSummary += `${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
            });

            orderSummary += `\nSubtotal: ₹${subtotal}`;
            orderSummary += `\nShipping: ₹${shipping}`;
            orderSummary += `\nTax: ₹${tax.toFixed(2)}`;
            orderSummary += `\nTotal: ₹${total.toFixed(2)}`;

            if (confirm(orderSummary + "\n\nConfirm Order?")) {

                fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        customerName: customerName,
                        phone: phone,
                        address: address,
                        cartItems: cartItems,
                        total: total.toFixed(2)
                    })
                })
                .then(response => response.json())
                .then(data => {

                    console.log("Success:", data);
                    
                    // ADD audio mp3 file BLOCK
                    if (data.audioUrl) {
                        const audio = new Audio(data.audioUrl);
                        audio.play();
                    }

                    // Save order locally
                    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];

                    orders.push({
                        id: data.orderId || Date.now(),
                        date: new Date().toLocaleDateString(),
                        customerName,
                        phone,
                        address,
                        items: [...cartItems],
                        total: total.toFixed(2),
                        status: "confirmed"
                    });

                    localStorage.setItem('userOrders', JSON.stringify(orders));

                    alert("🎉 Order placed successfully!");

                    localStorage.removeItem('cartItems');
                    cartItems = [];

                    renderCart();

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);

                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Failed to send order to API");
                });

            }

        });

    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    initializeCheckout();
});

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;

// Function to get image path for an item
function getImagePath(itemName) {
    if (imageMap[itemName]) {
        return imageMap[itemName];
    }

    return `https://placehold.co/80x80/4a69bd/ffffff?text=${itemName.split(' ')[0]}`;
}

// Function to check if item is a pet
function isPet(itemName) {
    const pets = ["German Shepherd", "Siberian Husky", "Labrador", "Persian Cat", "Ragdoll", "American Shorthair"];
    return pets.includes(itemName);
}
