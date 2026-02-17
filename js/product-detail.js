// Product Detail Page JavaScript
class ProductDetailPage {
    constructor() {
        this.product = null;
        this.selectedColor = null;
        this.selectedSize = null;
        this.quantity = 1;
        this.currentImageIndex = 0;
        this.images = [
            'https://picsum.photos/seed/product1/600/600',
            'https://picsum.photos/seed/product2/600/600',
            'https://picsum.photos/seed/product3/600/600',
            'https://picsum.photos/seed/product4/600/600'
        ];
        
        this.init();
    }

    init() {
        this.loadProductData();
        this.setupEventListeners();
        this.updateCartCount();
    }

    loadProductData() {
        // In a real application, this would fetch data based on URL parameters
        this.product = {
            id: 1,
            title: "Premium Wireless Headphones with Noise Cancellation",
            price: 299.99,
            originalPrice: 399.99,
            description: "Experience premium sound quality with our wireless headphones featuring advanced noise cancellation technology. Designed for comfort during extended use, these headphones deliver crystal-clear audio with deep bass and crisp highs.",
            category: "Electronics",
            rating: 4.5,
            reviews: 234,
            inStock: true,
            badge: "Best Seller",
            features: [
                "Active Noise Cancellation",
                "30-hour battery life",
                "Bluetooth 5.0 connectivity",
                "Premium leather cushions",
                "Foldable design",
                "Built-in microphone"
            ]
        };

        this.updateProductDisplay();
    }

    updateProductDisplay() {
        document.getElementById('productTitle').textContent = this.product.title;
        document.getElementById('currentPrice').textContent = `$${this.product.price}`;
        document.getElementById('originalPrice').textContent = `$${this.product.originalPrice}`;
        document.getElementById('productDescription').textContent = this.product.description;
        document.getElementById('breadcrumbCategory').textContent = this.product.category;
        document.getElementById('breadcrumbName').textContent = this.product.title;
    }

    setupEventListeners() {
        // Cart functionality
        const cartBtn = document.querySelector('.cart-btn');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        
        cartBtn?.addEventListener('click', () => this.openCart());
        closeCart?.addEventListener('click', () => this.closeCart());
        overlay?.addEventListener('click', () => this.closeCart());

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Quantity input validation
        const quantityInput = document.getElementById('quantityInput');
        quantityInput?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
            if (value > 10) e.target.value = 10;
            this.quantity = value;
        });
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    handleSearch(query) {
        if (query.length >= 2) {
            // Redirect to products page with search query
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
    }

    openCart() {
        this.showNotification('Cart feature coming soon!');
    }

    closeCart() {
        // Implementation for closing cart
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for inline event handlers
function changeImage(index) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && productDetailPage.images[index]) {
        mainImage.src = productDetailPage.images[index];
        productDetailPage.currentImageIndex = index;
        
        // Update active thumbnail
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
}

function selectColor(element) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
    
    // Store selected color
    const color = window.getComputedStyle(element).backgroundColor;
    productDetailPage.selectedColor = color;
}

function selectSize(element) {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
    
    // Store selected size
    productDetailPage.selectedSize = element.textContent;
}

function updateQuantity(change) {
    const quantityInput = document.getElementById('quantityInput');
    const currentQuantity = parseInt(quantityInput.value) || 1;
    const newQuantity = Math.max(1, Math.min(10, currentQuantity + change));
    
    quantityInput.value = newQuantity;
    productDetailPage.quantity = newQuantity;
}

function addToCart() {
    if (!productDetailPage.selectedColor) {
        productDetailPage.showNotification('Please select a color');
        return;
    }

    const cartItem = {
        id: productDetailPage.product.id,
        title: productDetailPage.product.title,
        price: productDetailPage.product.price,
        image: productDetailPage.images[0],
        quantity: productDetailPage.quantity,
        color: productDetailPage.selectedColor,
        size: productDetailPage.selectedSize
    };

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );

    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        cart.push(cartItem);
    }

    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    productDetailPage.updateCartCount();
    productDetailPage.showNotification(`Added ${cartItem.quantity} item(s) to cart!`);
    
    // Animate button
    event.target.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
        event.target.style.animation = '';
    }, 300);
}

function buyNow() {
    if (!productDetailPage.selectedColor) {
        productDetailPage.showNotification('Please select a color');
        return;
    }

    // Add to cart and proceed to checkout
    addToCart();
    window.location.href = 'checkout.html';
}

function toggleWishlist(button) {
    button.classList.toggle('active');
    const isActive = button.classList.contains('active');
    
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = productDetailPage.product.id;
    
    if (isActive) {
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
        }
        productDetailPage.showNotification('Added to wishlist!');
    } else {
        const index = wishlist.indexOf(productId);
        if (index > -1) {
            wishlist.splice(index, 1);
        }
        productDetailPage.showNotification('Removed from wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function showTab(tabName) {
    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Initialize the product detail page
const productDetailPage = new ProductDetailPage();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Check wishlist status on page load
window.addEventListener('load', () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const productId = productDetailPage.product.id;
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    if (wishlist.includes(productId) && wishlistBtn) {
        wishlistBtn.classList.add('active');
    }
});
