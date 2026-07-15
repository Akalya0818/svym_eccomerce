// --- State Management ---
const state = {
  products: [],
  filteredProducts: [],
  filters: {
    search: '',
    category: '',
    sort: 'rating-desc',
    selectedTag: ''
  },
  isLoading: true,
  
  // Wishlist State (Stage 2)
  wishlists: [], // Array of wishlists: { id, name, colorTheme, createdAt, items: [] }
  activeListId: null, // Current selected wishlist ID

  // Merge State (Stage 3 & 4)
  activeImportedList: null, // Decoded imported wishlist object
  mergeData: {
    onlyInA: [],
    onlyInB: [],
    identical: [],
    conflicts: [] // Array of { product, itemA, itemB, resolution: null }
  }
};

// Colors mapping for HSL themes
const COSMIC_THEMES = {
  cyan: { glow: '#06b6d4', rgb: '6, 182, 212' },
  purple: { glow: '#a855f7', rgb: '168, 85, 247' },
  gold: { glow: '#f59e0b', rgb: '245, 158, 11' },
  rose: { glow: '#f43f5e', rgb: '244, 63, 94' },
  emerald: { glow: '#10b981', rgb: '16, 185, 129' }
};

// Cosmic descriptions for Quick-view modal
const COSMIC_DESCRIPTIONS = [
  "Forged in the heart of a dying star, this unique item encapsulates stellar elegance and futuristic design, ideal for deep-space collectors.",
  "Designed to operate under extreme gravitational forces, blending state-of-the-art physics with practical aesthetic comfort.",
  "Bask in the ambient glow of celestial alignment. This artifact radiates subtle subatomic energy, enhancing any quadrant of your stellar living space.",
  "A perfect companion for interstellar navigation. Highly rated by the Cosmic Exploration Association for quality, efficiency, and timelessness."
];

// --- DOM Elements ---
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

// Wishlist DOM elements (Stage 2)
const wishlistSelector = document.getElementById('wishlist-selector');
const newListBtn = document.getElementById('new-list-btn');
const deleteListBtn = document.getElementById('delete-list-btn');
const themeDots = document.getElementById('theme-dots');
const wishlistItemsList = document.getElementById('wishlist-items-list');
const canvasEmptyState = document.getElementById('canvas-empty-state');
const shareListBtn = document.getElementById('share-list-btn');

// Modals
const quickviewModal = document.getElementById('quickview-modal');
const quickviewCloseBtn = document.getElementById('quickview-close-btn');
const qvImage = document.getElementById('qv-image');
const qvCategory = document.getElementById('qv-category');
const qvName = document.getElementById('qv-name');
const qvRatingContainer = document.getElementById('qv-rating-container');
const qvPrice = document.getElementById('qv-price');
const qvDescription = document.getElementById('qv-description');
const addWishlistForm = document.getElementById('add-wishlist-form');
const qvPriority = document.getElementById('qv-priority');
const qvNote = document.getElementById('qv-note');
const qvAddBtn = document.getElementById('qv-add-btn');

// New Wishlist Modal
const newListModal = document.getElementById('new-list-modal');
const newListCloseBtn = document.getElementById('new-list-close-btn');
const newListNameInput = document.getElementById('new-list-name-input');
const newListThemeDots = document.getElementById('new-list-theme-dots');
const saveNewListBtn = document.getElementById('save-new-list-btn');

// Share Modal (Stage 3)
const shareModal = document.getElementById('share-modal');
const shareCloseBtn = document.getElementById('share-close-btn');
const shareCodeArea = document.getElementById('share-code-area');
const copyCodeBtn = document.getElementById('copy-code-btn');

// Import Modal (Stage 3)
const importBtn = document.getElementById('import-btn');
const importModal = document.getElementById('import-modal');
const importCloseBtn = document.getElementById('import-close-btn');
const importCodeArea = document.getElementById('import-code-area');
const loadImportBtn = document.getElementById('load-import-btn');

// Local Merge DOM references
const localMergeBtn = document.getElementById('local-merge-btn');
const localMergeModal = document.getElementById('local-merge-modal');
const localMergeCloseBtn = document.getElementById('local-merge-close-btn');
const localMergeSelect = document.getElementById('local-merge-select');
const startLocalMergeBtn = document.getElementById('start-local-merge-btn');
const directLocalMergeBtn = document.getElementById('direct-local-merge-btn');

// Confirm Delete Modal selectors
const confirmDeleteModal = document.getElementById('confirm-delete-modal');
const confirmDeleteCloseBtn = document.getElementById('confirm-delete-close-btn');
const cancelDeleteListBtn = document.getElementById('cancel-delete-list-btn');
const executeDeleteListBtn = document.getElementById('execute-delete-list-btn');
const deleteListName = document.getElementById('delete-list-name');

// Merge Preview Modal (Stage 3 & 4)
const mergeModal = document.getElementById('merge-modal');
const mergeCloseBtn = document.getElementById('merge-close-btn');
const mergeCanvas = document.getElementById('merge-canvas');
const statTotal = document.getElementById('stat-total');
const statUniqueA = document.getElementById('stat-unique-a');
const statUniqueB = document.getElementById('stat-unique-b');
const statConflicts = document.getElementById('stat-conflicts');
const mergeConflictsList = document.getElementById('merge-conflicts-list');
const mergeNonconflictsList = document.getElementById('merge-nonconflicts-list');
const mergeNewName = document.getElementById('merge-new-name');
const confirmMergeBtn = document.getElementById('confirm-merge-btn');
const cancelMergeBtn = document.getElementById('cancel-merge-btn');

// Toast Container
const toastContainer = document.getElementById('toast-container');

// Canvas details
const activeCanvas = document.getElementById('constellation-canvas');
let activeCanvasCtx = null;
let activeCanvasPhysics = []; // Particles for physics simulator
let activeCanvasAnimationId = null;

// Merge Canvas details
let mergeCanvasCtx = null;
let mergeCanvasAnimationId = null;
let mergeParticles = []; // Particles for merge animation
let mergeAnimationProgress = 0; // 0 to 1

// Selected product for quick-view modal
let selectedProductId = null;
let newListTheme = 'cyan'; // tracks chosen theme for new list

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundTwinkle();
  loadWishlistsFromStorage();
  initStorefront();
  initModals();
  initActiveWishlistCanvas();
  initSPARouter();
  initDealsPage();
  initSupportPage();
});

// --- Toast System ---
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'warning') icon = 'fa-triangle-exclamation';
  if (type === 'error') icon = 'fa-circle-xmark';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Close handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    dismissToast(toast);
  });
  
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    dismissToast(toast);
  }, 4000);
}

function dismissToast(toast) {
  if (toast.classList.contains('dismissing')) return;
  toast.classList.add('dismissing');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

// --- // --- Background Twinkle Canvas (with space nebulae drift, Stage 5) ---
function initBackgroundTwinkle() {
  const canvas = document.getElementById('bg-twinkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let stars = [];
  const starCount = 120;
  let nebulae = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
    createNebulae();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random(),
        speed: 0.003 + Math.random() * 0.008,
        driftX: (Math.random() - 0.5) * 0.03,
        driftY: (Math.random() - 0.5) * 0.03
      });
    }
  }
  
  function createNebulae() {
    nebulae = [
      { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 260, color: 'rgba(6, 182, 212, 0.025)', vx: 0.06, vy: 0.04 },
      { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 340, color: 'rgba(168, 85, 247, 0.02)', vx: -0.04, vy: 0.05 },
      { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 300, color: 'rgba(244, 63, 94, 0.02)', vx: 0.05, vy: -0.03 },
      { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 320, color: 'rgba(99, 102, 241, 0.025)', vx: -0.03, vy: -0.04 }
    ];
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw colorful drifting space nebulae background
    nebulae.forEach(neb => {
      neb.x += neb.vx;
      neb.y += neb.vy;
      
      if (neb.x - neb.radius < 0 || neb.x + neb.radius > canvas.width) neb.vx = -neb.vx;
      if (neb.y - neb.radius < 0 || neb.y + neb.radius > canvas.height) neb.vy = -neb.vy;
      
      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.radius);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0) {
        star.speed = -star.speed;
      }
      star.alpha = Math.max(0, Math.min(1, star.alpha));

      star.x += star.driftX;
      star.y += star.driftY;

      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;

      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  animate();
}

