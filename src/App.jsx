
import { useEffect, useState } from 'react'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Classic Leather Bag',
    category: 'Accessories',
    price: 89,
    oldPrice: 120,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700',
    tag: 'BESTSELLER',
    description: 'A timeless leather bag designed for everyday elegance. Spacious, versatile, and made to complement your personal style.',
  },
  {
    id: 2,
    name: 'Minimal White Sneakers',
    category: 'Shoes',
    price: 75,
    oldPrice: 95,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
    tag: 'POPULAR',
    description: 'Clean, minimal sneakers that bring comfort and effortless style to your everyday outfits.',
  },
  {
    id: 3,
    name: 'Modern Wrist Watch',
    category: 'Accessories',
    price: 110,
    oldPrice: 145,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700',
    tag: 'NEW',
    description: 'A modern wrist watch with a refined design, perfect for everyday wear and special occasions.',
  },
  {
    id: 4,
    name: 'Everyday Sunglasses',
    category: 'Accessories',
    price: 45,
    oldPrice: 60,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700',
    tag: '',
    description: 'Stylish everyday sunglasses with a versatile look that pairs easily with any outfit.',
  },
  {
    id: 5,
    name: 'Premium Headphones',
    category: 'Electronics',
    price: 129,
    oldPrice: 159,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700',
    tag: 'TRENDING',
    description: 'Enjoy your favourite music with premium-style headphones designed for an immersive listening experience.',
  },
  {
    id: 6,
    name: 'Modern Backpack',
    category: 'Bags',
    price: 68,
    oldPrice: 85,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700',
    tag: '',
    description: 'A practical and stylish backpack with a modern look, suitable for work, travel, and everyday use.',
  },
  {
    id: 7,
    name: 'Elegant Running Shoes',
    category: 'Shoes',
    price: 95,
    oldPrice: 115,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700',
    tag: 'NEW',
    description: 'Comfortable athletic-inspired shoes for an active lifestyle and casual everyday outfits.',
  },
  {
    id: 8,
    name: 'Wireless Audio Speaker',
    category: 'Electronics',
    price: 79,
    oldPrice: 99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700',
    tag: '',
    description: 'A modern wireless speaker designed to bring music into your home with a clean, compact design.',
  },
]

const categories = ['All', 'Accessories', 'Shoes', 'Bags', 'Electronics']

