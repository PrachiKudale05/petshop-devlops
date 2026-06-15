// Cart page functionality

// Get cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];


// Render cart items
function renderCart() {
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
        if (cartSummary) cartSummary.style.display = 'none';
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
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${(subtotal + shipping + tax).toFixed(2)}`;
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
            const loggedInUser = localStorage.getItem('loggedInUser');
            if(!loggedInUser) {
                alert('Please login to proceed with checkout');
                window.location.href = 'login.html';
                return;
            }
            
            if(cartItems.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Calculate order total
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 50;
            const tax = subtotal * 0.18;
            const total = subtotal + shipping + tax;
            
            // Create order summary with images
            let orderSummary = 'Order Summary:\n\n';
            cartItems.forEach(item => {
                orderSummary += `🐾 ${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
            });
            orderSummary += `\nSubtotal: ₹${subtotal}`;
            orderSummary += `\nShipping: ₹${shipping}`;
            orderSummary += `\nTax: ₹${tax.toFixed(2)}`;
            orderSummary += `\nTotal: ₹${total.toFixed(2)}`;
            
            if(confirm(`${orderSummary}\n\nConfirm order?`)) {
                // Save order to localStorage (for order history)
                const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
                const order = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString(),
                    items: [...cartItems],
                    total: total.toFixed(2),
                    status: 'confirmed'
                };
                orders.push(order);
                localStorage.setItem('userOrders', JSON.stringify(orders));
                
                alert('🎉 Order placed successfully! Thank you for your purchase.\n\nYour order will be delivered within 3-5 business days.');
                localStorage.removeItem('cartItems');
                cartItems = [];
                renderCart();
                
                // Redirect to main page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'pet_shop.html';
                }, 2000);
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
    return imageMap[itemName] || `https://placehold.co/80x80/4a69bd/ffffff?text=${itemName.split(' ')[0]}`;
}

// Function to check if item is a pet
function isPet(itemName) {
    const pets = ["German Shepherd", "Siberian Husky", "Labrador", "Persian Cat", "Ragdoll", "American Shorthair"];
    return pets.includes(itemName);
}
// Render cart items
function renderCart() {
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
        if (cartSummary) cartSummary.style.display = 'none';
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
        
        cartHTML += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="https://placehold.co/80x80/4a69bd/ffffff?text=${item.name.split(' ')[0]}" alt="${item.name}" class="cart-item-image">
                        <span>${item.name}</span>
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
                <td>₹${itemSubtotal}</td>
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
    
    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('shipping').textContent = `₹${shipping}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${(subtotal + shipping + tax).toFixed(2)}`;
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if(newQuantity < 1) return;
    
    cartItems[index].quantity = newQuantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// Remove item from cart
function removeItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

// Show user information in order summary
function updateUserInfoDisplay() {
    const userName = document.getElementById('userName').value.trim();
    const userAddress = document.getElementById('userAddress').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    
    const userInfoDisplay = document.getElementById('userInfoDisplay');
    
    if (userName && userAddress && userPhone) {
        userInfoDisplay.style.display = 'block';
        document.getElementById('displayName').textContent = userName;
        document.getElementById('displayAddress').textContent = userAddress;
        document.getElementById('displayPhone').textContent = userPhone;
    } else {
        userInfoDisplay.style.display = 'none';
    }
}

// Show order confirmation
function showOrderConfirmation(userName, userAddress, total) {
    const notification = document.getElementById('orderNotification');
    const orderId = 'PW' + Date.now();
    
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('customerName').textContent = userName;
    document.getElementById('customerAddress').textContent = userAddress;
    document.getElementById('orderTotal').textContent = `₹${total}`;
    
    notification.style.display = 'block';
    
    // Auto-close after 5 seconds and redirect
    setTimeout(() => {
        notification.style.display = 'none';
        localStorage.removeItem('cartItems');
        window.location.href = 'pet_shop.html';
    }, 5000);
}

// Checkout functionality
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const userInputs = document.querySelectorAll('#userInfoForm input');
    
    // Real-time user info updates
    userInputs.forEach(input => {
        input.addEventListener('input', updateUserInfoDisplay);
    });
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const userName = document.getElementById('userName').value.trim();
            const userAddress = document.getElementById('userAddress').value.trim();
            const userPhone = document.getElementById('userPhone').value.trim();
            
            // Validate user information
            if (!userName || !userAddress || !userPhone) {
                alert('Please fill in all your information before checkout');
                return;
            }
            
            if(cartItems.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Calculate order total
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 50;
            const tax = subtotal * 0.18;
            const total = subtotal + shipping + tax;
            
            // Create order summary
            let orderSummary = '*****Order Summary:*****';
         
	    orderSummary += `\n\nCustomer: ${userName}`;
            orderSummary += `\nAddress: ${userAddress}`;
            orderSummary += `\nPhone: ${userPhone}`;

	    cartItems.forEach(item => {
                orderSummary += `\n\n${item.name} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
            });

            orderSummary += `\nSubtotal: ₹${subtotal}`;
            orderSummary += `\nShipping: ₹${shipping}`;
            orderSummary += `\nTax: ₹${tax.toFixed(2)}`;
            orderSummary += `\nTotal: ₹${total.toFixed(2)}`;
            
            
            if(confirm(`${orderSummary}\n\nConfirm order?`)) {
                // Save order to localStorage
                const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
                const order = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString(),
                    items: [...cartItems],
                    customer: {
                        name: userName,
                        address: userAddress,
                        phone: userPhone
                    },
                    total: total.toFixed(2),
                    status: 'confirmed'
                };
                orders.push(order);
                localStorage.setItem('userOrders', JSON.stringify(orders));
                
                // Show order confirmation with user details
                showOrderConfirmation(userName, userAddress, total.toFixed(2));
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

async function placeOrder() {

    const orderData = {
        customerName: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        cartItems: JSON.parse(localStorage.getItem("cart")) || []
    };

    try {

        const response = await fetch(
            "https://YOUR_API_ID.execute-api.ap-south-1.amazonaws.com/prod/order",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            }
        );

        const result = await response.json();

        alert(result.message);

        localStorage.removeItem("cart");

    } catch (error) {

        console.error(error);
        alert("Order failed");

    }
}