// --- Storefront Initialization ---
function initStorefront() {
  renderSkeletons();
  
  searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value.toLowerCase();
    applyFilters();
  });

  categoryFilter.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    applyFilters();
  });

  sortFilter.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    applyFilters();
  });

  productsGrid.addEventListener('mousemove', handleCardTilt);
  productsGrid.addEventListener('mouseleave', resetCardTilt, true);
  
  // Click handler delegation for cards
  productsGrid.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.wishlist-toggle-btn');
    const card = e.target.closest('.product-card');
    
    if (toggleBtn && card) {
      e.stopPropagation();
      const pId = card.getAttribute('data-id');
      
      // Spawn particle sparkle burst (Stage 5 Live Effect)
      spawnSparkles(e.clientX, e.clientY);
      
      handleHeartToggle(pId);
    } else if (card) {
      const pId = card.getAttribute('data-id');
      openQuickView(pId);
    }
  });

  // Simulate loading delay (300-500ms)
  setTimeout(() => {
    state.products = typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
    state.isLoading = false;
    
    applyFilters();
    updateStorefrontHearts();
  }, 400);
}

// --- Render Skeleton Cards ---
function renderSkeletons() {
  productsGrid.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-img skeleton-pulse"></div>
      <div class="skeleton-text short skeleton-pulse" style="margin-bottom: 1rem;"></div>
      <div class="skeleton-text long skeleton-pulse"></div>
      <div class="skeleton-text medium skeleton-pulse"></div>
      <div class="skeleton-text short skeleton-pulse" style="margin-top: auto;"></div>
    `;
    productsGrid.appendChild(skeleton);
  }
}

// --- Render Product Cards ---
function renderProducts() {
  productsGrid.innerHTML = '';
  
  if (state.filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-grid-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <i class="fa-solid fa-cloud-moon" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; opacity: 0.5;"></i>
        <h3 style="margin-bottom: 0.5rem;">No cosmic items found</h3>
        <p class="text-muted">Try adjusting your filters or search terms.</p>
      </div>
    `;
    return;
  }

  const activeWishlist = getActiveWishlist();
  
  state.filteredProducts.forEach((product, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    
    // Staggered load animation delay
    card.style.animationDelay = `${idx * 45}ms`;
    
    const stockBadge = product.inStock ? '' : '<span class="out-of-stock-badge">Out of Stock</span>';
    const isWished = activeWishlist && activeWishlist.items.some(item => item.productId === product.id);
    const activeClass = isWished ? 'active' : '';

    // Build rating stars
    let starsHtml = '';
    const fullStars = Math.floor(product.rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHtml += '<i class="fa-solid fa-star"></i>';
      } else if (i === fullStars && product.rating % 1 >= 0.5) {
        starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="fa-regular fa-star"></i>';
      }
    }

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-image-container">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${stockBadge}
          <button class="wishlist-toggle-btn ${activeClass}" aria-label="Add to wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>
        <span class="card-category">${product.category}</span>
        <h3 class="card-title" title="${product.name}">${product.name}</h3>
        <div class="card-meta">
          <span class="card-price">$${product.price.toFixed(2)}</span>
          <div class="rating-container">
            <div class="rating-stars">${starsHtml}</div>
            <span class="rating-value">(${product.rating})</span>
          </div>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

// --- Apply Filters & Sorting ---
function applyFilters() {
  if (state.isLoading) return;
  
  state.filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(state.filters.search) || 
                          product.category.toLowerCase().includes(state.filters.search);
                          
    const matchesCategory = state.filters.category === '' || product.category === state.filters.category;
    
    return matchesSearch && matchesCategory;
  });

  if (state.filters.sort === 'price-asc') {
    state.filteredProducts.sort((a, b) => a.price - b.price);
  } else if (state.filters.sort === 'price-desc') {
    state.filteredProducts.sort((a, b) => b.price - a.price);
  } else if (state.filters.sort === 'name-asc') {
    state.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    state.filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  renderProducts();
}

// --- Heart Toggling Logic ---
function handleHeartToggle(productId) {
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist) {
    showToast("Please create a wishlist first!", "warning");
    return;
  }
  
  const existingItemIndex = activeWishlist.items.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    const product = state.products.find(p => p.id === productId);
    activeWishlist.items.splice(existingItemIndex, 1);
    saveWishlistsToStorage();
    
    updateStorefrontHearts();
    renderWishlistUI();
    
    showToast(`Removed "${product ? product.name : 'Item'}" from constellation`, 'info');
  } else {
    openQuickView(productId);
  }
}

