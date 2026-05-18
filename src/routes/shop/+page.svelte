<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { base } from '$app/paths';
  import { ShoppingBag, CreditCard, Filter, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-svelte';

  const categories = ['All', 'Jerseys', 'Training Gear', 'Football Boots', 'Scarves', 'Matchday Products'];
  let selectedCategory = $state('All');

  const products = [
    {
      id: 1,
      name: "FC Bayern Home Jersey 2026/27",
      price: 99.95,
      image: `${base}/images/Titels/Fan Shop.png`,
      category: "Jerseys",
      description: "The authentic home matchday jersey for the 2026/2027 season. Engineered for elite performance."
    },
    {
      id: 2,
      name: "FC Bayern Away Jersey 2026/27",
      price: 99.95,
      image: `${base}/images/Titels/Fan Shop.png`,
      category: "Jerseys",
      description: "Elegant mint & purple colorways for away clashes. Premium breathable fabric."
    },
    {
      id: 3,
      name: "UCL Squad Presentation Jacket",
      price: 89.95,
      image: `${base}/images/Titels/Fan shop 2.png`,
      category: "Training Gear",
      description: "Official presentation wear as worn by Kompany and the squad during Champions League press events."
    },
    {
      id: 4,
      name: "Elite Hybrid Performance Top",
      price: 74.95,
      image: `${base}/images/Titels/Fan shop 4 .png`,
      category: "Training Gear",
      description: "Tailored fit with temperature-regulating technology. Perfect for cool-weather training."
    },
    {
      id: 5,
      name: "Classic Kaiser Turf Boots",
      price: 139.95,
      image: `${base}/images/Titels/Fußballschuhe FC Bayern.jpg`,
      category: "Football Boots",
      description: "Premium full-grain leather classic designed for multi-ground control and absolute comfort."
    },
    {
      id: 6,
      name: "Pro Speed Carbon FG Boots",
      price: 219.95,
      image: `${base}/images/Titels/Fußballschuhe FC Bayern.jpg`,
      category: "Football Boots",
      description: "Lightweight carbon-fiber frame engineered for rapid accelerations and supreme agility."
    },
    {
      id: 7,
      name: "Official Matchday Bar Scarf",
      price: 19.95,
      image: `${base}/images/Titels/Fan shop 5 .png`,
      category: "Scarves",
      description: "The timeless red & white club bar scarf. Essential for any stadium visitor."
    },
    {
      id: 8,
      name: "Mia San Mia Jacquard Scarf",
      price: 24.95,
      image: `${base}/images/Titels/Fan shop 5 .png`,
      category: "Scarves",
      description: "Premium knit design featuring our eternal club motto: Mia San Mia."
    },
    {
      id: 9,
      name: "Team Hooded Winter Coat",
      price: 149.95,
      image: `${base}/images/Titels/Fan shop 6.png`,
      category: "Matchday Products",
      description: "Insulated long-length winter parka. Keeps you warm during freezing nights at the Allianz Arena."
    },
    {
      id: 10,
      name: "Allianz Arena Thermos Flask",
      price: 18.95,
      image: `${base}/images/Titels/Fan shop 5 .png`,
      category: "Matchday Products",
      description: "Vacuum-sealed double-walled steel flask keeping drinks hot up to 12 hours. Premium red finish."
    }
  ];

  let filteredProducts = $derived(
    selectedCategory === 'All' 
      ? products 
      : products.filter(p => p.category === selectedCategory)
  );

  let selectedProduct = $state<any>(null);
  let orderSuccess = $state(false);
  let selectedSize = $state('M');
  let customPrint = $state('');
  let orderQty = $state(1);

  function openProductDetail(product: any) {
    selectedProduct = product;
    orderSuccess = false;
    selectedSize = product.category === 'Football Boots' ? '42' : 'M';
    customPrint = '';
    orderQty = 1;
  }

  function handlePlaceOrder() {
    orderSuccess = true;
    setTimeout(() => {
      selectedProduct = null;
      orderSuccess = false;
    }, 2800);
  }
</script>

<div class="shop-page-wrapper">
  <!-- Shop Header -->
  <header class="shop-header">
    <div class="header-breadcrumbs">
      <a href="{base}/" class="back-link">
        <ArrowLeft size={16} /> Back to Dashboard
      </a>
      <ChevronRight size={14} class="crumb-separator" />
      <span class="active-crumb">Megastore</span>
    </div>
    <div class="header-title-block">
      <div class="megastore-logo-badge">
        <ShoppingBag size={20} />
      </div>
      <div class="title-details">
        <h1>FC Bayern Munich Megastore 🛒</h1>
        <p>Premium official merchandise & player-exclusive gear</p>
      </div>
    </div>
  </header>

  <!-- Category Selector -->
  <div class="filter-bar">
    <div class="filter-title">
      <Filter size={14} /> <span>Filter by Category:</span>
    </div>
    <div class="categories-list">
      {#each categories as category}
        <button 
          class="cat-button" 
          class:active={selectedCategory === category}
          onclick={() => selectedCategory = category}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>

  <!-- Products Grid -->
  <div class="shop-products-grid">
    {#each filteredProducts as product}
      <div role="button" tabindex="0" onclick={() => openProductDetail(product)} class="premium-product-card clickable-shop-item">
        <div class="product-img-frame">
          <img src={product.image} alt={product.name} class="product-img" />
          <span class="product-badge">{product.category}</span>
        </div>
        <div class="product-content">
          <h3 class="product-title">{product.name}</h3>
          <p class="product-desc">{product.description}</p>
          <div class="product-footer">
            <span class="price-lbl">€{product.price.toFixed(2)}</span>
            <button class="buy-btn">
              <ShoppingBag size={14} /> <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Premium Order Modal -->
{#if selectedProduct}
  <div class="modal-overlay animate-fade" onclick={() => selectedProduct = null}>
    <div class="modal-content animate-in" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={() => selectedProduct = null}>&times;</button>
      
      {#if orderSuccess}
        <div class="checkout-success-view">
          <div class="success-icon-badge">✓</div>
          <h2>Squad Ledger debited!</h2>
          <p>Your order for <strong>{selectedProduct.name}</strong> (Qty: {orderQty}, Size: {selectedSize}) has been registered with the FC Bayern Equipment Office. It will be delivered directly to your stadium locker.</p>
          <div class="success-footer-note">Authorized via SpielerPlus Vault</div>
        </div>
      {:else}
        <div class="checkout-header-banner">
          <div class="comp-badge-shop">
            <ShoppingBag size={16} />
            <span>Equipment Manager Dispatch</span>
          </div>
          <h2>Order Customization</h2>
          <p>Order official kit via personal player account ledger</p>
        </div>

        <div class="checkout-body-grid">
          <!-- Product image and details -->
          <div class="checkout-product-preview">
            <div class="checkout-img-wrapper">
              <img src={selectedProduct.image} alt="" class="checkout-img" />
            </div>
            <h3 class="preview-title">{selectedProduct.name}</h3>
            <p class="preview-text-desc">{selectedProduct.description}</p>
            <span class="preview-price">€{selectedProduct.price.toFixed(2)}</span>
          </div>

          <!-- Configuration options -->
          <div class="checkout-form-options">
            <div class="form-group">
              <label for="size-select">
                {selectedProduct.category === 'Football Boots' ? 'Select Boot Size' : 'Select Size'}
              </label>
              <div class="size-buttons">
                {#if selectedProduct.category === 'Football Boots'}
                  {#each ['41', '42', '43', '44', '45'] as size}
                    <button 
                      class="size-btn" 
                      class:active={selectedSize === size}
                      onclick={() => selectedSize = size}
                    >
                      {size}
                    </button>
                  {/each}
                {:else if selectedProduct.category === 'Scarves' || selectedProduct.category === 'Matchday Products'}
                  <button class="size-btn active">One Size</button>
                {:else}
                  {#each ['S', 'M', 'L', 'XL'] as size}
                    <button 
                      class="size-btn" 
                      class:active={selectedSize === size}
                      onclick={() => selectedSize = size}
                    >
                      {size}
                    </button>
                  {/each}
                {/if}
              </div>
            </div>

            {#if selectedProduct.category === 'Jerseys'}
              <div class="form-group">
                <label for="jersey-print">Custom Name & Squad Number (+ €15.00)</label>
                <input 
                  id="jersey-print"
                  type="text" 
                  placeholder="e.g. MÜLLER 25" 
                  bind:value={customPrint}
                  class="premium-input"
                />
              </div>
            {/if}

            <div class="form-group">
              <label for="qty-select">Quantity</label>
              <div class="qty-counter">
                <button class="qty-btn" onclick={() => orderQty = Math.max(1, orderQty - 1)}>-</button>
                <span class="qty-value">{orderQty}</span>
                <button class="qty-btn" onclick={() => orderQty += 1}>+</button>
              </div>
            </div>

            <!-- Ledger Summary -->
            <div class="checkout-summary-receipt">
              <div class="receipt-line">
                <span>Subtotal ({orderQty} item{orderQty > 1 ? 's' : ''})</span>
                <span>€{(selectedProduct.price * orderQty).toFixed(2)}</span>
              </div>
              {#if customPrint && selectedProduct.category === 'Jerseys'}
                <div class="receipt-line">
                  <span>Custom Printing Surcharge</span>
                  <span>€15.00</span>
                </div>
              {/if}
              <div class="receipt-line total">
                <span>Locker Ledger Total</span>
                <span class="text-primary font-black">
                  €{((selectedProduct.price * orderQty) + (customPrint && selectedProduct.category === 'Jerseys' ? 15 : 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <button class="checkout-submit-btn w-full mt-6" onclick={handlePlaceOrder}>
              <CreditCard size={18} /> Confirm Order
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .shop-page-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .shop-header {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-radius: var(--radius-lg);
    padding: 2rem;
    color: white;
    box-shadow: var(--shadow-md);
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .shop-header::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%);
    border-radius: 50%;
  }

  .header-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
    margin-bottom: 1rem;
  }

  .back-link {
    color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: white;
  }

  .crumb-separator {
    color: rgba(255, 255, 255, 0.3);
  }

  .active-crumb {
    color: var(--primary);
    font-weight: 700;
  }

  .header-title-block {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .megastore-logo-badge {
    background: var(--primary);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  }

  .title-details h1 {
    font-size: 1.75rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .title-details p {
    font-size: 0.9375rem;
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  /* Filter bar */
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid var(--border);
    padding: 1rem 1.5rem;
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .filter-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .categories-list {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .cat-button {
    background: #f1f5f9;
    border: 1px solid transparent;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cat-button:hover {
    background: #e2e8f0;
    color: var(--text-main);
  }

  .cat-button.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
  }

  /* Products grid */
  .shop-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .premium-product-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .premium-product-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: rgba(220, 38, 38, 0.2) !important;
  }

  .product-img-frame {
    position: relative;
    height: 160px;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(15, 23, 42, 0.03);
  }

  .product-img {
    height: 100%;
    max-width: 90%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .premium-product-card:hover .product-img {
    transform: scale(1.08);
  }

  .product-badge {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    background: rgba(15, 23, 42, 0.85);
    color: white;
    font-size: 0.625rem;
    font-weight: 800;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .product-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .product-title {
    font-size: 0.875rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.375rem;
    line-height: 1.4;
  }

  .product-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 0 0 1rem;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px dashed var(--border);
    padding-top: 0.75rem;
    margin-top: auto;
  }

  .price-lbl {
    font-size: 1rem;
    font-weight: 900;
    color: var(--text-main);
  }

  .buy-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 750;
    cursor: pointer;
    transition: var(--transition);
  }

  .buy-btn:hover {
    background: #b91c1c;
  }

  /* Interactive Premium Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 1.5rem;
  }

  .modal-content {
    background: var(--surface);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 620px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
    color: var(--text-main);
    border: 1px solid var(--border);
  }

  .close-btn {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: rgba(15, 23, 42, 0.05);
    border: none;
    font-size: 1.75rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .close-btn:hover {
    background: rgba(220, 38, 38, 0.1);
    color: var(--primary);
  }

  /* Success View Screen */
  .checkout-success-view {
    padding: 4rem 2rem;
    text-align: center;
    background: linear-gradient(180deg, rgba(5, 150, 105, 0.04) 0%, transparent 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .success-icon-badge {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    border: 3px solid #059669;
    box-shadow: 0 4px 15px rgba(5, 150, 105, 0.2);
    animation: successScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes successScale {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  .checkout-success-view h2 {
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--text-main);
    margin: 0 0 0.75rem;
    letter-spacing: -0.02em;
  }

  .checkout-success-view p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    max-width: 440px;
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .success-footer-note {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #059669;
    background: rgba(5, 150, 105, 0.08);
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
  }

  /* Checkout Main UI */
  .checkout-header-banner {
    padding: 2.5rem 2rem 1.5rem;
    background: linear-gradient(180deg, rgba(220, 38, 38, 0.03) 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
  }

  .comp-badge-shop {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(15, 23, 42, 0.05);
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .checkout-header-banner h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
  }

  .checkout-header-banner p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    margin: 0;
    font-weight: 500;
  }

  .checkout-body-grid {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    gap: 2rem;
    padding: 2rem;
    background: #fafafa;
  }

  @media (max-width: 600px) {
    .checkout-body-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .checkout-product-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    text-align: center;
    box-shadow: var(--shadow-sm);
  }

  .checkout-img-wrapper {
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(15, 23, 42, 0.02);
  }

  .checkout-img {
    width: 90%;
    height: 90%;
    object-fit: contain;
  }

  .preview-title {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-main);
    margin: 0 0 0.5rem;
    line-height: 1.4;
  }

  .preview-text-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }

  .preview-price {
    font-size: 1.125rem;
    font-weight: 900;
    color: var(--primary);
  }

  /* Checkout Form Options */
  .checkout-form-options {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .size-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .size-btn {
    flex: 1;
    min-width: 44px;
    background: white;
    border: 1px solid var(--border);
    padding: 0.5rem 0;
    font-weight: 700;
    font-size: 0.875rem;
    color: var(--text-main);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
  }

  .size-btn:hover {
    border-color: var(--primary);
    background: rgba(220, 38, 38, 0.02);
  }

  .size-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 10px rgba(220, 38, 38, 0.25);
  }

  .premium-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: white;
    color: var(--text-main);
    font-weight: 600;
    font-size: 0.875rem;
  }

  .premium-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
  }

  .qty-counter {
    display: flex;
    align-items: center;
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    width: fit-content;
    overflow: hidden;
  }

  .qty-btn {
    border: none;
    background: none;
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-main);
    cursor: pointer;
    transition: var(--transition);
  }

  .qty-btn:hover {
    background: #f1f5f9;
  }

  .qty-value {
    width: 44px;
    text-align: center;
    font-weight: 800;
    color: var(--text-main);
    font-size: 0.9375rem;
  }

  /* Checkout Receipt Summary */
  .checkout-summary-receipt {
    background: white;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.125rem 1.25rem;
    box-shadow: var(--shadow-sm);
    margin-top: 0.5rem;
  }

  .receipt-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .receipt-line.total {
    border-top: 1px dashed var(--border);
    padding-top: 0.625rem;
    margin-top: 0.625rem;
    margin-bottom: 0;
    font-size: 0.9375rem;
    font-weight: 850;
    color: var(--text-main);
  }

  .checkout-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.875rem;
    font-size: 0.9375rem;
    font-weight: 800;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
  }

  .checkout-submit-btn:hover {
    background: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
  }

  .checkout-submit-btn:active {
    transform: translateY(0);
  }

  /* Animations */
  .animate-fade {
    animation: overlayFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-in {
    animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes overlayFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
