
        // Cart functionality
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Update cart count
        function updateCartCount() {
            const count = cartItems.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }
        
        // Add to cart handler
        function addToCartHandler(name, price, quantity) {
            if(quantity < 1) {
                alert('Please select at least 1 item!');
                return;
            }
            
            // Check if item already exists
            const existingIndex = cartItems.findIndex(item => item.name === name);
            if(existingIndex !== -1) {
                cartItems[existingIndex].quantity += quantity;
            } else {
                cartItems.push({ name, price, quantity });
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
            
            // Show notification
            const notification = document.getElementById('cart-notification');
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 2000);
        }
        
        // For pets
        document.querySelectorAll('.add-to-cart-pet').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.pet-card');
                const name = card.querySelector('.pet-name').innerText;
                const priceText = card.querySelector('.pet-price').innerText.replace(/[^0-9]/g, '');
                const price = parseInt(priceText);
                const qty = parseInt(card.querySelector('.pet-qty').value);
                addToCartHandler(name, price, qty);
            });
        });
        
        // For products
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.closest('.slide');
                const name = card.querySelector('.product-name').innerText;
                const priceText = card.querySelector('.product-price').innerText.replace(/[^0-9]/g, '');
                const price = parseInt(priceText);
                const qty = parseInt(card.querySelector('.product-qty').value);
                addToCartHandler(name, price, qty);
            });
        });
        
        // Cart icon click - redirect to cart page
        document.getElementById('cart-icon').addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
        
        // Product slider functionality
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        
        let currentIndex = 0;
        const slideWidth = slides[0].offsetWidth + 20; // width + margin
        
        function updateSlider() {
            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
        
        prevBtn.addEventListener('click', () => {
            if(currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if(currentIndex < slides.length - 1) {
                currentIndex++;
                updateSlider();
            }
        });
        

        