// --- Update Storefront Heart Indicators ---
function updateStorefrontHearts() {
  const activeWishlist = getActiveWishlist();
  const hearts = document.querySelectorAll('.wishlist-toggle-btn');
  
  hearts.forEach(btn => {
    const card = btn.closest('.product-card');
    if (!card) return;
    const pId = card.getAttribute('data-id');
    
    const isWished = activeWishlist && activeWishlist.items.some(item => item.productId === pId);
    if (isWished) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// --- Card 3D Tilt Hover effect ---
function handleCardTilt(e) {
  const card = e.target.closest('.product-card');
  if (!card) return;
  
  const inner = card.querySelector('.card-inner');
  const rect = inner.getBoundingClientRect();
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // spotlight shine coordinates
  inner.style.setProperty('--mouse-x', `${x}px`);
  inner.style.setProperty('--mouse-y', `${y}px`);
  
  const width = rect.width;
  const height = rect.height;
  
  const rotateX = -(y / height - 0.5) * 16;
  const rotateY = (x / width - 0.5) * 16;
  
  inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
}

function resetCardTilt(e) {
  const card = e.target.closest('.product-card');
  if (!card) return;
  
  const inner = card.querySelector('.card-inner');
  if (inner) {
    inner.style.transform = '';
  }
}

// --- MODAL UTILITIES (Stage 2) ---
function initModals() {
  quickviewCloseBtn.addEventListener('click', () => closeModal(quickviewModal));
  newListCloseBtn.addEventListener('click', () => closeModal(newListModal));
  
  // Share close modal (Stage 3)
  shareCloseBtn.addEventListener('click', () => closeModal(shareModal));
  
  // Import close modals (Stage 3)
  importCloseBtn.addEventListener('click', () => closeModal(importModal));
  importBtn.addEventListener('click', () => {
    importCodeArea.value = '';
    openModal(importModal);
    importCodeArea.focus();
  });
  
  // Merge close modal (Stage 3)
  mergeCloseBtn.addEventListener('click', abortMerge);
  cancelMergeBtn.addEventListener('click', abortMerge);
  
  document.querySelectorAll('.modal').forEach(modal => {
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        if (modal.id === 'merge-modal') {
          abortMerge();
        } else {
          closeModal(modal);
        }
      });
    }
  });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.classList.contains('hidden')) {
          if (modal.id === 'merge-modal') {
            abortMerge();
          } else {
            closeModal(modal);
          }
        }
      });
    }
  });

  // Handle Quickview Submit Add/Update Item
  addWishlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) {
      showToast("Please create a wishlist cluster first!", "warning");
      return;
    }
    
    const priority = qvPriority.value;
    const note = qvNote.value.trim();
    
    const existingIndex = activeWishlist.items.findIndex(item => item.productId === selectedProductId);
    const product = state.products.find(p => p.id === selectedProductId);
    
    if (existingIndex > -1) {
      activeWishlist.items[existingIndex].priority = priority;
      activeWishlist.items[existingIndex].note = note;
      showToast(`Updated "${product.name}" star properties`, 'success');
    } else {
      activeWishlist.items.push({
        productId: selectedProductId,
        addedAt: Date.now(),
        priority: priority,
        note: note
      });
      showToast(`Star "${product.name}" added to constellation`, 'success');
    }
    
    saveWishlistsToStorage();
    closeModal(quickviewModal);
    renderWishlistUI();
    updateStorefrontHearts();
  });

  // New list button triggers modal
  newListBtn.addEventListener('click', () => {
    newListNameInput.value = '';
    newListTheme = 'cyan';
    updateNewListThemeDots();
    openModal(newListModal);
    newListNameInput.focus();
  });

  // Dots selector in New Wishlist Modal
  newListThemeDots.addEventListener('click', (e) => {
    const dot = e.target.closest('.theme-dot');
    if (!dot) return;
    newListTheme = dot.getAttribute('data-theme');
    updateNewListThemeDots();
  });

  // Save new list
  saveNewListBtn.addEventListener('click', () => {
    const name = newListNameInput.value.trim();
    if (!name) {
      showToast("Please enter a name for the constellation list", "warning");
      return;
    }
    
    const listId = 'list-' + Date.now();
    const newListObj = {
      id: listId,
      name: name,
      colorTheme: newListTheme,
      createdAt: Date.now(),
      items: []
    };
    
    state.wishlists.push(newListObj);
    state.activeListId = listId;
    
    saveWishlistsToStorage();
    closeModal(newListModal);
    populateWishlistSelector();
    renderWishlistUI();
    updateStorefrontHearts();
    showToast(`Wishlist "${name}" formed!`, 'success');
  });

  // Delete active list (opens custom confirm delete modal, Stage 5)
  deleteListBtn.addEventListener('click', () => {
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;
    
    deleteListName.textContent = activeWishlist.name;
    openModal(confirmDeleteModal);
  });

  confirmDeleteCloseBtn.addEventListener('click', () => closeModal(confirmDeleteModal));
  cancelDeleteListBtn.addEventListener('click', () => closeModal(confirmDeleteModal));
  
  executeDeleteListBtn.addEventListener('click', () => {
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;

    const idx = state.wishlists.findIndex(w => w.id === state.activeListId);
    if (idx > -1) {
      state.wishlists.splice(idx, 1);
      
      if (state.wishlists.length > 0) {
        state.activeListId = state.wishlists[0].id;
      } else {
        const defaultList = {
          id: 'list-default',
          name: 'My Wishlist',
          colorTheme: 'cyan',
          createdAt: Date.now(),
          items: []
        };
        state.wishlists.push(defaultList);
        state.activeListId = defaultList.id;
      }
      
      saveWishlistsToStorage();
      closeModal(confirmDeleteModal);
      populateWishlistSelector();
      renderWishlistUI();
      updateStorefrontHearts();
      showToast("Cluster vaporized successfully", "info");
    }
  });

  // Wishlist dropdown change selector
  wishlistSelector.addEventListener('change', (e) => {
    state.activeListId = e.target.value;
    renderWishlistUI();
    updateStorefrontHearts();
  });

  // Change existing list accent theme color dots directly in sidebar
  themeDots.addEventListener('click', (e) => {
    const dot = e.target.closest('.theme-dot');
    if (!dot) return;
    
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;
    
    const theme = dot.getAttribute('data-theme');
    activeWishlist.colorTheme = theme;
    
    saveWishlistsToStorage();
    updateSidebarThemeDots();
    updateThemeClass();
    showToast(`Wishlist accent updated to ${theme}`, 'info');
  });

  // --- Export Code generation & Clipboard (Stage 3) ---
  shareListBtn.addEventListener('click', () => {
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;
    
    if (activeWishlist.items.length === 0) {
      showToast("Cannot export an empty wishlist cluster. Add some stars first!", "warning");
      return;
    }
    
    try {
      const code = serializeWishlist(activeWishlist);
      shareCodeArea.value = code;
      openModal(shareModal);
      shareCodeArea.select();
    } catch (e) {
      showToast("Failed to generate export code", "error");
      console.error(e);
    }
  });

  copyCodeBtn.addEventListener('click', () => {
    shareCodeArea.select();
    try {
      navigator.clipboard.writeText(shareCodeArea.value).then(() => {
        showToast("Cosmic code copied to clipboard!", "success");
      }).catch(err => {
        // Fallback for older browsers
        document.execCommand('copy');
        showToast("Cosmic code copied to clipboard!", "success");
      });
    } catch (e) {
      document.execCommand('copy');
      showToast("Cosmic code copied to clipboard!", "success");
    }
  });

  // --- Process Import Code (Stage 3) ---
  loadImportBtn.addEventListener('click', () => {
    const code = importCodeArea.value.trim();
    if (!code) {
      showToast("Please paste a cosmic wishlist code.", "warning");
      return;
    }
    
    try {
      const imported = deserializeWishlist(code);
      if (!imported || !imported.name || !Array.isArray(imported.items)) {
        throw new Error("Invalid format structure");
      }
      
      state.activeImportedList = imported;
      closeModal(importModal);
      
      // Initialize merge flow comparison & UI
      initMergeFlow();
    } catch (e) {
      showToast("Malformed or corrupted cosmic code. Please check your clipboard.", "error");
      console.error("Import error:", e);
    }
  });

  // Handle Confirms/Completes Fusion (Stage 3 & 4)
  confirmMergeBtn.addEventListener('click', completeWishlistMerge);

  // --- Local Merge (Stage 5) ---
  localMergeCloseBtn.addEventListener('click', () => closeModal(localMergeModal));

  localMergeBtn.addEventListener('click', () => {
    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;

    // Find all other local wishlists
    const otherLists = state.wishlists.filter(w => w.id !== state.activeListId);

    if (otherLists.length === 0) {
      showToast("No other local wishlist clusters found. Please create a new wishlist first!", "warning");
      return;
    }

    // Populate select dropdown
    localMergeSelect.innerHTML = '';
    otherLists.forEach(w => {
      const opt = document.createElement('option');
      opt.value = w.id;
      opt.textContent = `${w.name} (${w.items.length} ${w.items.length === 1 ? 'star' : 'stars'})`;
      localMergeSelect.appendChild(opt);
    });

    openModal(localMergeModal);
  });

  startLocalMergeBtn.addEventListener('click', () => {
    const selectedListId = localMergeSelect.value;
    const selectedList = state.wishlists.find(w => w.id === selectedListId);

    if (!selectedList) {
      showToast("Selected list not found.", "error");
      return;
    }

    // Clone to prevent mutating original until merge confirmed
    state.activeImportedList = JSON.parse(JSON.stringify(selectedList));
    closeModal(localMergeModal);

    // Trigger merge flow
    initMergeFlow();
  });

  // Direct Merge (Immediate fusion without preview, Stage 5)
  directLocalMergeBtn.addEventListener('click', () => {
    const selectedListId = localMergeSelect.value;
    const selectedList = state.wishlists.find(w => w.id === selectedListId);

    if (!selectedList) {
      showToast("Selected list not found.", "error");
      return;
    }

    const activeWishlist = getActiveWishlist();
    if (!activeWishlist) return;

    if (activeWishlist.items.length === 0 && selectedList.items.length === 0) {
      showToast("Both wishlists are empty. Nothing to merge.", "warning");
      return;
    }

    const mergedName = `${activeWishlist.name} + ${selectedList.name}`;
    const mergedItems = [];

    const mapA = new Map(activeWishlist.items.map(i => [i.productId, i]));
    const mapB = new Map(selectedList.items.map(i => [i.productId, i]));

    // Merge unique A and combine overlaps
    activeWishlist.items.forEach(itemA => {
      if (mapB.has(itemA.productId)) {
        const itemB = mapB.get(itemA.productId);
        const pMap = { low: 1, medium: 2, high: 3 };
        const resolvedPriority = pMap[itemA.priority] >= pMap[itemB.priority] ? itemA.priority : itemB.priority;

        const notes = [];
        if (itemA.note) notes.push(itemA.note.trim());
        if (itemB.note) notes.push(itemB.note.trim());
        const resolvedNote = notes.join(" | ");

        mergedItems.push({
          productId: itemA.productId,
          addedAt: Math.min(itemA.addedAt || Date.now(), itemB.addedAt || Date.now()),
          priority: resolvedPriority,
          note: resolvedNote
        });
      } else {
        mergedItems.push({ ...itemA });
      }
    });

    // Merge unique B
    selectedList.items.forEach(itemB => {
      if (!mapA.has(itemB.productId)) {
        mergedItems.push({ ...itemB });
      }
    });

    const mergedId = 'list-' + Date.now();
    const mergedListObj = {
      id: mergedId,
      name: mergedName,
      colorTheme: activeWishlist.colorTheme,
      createdAt: Date.now(),
      items: mergedItems
    };

    state.wishlists.push(mergedListObj);
    state.activeListId = mergedId;
    saveWishlistsToStorage();

    closeModal(localMergeModal);
    populateWishlistSelector();
    renderWishlistUI();
    updateStorefrontHearts();

    showToast(`Directly fused! Created "${mergedName}"`, 'success');
  });
}

