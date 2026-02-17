// Products Page JavaScript
class ProductsPage {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.currentSort = 'featured';
        this.cart = [];
        this.filters = {
            categories: [],
            priceRange: { min: 0, max: Infinity },
            rating: 0,
            inStock: true,
            onSale: false
        };
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.applyFilters();
    }

    loadCartFromStorage() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadProducts() {
        // Extended product catalog for the products page
        this.allProducts = [
            {
                id: 1,
                title: "Premium Wireless Headphones with Noise Cancellation",
                price: 299.99,
                originalPrice: 399.99,
                image: "images/Wireless Headphone/WirelessHeadphone-1.png",
                rating: 4.5,
                reviews: 234,
                badge: "Best Seller",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 2,
                title: "Smart Fitness Watch with Heart Rate Monitor",
                price: 199.99,
                originalPrice: 249.99,
                image: "images/Smart Fitness Watch/SmartWatch-1.png",
                rating: 4.3,
                reviews: 156,
                badge: "20% OFF",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 3,
                title: "Organic Cotton T-Shirt Collection",
                price: 39.99,
                originalPrice: 59.99,
                image: "images/Organic Cotton T-Shirt/OrganicT-Shirt-1.png",
                rating: 4.7,
                reviews: 89,
                badge: "Eco-Friendly",
                category: "fashion",
                inStock: true,
                onSale: true
            },
            {
                id: 4,
                title: "Professional Yoga Mat with Alignment Lines",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Yoga Mat/YogaMat-1.png",
                rating: 4.8,
                reviews: 312,
                badge: "Premium",
                category: "sports",
                inStock: true,
                onSale: true
            },
            {
                id: 5,
                title: "Ceramic Plant Pot Set (3 Pieces)",
                price: 49.99,
                originalPrice: 69.99,
                image: "images/Ceramic Pot/CeramicPot-1.png",
                rating: 4.4,
                reviews: 67,
                badge: "Limited",
                category: "home",
                inStock: true,
                onSale: true
            },
            {
                id: 6,
                title: "Luxury Skincare Face Serum",
                price: 89.99,
                originalPrice: 129.99,
                image: "images/Skin Care/SkinCare-1.png",
                rating: 4.6,
                reviews: 201,
                badge: "New",
                category: "beauty",
                inStock: true,
                onSale: true
            },
            {
                id: 7,
                title: "Bestselling Novel Collection",
                price: 24.99,
                originalPrice: 34.99,
                image: "images/Novel/Novel-1.png",
                rating: 4.9,
                reviews: 445,
                badge: "Award Winner",
                category: "books",
                inStock: true,
                onSale: true
            },
            {
                id: 8,
                title: "Wireless Charging Pad for Multiple Devices",
                price: 59.99,
                originalPrice: 79.99,
                image: "images/Wireless Charging Pad/WirelessCharging-1.png",
                rating: 4.2,
                reviews: 123,
                badge: "Fast Charge",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 9,
                title: "Designer Leather Handbag",
                price: 189.99,
                originalPrice: 259.99,
                image: "images/Leather Bag/LeatherBag-1.png",
                rating: 4.6,
                reviews: 178,
                badge: "Luxury",
                category: "fashion",
                inStock: true,
                onSale: true
            },
            {
                id: 10,
                title: "Smart Home Security Camera",
                price: 149.99,
                originalPrice: 199.99,
                image: "images/Home Camera/HomeCamera-1.png",
                rating: 4.4,
                reviews: 267,
                badge: "Smart Home",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 11,
                title: "Organic Green Tea Collection",
                price: 29.99,
                originalPrice: 39.99,
                image: "images/Organic Green Tea/GreenTea-1.png",
                rating: 4.7,
                reviews: 92,
                badge: "Organic",
                category: "home",
                inStock: true,
                onSale: true
            },
            {
                id: 12,
                title: "Running Shoes with Advanced Cushioning",
                price: 129.99,
                originalPrice: 169.99,
                image: "images/Running Shoe/RunningShoe-1.png",
                rating: 4.5,
                reviews: 334,
                badge: "Athletic",
                category: "sports",
                inStock: true,
                onSale: true
            },
            {
                id: 13,
                title: "Anti-Aging Face Cream",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Face Cream/FaceCream-1.png",
                rating: 4.3,
                reviews: 145,
                badge: "Skincare",
                category: "beauty",
                inStock: true,
                onSale: true
            },
            {
                id: 14,
                title: "Mystery Book Box Set",
                price: 49.99,
                originalPrice: 69.99,
                image: "images/Mystery Book/MysteryBook-1.png",
                rating: 4.8,
                reviews: 223,
                badge: "Box Set",
                category: "books",
                inStock: true,
                onSale: true
            },
            {
                id: 15,
                title: "Bluetooth Portable Speaker",
                price: 89.99,
                originalPrice: 119.99,
                image: "images/Bluetooth Speaker/BluetoothSpeaker-1.png",
                rating: 4.6,
                reviews: 189,
                badge: "Waterproof",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 16,
                title: "Silk Scarf Collection",
                price: 69.99,
                originalPrice: 89.99,
                image: "images/Scarf/Scarf-1.png",
                rating: 4.7,
                reviews: 76,
                badge: "Fashion",
                category: "fashion",
                inStock: true,
                onSale: true
            },
            {
                id: 17,
                title: "Meditation Cushion Set",
                price: 59.99,
                originalPrice: 79.99,
                image: "images/Mediatation/Mediatation-1.png",
                rating: 4.9,
                reviews: 134,
                badge: "Wellness",
                category: "sports",
                inStock: true,
                onSale: true
            },
            {
                id: 18,
                title: "Aromatherapy Essential Oils",
                price: 39.99,
                originalPrice: 54.99,
                image: "images/Oils/Oil-1.png",
                rating: 4.5,
                reviews: 167,
                badge: "Relaxation",
                category: "home",
                inStock: true,
                onSale: true
            },
            {
                id: 19,
                title: "Vitamin C Face Mask",
                price: 34.99,
                originalPrice: 44.99,
                image: "images/Face Mask/FaceMask-1.png",
                rating: 4.4,
                reviews: 98,
                badge: "Beauty",
                category: "beauty",
                inStock: true,
                onSale: true
            },
            {
                id: 20,
                title: "Cookbook Collection",
                price: 44.99,
                originalPrice: 59.99,
                image: "images/Cook Book/CookBook-1.png",
                rating: 4.6,
                reviews: 201,
                badge: "Cooking",
                category: "books",
                inStock: true,
                onSale: true
            },
            {
                id: 21,
                title: "Laptop Stand with Cooling Fan",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Laptop Stand/LaptopStand-1.png",
                rating: 4.3,
                reviews: 156,
                badge: "Office",
                category: "electronics",
                inStock: true,
                onSale: true
            },
            {
                id: 22,
                title: "Denim Jacket Classic",
                price: 99.99,
                originalPrice: 139.99,
                image: "images/Jacket/Jacket-1.png",
                rating: 4.5,
                reviews: 289,
                badge: "Casual",
                category: "fashion",
                inStock: true,
                onSale: true
            },
            {
                id: 23,
                title: "Resistance Bands Set",
                price: 29.99,
                originalPrice: 39.99,
                image: "images/Resistance band/ResistanceBand-1.png",
                rating: 4.7,
                reviews: 112,
                badge: "Fitness",
                category: "sports",
                inStock: true,
                onSale: true
            },
            {
                id: 24,
                title: "Decorative Wall Art Set",
                price: 89.99,
                originalPrice: 119.99,
                image: "images/Wall Set/WallSet-1.png",
                rating: 4.6,
                reviews: 78,
                badge: "Home Decor",
                category: "home",
                inStock: true,
                onSale: true
            }
        ];
    }

    setupEventListeners() {
        // Cart functionality (reuse from main.js logic)
        const cartBtn = document.querySelector('.cart-btn');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        
        cartBtn?.addEventListener('click', () => this.openCart());
        closeCart?.addEventListener('click', () => this.closeCart());
        overlay?.addEventListener('click', () => this.closeCart());

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        searchInput?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filter checkboxes
        const categoryCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateFilters());
        });

        // Price range inputs
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        minPriceInput?.addEventListener('input', () => this.updateFilters());
        maxPriceInput?.addEventListener('input', () => this.updateFilters());

        // Proceed to Checkout button
        document.querySelectorAll('.checkout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });
        });
    }

    updateFilters() {
        // Get selected categories
        const categoryCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"][id^="cat-"]');
        this.filters.categories = [];
        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const category = checkbox.id.replace('cat-', '');
                this.filters.categories.push(category);
            }
        });

        // Get price range
        const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
        this.filters.priceRange = { min: minPrice, max: maxPrice };

        // Get rating filter
        const rating4 = document.getElementById('rating-4')?.checked;
        const rating3 = document.getElementById('rating-3')?.checked;
        const rating2 = document.getElementById('rating-2')?.checked;
        
        if (rating4) this.filters.rating = 4;
        else if (rating3) this.filters.rating = 3;
        else if (rating2) this.filters.rating = 2;
        else this.filters.rating = 0;

        // Get availability filters
        this.filters.inStock = document.getElementById('in-stock')?.checked ?? true;
        this.filters.onSale = document.getElementById('sale')?.checked ?? false;
    }

    applyFilters() {
        this.updateFilters();
        
        this.filteredProducts = this.allProducts.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price filter
            if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                return false;
            }

            // Rating filter
            if (product.rating < this.filters.rating) {
                return false;
            }

            // Stock filter
            if (!this.filters.inStock && !product.inStock) {
                return false;
            }

            // Sale filter
            if (this.filters.onSale && !product.onSale) {
                return false;
            }

            return true;
        });

        this.sortProducts();
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.renderActiveFilters();
        this.renderPagination();
    }

    sortProducts() {
        const sortValue = document.getElementById('sortDropdown')?.value || 'featured';
        
        switch (sortValue) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default: // featured
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
        }
        
        this.currentSort = sortValue;
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <button class="product-wishlist" aria-label="Add to wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="price-current">$${product.price}</span>
                        <span class="price-original">$${product.originalPrice}</span>
                        <span class="price-discount">${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                    </div>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');

        this.setupProductEventListeners();
    }

    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="page-btn" onclick="productsPage.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>
                ←
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="page-btn ${i === this.currentPage ? 'active' : ''}" onclick="productsPage.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<span style="padding: 0 0.5rem;">...</span>';
            }
        }

        // Next button
        paginationHTML += `
            <button class="page-btn" onclick="productsPage.goToPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? 'disabled' : ''}>
                →
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            this.renderPagination();
            
            // Scroll to top of products
            document.querySelector('.products-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }
    
    renderActiveFilters() {
        const container = document.getElementById('activeFilters');
        if (!container) return;
        const chips = [];
        this.filters.categories.forEach(cat => {
            chips.push({ type: 'category', value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) });
        });
        if (this.filters.priceRange.min > 0) {
            chips.push({ type: 'priceMin', value: this.filters.priceRange.min, label: `Min $${this.filters.priceRange.min}` });
        }
        if (this.filters.priceRange.max !== Infinity) {
            chips.push({ type: 'priceMax', value: this.filters.priceRange.max, label: `Max $${this.filters.priceRange.max}` });
        }
        if (this.filters.rating > 0) {
            chips.push({ type: 'rating', value: this.filters.rating, label: `${this.filters.rating}★ & up` });
        }
        if (this.filters.onSale) {
            chips.push({ type: 'onSale', value: true, label: 'On Sale' });
        }
        if (!this.filters.inStock) {
            chips.push({ type: 'inStock', value: false, label: 'Include Out of Stock' });
        }
        if (chips.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = chips.map(chip => `
            <div class="filter-chip" data-type="${chip.type}" data-value="${chip.value}">
                <span>${chip.label}</span>
                <button class="chip-remove" onclick="removeFilter('${chip.type}', '${chip.value}')">×</button>
            </div>
        `).join('');
    }

    setupProductEventListeners() {
        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                this.addToCart(productId);
            });
        });

        // Wishlist buttons
        const wishlistBtns = document.querySelectorAll('.product-wishlist');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWishlist(btn);
            });
        });

        // Product card clicks
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.add-to-cart') && !e.target.closest('.product-wishlist')) {
                    const productId = parseInt(card.dataset.productId);
                    this.viewProductDetails(productId);
                }
            });
        });
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star">★</span>';
        }
        if (halfStar) {
            stars += '<span class="star">☆</span>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star" style="opacity: 0.3">★</span>';
        }
        return stars;
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.applyFilters();
            return;
        }

        this.filteredProducts = this.allProducts.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.renderPagination();
    }

    addToCart(productId) {
        const product = this.allProducts.find(p => p.id === productId);
        if (!product) return;

        // Simple cart implementation - in real app would use shared cart state
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Product added to cart!');
        this.animateAddToCart(productId);
        this.renderCart();
        this.openCart();
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

    renderCart() {
        this.loadCartFromStorage();
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        if (!cartItems) return;
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 1rem;">
                        <path d="M9 2 3 9v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-6-7z"></path>
                        <line x1="3" y1="9" x2="21" y2="9"></line>
                        <path d="M9 22V12h6v10"></path>
                    </svg>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="productsPage.updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="productsPage.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="productsPage.removeFromCart(${item.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    updateQuantity(productId, delta) {
        this.loadCartFromStorage();
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            this.cart = this.cart.filter(i => i.id !== productId);
        }
        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
    }

    removeFromCart(productId) {
        this.loadCartFromStorage();
        this.cart = this.cart.filter(i => i.id !== productId);
        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
    }

    openCart() {
        this.renderCart();
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
        }
        if (overlay) {
            overlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    animateAddToCart(productId) {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                productCard.style.animation = '';
            }, 300);
        }
    }

    toggleWishlist(btn) {
        btn.style.color = btn.style.color === 'red' ? '' : 'red';
        const isActive = btn.style.color === 'red';
        this.showNotification(isActive ? 'Added to wishlist!' : 'Removed from wishlist');
    }

    viewProductDetails(productId) {
        window.location.href = `product-detail.html?id=${productId}`;
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
function setView(view) {
    const productsGrid = document.getElementById('productsGrid');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    if (view === 'list') {
        productsGrid.classList.add('list-view');
    } else {
        productsGrid.classList.remove('list-view');
    }
    
    productsPage.currentView = view;
}

function applyFilters() {
    productsPage.applyFilters();
}

function sortProducts() {
    productsPage.sortProducts();
    productsPage.renderProducts();
}

// Initialize the products page
const productsPage = new ProductsPage();

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

// Update cart count on page load
productsPage.updateCartCount();
productsPage.renderActiveFilters();
productsPage.renderCart();

function removeFilter(type, value) {
    switch (type) {
        case 'category': {
            const cb = document.getElementById(`cat-${value}`);
            if (cb) cb.checked = false;
            break;
        }
        case 'priceMin': {
            const min = document.getElementById('minPrice');
            if (min) min.value = '';
            break;
        }
        case 'priceMax': {
            const max = document.getElementById('maxPrice');
            if (max) max.value = '';
            break;
        }
        case 'rating': {
            ['rating-4','rating-3','rating-2'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = false;
            });
            break;
        }
        case 'onSale': {
            const el = document.getElementById('sale');
            if (el) el.checked = false;
            break;
        }
        case 'inStock': {
            const el = document.getElementById('in-stock');
            if (el) el.checked = true;
            break;
        }
        default:
            break;
    }
    productsPage.applyFilters();
}
