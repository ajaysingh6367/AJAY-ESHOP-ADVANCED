import React, { useEffect, useMemo, useState } from 'react';
import {
  Search, ShoppingBag, ShoppingCart, UserRound, Package, Heart, Star, Menu,
  X, Plus, Minus, Trash2, ArrowRight, CheckCircle2, SlidersHorizontal,
  Sparkles, Truck, ShieldCheck, RotateCcw, CreditCard, ChevronDown, Zap
} from 'lucide-react';

const products = [
  { id: 1, name: 'Studio Wireless Headphones', category: 'Electronics', price: 1499, oldPrice: 2199, rating: 4.8, reviews: 120, badge: 'BESTSELLER', color: 'Lavender', image: 'https://images.unsplash.com/photo-150575utu?auto=format&fit=crop&w=900&q=85', fallback: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85', description: 'Immersive sound, plush ear cushions and all-day comfort with a clean, modern design.', stock: 'In stock' },
  { id: 2, name: 'Active Smart Watch', category: 'Electronics', price: 2499, oldPrice: 3299, rating: 4.6, reviews: 85, badge: 'TRENDING', color: 'Midnight', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', description: 'Track your activity, check notifications and keep your daily routine on track.', stock: 'In stock' },
  { id: 3, name: 'Everyday Running Shoes', category: 'Fashion', price: 1999, oldPrice: 2799, rating: 4.7, reviews: 200, badge: 'TOP RATED', color: 'Cloud White', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', description: 'Lightweight everyday trainers built for a comfortable stride and sporty style.', stock: 'In stock' },
  { id: 4, name: 'Minimal Everyday Backpack', category: 'Fashion', price: 1299, oldPrice: 1799, rating: 4.5, reviews: 64, badge: 'NEW', color: 'Sand', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85', description: 'A versatile backpack with room for daily essentials, work and weekend adventures.', stock: 'In stock' },
  { id: 5, name: 'Ceramic Coffee Set', category: 'Home', price: 899, oldPrice: 1199, rating: 4.4, reviews: 48, badge: 'JUST IN', color: 'Cream', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85', description: 'A simple ceramic set to make your coffee corner feel calm and considered.', stock: 'In stock' },
  { id: 6, name: 'Premium Desk Lamp', category: 'Home', price: 1599, oldPrice: 1999, rating: 4.7, reviews: 93, badge: 'POPULAR', color: 'Matte Black', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85', description: 'Warm, focused lighting with a minimal silhouette for your study or workspace.', stock: 'In stock' }
];

const money = n => '₹' + Number(n).toLocaleString('en-IN');
const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};

function Stars({ rating }) {
  return <span className="rating"><span className="stars">★★★★★</span><span className="rating-num">{rating.toFixed(1)}</span></span>;
}

function App() {
  const [cart, setCart] = useState(() => load('ajay-eshop-cart', []));
  const [orders, setOrders] = useState(() => load('ajay-eshop-orders', []));
  const [wishlist, setWishlist] = useState(() => load('ajay-eshop-wishlist', []));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('home');
  const [selected, setSelected] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [user, setUser] = useState(() => load('ajay-eshop-user', null));
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => { localStorage.setItem('ajay-eshop-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('ajay-eshop-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('ajay-eshop-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('ajay-eshop-user', JSON.stringify(user)); }, [user]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home'];
  const shownProducts = useMemo(() => {
    let list = products.filter(p =>
      (category === 'All' || p.category === category) &&
      p.rating >= minRating &&
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, minRating, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 1999 ? 0 : 99;
  const total = subtotal + shipping;

  function addToCart(product) {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      return found ? current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...current, { ...product, qty: 1 }];
    });
    setToast(`${product.name} added to your cart`);
  }
  function changeQty(id, delta) {
    setCart(current => current.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0));
  }
  function toggleWishlist(id) {
    setWishlist(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    setToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist');
  }
  function goHome() { setView('home'); setDrawer(false); setMobileMenu(false); setSelected(null); }
  function placeOrder(e) {
    e.preventDefault();
    if (!cart.length) return;
    const order = { id: 'AJ' + Date.now().toString().slice(-7), date: new Date().toLocaleDateString('en-IN'), items: cart, total, status: 'Confirmed', customer: name, address };
    setOrders(current => [order, ...current]);
    setCart([]);
    setCheckoutOpen(false);
    setDrawer(false);
    setView('orders');
    setToast(`Order ${order.id} placed successfully!`);
    setAddress('');
  }
  function signIn(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setUser({ name: name.trim() || email.split('@')[0], email });
    setLoginOpen(false);
    setToast('Welcome to Ajay E-Shop!');
  }

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={14} /> Welcome offer: Free delivery on orders above ₹1,999 <span>•</span> Shop the latest picks</div>
      <header className="topbar">
        <div className="nav-inner">
          <button className="mobile-menu icon-btn" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu /></button>
          <button className="brand" onClick={goHome} aria-label="Ajay E-Shop home">
            <span className="brand-mark"><ShoppingBag size={21} /></span>
            <span>ajay<span className="brand-accent">shop</span><small>EVERYDAY FINDS, BETTER PRICES</small></span>
          </button>
          <div className="nav-links">
            <button className={view === 'home' ? 'nav-link active' : 'nav-link'} onClick={goHome}>Home</button>
            <button className={view === 'orders' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('orders'); setDrawer(false); }}>Orders</button>
            <button className={view === 'wishlist' ? 'nav-link active' : 'nav-link'} onClick={() => { setView('wishlist'); setDrawer(false); }}>Wishlist {wishlist.length > 0 && <span className="tiny-count">{wishlist.length}</span>}</button>
          </div>
          <div className="nav-actions">
            <button className="icon-btn account-btn" onClick={() => user ? setToast(`Signed in as ${user.email}`) : setLoginOpen(true)} aria-label="Account"><UserRound size={19} /><span>{user ? user.name.split(' ')[0] : 'Sign in'}</span></button>
            <button className="cart-btn" onClick={() => setDrawer(true)} aria-label="Open cart"><ShoppingCart size={19} /><span>Cart</span><b>{cartCount}</b></button>
          </div>
        </div>
        {mobileMenu && <div className="mobile-nav"><button onClick={goHome}>Home</button><button onClick={() => { setView('orders'); setMobileMenu(false); }}>Orders</button><button onClick={() => { setView('wishlist'); setMobileMenu(false); }}>Wishlist</button></div>}
      </header>

      <main>
        {view === 'home' && <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> THE EVERYDAY EDIT</div>
              <h1>Good finds.<br /><em>Great feeling.</em></h1>
              <p>Thoughtfully picked essentials for your everyday life. Discover your next favourite thing.</p>
              <button className="primary-btn hero-btn" onClick={() => { setCategory('All'); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore collection <ArrowRight size={17} /></button>
              <div className="hero-trust"><span><Truck size={16} /> Easy delivery</span><span><ShieldCheck size={16} /> Secure checkout</span></div>
            </div>
            <div className="hero-visual">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1300&q=90" alt="Beautifully arranged modern retail store" />
              <div className="hero-floating"><span className="floating-icon"><Zap size={18} /></span><span><b>Fresh picks</b><small>Made for your everyday</small></span></div>
              <div className="hero-number">01 <span>/ 04</span></div>
            </div>
          </section>

          <section className="benefits">
            <div><span className="benefit-icon"><Truck /></span><span><b>Free delivery</b><small>On orders over ₹1,999</small></span></div>
            <div><span className="benefit-icon"><RotateCcw /></span><span><b>Easy returns</b><small>7-day return window</small></span></div>
            <div><span className="benefit-icon"><ShieldCheck /></span><span><b>Secure payments</b><small>Your details stay safe</small></span></div>
            <div><span className="benefit-icon"><Heart /></span><span><b>Picked with care</b><small>Quality you can love</small></span></div>
          </section>

          <section className="shop-section" id="products">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT FAVOURITE</div><h2>Shop the collection<span>.</span></h2><p>Useful things. Lovely details. Prices you'll feel good about.</p></div><div className="collection-note"><span>✳</span> Curated for you</div></div>
            <div className="toolbar">
              <div className="search-wrap"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, categories..." aria-label="Search products" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={16} /></button>}</div>
              <label className="sort-wrap"><SlidersHorizontal size={16} /><span>Sort by</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label>
            </div>
            <div className="shop-layout">
              <aside className="filters">
                <div className="filter-title">Categories <span>+</span></div>
                {categories.map(c => <button key={c} className={category === c ? 'filter-option selected' : 'filter-option'} onClick={() => setCategory(c)}><span className="filter-dot" />{c}<small>{c === 'All' ? products.length : products.filter(p => p.category === c).length}</small></button>)}
                <div className="filter-divider" />
                <div className="filter-title">Customer rating</div>
                {[0, 4, 4.5, 4.7].map(r => <button key={r} className={minRating === r ? 'rating-filter chosen' : 'rating-filter'} onClick={() => setMinRating(r)}><span className="radio-dot" />{r === 0 ? 'All ratings' : <>{r}+ <span className="stars">★</span></>} </button>)}
                <div className="filter-promo"><Sparkles size={18} /><b>Good things await</b><p>Find something lovely for your everyday.</p><button onClick={() => { setCategory('All'); setMinRating(0); setSearch(''); }}>Reset filters <ArrowRight size={14} /></button></div>
              </aside>
              <div className="products-area">
                <div className="results-line"><span><b>{shownProducts.length}</b> items to love</span><span className="results-caption">Showing {shownProducts.length} of {products.length} products</span></div>
                {shownProducts.length ? <div className="product-grid">{shownProducts.map((p, i) => <article className="product-card" key={p.id} style={{ animationDelay: `${i * 55}ms` }}>
                  <div className="product-image-wrap">
                    <img src={p.image} onError={e => { if (p.fallback && e.currentTarget.src !== p.fallback) e.currentTarget.src = p.fallback; else e.currentTarget.src = 'https://placehold.co/700x700/f0eee9/6b6258?text=Ajay+Shop'; }} alt={p.name} />
                    <span className="product-badge">{p.badge}</span>
                    <button className={wishlist.includes(p.id) ? 'wishlist-btn liked' : 'wishlist-btn'} onClick={() => toggleWishlist(p.id)} aria-label="Toggle wishlist"><Heart size={17} fill={wishlist.includes(p.id) ? 'currentColor' : 'none'} /></button>
                    <button className="quick-view" onClick={() => setSelected(p)}>Quick view <ArrowRight size={14} /></button>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{p.category}</div><h3>{p.name}</h3>
                    <Stars rating={p.rating} /><div className="price-row"><div><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del></div><span className="discount">{Math.round((1 - p.price / p.oldPrice) * 100)}% off</span></div>
                    <button className="add-btn" onClick={() => addToCart(p)}><ShoppingBag size={16} /> Add to cart</button>
                  </div>
                </article>)}</div> : <div className="empty-state"><Search size={28} /><h3>No products found</h3><p>Try another search or clear your filters.</p><button className="secondary-btn" onClick={() => { setSearch(''); setCategory('All'); setMinRating(0); }}>Clear filters</button></div>}
              </div>
            </div>
          </section>
          <section className="newsletter"><div className="newsletter-icon"><Sparkles /></div><div><div className="eyebrow">A LITTLE GOOD NEWS</div><h2>Lovely finds, straight to your inbox.</h2><p>Sign in to save your favourites and keep track of your orders.</p></div><button className="primary-btn" onClick={() => setLoginOpen(true)}>Join the shop <ArrowRight size={16} /></button></section>
        </>}

        {view === 'orders' && <section className="page-section"><div className="eyebrow"><span className="eyebrow-line" /> YOUR ACCOUNT</div><h1 className="page-title">Your orders<span>.</span></h1><p className="page-subtitle">Every good find, all in one place.</p>{orders.length ? <div className="orders-list">{orders.map(o => <article className="order-card" key={o.id}><div className="order-top"><div><small>ORDER ID</small><b>{o.id}</b></div><span className="status"><CheckCircle2 size={14} /> {o.status}</span></div><div className="order-items">{o.items.map(i => <div key={i.id} className="order-item"><img src={i.image} alt={i.name} /><div><b>{i.name}</b><small>Qty: {i.qty}</small></div><strong>{money(i.price * i.qty)}</strong></div>)}</div><div className="order-bottom"><span>Placed on {o.date}</span><b>Total paid: {money(o.total)}</b></div></article>)}</div> : <div className="empty-state"><Package size={32} /><h3>No orders yet</h3><p>Your next favourite thing is waiting to be found.</p><button className="primary-btn" onClick={goHome}>Explore products <ArrowRight size={16} /></button></div>}</section>}

        {view === 'wishlist' && <section className="page-section"><div className="eyebrow"><span className="eyebrow-line" /> SAVED FOR LATER</div><h1 className="page-title">Your wishlist<span>.</span></h1><p className="page-subtitle">All the things you have your eye on.</p>{wishlist.length ? <div className="product-grid wishlist-grid">{products.filter(p => wishlist.includes(p.id)).map(p => <article className="product-card" key={p.id}><div className="product-image-wrap"><img src={p.image} alt={p.name} /><button className="wishlist-btn liked" onClick={() => toggleWishlist(p.id)} aria-label="Remove from wishlist"><Heart size={17} fill="currentColor" /></button></div><div className="product-info"><div className="product-category">{p.category}</div><h3>{p.name}</h3><Stars rating={p.rating} /><div className="price-row"><b>{money(p.price)}</b><del>{money(p.oldPrice)}</del></div><button className="add-btn" onClick={() => addToCart(p)}><ShoppingBag size={16} /> Add to cart</button></div></article>)}</div> : <div className="empty-state"><Heart size={32} /><h3>Your wishlist is waiting</h3><p>Tap the heart on a product to save it here.</p><button className="primary-btn" onClick={goHome}>Find your favourites <ArrowRight size={16} /></button></div>}</section>}
      </main>

      <footer className="footer"><div className="footer-main"><button className="brand footer-brand" onClick={goHome}><span className="brand-mark"><ShoppingBag size={21} /></span><span>ajay<span className="brand-accent">shop</span><small>EVERYDAY FINDS, BETTER PRICES</small></span></button><p>Small things that make everyday living feel a little better.</p><div className="footer-social"><span>Made with care</span><span>© {new Date().getFullYear()} Ajay Shop</span></div></div><div className="footer-links"><div><b>Explore</b><button onClick={goHome}>All products</button><button onClick={() => { setCategory('Electronics'); setView('home'); }}>Electronics</button><button onClick={() => { setCategory('Fashion'); setView('home'); }}>Fashion</button></div><div><b>Help & account</b><button onClick={() => setView('orders')}>Track orders</button><button onClick={() => setLoginOpen(true)}>Your account</button><button onClick={() => setDrawer(true)}>Shopping cart</button></div></div></footer>

      {drawer && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setDrawer(false); }}><aside className="cart-drawer"><div className="drawer-header"><div><small>YOUR SELECTION</small><h2>Shopping bag <span>({cartCount})</span></h2></div><button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close cart"><X /></button></div>{cart.length ? <><div className="drawer-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><b>{item.name}</b><small>{item.category}</small><strong>{money(item.price)}</strong><div className="qty-control"><button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity"><Minus size={13} /></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity"><Plus size={13} /></button><button className="remove-btn" onClick={() => { setCart(c => c.filter(x => x.id !== item.id)); setToast('Item removed from cart'); }} aria-label="Remove item"><Trash2 size={14} /></button></div></div></div>)}</div><div className="drawer-summary"><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><b>{shipping === 0 ? 'FREE' : money(shipping)}</b></div>{shipping > 0 && <small>Add {money(1999 - subtotal)} more for free delivery.</small>}<div className="total-row"><span>Total</span><b>{money(total)}</b></div><button className="primary-btn checkout-btn" onClick={() => { setCheckoutOpen(true); setName(user?.name || ''); }}>Continue to checkout <ArrowRight size={16} /></button><button className="continue-shopping" onClick={() => setDrawer(false)}>Continue shopping</button><p><ShieldCheck size={14} /> Secure checkout · Easy returns</p></div></> : <div className="empty-state cart-empty"><span className="empty-bag"><ShoppingBag size={28} /></span><h3>Your bag is taking a break</h3><p>Looks like you haven't added anything yet.</p><button className="primary-btn" onClick={() => { setDrawer(false); goHome(); }}>Discover products <ArrowRight size={16} /></button></div>}</aside></div>}

      {selected && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><div className="product-modal"><button className="modal-close icon-btn" onClick={() => setSelected(null)} aria-label="Close product"><X /></button><div className="modal-image"><img src={selected.image} alt={selected.name} /></div><div className="modal-details"><div className="eyebrow"><span className="eyebrow-line" /> {selected.category}</div><h2>{selected.name}</h2><Stars rating={selected.rating} /><p className="modal-description">{selected.description}</p><div className="modal-price"><b>{money(selected.price)}</b><del>{money(selected.oldPrice)}</del><span>{Math.round((1-selected.price/selected.oldPrice)*100)}% off</span></div><div className="detail-row"><span>Colour</span><b>{selected.color}</b></div><div className="detail-row"><span>Availability</span><b className="in-stock"><span /> {selected.stock}</b></div><div className="modal-perks"><span><Truck size={16} /> Easy delivery</span><span><RotateCcw size={16} /> 7-day returns</span></div><button className="primary-btn modal-add" onClick={() => { addToCart(selected); setSelected(null); setDrawer(true); }}><ShoppingBag size={17} /> Add to bag — {money(selected.price)}</button><button className="text-action" onClick={() => toggleWishlist(selected.id)}><Heart size={16} fill={wishlist.includes(selected.id) ? 'currentColor' : 'none'} /> {wishlist.includes(selected.id) ? 'Remove from wishlist' : 'Save to wishlist'}</button></div></div></div>}

      {loginOpen && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setLoginOpen(false); }}><div className="form-modal"><button className="modal-close icon-btn" onClick={() => setLoginOpen(false)} aria-label="Close sign in"><X /></button><span className="form-icon"><UserRound size={23} /></span><div className="eyebrow">WELCOME TO THE SHOP</div><h2>Good to see you<span>.</span></h2><p>Sign in to keep your favourites and orders together.</p><form onSubmit={signIn}><label>Your name <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ajay" /></label><label>Email address <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label><button className="primary-btn full-btn" type="submit">Continue <ArrowRight size={16} /></button></form><small className="form-note">Demo sign-in only. No password or payment details are collected.</small></div></div>}

      {checkoutOpen && <div className="overlay modal-overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCheckoutOpen(false); }}><div className="form-modal checkout-modal"><button className="modal-close icon-btn" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout"><X /></button><span className="form-icon"><CreditCard size={23} /></span><div className="eyebrow">ALMOST YOURS</div><h2>Delivery details<span>.</span></h2><p>Enter where you'd like your order delivered.</p><form onSubmit={placeOrder}><label>Full name <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /></label><label>Email address <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Delivery address <textarea required value={address} onChange={e => setAddress(e.target.value)} placeholder="House no., street, city, PIN code" rows="3" /></label><div className="checkout-total"><span>Order total</span><b>{money(total)}</b></div><button className="primary-btn full-btn" type="submit">Place demo order <ArrowRight size={16} /></button></form><small className="form-note">Demo checkout: no real payment is taken.</small></div></div>}

      {toast && <div className="toast"><CheckCircle2 size={18} /><span>{toast}</span><button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
      <button className="floating-cart" onClick={() => setDrawer(true)} aria-label="Open shopping cart"><ShoppingCart size={20} /><span>{cartCount}</span></button>
    </div>
  );
}

export default App;