import { useState, useMemo, useCallback } from 'react';
import { Product, CartItem } from './types';
import { products, categories, roastLevels } from './data/products';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorNotes.some((note) =>
          note.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRoast =
        selectedRoast === 'All' || product.roast === selectedRoast;
      return matchesSearch && matchesCategory && matchesRoast;
    });
  }, [searchQuery, selectedCategory, selectedRoast]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const completeCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutComplete(false);
      setIsCheckoutOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">☕</span>
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-900 leading-tight">
                  Ember & Bloom
                </h1>
                <p className="text-[10px] sm:text-xs text-amber-700/70 tracking-widest uppercase hidden sm:block">
                  Specialty Coffee
                </p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search coffees, origins, flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-full text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Mobile search toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search coffees, origins, flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-full text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                  autoFocus
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-amber-300/80 text-sm tracking-widest uppercase mb-3 font-medium">
              Artisan Roasted • Small Batch
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-4">
              Coffee that tells<br />a story
            </h2>
            <p className="text-amber-100/80 text-base sm:text-lg leading-relaxed max-w-lg">
              Sourced from the world's finest growing regions, roasted with care to reveal each bean's unique character. Every cup is an invitation to slow down and savor.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap mr-1">
              Type:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Roast filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap mr-1">
              Roast:
            </span>
            {roastLevels.map((roast) => (
              <button
                key={roast}
                onClick={() => setSelectedRoast(roast)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  selectedRoast === roast
                    ? 'bg-amber-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {roast}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="mt-4 text-sm text-stone-500">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'coffee' : 'coffees'}
          {searchQuery && (
            <span> for "<span className="text-amber-800 font-medium">{searchQuery}</span>"</span>
          )}
        </p>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-xl font-serif text-stone-700 mb-2">No coffees found</h3>
            <p className="text-stone-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-2xl mb-3 block">☕</span>
          <p className="font-serif text-lg text-stone-200 mb-1">Ember & Bloom</p>
          <p className="text-sm">Crafted with passion since 2019</p>
          <p className="text-xs mt-4 text-stone-500">
            All prices in USD • Free shipping on orders over $50
          </p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(qty) => {
            addToCart(selectedProduct, qty);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          cartTotal={cartTotal}
          isComplete={checkoutComplete}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={completeCheckout}
        />
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
}: {
  product: Product;
  onViewDetails: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-stone-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Product Image Area */}
      <div
        className="relative h-48 sm:h-56 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center cursor-pointer"
        onClick={onViewDetails}
      >
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </span>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-amber-800 shadow-sm">
            {product.roast}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 bg-amber-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-sm">
            {product.origin}
          </span>
        </div>
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/5 transition-colors flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="px-5 py-2 bg-white text-amber-900 rounded-full text-sm font-semibold shadow-lg hover:bg-amber-50 transition-colors transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="font-serif text-lg font-bold text-stone-800 cursor-pointer hover:text-amber-800 transition-colors"
            onClick={onViewDetails}
          >
            {product.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-stone-600">{product.rating}</span>
          </div>
        </div>

        {/* Flavor Notes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.flavorNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Price and Weight */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-amber-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-stone-400 ml-1">/ {product.weight}</span>
          </div>
          <button
            onClick={onAddToCart}
            className="p-2.5 bg-amber-900 hover:bg-amber-800 text-white rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="Add to cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Product Detail Modal
function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="h-56 sm:h-64 bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center rounded-t-3xl">
          <span className="text-8xl">{product.image}</span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
              {product.roast}
            </span>
            <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
              {product.origin}
            </span>
            <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-xs font-semibold">
              {product.category}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800 mb-2">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-500' : 'text-stone-200'} fill-current`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-stone-500 ml-1">{product.rating} / 5</span>
          </div>

          <p className="text-stone-600 leading-relaxed mb-5">{product.description}</p>

          {/* Flavor Notes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Flavor Notes
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <div>
              <span className="text-3xl font-bold text-amber-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-stone-400 ml-2">/ {product.weight}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center bg-stone-100 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-stone-200 rounded-l-full transition-colors"
                >
                  <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-3 text-sm font-semibold text-stone-800 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-stone-200 rounded-r-full transition-colors"
                >
                  <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => onAddToCart(quantity)}
                className="px-6 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar
function CartSidebar({
  cart,
  cartTotal,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="text-xl font-serif font-bold text-stone-800">
            Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🛒</span>
              <p className="text-stone-500 font-medium">Your cart is empty</p>
              <p className="text-sm text-stone-400 mt-1">Add some delicious coffee!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-stone-50 rounded-xl"
                >
                  {/* Product icon */}
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-2xl">{item.product.image}</span>
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-800 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-stone-500">{item.product.weight}</p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity controls */}
                      <div className="flex items-center bg-white rounded-full border border-stone-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-100 rounded-l-full transition-colors"
                        >
                          <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-stone-100 rounded-r-full transition-colors"
                        >
                          <svg className="w-3 h-3 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-bold text-amber-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors self-start"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-stone-100 p-5 bg-stone-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-stone-500">Subtotal</span>
              <span className="text-sm text-stone-700">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-stone-500">Shipping</span>
              <span className="text-sm text-stone-700">
                {cartTotal >= 50 ? 'Free' : '$5.99'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200">
              <span className="text-base font-semibold text-stone-800">Total</span>
              <span className="text-xl font-bold text-amber-900">
                ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99)).toFixed(2)}
              </span>
            </div>
            {cartTotal < 50 && (
              <p className="text-xs text-amber-700 mt-2 text-center">
                Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <button
              onClick={onCheckout}
              className="w-full mt-4 py-3.5 bg-amber-900 hover:bg-amber-800 text-white rounded-full font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Checkout Modal
function CheckoutModal({
  cart,
  cartTotal,
  isComplete,
  onClose,
  onComplete,
}: {
  cart: CartItem[];
  cartTotal: number;
  isComplete: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">Order Confirmed!</h2>
          <p className="text-stone-500">
            Thank you for your order. Your freshly roasted coffee is on its way.
          </p>
          <p className="text-sm text-stone-400 mt-3">Order #EB-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6">Checkout</h2>

          {/* Order Summary */}
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
              Order Summary
            </h3>
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-stone-600">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-stone-800 font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-stone-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className="text-stone-700">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-1">
                  <span className="text-stone-800">Total</span>
                  <span className="text-amber-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onComplete();
            }}
          >
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
              Shipping Details
            </h3>
            <div className="space-y-3 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                />
              </div>
            </div>

            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
              Payment (Simulated)
            </h3>
            <div className="space-y-3 mb-6">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-900 hover:bg-amber-800 text-white rounded-full font-semibold text-sm transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Place Order — ${total.toFixed(2)}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3">
              🔒 This is a simulated checkout. No real payment will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