function openModal(modal) {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function updateNewListThemeDots() {
  newListThemeDots.querySelectorAll('.theme-dot').forEach(dot => {
    if (dot.getAttribute('data-theme') === newListTheme) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function updateSidebarThemeDots() {
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist) return;
  
  themeDots.querySelectorAll('.theme-dot').forEach(dot => {
    if (dot.getAttribute('data-theme') === activeWishlist.colorTheme) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// --- Quick View Modal Populate ---
function openQuickView(productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  
  selectedProductId = productId;
  
  qvImage.src = product.image;
  qvImage.alt = product.name;
  qvCategory.textContent = product.category;
  qvName.textContent = product.name;
  qvPrice.textContent = `$${product.price.toFixed(2)}`;
  
  const descIdx = Math.abs(productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % COSMIC_DESCRIPTIONS.length;
  qvDescription.textContent = COSMIC_DESCRIPTIONS[descIdx];
  
  let starsHtml = '';
  const fullStars = Math.floor(product.rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    } else if (i === fullStars && product.rating % 1 >= 0.5) {
      starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      starsHtml += '<i class="fa-regular fa-star"></i>';
    }
  }
  qvRatingContainer.innerHTML = starsHtml;
  
  const activeWishlist = getActiveWishlist();
  const existingItem = activeWishlist ? activeWishlist.items.find(item => item.productId === productId) : null;
  
  if (existingItem) {
    qvPriority.value = existingItem.priority;
    qvNote.value = existingItem.note || '';
    qvAddBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Update Star Node';
  } else {
    qvPriority.value = 'medium';
    qvNote.value = '';
    qvAddBtn.innerHTML = '<i class="fa-solid fa-heart"></i> Add to Wishlist';
  }
  
  openModal(quickviewModal);
}

// --- Wishlist Storage Handling (Stage 2) ---
function loadWishlistsFromStorage() {
  try {
    const stored = localStorage.getItem('stellar_wishlists');
    if (stored) {
      state.wishlists = JSON.parse(stored);
    }
  } catch (err) {
    showToast("Local storage is disabled. Your wishlists won't persist across reloads.", "warning");
    console.warn("Storage warning:", err);
  }

  if (!state.wishlists || state.wishlists.length === 0) {
    state.wishlists = [
      {
        id: 'list-default',
        name: 'My Wishlist',
        colorTheme: 'cyan',
        createdAt: Date.now(),
        items: []
      }
    ];
  }
  
  try {
    const lastActive = localStorage.getItem('stellar_active_list_id');
    if (lastActive && state.wishlists.some(w => w.id === lastActive)) {
      state.activeListId = lastActive;
    } else {
      state.activeListId = state.wishlists[0].id;
    }
  } catch (e) {
    state.activeListId = state.wishlists[0].id;
  }

  populateWishlistSelector();
  renderWishlistUI();
}

function saveWishlistsToStorage() {
  try {
    localStorage.setItem('stellar_wishlists', JSON.stringify(state.wishlists));
    if (state.activeListId) {
      localStorage.setItem('stellar_active_list_id', state.activeListId);
    }
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

function getActiveWishlist() {
  return state.wishlists.find(w => w.id === state.activeListId) || null;
}

function populateWishlistSelector() {
  wishlistSelector.innerHTML = '';
  state.wishlists.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.id;
    opt.textContent = `${w.name} (${w.items.length} ${w.items.length === 1 ? 'star' : 'stars'})`;
    wishlistSelector.appendChild(opt);
  });
  wishlistSelector.value = state.activeListId;
}

function updateThemeClass() {
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist) return;
  
  document.body.classList.remove('theme-cyan', 'theme-purple', 'theme-gold', 'theme-rose', 'theme-emerald');
  document.body.classList.add(`theme-${activeWishlist.colorTheme}`);
}

// --- Render Wishlist Sidebar List + Canvas Sync (Stage 2) ---
function renderWishlistUI() {
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist) return;
  
  updateThemeClass();
  updateSidebarThemeDots();
  populateWishlistSelector();
  
  wishlistItemsList.innerHTML = '';
  
  if (activeWishlist.items.length === 0) {
    canvasEmptyState.classList.remove('hidden');
    wishlistItemsList.innerHTML = `
      <li class="empty-list-indicator" style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1.5rem 0.5rem; list-style: none;">
        No items in this cluster list yet.
      </li>
    `;
    syncCanvasParticles();
    return;
  }
  
  canvasEmptyState.classList.add('hidden');
  
  activeWishlist.items.forEach(item => {
    const product = state.products.find(p => p.id === item.productId);
    if (!product) return;
    
    const row = document.createElement('li');
    row.className = 'wishlist-item-row';
    row.setAttribute('data-pid', item.productId);
    
    const prioClass = item.priority || 'medium';
    const noteText = item.note ? ` - "${item.note}"` : '';
    const tooltipText = `${product.name} [${prioClass.toUpperCase()}]${noteText}`;
    
    row.innerHTML = `
      <span class="item-priority-indicator ${prioClass}"></span>
      <span class="item-row-name" title="${tooltipText}">${product.name}</span>
      <div class="item-row-actions">
        <button class="btn-row-action edit" title="Edit star properties">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button class="btn-row-action delete" title="Vaporize star node">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
    
    row.querySelector('.edit').addEventListener('click', (e) => {
      e.stopPropagation();
      openQuickView(item.productId);
    });
    
    row.querySelector('.delete').addEventListener('click', (e) => {
      e.stopPropagation();
      handleHeartToggle(item.productId);
    });
    
    row.querySelector('.item-row-name').addEventListener('click', () => {
      openQuickView(item.productId);
    });
    
    wishlistItemsList.appendChild(row);
  });
  
  syncCanvasParticles();
}

// --- Active Wishlist Interactive Canvas System (Stage 2) ---
function initActiveWishlistCanvas() {
  if (!activeCanvas) return;
  activeCanvasCtx = activeCanvas.getContext('2d');
  
  function resize() {
    const rect = activeCanvas.parentNode.getBoundingClientRect();
    activeCanvas.width = rect.width * window.devicePixelRatio;
    activeCanvas.height = rect.height * window.devicePixelRatio;
    activeCanvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  runActiveCanvasLoop();
}

function syncCanvasParticles() {
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist || activeWishlist.items.length === 0) {
    activeCanvasPhysics = [];
    return;
  }
  
  const width = activeCanvas.width / window.devicePixelRatio;
  const height = activeCanvas.height / window.devicePixelRatio;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const newParticles = [];
  
  activeWishlist.items.forEach((item, index) => {
    const product = state.products.find(p => p.id === item.productId);
    if (!product) return;
    
    const existing = activeCanvasPhysics.find(p => p.productId === item.productId);
    
    if (existing) {
      existing.priority = item.priority;
      existing.note = item.note;
      existing.targetOrbitRadius = 60 + index * 18;
      newParticles.push(existing);
    } else {
      const angle = Math.random() * Math.PI * 2;
      const spawnRadius = 250;
      
      newParticles.push({
        productId: item.productId,
        productName: product.name,
        priority: item.priority,
        note: item.note,
        x: centerX + Math.cos(angle) * spawnRadius,
        y: centerY + Math.sin(angle) * spawnRadius,
        vx: 0,
        vy: 0,
        orbitAngle: angle,
        orbitSpeed: 0.002 + Math.random() * 0.004 * (Math.random() > 0.5 ? 1 : -1),
        targetOrbitRadius: 60 + index * 18,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
  });
  
  activeCanvasPhysics = newParticles;
}

function runActiveCanvasLoop() {
  if (activeCanvasAnimationId) {
    cancelAnimationFrame(activeCanvasAnimationId);
  }
  
  function step() {
    drawActiveConstellation();
    activeCanvasAnimationId = requestAnimationFrame(step);
  }
  
  step();
}

function drawActiveConstellation() {
  if (!activeCanvasCtx) return;
  
  const width = activeCanvas.width / window.devicePixelRatio;
  const height = activeCanvas.height / window.devicePixelRatio;
  
  activeCanvasCtx.clearRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  const activeWishlist = getActiveWishlist();
  if (!activeWishlist || activeCanvasPhysics.length === 0) return;
  
  const activeThemeName = activeWishlist.colorTheme;
  const themeColors = COSMIC_THEMES[activeThemeName] || COSMIC_THEMES.cyan;
  
  // core
  activeCanvasCtx.shadowBlur = 20;
  activeCanvasCtx.shadowColor = themeColors.glow;
  activeCanvasCtx.fillStyle = '#ffffff';
  activeCanvasCtx.beginPath();
  activeCanvasCtx.arc(centerX, centerY, 7, 0, Math.PI * 2);
  activeCanvasCtx.fill();
  activeCanvasCtx.shadowBlur = 0;
  
  activeCanvasCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  activeCanvasCtx.font = '9px var(--font-display)';
  activeCanvasCtx.textAlign = 'center';
  activeCanvasCtx.fillText('GRAVITATIONAL CORE', centerX, centerY + 18);
  
  activeCanvasPhysics.forEach((star, index) => {
    star.orbitAngle += star.orbitSpeed;
    const targetX = centerX + Math.cos(star.orbitAngle) * star.targetOrbitRadius;
    const targetY = centerY + Math.sin(star.orbitAngle) * star.targetOrbitRadius;
    
    const ax = (targetX - star.x) * 0.05;
    const ay = (targetY - star.y) * 0.05;
    
    star.vx = (star.vx + ax) * 0.85;
    star.vy = (star.vy + ay) * 0.85;
    
    activeCanvasPhysics.forEach((otherStar, otherIndex) => {
      if (index === otherIndex) return;
      const dx = star.x - otherStar.x;
      const dy = star.y - otherStar.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDistance = 25;
      
      if (dist < minDistance && dist > 0) {
        const force = (minDistance - dist) * 0.08;
        star.vx += (dx / dist) * force;
        star.vy += (dy / dist) * force;
      }
    });
    
    star.x += star.vx;
    star.y += star.vy;
    
    let baseRadius = 4;
    let glowSize = 10;
    let pulseIntensity = 0;
    
    if (star.priority === 'low') {
      baseRadius = 2.5;
      glowSize = 2;
    } else if (star.priority === 'high') {
      baseRadius = 6;
      glowSize = 20;
      pulseIntensity = Math.sin(Date.now() * 0.005 + star.pulseOffset) * 4;
    } else {
      baseRadius = 4.5;
      glowSize = 10;
      pulseIntensity = Math.sin(Date.now() * 0.002 + star.pulseOffset) * 2;
    }
    
    const finalRadius = baseRadius + pulseIntensity * 0.15;
    const finalGlow = glowSize + pulseIntensity;
    
    activeCanvasCtx.beginPath();
    activeCanvasCtx.moveTo(centerX, centerY);
    activeCanvasCtx.lineTo(star.x, star.y);
    activeCanvasCtx.lineWidth = star.priority === 'high' ? 0.8 : 0.4;
    
    const lineGrad = activeCanvasCtx.createLinearGradient(centerX, centerY, star.x, star.y);
    lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
    lineGrad.addColorStop(1, `rgba(${themeColors.rgb}, ${star.priority === 'high' ? 0.3 : 0.15})`);
    
    activeCanvasCtx.strokeStyle = lineGrad;
    activeCanvasCtx.stroke();
    
    if (star.priority !== 'low') {
      activeCanvasCtx.shadowBlur = finalGlow;
      activeCanvasCtx.shadowColor = themeColors.glow;
    }
    
    activeCanvasCtx.fillStyle = star.priority === 'high' ? '#ffffff' : `rgba(${themeColors.rgb}, 0.9)`;
    activeCanvasCtx.beginPath();
    activeCanvasCtx.arc(star.x, star.y, finalRadius, 0, Math.PI * 2);
    activeCanvasCtx.fill();
    activeCanvasCtx.shadowBlur = 0;
    
    if (star.priority === 'high') {
      activeCanvasCtx.fillStyle = '#ffffff';
      activeCanvasCtx.beginPath();
      activeCanvasCtx.arc(star.x, star.y, finalRadius * 0.4, 0, Math.PI * 2);
      activeCanvasCtx.fill();
    }
    
    if (star.priority === 'high') {
      activeCanvasCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      activeCanvasCtx.font = '8px sans-serif';
      activeCanvasCtx.fillText(star.productName.substring(0, 12) + '...', star.x, star.y - finalRadius - 4);
    }
  });
}

// --- BASE64 SERIALIZER & CODEC (Stage 3) ---
function serializeWishlist(wishlist) {
  const data = {
    name: wishlist.name,
    colorTheme: wishlist.colorTheme,
    items: wishlist.items.map(item => ({
      productId: item.productId,
      priority: item.priority,
      note: item.note || ''
    }))
  };
  const jsonStr = JSON.stringify(data);
  // Base64 encoding supporting Unicode characters safely
  return btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

function deserializeWishlist(base64Str) {
  const raw = atob(base64Str.trim());
  const jsonStr = decodeURIComponent(raw.split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonStr);
}

// --- MERGE LOGIC FLOW (Stage 3 & 4) ---
function initMergeFlow() {
  const activeWishlist = getActiveWishlist();
  const importedList = state.activeImportedList;
  if (!activeWishlist || !importedList) return;

  // Handle edge case: merging same list or both empty
  if (activeWishlist.items.length === 0 && importedList.items.length === 0) {
    showToast("Both wishlists are empty. Nothing to merge.", "warning");
    return;
  }

  // Detect items
  const itemsA = activeWishlist.items;
  const itemsB = importedList.items;
  
  const mapA = new Map(itemsA.map(i => [i.productId, i]));
  const mapB = new Map(itemsB.map(i => [i.productId, i]));
  
  const onlyInA = [];
  const onlyInB = [];
  const identical = [];
  const conflicts = [];
  
  // Check A items
  itemsA.forEach(itemA => {
    const product = state.products.find(p => p.id === itemA.productId);
    if (!product) return;
    
    if (mapB.has(itemA.productId)) {
      const itemB = mapB.get(itemA.productId);
      if (itemA.priority === itemB.priority && (itemA.note || '') === (itemB.note || '')) {
        identical.push({ product, itemA, itemB });
      } else {
        conflicts.push({ product, itemA, itemB, resolution: null });
      }
    } else {
      onlyInA.push({ product, itemA });
    }
  });
  
  // Check B items
  itemsB.forEach(itemB => {
    const product = state.products.find(p => p.id === itemB.productId);
    if (!product) return;
    
    if (!mapA.has(itemB.productId)) {
      onlyInB.push({ product, itemB });
    }
  });

  // Edge case: check if we are merging a list with itself
  const isSelf = activeWishlist.name === importedList.name && 
                 itemsA.length === itemsB.length && 
                 conflicts.length === 0 && 
                 onlyInA.length === 0 && 
                 onlyInB.length === 0;

  if (isSelf) {
    showToast("You are merging this wishlist with itself!", "warning");
  }

  // Populate state
  state.mergeData = { onlyInA, onlyInB, identical, conflicts };
  
  // Default new wishlist name suggestion
  mergeNewName.value = `${activeWishlist.name} + ${importedList.name}`;
  
  // Populate Diff lists
  renderMergeDiffLists();
  
  // Open Modal & Launch Merge Canvas
  openModal(mergeModal);
  initMergeCanvasAnimation(activeWishlist, importedList);
}

function renderMergeDiffLists() {
  const { onlyInA, onlyInB, identical, conflicts } = state.mergeData;
  
  // Summary Stats
  const totalItems = onlyInA.length + onlyInB.length + identical.length + conflicts.length;
  statTotal.textContent = totalItems;
  statUniqueA.textContent = onlyInA.length;
  statUniqueB.textContent = onlyInB.length;
  statConflicts.textContent = conflicts.length;
  
  // Clear lists
  mergeConflictsList.innerHTML = '';
  mergeNonconflictsList.innerHTML = '';

  // Helper for rendering rating stars
  function makeStars(rating) {
    let html = '';
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < full) html += '<i class="fa-solid fa-star"></i>';
      else html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }
  
  // RENDER CONFLICTS
  if (conflicts.length === 0) {
    mergeConflictsList.innerHTML = `
      <div class="empty-list-indicator text-success" style="padding: 1.5rem; text-align: center;">
        <i class="fa-solid fa-face-smile animate-pulse" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
        <p>No star priority/note conflicts found!</p>
      </div>
    `;
  } else {
    conflicts.forEach((conf, idx) => {
      const row = document.createElement('div');
      row.className = 'diff-row conflict-unresolved';
      row.setAttribute('data-conf-idx', idx);
      
      const noteA = conf.itemA.note ? `"${conf.itemA.note}"` : 'None';
      const noteB = conf.itemB.note ? `"${conf.itemB.note}"` : 'None';
      
      row.innerHTML = `
        <div class="diff-row-header">
          <span class="diff-product-name" title="${conf.product.name}">${conf.product.name}</span>
          <span class="diff-badge both">Conflict</span>
        </div>
        <div class="diff-row-body">
          <div class="diff-data-compare">
            <div class="compare-col">
              <span class="compare-label">Current List (A):</span>
              <span class="compare-val">Prio: ${conf.itemA.priority.toUpperCase()}</span>
              <span class="compare-val text-muted" style="font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${noteA}">${noteA}</span>
            </div>
            <div class="compare-col">
              <span class="compare-label">Imported List (B):</span>
              <span class="compare-val">Prio: ${conf.itemB.priority.toUpperCase()}</span>
              <span class="compare-val text-muted" style="font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${noteB}">${noteB}</span>
            </div>
          </div>
          <div class="conflict-options">
            <button class="conflict-option-btn" data-choice="keep-a">Keep A</button>
            <button class="conflict-option-btn" data-choice="keep-b">Keep B</button>
            <button class="conflict-option-btn" data-choice="combine">Merge Notes</button>
            <button class="conflict-option-btn" data-choice="max-prio">Max Prio</button>
          </div>
        </div>
      `;
      
      // Wire Conflict Option buttons (Stage 4)
      row.querySelectorAll('.conflict-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const choice = btn.getAttribute('data-choice');
          
          // Reset sibling buttons selection
          row.querySelectorAll('.conflict-option-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          
          // Mark resolved
          conf.resolution = choice;
          row.classList.remove('conflict-unresolved');
          row.classList.add('conflict-resolved');
          
          checkMergeConditions();
        });
      });
      
      mergeConflictsList.appendChild(row);
    });
  }
  
  // RENDER NON-CONFLICTS
  // 1. Only In Current (A)
  onlyInA.forEach(item => {
    const row = document.createElement('div');
    row.className = 'diff-row';
    row.innerHTML = `
      <div class="diff-row-header">
        <span class="diff-product-name" title="${item.product.name}">${item.product.name}</span>
        <span class="diff-badge only-a">Only in Current</span>
      </div>
      <div class="diff-row-body text-muted">
        <span>Priority: ${item.itemA.priority.toUpperCase()} | Note: ${item.itemA.note || 'None'}</span>
      </div>
    `;
    mergeNonconflictsList.appendChild(row);
  });
  
  // 2. Only In Imported (B)
  onlyInB.forEach(item => {
    const row = document.createElement('div');
    row.className = 'diff-row';
    row.innerHTML = `
      <div class="diff-row-header">
        <span class="diff-product-name" title="${item.product.name}">${item.product.name}</span>
        <span class="diff-badge only-b">Only in Imported</span>
      </div>
      <div class="diff-row-body text-muted">
        <span>Priority: ${item.itemB.priority.toUpperCase()} | Note: ${item.itemB.note || 'None'}</span>
      </div>
    `;
    mergeNonconflictsList.appendChild(row);
  });
  
  // 3. Identical matching items (auto-merged)
  identical.forEach(item => {
    const row = document.createElement('div');
    row.className = 'diff-row';
    row.innerHTML = `
      <div class="diff-row-header">
        <span class="diff-product-name" title="${item.product.name}">${item.product.name}</span>
        <span class="diff-badge both" style="background: rgba(16, 185, 129, 0.15); color: var(--color-emerald); border-color: rgba(16, 185, 129, 0.3)">Identical</span>
      </div>
      <div class="diff-row-body text-muted">
        <span>Priority: ${item.itemA.priority.toUpperCase()} | Note: ${item.itemA.note || 'None'} (Auto-merged)</span>
      </div>
    `;
    mergeNonconflictsList.appendChild(row);
  });
  
  checkMergeConditions();
}

function checkMergeConditions() {
  const unresolved = state.mergeData.conflicts.some(c => c.resolution === null);
  confirmMergeBtn.disabled = unresolved;
}

function abortMerge() {
  // Reset animator
  if (mergeCanvasAnimationId) {
    cancelAnimationFrame(mergeCanvasAnimationId);
  }
  state.activeImportedList = null;
  closeModal(mergeModal);
  showToast("Merge aborted", "info");
}

// Complete the Wishlist Merge & generate new list (Stage 4)
function completeWishlistMerge() {
  const activeWishlist = getActiveWishlist();
  const importedList = state.activeImportedList;
  if (!activeWishlist || !importedList) return;
  
  const mergedName = mergeNewName.value.trim() || "Merged Constellation";
  
  // Build new wishlist items list
  const mergedItems = [];
  const { onlyInA, onlyInB, identical, conflicts } = state.mergeData;
  
  // Add unique items from Current (A)
  onlyInA.forEach(item => {
    mergedItems.push({
      productId: item.itemA.productId,
      addedAt: item.itemA.addedAt || Date.now(),
      priority: item.itemA.priority,
      note: item.itemA.note
    });
  });
  
  // Add unique items from Imported (B)
  onlyInB.forEach(item => {
    mergedItems.push({
      productId: item.itemB.productId,
      addedAt: item.itemB.addedAt || Date.now(),
      priority: item.itemB.priority,
      note: item.itemB.note
    });
  });
  
  // Add identical items
  identical.forEach(item => {
    mergedItems.push({
      productId: item.itemA.productId,
      addedAt: Math.min(item.itemA.addedAt || Date.now(), item.itemB.addedAt || Date.now()),
      priority: item.itemA.priority,
      note: item.itemA.note
    });
  });
  
  // Add conflicts resolved by user (Stage 4 resolution mappings)
  conflicts.forEach(conf => {
    let resolvedPriority = 'medium';
    let resolvedNote = '';
    
    const choice = conf.resolution;
    
    if (choice === 'keep-a') {
      resolvedPriority = conf.itemA.priority;
      resolvedNote = conf.itemA.note || '';
    } else if (choice === 'keep-b') {
      resolvedPriority = conf.itemB.priority;
      resolvedNote = conf.itemB.note || '';
    } else if (choice === 'combine') {
      // Choose maximum priority, and join notes
      const pMap = { low: 1, medium: 2, high: 3 };
      resolvedPriority = pMap[conf.itemA.priority] >= pMap[conf.itemB.priority] ? conf.itemA.priority : conf.itemB.priority;
      
      const notes = [];
      if (conf.itemA.note) notes.push(conf.itemA.note.trim());
      if (conf.itemB.note) notes.push(conf.itemB.note.trim());
      resolvedNote = notes.join(" | ");
    } else if (choice === 'max-prio') {
      // Choose highest priority, keep note of the one with higher priority (or concat if same)
      const pMap = { low: 1, medium: 2, high: 3 };
      if (pMap[conf.itemA.priority] > pMap[conf.itemB.priority]) {
        resolvedPriority = conf.itemA.priority;
        resolvedNote = conf.itemA.note || '';
      } else if (pMap[conf.itemB.priority] > pMap[conf.itemA.priority]) {
        resolvedPriority = conf.itemB.priority;
        resolvedNote = conf.itemB.note || '';
      } else {
        // Same priority, choose A note
        resolvedPriority = conf.itemA.priority;
        resolvedNote = conf.itemA.note || '';
      }
    }
    
    mergedItems.push({
      productId: conf.product.id,
      addedAt: Math.min(conf.itemA.addedAt || Date.now(), conf.itemB.addedAt || Date.now()),
      priority: resolvedPriority,
      note: resolvedNote
    });
  });

  // Create the new merged wishlist object
  const mergedId = 'list-' + Date.now();
  const mergedListObj = {
    id: mergedId,
    name: mergedName,
    colorTheme: activeWishlist.colorTheme, // keeps current theme as base
    createdAt: Date.now(),
    items: mergedItems
  };
  
  state.wishlists.push(mergedListObj);
  state.activeListId = mergedId;
  state.activeImportedList = null;
  
  saveWishlistsToStorage();
  
  // Close modales
  if (mergeCanvasAnimationId) {
    cancelAnimationFrame(mergeCanvasAnimationId);
  }
  closeModal(mergeModal);
  
  populateWishlistSelector();
  renderWishlistUI();
  updateStorefrontHearts();
  
  showToast(`Successfully fused wishlists! Created "${mergedName}"`, 'success');
}

// --- CONSTELLATION MERGE CANVAS DRIFT ANIMATION (Stage 3) ---
function initMergeCanvasAnimation(listA, listB) {
  if (!mergeCanvas) return;
  mergeCanvasCtx = mergeCanvas.getContext('2d');
  
  // Set dimensions
  const rect = mergeCanvas.parentNode.getBoundingClientRect();
  mergeCanvas.width = rect.width * window.devicePixelRatio;
  mergeCanvas.height = rect.height * window.devicePixelRatio;
  mergeCanvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const width = mergeCanvas.width / window.devicePixelRatio;
  const height = mergeCanvas.height / window.devicePixelRatio;
  
  mergeAnimationProgress = 0;
  
  // Prepare particle systems for both wishlists A and B
  mergeParticles = [];
  
  // Helper to build particles
  function buildMergeParticles(items, isListA) {
    const themeName = isListA ? listA.colorTheme : listB.colorTheme;
    const theme = COSMIC_THEMES[themeName] || COSMIC_THEMES.cyan;
    
    items.forEach((item, index) => {
      const product = state.products.find(p => p.id === item.productId);
      if (!product) return;
      
      const angle = (index * (Math.PI * 2) / Math.max(items.length, 1)) + Math.random() * 0.4;
      const orbitRad = 40 + index * 10;
      
      mergeParticles.push({
        productId: item.productId,
        productName: product.name,
        priority: item.priority,
        isListA: isListA,
        color: theme.glow,
        rgb: theme.rgb,
        orbitRadius: orbitRad,
        orbitAngle: angle,
        orbitSpeed: 0.01 + Math.random() * 0.01 * (Math.random() > 0.5 ? 1 : -1),
        x: 0,
        y: 0,
        pulseOffset: Math.random() * Math.PI
      });
    });
  }
  
  buildMergeParticles(listA.items, true);
  buildMergeParticles(listB.items, false);
  
  // Run loop
  runMergeCanvasLoop(listA, listB);
}

function runMergeCanvasLoop(listA, listB) {
  if (mergeCanvasAnimationId) {
    cancelAnimationFrame(mergeCanvasAnimationId);
  }
  
  const duration = 150; // frames (~2.5s)
  let elapsed = 0;
  
  const themeA = COSMIC_THEMES[listA.colorTheme] || COSMIC_THEMES.cyan;
  const themeB = COSMIC_THEMES[listB.colorTheme] || COSMIC_THEMES.cyan;

  function step() {
    elapsed++;
    mergeAnimationProgress = Math.min(1, elapsed / duration);
    
    drawMergeFrame(themeA, themeB);
    
    mergeCanvasAnimationId = requestAnimationFrame(step);
  }
  
  step();
}

function drawMergeFrame(themeA, themeB) {
  if (!mergeCanvasCtx) return;
  
  const width = mergeCanvas.width / window.devicePixelRatio;
  const height = mergeCanvas.height / window.devicePixelRatio;
  
  mergeCanvasCtx.clearRect(0, 0, width, height);
  
  // Centers drift math (sinusoidal ease-in-out)
  const t = mergeAnimationProgress;
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  
  // Left core starts at 22% width, moves to center (50% width)
  const coreAX = width * 0.22 + (width * 0.5 - width * 0.22) * ease;
  const coreAY = height * 0.5;
  
  // Right core starts at 78% width, moves to center (50% width)
  const coreBX = width * 0.78 + (width * 0.5 - width * 0.78) * ease;
  const coreBY = height * 0.5;
  
  // 1. Draw connecting gravitational link between cores
  mergeCanvasCtx.beginPath();
  mergeCanvasCtx.moveTo(coreAX, coreAY);
  mergeCanvasCtx.lineTo(coreBX, coreBY);
  mergeCanvasCtx.lineWidth = 1;
  const linkGrad = mergeCanvasCtx.createLinearGradient(coreAX, coreAY, coreBX, coreBY);
  linkGrad.addColorStop(0, `rgba(${themeA.rgb}, 0.2)`);
  linkGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.1 + (1 - ease) * 0.3})`);
  linkGrad.addColorStop(1, `rgba(${themeB.rgb}, 0.2)`);
  mergeCanvasCtx.strokeStyle = linkGrad;
  mergeCanvasCtx.stroke();
  
  // 2. Draw active cores
  // A Core (Current)
  mergeCanvasCtx.shadowBlur = 15;
  mergeCanvasCtx.shadowColor = themeA.glow;
  mergeCanvasCtx.fillStyle = '#ffffff';
  mergeCanvasCtx.beginPath();
  mergeCanvasCtx.arc(coreAX, coreAY, 6, 0, Math.PI * 2);
  mergeCanvasCtx.fill();
  
  // B Core (Imported)
  mergeCanvasCtx.shadowColor = themeB.glow;
  mergeCanvasCtx.beginPath();
  mergeCanvasCtx.arc(coreBX, coreBY, 6, 0, Math.PI * 2);
  mergeCanvasCtx.fill();
  mergeCanvasCtx.shadowBlur = 0; // reset
  
  // 3. Update & Draw individual star particles orbiting their respective cores
  mergeParticles.forEach(star => {
    // Increment orbit angle
    star.orbitAngle += star.orbitSpeed;
    
    // Core references
    const cx = star.isListA ? coreAX : coreBX;
    const cy = star.isListA ? coreAY : coreBY;
    
    // Orbital path coordinates
    star.x = cx + Math.cos(star.orbitAngle) * star.orbitRadius;
    star.y = cy + Math.sin(star.orbitAngle) * star.orbitRadius;
    
    // Draw gravity threads to active core
    mergeCanvasCtx.beginPath();
    mergeCanvasCtx.moveTo(cx, cy);
    mergeCanvasCtx.lineTo(star.x, star.y);
    mergeCanvasCtx.lineWidth = 0.4;
    mergeCanvasCtx.strokeStyle = `rgba(${star.rgb}, 0.08)`;
    mergeCanvasCtx.stroke();
    
    // Render star point
    let baseRad = star.priority === 'low' ? 2.5 : (star.priority === 'high' ? 5.5 : 4);
    if (star.priority === 'high') {
      baseRad += Math.sin(Date.now() * 0.005 + star.pulseOffset) * 0.8;
    }
    
    mergeCanvasCtx.fillStyle = star.priority === 'high' ? '#ffffff' : `rgba(${star.rgb}, 0.85)`;
    if (star.priority !== 'low') {
      mergeCanvasCtx.shadowBlur = star.priority === 'high' ? 12 : 6;
      mergeCanvasCtx.shadowColor = star.color;
    }
    mergeCanvasCtx.beginPath();
    mergeCanvasCtx.arc(star.x, star.y, baseRad, 0, Math.PI * 2);
    mergeCanvasCtx.fill();
    mergeCanvasCtx.shadowBlur = 0; // reset
  });
  
  // 4. Overlap Visualizations: find identical and conflict pairs to draw connections or pulse when fused
  const mapA = mergeParticles.filter(p => p.isListA);
  const mapB = mergeParticles.filter(p => !p.isListA);
  
  mapA.forEach(starA => {
    const starB = mapB.find(p => p.productId === starA.productId);
    if (!starB) return;
    
    // If they exist in both, draw an arc bridge connecting them
    const dx = starA.x - starB.x;
    const dy = starA.y - starB.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist > 1) {
      mergeCanvasCtx.beginPath();
      mergeCanvasCtx.moveTo(starA.x, starA.y);
      mergeCanvasCtx.lineTo(starB.x, starB.y);
      mergeCanvasCtx.lineWidth = 0.8;
      mergeCanvasCtx.strokeStyle = `rgba(255, 245, 158, ${0.15 + (1 - ease) * 0.25})`;
      mergeCanvasCtx.stroke();
    }
    
    // Once merged at the center (ease is 1), render overlapping item particles as single pulsing star
    if (ease >= 0.95) {
      // Draw overlapping pulse ring
      const pulseSize = 10 + Math.sin(Date.now() * 0.01 + starA.pulseOffset) * 6;
      mergeCanvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      mergeCanvasCtx.lineWidth = 0.5;
      mergeCanvasCtx.beginPath();
      mergeCanvasCtx.arc(starA.x, starA.y, pulseSize, 0, Math.PI * 2);
      mergeCanvasCtx.stroke();
    }
  });
}

// --- Particle Sparkle Spawner (Stage 5 Live Effect) ---
function spawnSparkles(x, y) {
  const count = 10;
  const activeWishlist = getActiveWishlist();
  const activeThemeName = activeWishlist ? activeWishlist.colorTheme : 'cyan';
  const themeColors = COSMIC_THEMES[activeThemeName] || COSMIC_THEMES.cyan;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';
    particle.style.setProperty('--theme-glow', themeColors.glow);
    
    const size = Math.random() * 4 + 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position at mouse click point
    particle.style.left = `${x - size / 2}px`;
    particle.style.top = `${y - size / 2}px`;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 60 + 30;
    const dx = Math.cos(angle) * velocity;
    const dy = Math.sin(angle) * velocity;
    
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);
    
    document.body.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}

// --- Single Page App Router (Stage 5 Boutique Pivot) ---
function initSPARouter() {
  const navLinks = document.querySelectorAll('.header-nav .nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.textContent.trim();
      navigateToView(viewName);
    });
  });

  // Category card clicks delegation
  const categoryGrid = document.querySelector('.categories-grid');
  if (categoryGrid) {
    categoryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.category-card');
      if (!card) return;
      
      const category = card.getAttribute('data-category');
      
      // Set dropdown filter value & trigger filter refresh
      categoryFilter.value = category;
      categoryFilter.dispatchEvent(new Event('change'));
      
      // Redirect to Shop view
      navigateToView('Shop');
    });
  }
}

