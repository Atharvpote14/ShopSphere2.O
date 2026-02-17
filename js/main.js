// ShopSphere Main JavaScript File
class ShopSphere {
    constructor() {
        this.cart = [];
        this.products = [];
        this.deals = [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.loadDeals();
        this.setupEventListeners();
        this.setupAnimations();
        this.loadCartFromStorage();
        this.updateCartCount();
        this.renderCart(); // Add this to render cart items on page load
        this.initProductDetail();
    }

    initProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId) {
            const product = this.products.find(p => p.id === parseInt(productId));
            if (product) {
                this.renderProductDetail(product);
            }
        }
    }

    renderProductDetail(product) {
        const titleEl = document.getElementById('product-title');
        if (!titleEl) return;

        // Basic Info
        this.currentProduct = product;
        titleEl.textContent = product.title;
        document.getElementById('pd-stars').innerHTML = this.renderStars(product.rating);
        document.getElementById('pd-reviews').textContent = `${product.reviews} ratings`;
        
        const price = Math.floor(product.price);
        const fraction = Math.round((product.price - price) * 100).toString().padEnd(2, '0');
        
        const priceBlock = document.querySelector('.pd-price-block');
        if (priceBlock) {
             priceBlock.innerHTML = `
                <span class="price-label">Price:</span>
                <span class="pd-price-symbol">$</span>
                <span class="pd-price-whole">${price}</span>
                <span class="pd-price-fraction">${fraction}</span>
             `;
        }

        document.getElementById('buy-box-price').textContent = `$${product.price}`;
        
        const categoryCrumb = document.getElementById('category-crumb');
        if (categoryCrumb) categoryCrumb.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        
        const productCrumb = document.getElementById('product-crumb');
        if (productCrumb) productCrumb.textContent = product.title;

        // Delivery
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const deliveryEl = document.getElementById('delivery-date');
        if (deliveryEl) deliveryEl.textContent = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        // Image
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.src = product.image;
            // Add click listener for Zoom Modal
            mainImage.style.cursor = 'zoom-in';
            mainImage.onclick = () => this.openZoomModal(this.currentProduct, mainImage.src);
        }
        
        // Thumbnails
        const images = product.thumbnails || [
            product.image,
            `https://picsum.photos/seed/${product.id}a/400/300`,
            `https://picsum.photos/seed/${product.id}b/400/300`,
            `https://picsum.photos/seed/${product.id}c/400/300`
        ];

        const thumbnailList = document.getElementById('thumbnail-list');
        if (thumbnailList) {
            thumbnailList.innerHTML = images.map((img, index) => `
                <div class="thumbnail-item ${index === 0 ? 'active' : ''}" onmouseover="shopSphere.switchImage(this, '${img}')">
                    <img src="${img}" alt="Thumbnail">
                </div>
            `).join('');
        }

        // Features
        const features = [
            "High-quality material ensures durability and long-lasting use.",
            "Designed for comfort and style, perfect for everyday use.",
            "Energy efficient and eco-friendly manufacturing process.",
            "Comes with a 1-year manufacturer warranty for peace of mind.",
            "Easy to clean and maintain with standard household products."
        ];
        const featuresEl = document.getElementById('pd-features');
        if (featuresEl) featuresEl.innerHTML = features.map(f => `<li>${f}</li>`).join('');

        // Add to cart in Buy Box
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                const qtySelect = document.getElementById('qty-select');
                const qty = qtySelect ? parseInt(qtySelect.value) : 1;
                for(let i=0; i<qty; i++) this.addToCart(product.id);
            };
        }
        const buyNowBtn = document.getElementById('buy-now-btn');
        if (buyNowBtn) {
            buyNowBtn.onclick = () => {
                const qtySelect = document.getElementById('qty-select');
                const qty = qtySelect ? parseInt(qtySelect.value) : 1;
                for(let i=0; i<qty; i++) this.addToCart(product.id);
                window.location.href = 'checkout.html';
            };
        }
    }

    switchImage(thumbnail, src) {
        document.querySelectorAll('.thumbnail-item').forEach(item => item.classList.remove('active'));
        thumbnail.classList.add('active');
        const mainImage = document.getElementById('main-image');
        mainImage.src = src;
        // Update click listener with new image
        mainImage.onclick = () => this.openZoomModal(this.currentProduct, src);
    }

    // Zoom Modal Functions
    openZoomModal(product, currentImageSrc) {
        this.currentProduct = product; // Store for context
        const modal = document.getElementById('image-zoom-modal');
        const zoomImage = document.getElementById('zoom-main-image');
        const title = document.getElementById('zoom-product-title');
        const thumbnailList = document.getElementById('zoom-thumbnail-list');
        const closeBtn = document.querySelector('.close-modal');
        
        if (!modal) return;

        zoomImage.src = currentImageSrc;
        zoomImage.style.transform = 'scale(1)';
        this.currentZoomLevel = 1;
        title.textContent = product.title;

        // Populate Zoom Thumbnails
        const images = product.thumbnails || [
            product.image,
            `https://picsum.photos/seed/${product.id}a/400/300`,
            `https://picsum.photos/seed/${product.id}b/400/300`,
            `https://picsum.photos/seed/${product.id}c/400/300`
        ];

        thumbnailList.innerHTML = images.map((img, index) => `
            <div class="zoom-thumbnail ${img === currentImageSrc ? 'active' : ''}" onclick="shopSphere.switchZoomImage(this, '${img}')">
                <img src="${img}" alt="Thumbnail">
            </div>
        `).join('');

        modal.style.display = 'block';

        // Close events
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) modal.style.display = 'none';
        };

        // Zoom Controls
        document.getElementById('zoom-in-btn').onclick = () => this.handleZoom(0.2);
        document.getElementById('zoom-out-btn').onclick = () => this.handleZoom(-0.2);
        
        // Mouse Wheel Zoom
        zoomImage.onwheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.handleZoom(delta);
        };
    }

    switchZoomImage(thumbnail, src) {
        document.querySelectorAll('.zoom-thumbnail').forEach(item => item.classList.remove('active'));
        thumbnail.classList.add('active');
        const zoomImage = document.getElementById('zoom-main-image');
        zoomImage.src = src;
        zoomImage.style.transform = 'scale(1)';
        this.currentZoomLevel = 1;
    }

    handleZoom(delta) {
        const zoomImage = document.getElementById('zoom-main-image');
        let newZoom = this.currentZoomLevel + delta;
        // Clamp zoom level between 0.5 and 5
        if (newZoom < 0.5) newZoom = 0.5;
        if (newZoom > 5) newZoom = 5;
        
        this.currentZoomLevel = newZoom;
        zoomImage.style.transform = `scale(${newZoom})`;
    }

    // Product Data
    loadProducts() {
        this.products = [
            {
                id: 1,
                title: "Premium Wireless Headphones with Noise Cancellation",
                price: 299.99,
                originalPrice: 399.99,
                image: "images/Wireless Headphone/WirelessHeadphone-1.png",
                thumbnails: [
                        "images/Wireless Headphone/WirelessHeadphone-1.png",
                        "images/Wireless Headphone/WirelessHeadphone-2.png",
                        "images/Wireless Headphone/WirelessHeadphone-3.png",
                        "images/Wireless Headphone/WirelessHeadphone-4.png"
                ],
                rating: 4.5,
                reviews: 234,
                badge: "Best Seller",
                category: "electronics"
            },
            {
                id: 2,
                title: "Smart Fitness Watch with Heart Rate Monitor",
                price: 199.99,
                originalPrice: 249.99,
                image: "images/Smart Fitness Watch/SmartWatch-1.png",
                thumbnails: [
                        "images/Smart Fitness Watch/SmartWatch-1.png",
                        "images/Smart Fitness Watch/SmartWatch-2.png",
                        "images/Smart Fitness Watch/SmartWatch-3.png",
                        "images/Smart Fitness Watch/SmartWatch-4.png"
                ],
                rating: 4.3,
                reviews: 156,
                badge: "20% OFF",
                category: "electronics"
            },
            {
                id: 3,
                title: "Organic Cotton T-Shirt Collection",
                price: 39.99,
                originalPrice: 59.99,
                image: "images/Organic Cotton T-Shirt/OrganicT-Shirt-1.png",
                thumbnails: [
                        "images/Organic Cotton T-Shirt/OrganicT-Shirt-1.png",
                        "images/Organic Cotton T-Shirt/OrganicT-Shirt-2.png",
                        "images/Organic Cotton T-Shirt/OrganicT-Shirt-3.png",
                        "images/Organic Cotton T-Shirt/OrganicT-Shirt-4.png"
                ] ,
                rating: 4.7,
                reviews: 89,
                badge: "Eco-Friendly",
                category: "fashion"
            },
            {
                id: 4,
                title: "Professional Yoga Mat with Alignment Lines",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Yoga Mat/YogaMat-1.png",
                thumbnails: [
                        "images/Yoga Mat/YogaMat-1.png",
                        "images/Yoga Mat/YogaMat-2.png",
                        "images/Yoga Mat/YogaMat-3.png",
                        "images/Yoga Mat/YogaMat-4.png"
                ],
                rating: 4.8,
                reviews: 312,
                badge: "Premium",
                category: "sports"
            },
            {
                id: 5,
                title: "Ceramic Plant Pot Set (3 Pieces)",
                price: 49.99,
                originalPrice: 69.99,
                image: "images/Ceramic Pot/CeramicPot-1.png",
                thumbnails: [
                        "images/Ceramic Pot/CeramicPot-1.png",
                        "images/Ceramic Pot/CeramicPot-2.png",
                        "images/Ceramic Pot/CeramicPot-3.png",
                        "images/Ceramic Pot/CeramicPot-4.png"
                ],
                rating: 4.4,
                reviews: 67,
                badge: "Limited",
                category: "home"
            },
            {
                id: 6,
                title: "Luxury Skincare Face Serum",
                price: 89.99,
                originalPrice: 129.99,
                image: "images/Skin Care/SkinCare-1.png",
                thumbnails: [
                        "images/Skin Care/SkinCare-1.png",
                        "images/Skin Care/SkinCare-2.png",
                        "images/Skin Care/SkinCare-3.png",
                        "images/Skin Care/SkinCare-4.png"
                ],
                rating: 4.6,
                reviews: 201,
                badge: "New",
                category: "beauty"
            },
            {
                id: 7,
                title: "Bestselling Novel Collection",
                price: 24.99,
                originalPrice: 34.99,
                image: "images/Novel/Novel-1.png",
                thumbnails: [
                        "images/Novel/Novel-1.png",
                        "images/Novel/Novel-2.png",
                        "images/Novel/Novel-3.png",
                        "images/Novel/Novel-4.png"
                ],
                rating: 4.9,
                reviews: 445,
                badge: "Award Winner",
                category: "books"
            },
            {
                id: 8,
                title: "Wireless Charging Pad for Multiple Devices",
                price: 59.99,
                originalPrice: 79.99,
                image: "images/Wireless Charging Pad/WirelessCharging-1.png",
                thumbnails: [
                        "images/Wireless Charging Pad/WirelessCharging-1.png",
                        "images/Wireless Charging Pad/WirelessCharging-2.png",
                        "images/Wireless Charging Pad/WirelessCharging-3.png",
                        "images/Wireless Charging Pad/WirelessCharging-4.png"
                ],
                rating: 4.2,
                reviews: 123,
                badge: "Fast Charge",
                category: "electronics"
            },
            {
                id: 9,
                title: "Designer Leather Handbag",
                price: 189.99,
                originalPrice: 259.99,
                image: "images/Leather Bag/LeatherBag-1.png",
                thumbnails: [
                        "images/Leather Bag/LeatherBag-1.png",
                        "images/Leather Bag/LeatherBag-2.png",
                        "images/Leather Bag/LeatherBag-3.png",
                        "images/Leather Bag/LeatherBag-4.png"
                ],
                rating: 4.6,
                reviews: 178,
                badge: "Luxury",
                category: "fashion"
            },
            {
                id: 10,
                title: "Smart Home Security Camera",
                price: 149.99,
                originalPrice: 199.99,
                image: "images/Home Camera/HomeCamera-1.png",
                thumbnails: [
                        "images/Home Camera/HomeCamera-1.png",
                        "images/Home Camera/HomeCamera-2.png",
                        "images/Home Camera/HomeCamera-3.png",
                        "images/Home Camera/HomeCamera-4.png"
                ],
                rating: 4.4,
                reviews: 267,
                badge: "Smart Home",
                category: "electronics"
            },
            {
                id: 11,
                title: "Organic Green Tea Collection",
                price: 29.99,
                originalPrice: 39.99,
                image: "images/Organic Green Tea/GreenTea-1.png",
                thumbnails: [
                        "images/Organic Green Tea/GreenTea-1.png",
                        "images/Organic Green Tea/GreenTea-2.png",
                        "images/Organic Green Tea/GreenTea-3.png",
                        "images/Organic Green Tea/GreenTea-4.png"
                ],
                rating: 4.7,
                reviews: 92,
                badge: "Organic",
                category: "home"
            },
            {
                id: 12,
                title: "Running Shoes with Advanced Cushioning",
                price: 129.99,
                originalPrice: 169.99,
                image: "images/Running Shoe/RunningShoe-1.png",
                thumbnails: [
                        "images/Running Shoe/RunningShoe-1.png",
                        "images/Running Shoe/RunningShoe-2.png",
                        "images/Running Shoe/RunningShoe-3.png",
                        "images/Running Shoe/RunningShoe-4.png"
                ],
                rating: 4.5,
                reviews: 334,
                badge: "Athletic",
                category: "sports"
            },
            {
                id: 13,
                title: "Anti-Aging Face Cream",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Face Cream/FaceCream-1.png",
                thumbnails: [
                        "images/Face Cream/FaceCream-1.png",
                        "images/Face Cream/FaceCream-2.png",
                        "images/Face Cream/FaceCream-3.png",
                        "images/Face Cream/FaceCream-4.png"
                ],
                rating: 4.3,
                reviews: 145,
                badge: "Skincare",
                category: "beauty"
            },
            {
                id: 14,
                title: "Mystery Book Box Set",
                price: 49.99,
                originalPrice: 69.99,
                image: "images/Mystery Book/MysteryBook-1.png",
                thumbnails: [
                        "images/Mystery Book/MysteryBook-1.png",
                        "images/Mystery Book/MysteryBook-2.png",
                        "images/Mystery Book/MysteryBook-3.png",
                        "images/Mystery Book/MysteryBook-4.png"
                ],
                rating: 4.8,
                reviews: 223,
                badge: "Box Set",
                category: "books"
            },
            {
                id: 15,
                title: "Bluetooth Portable Speaker",
                price: 89.99,
                originalPrice: 119.99,
                image: "images/Bluetooth Speaker/BluetoothSpeaker-1.png",
                thumbnails: [
                        "images/Bluetooth Speaker/BluetoothSpeaker-1.png",
                        "images/Bluetooth Speaker/BluetoothSpeaker-2.png",
                        "images/Bluetooth Speaker/BluetoothSpeaker-3.png",
                        "images/Bluetooth Speaker/BluetoothSpeaker-4.png"
                ],
                rating: 4.6,
                reviews: 189,
                badge: "Waterproof",
                category: "electronics"
            },
            {
                id: 16,
                title: "Silk Scarf Collection",
                price: 69.99,
                originalPrice: 89.99,
                image: "images/Scarf/Scarf-1.png",
                thumbnails: [
                        "images/Scarf/Scarf-1.png",
                        "images/Scarf/Scarf-2.png",
                        "images/Scarf/Scarf-3.png",
                        "images/Scarf/Scarf-4.png"
                ],
                rating: 4.7,
                reviews: 76,
                badge: "Fashion",
                category: "fashion"
            },
            {
                id: 17,
                title: "Meditation Cushion Set",
                price: 59.99,
                originalPrice: 79.99,
                image: "images/Mediatation/Mediatation-1.png",
                thumbnails: [
                        "images/Mediatation/Mediatation-1.png",
                        "images/Mediatation/Mediatation-2.png",
                        "images/Mediatation/Mediatation-3.png",
                        "images/Mediatation/Mediatation-4.png"
                ],
                rating: 4.9,
                reviews: 134,
                badge: "Wellness",
                category: "sports"
            },
            {
                id: 18,
                title: "Aromatherapy Essential Oils",
                price: 39.99,
                originalPrice: 54.99,
                image: "images/Oils/Oil-1.png",
                thumbnails: [
                        "images/Oils/Oil-1.png",
                        "images/Oils/Oil-2.png",
                        "images/Oils/Oil-3.png",
                        "images/Oils/Oil-4.png"
                ],
                rating: 4.5,
                reviews: 167,
                badge: "Relaxation",
                category: "home"
            },
            {
                id: 19,
                title: "Vitamin C Face Mask",
                price: 34.99,
                originalPrice: 44.99,
                image: "images/Face Mask/FaceMask-1.png",
                thumbnails: [
                        "images/Face Mask/FaceMask-1.png",
                        "images/Face Mask/FaceMask-2.png",
                        "images/Face Mask/FaceMask-3.png",
                        "images/Face Mask/FaceMask-4.png"
                ],
                rating: 4.4,
                reviews: 98,
                badge: "Beauty",
                category: "beauty"
            },
            {
                id: 20,
                title: "Cookbook Collection",
                price: 44.99,
                originalPrice: 59.99,
                image: "images/Cook Book/CookBook-1.png",
                thumbnails: [
                        "images/Cook Book/CookBook-1.png",
                        "images/Cook Book/CookBook-2.png",
                        "images/Cook Book/CookBook-3.png",
                        "images/Cook Book/CookBook-4.png"
                ],
                rating: 4.6,
                reviews: 201,
                badge: "Cooking",
                category: "books"
            },
            {
                id: 21,
                title: "Laptop Stand with Cooling Fan",
                price: 79.99,
                originalPrice: 99.99,
                image: "images/Laptop Stand/LaptopStand-1.png",
                thumbnails: [
                        "images/Laptop Stand/LaptopStand-1.png",
                        "images/Laptop Stand/LaptopStand-2.png",
                        "images/Laptop Stand/LaptopStand-3.png",
                        "images/Laptop Stand/LaptopStand-4.png"
                ],
                rating: 4.3,
                reviews: 156,
                badge: "Office",
                category: "electronics"
            },
            {
                id: 22,
                title: "Denim Jacket Classic",
                price: 99.99,
                originalPrice: 139.99,
                image: "images/Jacket/Jacket-1.png",
                thumbnails: [
                        "images/Jacket/Jacket-1.png",
                        "images/Jacket/Jacket-2.png",
                        "images/Jacket/Jacket-3.png",
                        "images/Jacket/Jacket-4.png"
                ],
                rating: 4.5,
                reviews: 289,
                badge: "Casual",
                category: "fashion"
            },
            {
                id: 23,
                title: "Resistance Bands Set",
                price: 29.99,
                originalPrice: 39.99,
                image: "images/Resistance band/ResistanceBand-1.png",
                thumbnails: [
                        "images/Resistance band/ResistanceBand-1.png",
                        "images/Resistance band/ResistanceBand-2.png",
                        "images/Resistance band/ResistanceBand-3.png",
                        "images/Resistance band/ResistanceBand-4.png"
                ],
                rating: 4.7,
                reviews: 112,
                badge: "Fitness",
                category: "sports"
            },
            {
                id: 24,
                title: "Decorative Wall Art Set",
                price: 89.99,
                originalPrice: 119.99,
                image: "images/Wall Set/WallSet-1.png",
                thumbnails: [
                        "images/Wall Set/WallSet-1.png",
                        "images/Wall Set/WallSet-2.png",
                        "images/Wall Set/WallSet-3.png",
                        "images/Wall Set/WallSet-4.png"
                ],
                rating: 4.6,
                reviews: 78,
                badge: "Home Decor",
                category: "home"
            }
        ];
        this.renderProducts();
    }

    loadDeals() {
        this.deals = [
            {
                id: 1,
                title: "Flash Sale - Electronics",
                description: "Up to 50% off on selected electronics. Limited time offer!",
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                discount: 50
            },
            {
                id: 2,
                title: "Fashion Week Special",
                description: "Get 30% off on all fashion items. Style meets savings!",
                endTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
                discount: 30
            },
            {
                id: 3,
                title: "Home Makeover Sale",
                description: "Transform your space with 40% off on home decor items.",
                endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
                discount: 40
            }
        ];
        this.renderDeals();
    }

    // Render Functions
    renderProducts() {
        const featuredProducts = document.getElementById('featuredProducts');
        if (!featuredProducts) return;

        const productsToRender = [...this.products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);

        featuredProducts.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <button class="product-wishlist" aria-label="Add to wishlist" onclick="event.stopPropagation();">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">${product.title}</h3>
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

    renderDeals() {
        const dealsGrid = document.getElementById('dealsGrid');
        if (!dealsGrid) return;

        dealsGrid.innerHTML = this.deals.map(deal => `
            <div class="deal-card">
                <div class="deal-timer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span class="countdown" data-end-time="${deal.endTime.toISOString()}">Ends in ${this.getTimeRemaining(deal.endTime)}</span>
                </div>
                <h3 class="deal-title">${deal.title}</h3>
                <p class="deal-description">${deal.description}</p>
                <button class="deal-cta">Shop Now - ${deal.discount}% OFF</button>
            </div>
        `).join('');

        this.startCountdownTimers();
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

    getTimeRemaining(endTime) {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const difference = end - now;

        if (difference <= 0) return 'Expired';

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    }

    // Event Listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navRight = document.querySelector('.nav-right');
        
        if (mobileMenuToggle && navRight) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                navRight.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuToggle && navRight) {
                if (!navRight.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    navRight.classList.remove('active');
                }
            }
        });

        // Cart functionality
        const cartBtn = document.querySelector('.cart-btn');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openCart();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCart();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCart();
            });
        }

        // Search functionality
        const searchInputs = document.querySelectorAll('.search-input, .hero-search-input, .input');
        searchInputs.forEach(input => {
            // Remove real-time search, only keep Enter key functionality
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e.target.value);
                }
            });
        });

        // Search button functionality
        const searchButtons = document.querySelectorAll('.search-button');
        searchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const searchInput = button.closest('#main').querySelector('.input');
                if (searchInput) {
                    this.handleSearch(searchInput.value);
                }
            });
        });

        // Category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm?.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Proceed to Checkout buttons
        document.querySelectorAll('.checkout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'checkout.html';
            });
        });
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

    // Cart Functions
    loadCartFromStorage() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.loadCartFromStorage();
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
        this.showNotification('Product added to cart!');
        this.animateAddToCart(productId);
    }

    removeFromCart(productId) {
        this.loadCartFromStorage();
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(productId, change) {
        this.loadCartFromStorage();
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCartToStorage();
                this.renderCart();
                this.updateCartCount();
            }
        }
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
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
                            <button class="quantity-btn" onclick="shopSphere.updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="shopSphere.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="shopSphere.removeFromCart(${item.id})">
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

    openCart() {
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

    // Search Functions
    handleSearch(query) {
        if (query.length < 2) {
            this.renderProducts();
            return;
        }

        const filtered = this.products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );

        const featuredProducts = document.getElementById('featuredProducts');
        if (featuredProducts) {
            if (filtered.length === 0) {
                featuredProducts.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                        <h3>No products found</h3>
                        <p>Try searching for something else</p>
                    </div>
                `;
            } else {
                featuredProducts.innerHTML = filtered.map(product => `
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
        }

        // Smooth scroll to results
        this.scrollToProducts();
    }

    // Category Functions
    filterByCategory(category) {
        const filtered = this.products.filter(product => product.category === category);
        
        const featuredProducts = document.getElementById('featuredProducts');
        if (featuredProducts) {
            featuredProducts.innerHTML = filtered.map(product => `
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
    }

    // Scroll to products section
    scrollToProducts() {
        const featuredProducts = document.querySelector('.featured-products');
        if (featuredProducts) {
            featuredProducts.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Utility Functions
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

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        if (email) {
            this.showNotification('Successfully subscribed to newsletter!');
            e.target.reset();
        }
    }

    // Countdown Timers
    startCountdownTimers() {
        const updateTimers = () => {
            const countdowns = document.querySelectorAll('.countdown');
            countdowns.forEach(countdown => {
                const endTime = new Date(countdown.dataset.endTime);
                countdown.textContent = `Ends in ${this.getTimeRemaining(endTime)}`;
            });
        };

        updateTimers();
        setInterval(updateTimers, 60000); // Update every minute
    }

    // Animations
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.product-card, .category-card, .deal-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }
}

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
    
    @keyframes fadeInUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.shopSphere = new ShopSphere();
    });
} else {
    window.shopSphere = new ShopSphere();
}