const initialCustomer = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  paymentMethod: 'Cash on Delivery',
}

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  const [cart, setCart] = useState(() => readStorage('luxecart-cart', []))
  const [wishlist, setWishlist] = useState(() => readStorage('luxecart-wishlist', []))

  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customer, setCustomer] = useState(initialCustomer)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [orderEmail, setOrderEmail] = useState('')

  useEffect(() => {
    localStorage.setItem('luxecart-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('luxecart-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        activeCategory === 'All' || product.category === activeCategory

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'newest') return b.id - a.id
      return a.id - b.id
    })

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  )

  function addToCart(product, quantity = 1) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id)

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentCart, { ...product, quantity }]
    })
  }

  function updateCartQuantity(productId, change) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    )
  }

  function openQuickView(product) {
    setSelectedProduct(product)
    setSelectedQuantity(1)
  }

  function closeQuickView() {
    setSelectedProduct(null)
    setSelectedQuantity(1)
  }

  function toggleWishlist(productId) {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    )
  }

  function updateCustomer(event) {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  function openCheckout() {
    if (cart.length === 0) return
    setCheckoutOpen(true)
  }

  function placeOrder(event) {
    event.preventDefault()

    const newOrderNumber = `LC-${Date.now().toString().slice(-7)}`

    setOrderNumber(newOrderNumber)
    setOrderEmail(customer.email)
    setOrderPlaced(true)
    setCheckoutOpen(false)
    setCart([])
    setCustomer(initialCustomer)
  }

  function closeOrderConfirmation() {
    setOrderPlaced(false)
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shippingCost = cartTotal >= 100 || cartTotal === 0 ? 0 : 8
  const finalTotal = cartTotal + shippingCost

  function ProductCard({ product }) {
    const isWishlisted = wishlist.includes(product.id)

    return (
      <article className="product-card" key={product.id}>
        <div className="product-image">
          <img src={product.image} alt={product.name} />

          {product.tag && <span className="product-tag">{product.tag}</span>}

          <button
            className={isWishlisted ? 'wishlist-button selected' : 'wishlist-button'}
            onClick={() => toggleWishlist(product.id)}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>

          <button className="quick-add" onClick={() => addToCart(product)}>
            Add to Bag +
          </button>
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>

          <div className="product-prices">
            <strong>${product.price}</strong>
            <del>${product.oldPrice}</del>
          </div>

          <button className="view-details" onClick={() => openQuickView(product)}>
            View Details →
          </button>
        </div>
      </article>
    )
  }

  return (
    <>
      <div className="announcement">
        Free shipping on orders over $100
        <span> | </span>
        Discover the new collection
      </div>

      <header className="header">
        <div className="container nav-container">
          <a href="#home" className="logo">
            luxe<span>cart.</span>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setMenuOpen(false)}>Shop</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#wishlist" onClick={() => setMenuOpen(false)}>Wishlist</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            <a href="#products" className="search-shortcut">Search</a>
            <a href="#wishlist" className="wishlist-link">
              ♡ <span>{wishlist.length}</span>
            </a>
            <a href="#cart" className="cart-link">
              Bag <span className="cart-count">{cartCount}</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">THE NEW SEASON COLLECTION</p>
            <h1>
              Style that
              <br />
              speaks <span>for you.</span>
            </h1>
            <p className="hero-description">
              Discover thoughtfully selected essentials that bring
              style, comfort, and quality into your everyday life.
            </p>
            <a href="#products" className="button button-dark">
              Shop Collection <span>→</span>
            </a>
            <div className="hero-note">
              <span>01 / 03</span>
              <span>Designed for everyday living</span>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
              alt="Modern fashion store interior"
            />
            <div className="hero-image-label">
              <span>CURATED FOR YOU</span>
              <strong>Everyday essentials.</strong>
            </div>
          </div>
        </section>

        <section className="benefits">
          <div className="container benefits-grid">
            <div>
              <span className="benefit-icon">✦</span>
              <div>
                <strong>Premium Quality</strong>
                <p>Carefully selected products</p>
              </div>
            </div>
            <div>
              <span className="benefit-icon">↗</span>
              <div>
                <strong>Free Shipping</strong>
                <p>On orders over $100</p>
              </div>
            </div>
            <div>
              <span className="benefit-icon">↺</span>
              <div>
                <strong>Easy Returns</strong>
                <p>Simple return experience</p>
              </div>
            </div>
            <div>
              <span className="benefit-icon">♡</span>
              <div>
                <strong>Secure Shopping</strong>
                <p>Your details stay protected</p>
              </div>
            </div>
          </div>
        </section>

        <section className="products-section section-padding" id="products">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">OUR SELECTION</p>
              <h2>Shop the essentials.</h2>
              <p>Good design, quality materials, and everyday style.</p>
            </div>

            <div className="shop-controls">
              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={activeCategory === category ? 'filter active' : 'filter'}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <input
                className="search-input"
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                className="search-input"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="no-products">No products found. Try another search.</p>
            )}
          </div>
        </section>

        <section className="collection-section" id="collections">
          <div className="collection-image">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
              alt="Fashion collection"
            />
          </div>
          <div className="collection-content">
            <p className="eyebrow">THE LUXECART EDIT</p>
            <h2>Less, but better.</h2>
            <p>
              Explore a collection of timeless pieces designed to make
              everyday moments feel a little more special.
            </p>
            <a href="#products" className="text-link">Explore the collection →</a>
          </div>
        </section>

        <section className="products-section section-padding" id="wishlist">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">YOUR FAVOURITES</p>
              <h2>Your wishlist.</h2>
              <p>Keep the pieces you love close at hand.</p>
            </div>

            {wishlistProducts.length > 0 ? (
              <div className="products-grid">
                {wishlistProducts.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="empty-cart">
                <span>♡</span>
                <h3>Your wishlist is empty.</h3>
                <p>Tap the heart on a product to save it here.</p>
                <a href="#products" className="button button-dark">Explore Products</a>
              </div>
            )}
          </div>
        </section>

        <section className="cart-section section-padding" id="cart">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">YOUR SELECTION</p>
              <h2>Shopping bag.</h2>
              <p>Your chosen items are waiting for you.</p>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>♡</span>
                <h3>Your bag is empty.</h3>
                <p>Explore our collection and find something you love.</p>
                <a href="#products" className="button button-dark">Start Shopping</a>
              </div>
            ) : (
              <div className="cart-content">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>${item.price} each</p>

                      <div className="cart-quantity-controls">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <strong>{item.quantity}</strong>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <strong className="cart-item-price">
                      ${item.price * item.quantity}
                    </strong>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="cart-total">
                  <span>Total: ${cartTotal}</span>
                  <button className="button button-dark" onClick={openCheckout}>
                    Proceed to Checkout
                  </button>
                </div>

                <p style={{ textAlign: 'right', marginTop: '12px' }}>
                  {shippingCost === 0
                    ? 'Your order qualifies for free shipping!'
                    : `Shipping: $${shippingCost}`}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="newsletter" id="about">
          <div className="container newsletter-content">
            <p className="eyebrow">A LITTLE NOTE FROM US</p>
            <h2>Good things, delivered.</h2>
            <p>
              Stay in the loop with new arrivals, thoughtful edits,
              and special offers.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(event) => {
                event.preventDefault()
                alert('Thank you for subscribing! This is a demo.')
                event.target.reset()
              }}
            >
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe →</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#home" className="logo">luxe<span>cart.</span></a>
            <p>
              Thoughtfully selected essentials for a more considered
              everyday life.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#products">Shop</a>
            <a href="#collections">Collections</a>
          </div>

          <div className="footer-column">
            <h3>Information</h3>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <a href="#cart">Shopping Bag</a>
          </div>

          <div className="footer-column">
            <h3>Customer Care</h3>
            <span>Shipping & Returns</span>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© 2026 LuxeCart. All rights reserved.</p>
          <p>Designed with care.</p>
        </div>
      </footer>

      {selectedProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div
            className="quick-view-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProduct.name} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="quick-view-close" onClick={closeQuickView}>✕</button>

            <div className="quick-view-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="quick-view-info">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2>{selectedProduct.name}</h2>

              <div className="quick-view-prices">
                <strong>${selectedProduct.price}</strong>
                <del>${selectedProduct.oldPrice}</del>
              </div>

              <p className="quick-view-description">{selectedProduct.description}</p>

              <div className="quantity-selector">
                <span>Quantity</span>
                <div className="quantity-controls">
                  <button
                    onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                    disabled={selectedQuantity <= 1}
                  >
                    −
                  </button>
                  <strong>{selectedQuantity}</strong>
                  <button onClick={() => setSelectedQuantity((q) => q + 1)}>
                    +
                  </button>
                </div>
              </div>

              <button
                className="button button-dark quick-view-add"
                onClick={() => {
                  addToCart(selectedProduct, selectedQuantity)
                  closeQuickView()
                }}
              >
                Add {selectedQuantity} to Bag — ${selectedProduct.price * selectedQuantity}
              </button>

              <p className="quick-view-note">Free shipping on orders over $100.</p>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div
          className="quick-view-overlay checkout-overlay"
          onClick={() => setCheckoutOpen(false)}
          style={{ zIndex: 1100, overflowY: 'auto', padding: '25px 15px' }}
        >
          <div
            className="checkout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            onClick={(event) => event.stopPropagation()}
            style={{
              background: '#fff',
              width: 'min(850px, 100%)',
              margin: 'auto',
              padding: '35px',
              position: 'relative',
              color: '#24231f',
            }}
          >
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              aria-label="Close checkout"
              style={{
                position: 'absolute',
                right: '18px',
                top: '15px',
                border: 'none',
                background: 'transparent',
                fontSize: '25px',
              }}
            >
              ×
            </button>

            <p className="eyebrow">ALMOST YOURS</p>
            <h2 style={{ marginBottom: '8px' }}>Checkout.</h2>
            <p style={{ marginBottom: '25px', color: '#777' }}>
              Enter your details to complete your order.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '35px',
              }}
            >
              <form onSubmit={placeOrder}>
                <h3 style={{ marginBottom: '18px' }}>Delivery details</h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                  <label style={labelStyle}>
                    Full Name
                    <input
                      type="text"
                      name="fullName"
                      value={customer.fullName}
                      onChange={updateCustomer}
                      placeholder="Enter your full name"
                      required
                      autoComplete="name"
                      style={checkoutInputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Email Address
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={updateCustomer}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      style={checkoutInputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={updateCustomer}
                      placeholder="Enter your phone number"
                      required
                      autoComplete="tel"
                      style={checkoutInputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Delivery Address
                    <textarea
                      name="address"
                      value={customer.address}
                      onChange={updateCustomer}
                      placeholder="House number, street, area..."
                      required
                      rows="3"
                      autoComplete="street-address"
                      style={{ ...checkoutInputStyle, resize: 'vertical' }}
                    />
                  </label>

                  <label style={labelStyle}>
                    City
                    <input
                      type="text"
                      name="city"
                      value={customer.city}
                      onChange={updateCustomer}
                      placeholder="Enter your city"
                      required
                      autoComplete="address-level2"
                      style={checkoutInputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Postal Code
                    <input
                      type="text"
                      name="postalCode"
                      value={customer.postalCode}
                      onChange={updateCustomer}
                      placeholder="Postal code"
                      required
                      autoComplete="postal-code"
                      style={checkoutInputStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    Payment Method
                    <select
                      name="paymentMethod"
                      value={customer.paymentMethod}
                      onChange={updateCustomer}
                      style={checkoutInputStyle}
                    >
                      <option>Cash on Delivery</option>
                      <option>Card Payment (Demo Only)</option>
                    </select>
                  </label>
                </div>

                <button
                  type="submit"
                  className="button button-dark"
                  style={{ width: '100%', marginTop: '22px' }}
                >
                  Place Order — ${finalTotal}
                </button>

                <p style={{ fontSize: '12px', color: '#888', marginTop: '12px' }}>
                  Demo checkout only. No real payment will be processed.
                </p>
              </form>

              <div>
                <h3 style={{ marginBottom: '18px' }}>Your order</h3>

                <div style={{ display: 'grid', gap: '15px' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '65px', height: '65px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '14px' }}>
                          {item.name}
                        </strong>
                        <span style={{ fontSize: '13px', color: '#777' }}>
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <strong>${item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div style={summaryBoxStyle}>
                  <div style={summaryRowStyle}>
                    <span>Subtotal</span>
                    <strong>${cartTotal}</strong>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>Shipping</span>
                    <strong>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</strong>
                  </div>
                  <div style={{ ...summaryRowStyle, fontSize: '18px', borderTop: '1px solid #e9e5df', paddingTop: '15px' }}>
                    <strong>Total</strong>
                    <strong>${finalTotal}</strong>
                  </div>
                </div>

                <p style={{ color: '#777', fontSize: '13px', marginTop: '18px' }}>
                  {shippingCost === 0
                    ? 'Your order qualifies for free shipping.'
                    : `Add $${100 - cartTotal} more to qualify for free shipping.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className="quick-view-overlay" style={{ zIndex: 1200 }}>
          <div
            style={{
              background: '#fff',
              width: 'min(480px, 92%)',
              padding: '40px 25px',
              textAlign: 'center',
              color: '#24231f',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '65px',
                height: '65px',
                borderRadius: '50%',
                background: '#eaf4e9',
                color: '#387b42',
                display: 'grid',
                placeItems: 'center',
                fontSize: '32px',
                margin: '0 auto 20px',
              }}
            >
              ✓
            </div>

            <p className="eyebrow">THANK YOU FOR SHOPPING</p>
            <h2 style={{ marginBottom: '12px', fontFamily: 'Playfair Display, serif' }}>
              Order confirmed!
            </h2>
            <p style={{ color: '#777', marginBottom: '20px' }}>
              Your demo order has been placed successfully.
            </p>

            <div style={{ background: '#f6f4f0', padding: '15px', marginBottom: '22px' }}>
              <span style={{ display: 'block', color: '#777', fontSize: '13px' }}>
                Your order number
              </span>
              <strong style={{ fontSize: '20px' }}>{orderNumber}</strong>
            </div>

            <p style={{ marginBottom: '22px', fontSize: '14px' }}>
              A confirmation message would be sent to {orderEmail}.
            </p>

            <button
              className="button button-dark"
              style={{ width: '100%' }}
              onClick={closeOrderConfirmation}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const checkoutInputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #dedbd5',
  background: '#fff',
  color: '#24231f',
  font: 'inherit',
  fontSize: '14px',
  outlineOffset: '2px',
}

const labelStyle = {
  display: 'grid',
  gap: '6px',
  color: '#24231f',
  fontSize: '13px',
  fontWeight: 600,
}

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const summaryBoxStyle = {
  borderTop: '1px solid #e9e5df',
  marginTop: '22px',
  paddingTop: '18px',
  display: 'grid',
  gap: '12px',
}

export default App