function navigateToView(viewName) {
  // Update nav active styling
  document.querySelectorAll('.header-nav .nav-link').forEach(link => {
    if (link.textContent.trim() === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Hide all views
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.add('hidden');
  });

  // Show target view
  const map = {
    'Shop': 'shop-view',
    'Categories': 'categories-view',
    'Deals': 'deals-view',
    'Support': 'support-view'
  };
  const id = map[viewName];
  if (id) {
    document.getElementById(id).classList.remove('hidden');
  }
}

// --- Deals Page Controller (Countdown & Copies) ---
function initDealsPage() {
  // Coupon Copy Logic
  const copyButtons = document.querySelectorAll('.btn-copy-coupon');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Copied coupon code [${code}] to clipboard!`, 'success');
      }).catch(() => {
        // Fallback copy
        const temp = document.createElement('textarea');
        temp.value = code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
        showToast(`Copied coupon code [${code}] to clipboard!`, 'success');
      });
    });
  });

  // Daily Offer Claim Button
  const claimBtn = document.getElementById('claim-deal-btn');
  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      // Star-Dust Sequin Dress has ID "dress-24"
      openQuickView('dress-24');
    });
  }

  // Daily Deal Countdown timer (8h 42m 15s starting basis)
  let totalSeconds = (8 * 3600) + (42 * 60) + 15;

  function updateTimer() {
    if (totalSeconds <= 0) {
      totalSeconds = 24 * 3600; // Reset to 24h
    }
    
    totalSeconds--;
    
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    const hEl = document.getElementById('timer-h');
    const mEl = document.getElementById('timer-m');
    const sEl = document.getElementById('timer-s');
    
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}

// --- Support Page Controller (Collapsible FAQ & Forms) ---
function initSupportPage() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const answer = item.querySelector('.faq-answer');
    
    toggle.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other accordions for sleek look
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0px';
      });
      
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Submit Contact Form inquiry mock
  const supportForm = document.getElementById('support-contact-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const topic = document.getElementById('contact-topic').value;
      
      // Clear fields
      supportForm.reset();
      
      showToast(`Inquiry regarding "${topic.toUpperCase()}" submitted successfully. Our atelier team will contact you, ${name}!`, 'success');
    });
  }
}
